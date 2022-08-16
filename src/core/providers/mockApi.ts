import * as React from "react";
import { TerrainMap } from 'hmm0-types/terrainmap';
import { Army, Unit } from 'hmm0-types/monster/army';
import { BattleEvent, BattleLog } from 'hmm0-types/battle/battle';
import { Capabilities } from "hmm0-types/monster/monster";

export class MockApi {
  private aiInterval: any = null;
  private subscribers: ((event: BattleEvent) => void)[] = [];
  private subscribe(cb: (event: BattleEvent) => void) {
    this.subscribers.push(cb);
  }
  clearSubscribers() {
    this.subscribers = [];
    clearInterval(this.aiInterval);
    this.aiInterval = null;
  }
  async notify(event: BattleEvent): Promise<void> {

  }

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
        ap: 3,
        health: 0.72,
        direction: isEnemy ? 's': 'n',
        location: (isEnemy
          ? [cnt[id]++, 0]
          : [cnt[id]++, 20]) as [number, number],
        monster: { type: 'ogre', power: 1, ap: 3, hp: 100, location: [NaN, NaN], capabilities: Capabilities.default },
      });
    })().next().value || null;

    return {
      heroId: id,
      location: [0, 0],
      units: [unit(), unit(), unit(), unit(), unit()],
    };
  }

  pushArmyActions(battleId: string, actions: BattleLog): void {
    this.aiInterval && clearInterval(this.aiInterval);
    this.aiInterval = setInterval(async () => {
      this.notify(await this.nextAIAction());
    });
  }

  private async nextAIAction(): Promise<BattleEvent>{
    return Promise.resolve({
      type: 'skip',
      unitInx: 0,
    });
  }
}

export const ApiContext = React.createContext(new MockApi);