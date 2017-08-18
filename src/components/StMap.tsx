import * as React from "react";
import { render } from 'react-dom';

import * as Leaflet from 'leaflet';
import { Map, Marker, MarkerProps, Popup, TileLayer } from 'react-leaflet';

import {ViewModelElement} from '../services/StreetElementService';

type FunctionCB = (e:Array<ViewModelElement>) => void;
type FunctionSaveCB = (e:ViewModelElement) => void;


export interface StMapProps { ref? :string,
                              center:Leaflet.LatLngExpression,
                              elements? : Array<ViewModelElement>,
                              onElements : FunctionCB,
                              onSaveElement : FunctionSaveCB };

export interface StMapState { displayedElements : Array<ViewModelElement>,
                              selectedElements : Array<ViewModelElement>,
                              allElements: Array<ViewModelElement>,
                              center : Leaflet.LatLngExpression,
                              zoom: number };


export class StMap extends React.Component<StMapProps, StMapState> {

   private elementsCB : FunctionCB;
   private saveElementCB : FunctionSaveCB;

   constructor(props : StMapProps) {
     super(props);
     this.elementsCB = props.onElements;
     this.saveElementCB = props.onSaveElement;
     var markerArray : Array<ViewModelElement> = [];
     if (props.elements) {
        markerArray.concat(props.elements);
     }

     // initial state
     this.state = { displayedElements : markerArray,
                    selectedElements: [],
                    allElements: new Array().concat(markerArray),
                    center:props.center,
                    zoom: 4 };

   }

   public addElementAndZoom(f : ViewModelElement) : void {

     var marker = f;
     var nm = [marker].concat( this.state.displayedElements);

     this.setState( {displayedElements : nm, center:[marker.content.geometry.coordinates[1], marker.content.geometry.coordinates[0] ]} );
   }


   /**
    * add all elements to the map, this replace the actual elements in the map
    */
   public addAllElements(f : Array<ViewModelElement>) : void {
     var nm = [].concat(f);
     this.setState( {displayedElements : nm});
   }
   public setAllElements(f : Array<ViewModelElement>) : void {
     var nm = [].concat(f);
     this.setState( {allElements : nm});
   }


   public setSelected(f : Array<ViewModelElement>) : void {
     this.setState( {selectedElements : f});
   }

  //  public zoomToElement(f : GeoJSON.Feature<GeoJSON.Point>) : void {
  //     this.setState({ displayedElements: [].concat(this.state.displayedElements), center: [f.geometry.coordinates[1],f.geometry.coordinates[0] ] });
  //  }


  zoomEnd = (e:any) => {

    this.setState( {zoom: e.zoom}) ;

    let b = e.target.getBounds();


    // filter visible elements
    var n = [];

    if (this.state.allElements) {
      for (var f of this.state.allElements) {

        // if (f.content.geometry.coordinates[1])
        let l = new Leaflet.LatLng(f.content.geometry.coordinates[1], f.content.geometry.coordinates[0]);
        if (b.contains(l)) {
          n.push(f);
        }

      }

      this.setState({displayedElements : n});
      if (this.elementsCB) {
        // call function
        this.elementsCB(n);
      }
    }
  }

    render() {


       var self = this;

        let onElementClick = (e) => {
          console.log(e);
        };

        // console.log(this.props);
        // console.log(JSON.stringify(this.state));
        return <Map zoom={this.state.zoom} ref="map" center={this.state.center} onzoomend={this.zoomEnd} onmoveend={this.zoomEnd} >
          <TileLayer
            url='http://{s}.tile.stamen.com/toner/{z}/{x}/{y}.png'
            attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
          />
          {this.state.displayedElements.map(function(element) {
              // create icon associated to the point
              let i = new Leaflet.Icon({
                 iconUrl: element.content.properties['imageURL'],
                 iconSize: Leaflet.point(40,40)
              } as Leaflet.IconOptions);
              // place the marker
              return <Marker position={ [element.content.geometry.coordinates[1], element.content.geometry.coordinates[0] ] }
                        onclick={onElementClick}
                        icon={i}
                        opacity={0.6}
                        >

                        </Marker>
          })}

          {this.state.selectedElements.map(function(element) {
              // place the selected marker

              let i = new Leaflet.Icon({
                 iconUrl: element.content.properties['imageURL'],
                 iconSize: Leaflet.point(20,20),
                 iconAnchor: Leaflet.point(10,10)
              } as Leaflet.IconOptions);

              let currentElement = element;
              let changePosition = (e) => {
                var t = e.target;
                var l : Leaflet.LatLngLiteral = t.getLatLng();
                  currentElement.content.geometry.coordinates[1] = l.lat;
                  currentElement.content.geometry.coordinates[0] = l.lng;
                  // save !!
                  if (self.saveElementCB) {
                    self.saveElementCB(currentElement);
                  }

              };

              return [<Marker position={ [element.content.geometry.coordinates[1], element.content.geometry.coordinates[0] ] }
                        onclick={onElementClick}
                        icon={i}
                        zIndexOffset={1001}>
                        </Marker>
                        ,<Marker position={ [element.content.geometry.coordinates[1], element.content.geometry.coordinates[0] ] }
                                  onclick={onElementClick}
                                  zIndexOffset={1000}
                                  draggable={true}
                                  ondragend={changePosition}
                                  >
                                  </Marker>
                      ]
          })}


        </Map>

    };

    // <Marker position={this.props.position}>
    //   <Popup>
    //     <span>A pretty CSS3 popup.<br/>Easily customizable.</span>
    //   </Popup>
    // </Marker>



};
