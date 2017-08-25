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
    this.props.service.connect(login, pwd);
    setTimeout(() => // close the form
      this.setState({ open: false }), 1000);
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
