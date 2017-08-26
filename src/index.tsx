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
