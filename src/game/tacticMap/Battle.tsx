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

type BattlePlayers = {
  player: Player;
  hero: Hero;
  army: Monster[];
}

export const Battle = () => {
  const {store: {world}} = useContext(StoreContext);
  const {attaker, defender} = useParams();
  const api = useContext(ApiContext);
  const [players, setPlayers] = useState<BattlePlayers[]>([]);
  const [ready, setReady] = useState<boolean>(false);
  const [battlefield, setBattlefield] = useState<WorldMap>();

  const loadPlayers = async (): Promise<BattlePlayers[]> => {
    return [];
  }

  const createTerrain = async (): Promise<WorldMap> => {
    const terrain = await api.getTerrainAt(0,0,0,0);
    return new WorldMap([
      [new Domain(0, 0, TerrainMap.fromString(terrain))]
    ]);
  }

  useEffect(() => {
    Promise.all([
      loadPlayers(),
      createTerrain(),
    ]). then(([players, battlefield]) => {
      setPlayers(players);
      setBattlefield(battlefield);
      setReady(true);
    });
  })

  return (
    <Board>
      <Stats />
      {ready && <BattleMap world={world} />}
    </Board>
  );
}
