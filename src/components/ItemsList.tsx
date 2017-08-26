//  Copyright 2017 Patrice Freydiere

//  Permission is hereby granted, free of charge, to any person obtaining a 
//  copy of this software and associated documentation files (the "Software"), 
//  to deal in the Software without restriction, including without limitation 
//  the rights to use, copy, modify, merge, publish, distribute, sublicense, 
//  and/or sell copies of the Software, and to permit persons to whom the 
//  Software is furnished to do so, subject to the following conditions:
//
//  The above copyright notice and this permission notice shall be included in 
//  all copies or substantial portions of the Software.
//
//  THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS 
//  OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, 
//  FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE 
//  AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER 
//  LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING 
//  FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER 
//  DEALINGS IN THE SOFTWARE.


import * as React from 'react';
import { render } from 'react-dom';


import { List, ListItem } from 'material-ui/List';
import FlatButton from 'material-ui/FlatButton';
import { Card, CardActions, CardHeader, CardMedia, CardTitle, CardText } from 'material-ui/Card';
import Toggle from 'material-ui/Toggle';


/// <reference path="geojson.d.ts"/>


import { ViewModelElement } from '../services/StreetElementService';


export interface ItemProps {
  item: ViewModelElement;
  onClicked: (element) => void;
  onSaveElement: (e: ViewModelElement) => void;
}

export interface ItemState {
  expanded: boolean;
  published: boolean;
  notpublished: boolean;
}


export class StItem extends React.Component<ItemProps, ItemState> {

  private savedCallBack: (e: ViewModelElement) => void;

  constructor(props: ItemProps) {
    super(props);
    this.savedCallBack = this.props.onSaveElement;
    var currentItem: ViewModelElement = props.item;
    var itemContent = currentItem.content;


    if (typeof itemContent.properties['mustbepublished'] === 'string') {
      if (itemContent.properties['mustbepublished'] === "false") {
        itemContent.properties['mustbepublished'] = false;
      } else {
        itemContent.properties['mustbepublished'] = true;
      }
    }

    if (typeof itemContent.properties['validated'] === 'string') {
      if (itemContent.properties['validated'] === "false") {
        itemContent.properties['validated'] = false;
      } else {
        itemContent.properties['validated'] = true;
      }
    }

    var b: boolean = itemContent.properties['mustbepublished'] && itemContent.properties['validated'];
    var c: boolean = (!itemContent.properties['mustbepublished']) && itemContent.properties['validated'];

    this.state = {
      expanded: true,
      published: b,
      notpublished: c
    };

  }

  private stateToElement(p: boolean, n: boolean): void {
    this.props.item.content.properties['mustbepublished'] = p;
    this.props.item.content.properties['validated'] = p || n;
    this.setState({ published: p, notpublished: n })

  }


  private formatDate(date: Date) {
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
    let handleExpandChange = (expanded: boolean) => {
      // console.log("item pushed :" + expanded);
      t.setState({ expanded: expanded });
    };

    let handleExpand = () => {
      // console.log("expand");
      t.setState({ expanded: true });
    };

    let handleReduce = () => {
      // console.log("reduce");
      t.setState({ expanded: false });
    };
    let toggle = () => {
      t.setState({ expanded: !t.state.expanded });
    }


    let handleClick = (e) => {
      // console.log("hello");
      if (this.props.onClicked) {
        this.props.onClicked(this);
      }
    }

    let togglePublished = (e) => {
      t.stateToElement(!t.state.published, false);
      t.savedCallBack(t.props.item);
    }

    let toggleNotPublished = (e) => {
      t.stateToElement(false, !t.state.notpublished);
      t.savedCallBack(t.props.item);
    }



    let mv = this.props.item.content;


    //   <span {...{onClick: () => handleClick(this)} as {}}>

    //
    return <Card expanded={this.state.expanded} onExpandChange={handleExpandChange}  {...{ onClick: () => handleClick(this) } as {}} >

      <CardHeader actAsExpander={true} showExpandableButton={true}
        title={mv.properties['instagramid']}
        subtitle={mv.properties['author']} expandable={false}
        avatar={mv.properties['imageURL']}
      />

      <CardMedia
        expandable={true}
        overlay={<CardTitle title={this.formatDate(new Date(mv.properties['post_date']))} subtitle="Overlay subtitle" />}>
        <img src={mv.properties['imageURL']} alt="" />

      </CardMedia>

      <CardText expandable={true} >
        {mv.properties['caption']}
      </CardText>

      <CardActions expandable={false}>
        <Toggle label="Publie" toggled={this.state.published} onToggle={togglePublished} />
        <Toggle label="Non Publie" toggled={this.state.notpublished} onToggle={toggleNotPublished} />

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
  displayList: Array<any>;
  selectedElement: (i: StItem) => void;
  onSaveElement: (e: ViewModelElement) => void;
}


export class ItemsList extends React.Component<ItemsListProp, any> {

  private saveCB: (e: ViewModelElement) => void;

  constructor(props: ItemsListProp) {
    super(props);
    this.saveCB = props.onSaveElement;

  }


  render() {

    let onElementClick = (i: StItem) => {
      if (this.props.selectedElement) {
        this.props.selectedElement(i);
      }
    }

    let t = this;

    return <div >
      {this.props.displayList.map(function (listValue) {
        let lv = listValue;
        return <StItem item={lv} key={lv.content.id} onClicked={onElementClick} onSaveElement={t.saveCB} />

      })}
    </div>

  }

}
