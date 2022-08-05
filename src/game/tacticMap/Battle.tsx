import * as React from "react";
import { useParams } from "react-router-dom";
import { ApiContext } from "../../core/providers/mockApi";
import { Hero } from "../../models/actors/hero";
import { Monster } from "../../models/actors/monster";
import { Domain } from "../../models/domain";
import { Player } from "../../models/player";
import { WorldMap } from "../../models/worldmap";
import { TerrainMap } from "hmm0-types/terrainmap";

import { Board } from "../components/Board";
import { Stats } from "./components/stats";
import { useContext, useEffect, useState } from "react";
import { BattleMap } from "./BattleMap";
import { StoreContext } from "../../core/Store";
import { Army } from "hmm0-types/monster/army";

type BattlePlayers = {
  player: Player;
  hero: Hero;
  army: Monster[];
}

export const Battle = () => {
  const {attaker, defender} = useParams();
  const api = useContext(ApiContext);
  const [players, setPlayers] = useState<BattlePlayers[]>([]);
  const [ready, setReady] = useState<boolean>(false);
  const [battlefield, setBattlefield] = useState<WorldMap>();

  const [attackers, setAttackers] = useState<Army>();
  const [defenders, setDefenders] = useState<Army>();

  const loadPlayers = async (): Promise<BattlePlayers[]> => {
    return [];
  }
  const loadArmy = async (id: string): Promise<Army> => {
    return await api.getArmy(id);
  }
  const createTerrain = async (): Promise<WorldMap> => {
    const terrain = await api.getTerrainAt(0,0,0,0);
    return new WorldMap([[new Domain(0, 0, terrain)]], 22);
  }
  useEffect(() => {
  Promise.all([
    loadPlayers(),
    createTerrain(),
    loadArmy(attaker),
    loadArmy(defender),
  ]). then(([players, battlefield, attakingArmy, defendingArmy]) => {
    setPlayers(players);
    setBattlefield(battlefield);
    setAttackers(attakingArmy);
    setDefenders(defendingArmy);
  }).then(() => setReady(true));
}, []);

  return (
    <Board>
      <Stats />
      {ready && <BattleMap world={battlefield} topArmy={attackers} bottomArmy={defenders} />}
      {!ready && <div>Loading...</div>}
    </Board>
  );
}
