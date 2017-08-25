
/// <reference path="geojson.d.ts"/>

import {Deferred} from "ts-deferred";

import {factory} from "../LogConfig";


const log = factory.getLogger("services.streetelementservice");
const WORKING_REPO = "streetartcapphi";


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

      this.repo = this.gh.getRepo(WORKING_REPO, "locations");
      log.debug("repository :" + JSON.stringify(this.repo));
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
      log.debug("sending request");
      this.repo.getSha(this.branch, "", (r:any,t:Array<SHAResponse>) => {
        log.debug("sha response:" + JSON.stringify(t));
        for (var e of t) {
          log.debug(JSON.stringify(e));
        }
        cb(r,t);
      });

    }


    public loadView(viewPath : string) : Promise<Array<ViewModelElement>>{

       let d = new Deferred<ViewModelElement[]>();

        // load view
        this.repo.getContents(this.branch,viewPath, true, (r:any,t:any) => {
           log.debug("response received");
            if (r) {

              d.reject("error in getting view " + viewPath + " :" + JSON.stringify(r));
              return;
            }

            var a : Array<ViewModelElement> = [];
            log.debug("get all elements ");

            let allDeferred : Array<Promise<GeoJSONFeatureCollection<GeoJSON.Point>>> = [];

              // get all elements and input path
            for(var el of t.features) {
               let e = el;
               log.debug("view element " + JSON.stringify(e));
               let editurl = e.properties.editURL;

               var relativePath = null;

               if (editurl) {
                 log.debug("get the relative url");
                 var r :any =  /.*(input.*\.json)/g;
                 var resultat = r.exec(editurl);
                 if (resultat) {
                      log.debug("matched :" + JSON.stringify(resultat));
                 } else {
                     log.debug("fail to extract relativeurl from " + editurl);
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
                 log.debug("construct relative path from elements");

                 let d = new Date(e.properties.post_date);
                 log.debug("post date :");
                 log.debug(JSON.stringify(d));
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
                  log.warn("no id for element " + JSON.stringify(e) + " will not be added");
                } else {
                  relativePath = "input/" + folder + "/" +  (d.getUTCFullYear()) + "-" + month + "-" + day + "/" + id + suffix;
                }
              }

              let closedRelativePath = relativePath;

              if (closedRelativePath != null) {

                 let id = e.properties.id;

                 log.debug("extract elements from " + closedRelativePath);
                 let dp = new Deferred<GeoJSONFeatureCollection<GeoJSON.Point>>();
                 let pro = dp.promise;

                 allDeferred.push(pro);

                 pro.then( (elements:GeoJSONFeatureCollection<GeoJSON.Point>)  => {
                    log.debug("promise resolved "+pro);
                    if (elements.features) {
                       log.debug("adding element :");
                       log.debug(JSON.stringify(elements.features[0]));
                       a.push({ content : elements.features[0], filePath:closedRelativePath, id:id} as ViewModelElement);
                    }
                  }).catch( (e) => {
                         log.warn("remove the element, error from server :" + JSON.stringify(e));
                  })

                 var contentPromise : Promise<any> = this.repo.getContents(this.branch,closedRelativePath,true);

                 contentPromise.then( (t) => {
                   log.debug("content resolved for " + dp);
                   log.debug(JSON.stringify(t));
                   if (t.data) {
                     dp.resolve(t.data);
                   } else {
                     log.error(t);
                     dp.reject("error in getting element " + closedRelativePath);
                   }
                       log.debug("resolved call ");

                 }).catch( (r)=> {
                   log.error("content for " + closedRelativePath + " errored");
                   dp.reject("error in getting content for :" + JSON.stringify(r));
                 });


              }



            } // for

            Promise.all(allDeferred.map(p => p.catch(() => undefined))).then( () => {
              log.debug("all promise finished");
              log.debug(JSON.stringify(a));
              d.resolve(a);
            });

        });

        return d.promise;
    }



    public loadPositions(filePath:string, cb:Function_CB<GeoJSONFeatureCollection<GeoJSON.Point>>) {
       this.checkAuth();
       log.debug("launch get contents");
       this.repo.getContents(this.branch,filePath, true, (r:any,t:any) => {
         log.debug("error returned :" + r);
         log.debug("result :" + JSON.stringify(t));
         cb(r, t );
       });
    }

    public saveAlonePosition(e:ViewModelElement, reason : string) : Promise<string> {

      var d = new Deferred<string>();

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
        log.debug("error returned :" + r);
        log.debug("result :" + JSON.stringify(t));
        log.debug("executed, call callback");
        cb(r, t );
      });
    }



}
