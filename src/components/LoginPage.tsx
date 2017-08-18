import * as React from "react";
import { render } from 'react-dom';


import { Route, BrowserRouter as Router, Link, match, Switch, Redirect } from 'react-router-dom';

import {StreetElementService} from "../services/StreetElementService";

import Dialog from 'material-ui/Dialog';
import RaisedButton from 'material-ui/RaisedButton';


import TextField from 'material-ui/TextField';
import FlatButton from 'material-ui/FlatButton';

interface LoginProps {
  service : StreetElementService;
}

interface LoginState {
  open : boolean;
  checking : boolean;
  login : string;
  password : string;
}

export class LoginPage extends React.Component<LoginProps, LoginState> {

  constructor(props) {
    super(props);
    this.state = {
      checking : false,
      open : true,
      login: null,
      password : null
    };
  }

  handleOpen = () => {
      this.setState({open: true});
    };

    handleClose = () => {
      this.setState({open: false});
    };

  handleSubmit = () => {
    this.props.service.connect(this.state.login, this.state.password);
    setTimeout(() =>
    this.setState({open : false}), 1000);
  };


  render() {

    const actions  = [
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

    if (! this.state.open) {
      return <Redirect to={{
       pathname: '/'
     }}/>
    }

    return  <div>

      <Dialog
              title="Login to Github"
              actions={actions}
              modal={false}
              open={this.state.open}
              onRequestClose={this.handleClose}
       >
        Please enter your credentials to access content in R/W <br/>
        <TextField hintText="Login" floatingLabelText="Login" value={this.state.login}/> <br/>
        <TextField hintText="Password"  type="password" value={this.state.password}/><br/>

        </Dialog>

      </div>

  }


}
