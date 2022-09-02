import * as React from 'react';
import { useContext, useEffect, useState} from 'react';
import './App.scss';

import { Game } from './game/strategicMap/Game';
import { BrowserRouter, Route, Routes } from 'react-router-dom';

import { StoreContext } from './core/Store';
import { Battle } from './game/tacticMap/Battle';
import { ApiContext, MockApi } from './core/providers/mockApi';

import { WorldMap } from "hmm0-types/worldmap"
import { User } from 'hmm0-types/user/user';


const App = () => {
  const api = useContext(ApiContext);
  const [ready, setReady] = useState(false);
  const [world, setWorld] = useState<WorldMap>(null);
  const [user, setUser] = useState<User>(null);

  useEffect(() => {
    api.getWorldMap().then(async (w) => {
      setWorld(w);
      setUser(await api.getUserInfo());
      setReady(true);
    });
  }, []);

  return (
    <BrowserRouter>
      {ready && <div className="App">
        <StoreContext.Provider value={{world, user}}>
          <Routes>
            <Route path="/" element={<Game />}/>
            <Route path="/battle/:battleId" element={<Battle />} />
          </Routes>
        </StoreContext.Provider>
      </div>}
    </BrowserRouter>
  );
}

const appWithStore = () => {
  class WithStore extends React.Component {
    render() {
      return (
          <ApiContext.Provider value={new MockApi}>
            <App />
          </ApiContext.Provider>
        
      );
    }
  }
  return WithStore;
}

export default appWithStore();
