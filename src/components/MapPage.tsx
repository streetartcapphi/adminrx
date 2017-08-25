
import * as React from "react";
import { render } from 'react-dom';

import Toggle from 'material-ui/Toggle';
import Drawer from 'material-ui/Drawer';
import AppBar from 'material-ui/AppBar';
import Paper from 'material-ui/Paper';
import CircularProgress from 'material-ui/CircularProgress';
import FlatButton from 'material-ui/FlatButton';


import { StMap, StMapProps } from './StMap';
import { ItemsList, StItem } from './ItemsList';

import * as Leaflet from "leaflet";

import * as Street from '../services/StreetElementService';



export interface MapPageProps {

  service: Street.StreetElementService;

};

interface MapPageState {
  open: boolean; // Drawer
  isLoading: boolean;
  loadedElements: Array<Street.ViewModelElement>;
  selectedElement: Array<Street.ViewModelElement>;
}



export class MapPage extends React.Component<MapPageProps, MapPageState> {

  private service: Street.StreetElementService;

  constructor(props: MapPageProps) {
    super(props);
    this.service = props.service;
    this.state = { open: true, isLoading: true, loadedElements: [], selectedElement: [] };

    this.loadView("views/unvalidated/content.geojson");
  }


  public loadView(viewPath: string): void {
    // views/bydate/[XX]months/content.geojson


    let result = this.props.service.loadView(viewPath).then((l) => {

      console.log("lost received from loadView :");
      console.log(l);
      var stmap: StMap = (this.refs["mymap"]) as StMap;

      // set the loaded elements
      this.setState({ loadedElements: l, isLoading: false })

      stmap.addAllElements(l);
      stmap.setAllElements(l);

      // zoom to all elements in layer
      try {
        if (l.length > 1) {
          stmap.zoomToAllMarkers();
        }
      } catch (e) {

      }
    }).catch((e) => {

      console.error(e);

      // error in getting the result,
      this.setState({ loadedElements: [], isLoading: false })
    });

  }


  handleToggle = () => this.setState({ open: !this.state.open });
  //
  // changeToggle = () =>
  //   this.setState({label:"thelabel"});

  elementSelected = (e: StItem) => {
    var stmap: StMap = (this.refs["mymap"]) as StMap;
    // console.log("st map");
    // console.log(stmap);

    stmap.setSelected([e.props.item]);

  }

  visibleElementsChanged = (l) => {
    console.log("call back for display on the left");
    this.setState({ loadedElements: l });

  };

  saveElement = (e: Street.ViewModelElement): Promise<any> => {

    var r = this.service.saveAlonePosition(e, "update position to " + e.content.geometry.coordinates);
    r.then((e) => {
      console.log("saved !!");
    }).catch((e) => {
      console.error(e);
    });

    return r;
  };

  saveElementPublicationProperties = (e: Street.ViewModelElement) => {

    var r = this.service.saveAlonePosition(e, "update properties");
    r.then((e) => {
      console.log("saved !!");
    }).catch((e) => {
      console.error(e);
    });
  };

  elementClicked = (e: Street.ViewModelElement) => {
    var stmap: StMap = (this.refs["mymap"]) as StMap;
    // console.log("st map");
    // console.log(stmap);

    stmap.setSelected([e]);
  }

  views: { [id: string]: string; } = {
    "Non Validé": "views/unvalidated/content.geojson",
    "Visu Site (deux mois) validé": "views/cumulbydate/2months/content.geojson",
    "Validés Dernière semaine": "views/cumulbydate/1weeks/content.geojson",
    "Validé Mois courant": "views/cumulbydate/1months/content.geojson"
  };

  render() {

    const position = { lat: 51.505, lng: -0.09 };

    let paddingStyle = { padding: "12px" };

    return <div>

      <div>
        {Object.keys(this.views).map((s: string) => {

          return <FlatButton onClick={(e) => {
            var stmap: StMap = (this.refs["mymap"]) as StMap;
            stmap.addAllElements([]);
            stmap.setAllElements([]);
            this.setState({ loadedElements: [], isLoading: true });
            this.loadView(this.views[s]);
          }} label={s} primary={true} />


        })}


      </div>
      <StMap ref="mymap" center={position} onElements={this.visibleElementsChanged}
        onSaveElement={this.saveElement} onElementClick={this.elementClicked} />

      <Drawer width={400} openSecondary={true}
        open={this.state.open} >
        <AppBar title="Vue" />

        {this.state.isLoading ?
          <div style={{ "text-align": "center", "vertical-align": "middle" }}>
            <CircularProgress size={200} thickness={7} />
          </div>
          : []
        }

        <div style={paddingStyle}>
          <ItemsList displayList={this.state.loadedElements}
            selectedElement={this.elementSelected}
            onSaveElement={this.saveElement}
          />
        </div>
      </Drawer>


    </div>

  };


};
