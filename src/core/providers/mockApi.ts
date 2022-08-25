import * as React from "react";
import { addDirection, Direction, TerrainMap } from 'hmm0-types/terrainmap';
import { Army, Unit } from 'hmm0-types/monster/army';
import { Battle, BattleEvent, BattleLog } from 'hmm0-types/battle/battle';
import { nextAIAction } from 'hmm0-types/battle/ai';
import { Capabilities, defaultCapabilities } from "hmm0-types/monster/monster";

export class MockApi {
  private aiInterval: any = null;
  private battles: {[key: string]: Battle} = {
    '1': {
      id: '1',
      attackerId: '1',
      defenderId: '2',
      location: [0, 0],
      turns: [],
    }
  };
  private armies: {[key: string]: Army} = {};
  private battleGround: TerrainMap = new TerrainMap(22, 0.6, 'confrontation');
  private subscribers: ((event: BattleEvent) => void)[] = [];
  subscribe(cb: (event: BattleEvent) => void) {
    this.subscribers.push(cb);
  }
  clearSubscribers() {
    this.subscribers = [];
    clearInterval(this.aiInterval);
    this.aiInterval = null;
  }
  private async notify(event: BattleEvent): Promise<void> {
    this.subscribers.forEach(cb => cb(event));
  }

  async getTerrainAt(Dx: number, Dy: number, x: number, y: number): Promise<TerrainMap> {
    return this.battleGround;
  }

  async createBattle(attackerId: string, defenderId: string, location: [number, number]): Promise<Battle> {
    const battle: Battle = {
      id: [...Array(10)].map(() => (Math.random()*16|0).toString(16)).join(''),
      attackerId,
      defenderId,
      location,
      turns: [],
    };
    this.battles[battle.id] = battle;
    return this.__deepCopy(battle);
  }

  async getBattle(id: string): Promise<Battle> {
    return this.battles[id];
  }

  async getUserInfo(): Promise<{id: string, name: string}> {
    return {id: '1', name: 'MockedPlayer'};
  }

  async getArmy(id: string): Promise<Army> {
    let cnt:{[key: string]: number} = {};
    const unit = () => (function* (): Generator<Unit, void, boolean> {
      const isEnemy = id != '1';
      cnt[id] = cnt[id] || 0;
      yield ({
        count: 1,
        ap: 3,
        health: 15,
        direction: isEnemy ? 's': 'n',
        location: (isEnemy
          ? [cnt[id]++ + 2, 19]
          : [cnt[id]++, 20]) as [number, number],
        monster: { type: 'ogre', power: 1, ap: 3, hp: 15, location: [NaN, NaN], capabilities: defaultCapabilities() },
      });
    })().next().value || null;

    this.armies[id] = {
      heroId: id,
      location: [0, 0],
      units: [unit()],//, unit(), unit(), unit(), unit()],
    };
    return this.__deepCopy(this.armies[id]);
  }

  __deepCopy(obj: any): any {
    return JSON.parse(JSON.stringify(obj));
  }

  async pushArmyActions(battleId: string, actions: BattleLog): Promise<void> {
    this.aiInterval && clearInterval(this.aiInterval);
    const { attackerId, defenderId } = this.battles[battleId];
    this.battles[battleId].turns.push(actions);
    const isEnded = await this.playBattleLog(actions);
    console.log("actions played", actions, this.armies);
    if (isEnded) {
      this.stopAI();
      this.battles[battleId].winner = actions.playerId;
    } else
      this.makeUpAnAI(attackerId, defenderId);
  }

  private async playBattleLog(actions: BattleLog): Promise<boolean> {
    for(const action of actions.events) {
      if (action.type === 'end') break;
      switch (action.type) {
        case 'move':
          this.armies[actions.playerId].units[action.unitInx].location = addDirection(this.armies[actions.playerId].units[action.unitInx].direction, this.armies[actions.playerId].units[action.unitInx].location);
          continue;
        case 'turn':
          this.armies[actions.playerId].units[action.unitInx].direction = action.direction;
          continue;
        case 'hit':
          this.armies[action.defenderId].units[action.defenderUnitInx].health -= action.damage;
          if (this.armies[action.defenderId].units[action.defenderUnitInx].health <= 0) {
            console.log(`#${action.defenderId} = ${action.defenderUnitInx} HP ~ ${this.armies[action.defenderId].units[action.defenderUnitInx].health}`)
            this.armies[action.defenderId].units.splice(action.defenderUnitInx, 1);
            if (!this.armies[action.defenderId].units.length) {
              alert(`USER-${actions.playerId} WON!!!`);
              return true;
            }
          }
          continue;
      }
    }
    return false;
  }

  private stopAI() {
    clearInterval(this.aiInterval);
    this.aiInterval = null;
  }

  private async makeUpAnAI(playerId: string, aiId: string): Promise<void> {
    let inx = 0;
    this.aiInterval = setInterval(async () => {
      const event = nextAIAction({
        armies: this.armies,
        aiId: '2',
        map: this.battleGround,
      }, inx);
      if (this.armies[aiId].units[inx]?.ap === 0) inx++;
      console.log("nextAction", event);
      this.notify(event);
      this.playBattleLog({battleId: '1', playerId: '2', events: [event]});
      if (event.type === 'end') {
        this.stopAI();
      }
    }, 1000);
  }
}

export const ApiContext = React.createContext(new MockApi);