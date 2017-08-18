import * as React from "react";
import { render } from 'react-dom';

import darkBaseTheme from 'material-ui/styles/baseThemes/darkBaseTheme';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';


interface AppProps {
    children : React.ReactNode;
}

export class Application extends React.Component<AppProps, undefined> {

  constructor(props : AppProps) {
   super(props);
  }
 
  render()  {
    return   <MuiThemeProvider muiTheme={getMuiTheme(darkBaseTheme)}>
          {this.props.children}
   </MuiThemeProvider>
  };


};
