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


import * as React from "react";
import { render } from 'react-dom';
import { Route, BrowserRouter as Router, Link, match, Switch, Redirect } from 'react-router-dom';

import { StreetElementService } from "../services/StreetElementService";

import Dialog from 'material-ui/Dialog';
import RaisedButton from 'material-ui/RaisedButton';
import TextField from 'material-ui/TextField';
import FlatButton from 'material-ui/FlatButton';

interface LoginProps {
  service: StreetElementService;
}

interface LoginState {
  open: boolean;
  checking: boolean;
}

export class LoginPage extends React.Component<LoginProps, LoginState> {

  constructor(props) {
    super(props);
    this.state = {
      checking: false,
      open: true
    };
  }

  handleOpen = () => {
    this.setState({ open: true });
  };

  handleClose = () => {
    this.setState({ open: false });
  };

  handleSubmit = () => {
    var login = (this.refs.login as TextField).getValue();
    if (typeof login ==='undefined') {
      throw "no login";
    }
    if (login === null || login === "" || typeof login === 'undefined') {
      throw "login is not defined";
    }
    var pwd = (this.refs.password as TextField).getValue();
    console.log("connect ");
    let p = this.props.service.connect(login, pwd);
    p.then(()=> {
      setTimeout(() => // close the form
      this.setState({ open: false }), 1000);
    }).catch((e) => {
      console.error(e);
      alert("bad authentication or no serveur connection, see logs");
    });

  };


  render() {

    const actions = [
      <FlatButton
        label="Cancel"
        primary={true}
        onClick={this.handleClose}
      />,
      <FlatButton
        label="Submit"
        primary={true}
        keyboardFocused={true}
        onClick={this.handleSubmit}
      />,
    ];

    if (!this.state.open) {
      return <Redirect to={{
        pathname: '/'
      }} />
    }

    return <div>

      <Dialog
        title="Login to Github"
        actions={actions}
        modal={false}
        open={this.state.open}
        onRequestClose={this.handleClose}>
        Please enter your credentials to access content in R/W <br />

        <TextField hintText="Login" floatingLabelText="Login" ref="login" /> <br />
        <TextField hintText="Password" type="password" ref="password" onKeyPress={e => {

          console.log("charcode :" + e.charCode);

          if (e.charCode == 13) {
            this.handleSubmit();
          }
        }} /><br />

      </Dialog>

    </div>

  }


}
