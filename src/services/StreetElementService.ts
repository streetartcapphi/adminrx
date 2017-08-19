
/// <reference path="geojson.d.ts"/>

import {Deferred} from "ts-deferred";

declare var GitHub : any;

export type Function_CB<T> = (err : any, res: T) => void;


export interface SHAResponse {
    name:string;
    path:string;
    sha:string;
    size:number;
    url:string;
    type:string; // dir, for folder
};


export interface ViewModelElement {
    filePath : string;
    id : string;
    content : GeoJSON.Feature<GeoJSON.Point>;
}

export class StreetElementService {

    private gh : any;
    private repo : any;

    constructor(private branch : string = "master") {

    }

    public connect(user : string,password : string) {

      // basic auth
      this.gh = new GitHub({
         username: user,
         password: password
         /* also acceptable:
            token: 'MY_OAUTH_TOKEN'
          */
      });

      this.repo = this.gh.getRepo("streetartcapphi", "locations");
      console.debug("repository :" + JSON.stringify(this.repo));
    }

    public isConnected() : boolean {
      return this.repo;
    }

    private checkAuth() {
      if (!this.isConnected()) {
        throw new Error("object has not been properly executed using")
      }
    }

    public listFiles(folder:string, cb:Function_CB<Array<SHAResponse>>) {
      this.checkAuth();
      console.log("sending request");
      this.repo.getSha(this.branch, "", (r:any,t:Array<SHAResponse>) => {
        console.log("sha response:" + JSON.stringify(t));
        for (var e of t) {
          console.log(e);
        }
        cb(r,t);
        // this.repo.getTree()
      });

    }


    public loadView(viewPath : string) : Promise<Array<ViewModelElement>>{

       let d = new Deferred();

        // load view
        this.repo.getContents(this.branch,viewPath, true, (r:any,t:any) => {
           console.log("response received");
            if (r) {

              d.reject("error in getting view " + viewPath + " :" + JSON.stringify(r));
              return;
            }

            var a : Array<ViewModelElement> = [];
            console.log("get all elements ");

            let allDeferred : Array<Promise<GeoJSONFeatureCollection<GeoJSON.Point>>> = [];

              // get all elements and input path
            for(var el of t.features) {
               let e = el;
               console.log("view element " + JSON.stringify(e));
               let editurl = e.properties.editURL;

               var relativePath = null;

               if (editurl) {
                 console.log("get the relative url");
                 var r :any =  /.*(input.*\.json)/g;
                 var resultat = r.exec(editurl);
                 if (resultat) {
                      console.log("matched :" + JSON.stringify(resultat));
                 } else {
                     console.log("fail to extract relativeurl from " + editurl);
                     // try ggeojson
                     r =  /.*(input.*\.geojson)/g;
                     resultat = r.exec(editurl);
                     if (resultat) {
                        // continue
                     } else {
                       continue;
                     }
                 }

                 relativePath = resultat[1];
              }

              if (relativePath === null) {
                 console.log("construct relative path from elements");

                 let d = new Date(e.properties.post_date);
                 console.log("post date :");
                 console.log(d);
                 let id = e.properties.id;
                 let author = e.properties.author;

                 var suffix = ".geojson";
                 var folder = "capphi/instagram";
                 if (author !== "cap_phi") {
                   folder = "contrib";
                   suffix = ".json";
                 }

                var month = "" + (d.getMonth() + 1);
                if (month.length < 2)
                {
                  month = "0" + month;
                }

                var day = "" +d.getDate() ;
                if (day.length < 2) {
                  day = "0" + day;
                }

                if (typeof id == 'undefined') {
                  console.warn("no id for element " + JSON.stringify(e) + " will not be added");
                } else {
                  relativePath = "input/" + folder + "/" +  (d.getUTCFullYear()) + "-" + month + "-" + day + "/" + id + suffix;
                }
              }

              let closedRelativePath = relativePath;

              if (closedRelativePath != null) {

                 let id = e.properties.id;

                 console.log("extract elements from " + closedRelativePath);
                 let dp = new Deferred<GeoJSONFeatureCollection<GeoJSON.Point>>();
                 let pro = dp.promise;

                 allDeferred.push(pro);

                 pro.then( (elements:GeoJSONFeatureCollection<GeoJSON.Point>)  => {
                    console.log("promise resolved "+pro);
                    if (elements.features) {
                       console.log("adding element :");
                       console.log(elements.features[0]);
                       a.push({ content : elements.features[0], filePath:closedRelativePath, id:id} as ViewModelElement);
                    }
                  }).catch( (e) => {
                         console.log("remove the element, error from server :" + JSON.stringify(e));
                  })

                 var contentPromise : Promise<any> = this.repo.getContents(this.branch,closedRelativePath,true);

                 contentPromise.then( (t) => {
                   console.log("content resolved for " + dp);
                   console.log(t);
                   if (t.data) {
                     dp.resolve(t.data);

                   } else {
                     console.error(t);
                     dp.reject("error in getting element " + closedRelativePath);
                   }
                       console.log("resolved call ");

                 }).catch( (r)=> {
                   console.error("content for " + closedRelativePath + " errored");
                   dp.reject("error in getting content for :" + JSON.stringify(r));
                 });


              }



            } // for

            Promise.all(allDeferred.map(p => p.catch(() => undefined))).then( () => {
              console.log("all promise finished");
              console.log(a);
              d.resolve(a);
            });

        });

        return d.promise;
    }



    public loadPositions(filePath:string, cb:Function_CB<GeoJSONFeatureCollection<GeoJSON.Point>>) {
       this.checkAuth();
       console.debug("launch get contents");

       this.repo.getContents(this.branch,filePath, true, (r:any,t:any) => {
         console.debug("error returned :" + r);
         console.debug("result :" + JSON.stringify(t));
         cb(r, t );
       });
    }

    public saveAlonePosition(e:ViewModelElement, reason : string) : Promise<string> {

      var d = new Deferred();

      if (!reason) {
        reason = "Modifications";
      }

      var toSave = { type:'FeatureCollection', features:[e.content] } as  GeoJSONFeatureCollection<GeoJSON.Point>;
      this.savePositions(e.filePath, toSave, reason, function(r,t) {
          if (r) {
            d.reject(r);
          } else {
            d.resolve("ok, saved");
          }
      } );

      return d.promise;
    }


    public savePositions(filePath:string,
                         content: GeoJSONFeatureCollection<GeoJSON.Point>,
                         reason : string,
                         cb:Function_CB<any>) {
      this.checkAuth();

      var content_sent : any = content;
      if (typeof content_sent !== 'string') {
           content_sent = JSON.stringify(content_sent);
      }

      this.repo.writeFile(this.branch, filePath, content_sent, "initial message",(r:any,t:any) => {
        console.debug("error returned :" + r);
        console.debug("result :" + JSON.stringify(t));
        console.debug("executed, call callback");
        cb(r, t );

      });
    }



}
