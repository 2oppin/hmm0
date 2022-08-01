import * as React from "react";
import {TerrainMap} from 'hmm0-types/terrainmap';
import {Army} from 'hmm0-types/monster/army';

export class MockApi {
  async getArmy(id: string): Promise<Army[]> {
    return [];
  }

  async getTerrainAt(Dx: number, Dy: number, x: number, y: number): Promise<string> {
    return new TerrainMap(32, 0.9, 0).toString();
  }
}

export const ApiContext = React.createContext(new MockApi);