import * as React from "react";
import * as ReactDOM from "react-dom";

import { Application } from "./components/Application";
import { MapPage } from "./components/MapPage";
import { LoginPage } from "./components/LoginPage";


import * as Street from "./services/StreetElementService";

import * as injectTapEventPlugin from 'react-tap-event-plugin'

import { Route, BrowserRouter as Router, Link, match, Switch, Redirect, HashRouter } from 'react-router-dom';

let el = document.getElementById("app");

//
// <AppBar
//   title="Title"
//   iconClassNameRight="muidocs-icon-navigation-expand-more"
// />

// console.log(el);

let s = new Street.StreetElementService();


// Needed for onTouchTap
injectTapEventPlugin();




ReactDOM.render(<HashRouter>
    <Switch>
    <Route exact={true} path="/" component={(props) =>
      !s.isConnected() ?
        <Redirect to="/login" />
        :
        <div>
        <Application>
            <MapPage service={s} {...props} />
        </Application>
        </div>
      }  />
      <Route path="/login" component={(props) =>
        <Application>
            <LoginPage service={s} {...props} />
        </Application>
      }  />

       <Redirect path="*" to="/" />
    </Switch>

   </HashRouter>
   ,
   el
);
