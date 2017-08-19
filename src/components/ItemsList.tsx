
import * as React from 'react';
import { render } from 'react-dom';


import {List, ListItem} from 'material-ui/List';
import FlatButton from 'material-ui/FlatButton';
import {Card, CardActions, CardHeader, CardMedia, CardTitle, CardText} from 'material-ui/Card';
import Toggle from 'material-ui/Toggle';


/// <reference path="geojson.d.ts"/>


import {ViewModelElement} from '../services/StreetElementService';


export interface ItemProps {
    item : ViewModelElement;
    onClicked : (element) => void;
    onSaveElement : (e:ViewModelElement) => void;
}

export interface ItemState {
    expanded : boolean;
    published : boolean;
    notpublished : boolean;
}


export class StItem extends React.Component<ItemProps,ItemState> {

  private savedCallBack :(e : ViewModelElement) => void;

  constructor(props : ItemProps) {
    super(props);
    this.savedCallBack = this.props.onSaveElement;

    var b : boolean = (props.item.content.properties['mustbepublished'] === true && props.item.content.properties['validated'] === true);
    var c : boolean = props.item.content.properties['mustbepublished'] === false && props.item.content.properties['validated'] === true ;

    this.state = {
      expanded : true,
      published : b ,
      notpublished : c
    };

  }

  private stateToElement(p : boolean, n : boolean) : void {
    this.props.item.content.properties['mustbepublished'] = p;
    this.props.item.content.properties['validated'] = p || n;
    this.setState({published : p, notpublished : n})

  }


  private formatDate(date : Date) {
    var monthNames = [
      "Janvier", "Février", "Mars",
      "Avril", "Mai", "Juin", "Juillet",
      "Aout", "Septembre", "Octobre",
      "Novembre", "Decembre"
    ];

    var day = date.getDate();
    var monthIndex = date.getMonth();
    var year = date.getFullYear();

    return day + ' ' + monthNames[monthIndex] + ' ' + year;
  }


  render() {
    let t = this;
    let handleExpandChange = (expanded : boolean) => {
      console.log("item pushed :" + expanded);
        t.setState({expanded: expanded});
    };

    let handleExpand = () => {
      console.log("expand");
     t.setState({expanded: true});
   };

 let handleReduce = () => {
   console.log("reduce");
   t.setState({expanded: false});
 };
 let toggle = () => {
   t.setState({expanded : !t.state.expanded});
 }


 let handleClick = (e) => {
   console.log("hello");
    this.props.onClicked(this);
 }

let togglePublished = (e) => {
  t.stateToElement(!t.state.published, false );
  t.savedCallBack(t.props.item);
}

let toggleNotPublished = (e) => {
   t.stateToElement( false, !t.state.notpublished);
   t.savedCallBack(t.props.item);
}



    let mv = this.props.item.content;


//   <span {...{onClick: () => handleClick(this)} as {}}>

    //
    return   <Card  expanded={this.state.expanded} onExpandChange={handleExpandChange}  {...{onClick: () => handleClick(this)} as {}} >

            <CardHeader actAsExpander={true} showExpandableButton={true}
                title={mv.properties['instagramid']}
                subtitle={mv.properties['author']} expandable={false}
                avatar={mv.properties['imageURL']}
                 />

            <CardMedia
              expandable={true}
              overlay={<CardTitle title={this.formatDate(new Date(mv.properties['post_date']))} subtitle="Overlay subtitle" />}>
               <img src={mv.properties['imageURL']} alt=""  />

            </CardMedia>

            <CardText expandable={true} >
               {mv.properties['caption']}
            </CardText>

            <CardActions expandable={false}>
              <Toggle label="Publie" toggled={this.state.published} onToggle={togglePublished}/>
              <Toggle label="Non Publie" toggled={this.state.notpublished} onToggle={toggleNotPublished}/>

            </CardActions>


       </Card>


  }
  //
  // <FlatButton label="Select" onClick={handleClick} onTouchTap={handleClick} />
  // <FlatButton label="Expand" onClick={handleExpand} onTouchTap={handleExpand} />
  // <FlatButton label="Reduce" onClick={handleReduce} onTouchTap={handleReduce} />

}

/////////////////////////////////////////////////////////////////////////////////////////////
// items

export interface ItemsListProp {
    displayList : Array<any>;
    selectedElement : (i :StItem) => void;
    onSaveElement : (e:ViewModelElement) => void;
}


export class ItemsList extends React.Component<ItemsListProp, any> {

  private saveCB : (e:ViewModelElement) => void;

  constructor(props:ItemsListProp) {
    super(props);
    this.saveCB = props.onSaveElement;

  }


  render() {

            let onElementClick = (i:StItem) => {
               if (this.props.selectedElement) {
                 this.props.selectedElement(i);
               }
          }

          let t = this;

          return   <div >
                 {this.props.displayList.map(function(listValue){
                    return  <StItem item={listValue} onClicked={onElementClick} onSaveElement={t.saveCB}/>

                 })}
        </div>

  }

}
