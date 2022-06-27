import * as React from 'react';
import {Component} from 'react';
import './App.scss';

import {Game} from './game/strategicMap/Game';
import {BrowserRouter, Route, Routes} from 'react-router-dom';

import {StoreContext} from './core/Store';
import { WorldMap } from './models/worldmap';
import { Creatures } from './models/creatures';
import { DOMAIN_SIZE } from './models/domain';
import { Battle } from './game/tacticMap/Battle';
import { ApiContext, MockApi } from './core/providers/mockApi';


const world: WorldMap = new WorldMap();
const creatures: Creatures = new Creatures();
creatures.seed(world.getDomain(0, 0), 100, {[DOMAIN_SIZE/2|0]: DOMAIN_SIZE/2|0});
class App extends Component {
  render() {
    return (
        <div className="App">
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Game world={world} creatures={creatures} />}/>
              <Route path="/battle/:attacker/:defender"><>{({match: {params: {filter: {attaker, defender}}}}: any) =>
                <Battle world={world} attacker={attaker} defender={defender}/>
              }</>
              </Route>
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
          <ApiContext.Provider value={new MockApi}>
            <App />
          </ApiContext.Provider>
        </StoreContext.Provider>
      );
    }
  }
  return WithStore;
}

export default appWithStore();
