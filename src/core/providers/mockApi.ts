import * as React from "react";
import {TerrainMap} from 'hmm0-types/terrainmap';
import {Army} from 'hmm0-types/monster/army';

export class MockApi {
  async getTerrainAt(Dx: number, Dy: number, x: number, y: number): Promise<TerrainMap> {
    return new TerrainMap(22, 0.6, 'confrontation');
  }

  async getArmy(id: string): Promise<Army> {
    return {
      heroId: id,
      location: [0, 0],
      units: [
        {
          count: 1,
          health: 0.72,
          direction: "nw",
          monster: { type: 'ogre', power: 1, hp: 100, location: [0, 0]}
        },
        {
          count: 1,
          health: 0.72,
          direction: "nw",
          monster: { type: 'ogre', power: 1, hp: 100, location: [0, 0]}
        },
        {
          count: 1,
          health: 0.72,
          direction: "nw",
          monster: { type: 'ogre', power: 1, hp: 100, location: [0, 0]}
        },
      ]
    };
  }
}

export const ApiContext = React.createContext(new MockApi);