import * as React from 'react';
import {Component} from 'react';
import './App.scss';
import 'materialize-css/dist/css/materialize.min.css';

import {Game} from './game/Game';
import {BrowserRouter, Route, Routes} from 'react-router-dom';

import {StoreContext} from './core/Store';
import { WorldMap } from './models/worldmap';


const world: WorldMap = new WorldMap();
class App extends Component {
  render() {
    return (
        <div className="App">
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Game world={world}/>} />
            </Routes>
          </BrowserRouter>
        </div>
    );
  }
}

const appWithStore = () => {
  class WithStore extends React.Component {
    render() {
      return (
        <StoreContext.Provider value={{store: {world}}}>
          <App />
        </StoreContext.Provider>
      );
    }
  }
  return WithStore;
}

export default appWithStore();
