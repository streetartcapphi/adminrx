
import { StreetElementService, SHAResponse, ViewModelElement } from '../../src/services/StreetElementService';


// jasmine.DEFAULT_TIMEOUT_INTERVAL = 20000;

/*
describe('test connection', () => {

  let a = new StreetElementService();

  it("test connect", (done) => {

    let c = a.connect("frett27", "frett27"); // wrong password

    c.catch(() => fail()).then(() => done());

  });
})

*/


describe('Loading geometry elements', () => {

  let a = new StreetElementService("master");

  /*
  a.connect("USER", "PWD");

 
  
    it('Has geometries and connected ?', (done) => {
  
      a.loadPositions("views/unvalidated/content.geojson", function(err:any, result: GeoJSONFeatureCollection<GeoJSON.Point>) {
  
        console.log("nombre d'éléments :" + result.features.length);
        var features = result.features;
        for (var i = 0 ; i < features.length; i ++) {
          console.log(JSON.stringify(features[i]));
        }
  
        done();
      });
      // expect(a).toEqual(null);
  
    });
  */
  /*
    it('Has geometries and connected ?', (done) => {
  
      a.loadPositions("views/unvalidated/content.geojson", function(err:any, result: GeoJSONFeatureCollection<GeoJSON.Point>) {
  
        console.log("nombre d'éléments :" + result.features.length);
        var features = result.features;
        for (var i = 0 ; i < features.length; i ++) {
          console.log(JSON.stringify(features[i]));
        }
        a.savePositions("views/unvalidated/content3.geojson", result, function(err:any, result:any) {
             done();
        });
  
      });
  
    });
  */
  /*
    it("test list files", (done) => {
      a.listFiles("view/unvalidated", function(err:any, result:Array<SHAResponse>) {
  
        for(var t of result) {
          console.log("name :" + t.name);
          console.log("item :" + JSON.stringify(t));
        }
  
        // console.log("returned :" + JSON.stringify(result));
  
        done();
  
      })
    });
  
  it("test load view ", (done) => {

    // "views/unvalidated/content.geojson"
    var p: Promise<Array<ViewModelElement>> = a.loadView("views/unvalidatebydate/0months/content.geojson");

    p.then((a) => {
      console.log("returned array :");
      console.log(JSON.stringify(a));
      done();
    }).catch((e => {
      console.log("error getting the elements :" + e);
    }))



  });

*/



});
