import React from 'react';
import { ThemeProvider } from 'styled-components';
import {Sidebar} from 'semantic-ui-react'
import * as defaultTheme from './common/themes/defaultTheme'
import WeightedItems from "./WeightedItems"
import {FlexColumns, FlexRows} from "./common/CommonComponents"
import {Div} from "./common/StyledElements"
import TopBar from './TopBar';
import SideBar from './SideBar'
import Map from './Map'

function App() {
  return (
    <ThemeProvider theme={defaultTheme}>
      <FlexRows height="100%">
        <TopBar/>        
        <FlexColumns height="100%">
          <Sidebar.Pushable as={Div} width="100%" height="100%">
            <SideBar/>
            <Sidebar.Pusher style={{height: "100%"}}>
              <Map/>
            </Sidebar.Pusher>
          </Sidebar.Pushable>
          <Div width="25%">
            <WeightedItems/>
          </Div>          
        </FlexColumns>
      </FlexRows>      
    </ThemeProvider>        
  );
}

export default App;