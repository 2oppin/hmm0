import * as React from "react";
import {TerrainMap} from 'hmm0-types/terrainmap';
import {Army, Unit} from 'hmm0-types/monster/army';
import { Capabilities } from "hmm0-types/monster/monster";

export class MockApi {
  async getTerrainAt(Dx: number, Dy: number, x: number, y: number): Promise<TerrainMap> {
    return new TerrainMap(22, 0.6, 'confrontation');
  }

  async getArmy(id: string): Promise<Army> {
    let cnt:{[key: string]: number} = {};
    const unit = () => (function* (): Generator<Unit, void, boolean> {
      const isEnemy = id != '1';
      cnt[id] = cnt[id] || 0;
      yield ({
        count: 1,
        health: 0.72,
        direction: isEnemy ? 's': 'n',
        location: (isEnemy
          ? [cnt[id]++, 0]
          : [cnt[id]++, 19]) as [number, number],
        monster: { type: 'ogre', power: 1, hp: 100, location: [NaN, NaN], capabilities: Capabilities.default },
      });
    })().next().value || null;

    return {
      heroId: id,
      location: [0, 0],
      units: [unit(), unit(), unit()],
    };
  }
}

export const ApiContext = React.createContext(new MockApi);