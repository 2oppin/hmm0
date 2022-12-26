import * as React from "react";
import { addDirection, Direction, TerrainMap } from 'hmm0-types/terrainmap';
import { Army, ArmyDetails, Unit } from 'hmm0-types/monster/army';
import { Battle, BattleEvent, BattleLog, BattleResult } from 'hmm0-types/battle/battle';
import { nextAIActions } from 'hmm0-types/battle/ai';
import { WorldMap } from 'hmm0-types/worldmap';
import { defaultCapabilities, MonsterType } from "hmm0-types/monster/monster";
import { Domain } from "hmm0-types/domain";
import { User } from "hmm0-types/user/user";
import { genUUID } from "hmm0-types/untils";

// Helpers
const unit = () => ({
  count: 1,
  ap: 3,
  health: 15,
  direction: 'n',
  location: [0, 0],
  monster: { type: 'ogre' as MonsterType, power: 1, ap: 3, hp: 2, location: [NaN, NaN], capabilities: defaultCapabilities() },
}) as Unit;

export class MockApi {
  private aiInterval: any = null;
  private world = new WorldMap('mockMapID', (wid, Dx, Dy) => this.getDomain(wid, Dx, Dy));
  private battles: {[key: string]: Battle} = {
    '1': {
      id: '1',
      attackerId: '1',
      defenderId: '2',
      location: [0, 0],
      turns: [],
    }
  };
  private armies: {[key: string]: ArmyDetails} = {};
  private neutralGeneratedForDomain: {[key: string]: boolean} = {};
  private battleGround: TerrainMap = new TerrainMap(22, 0.6, 'confrontation');
  private subscribers: ((event: BattleEvent) => void)[] = [];

  // ---- Web Sockets ----
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

  // ---- User ----

  async getUserInfo(): Promise<User> {
    return {id: '1', name: 'MockedPlayer'};
  }

  // ---- Map & Coords -----
  async getWorldMap(): Promise<WorldMap> {
    return this.world;
  }

  async getDomain(wid: string, Dx: number, Dy: number): Promise<Domain> {
    return new Domain(Dx, Dy);
  }

  async getTerrainAt([x, y]: [number, number]): Promise<TerrainMap> {
    if (!this.battleGround)
      this.battleGround = new TerrainMap(22, 0.6, 'confrontation');
    console.log(this.battleGround);
    return this.battleGround;
  }

  // ---- Strategic-Map Objects -----

  // ---- Battle -----
  async createBattle(attackerId: string, defenderId: string, location: [number, number]): Promise<Battle> {
    /*
    const battle: Battle = {
      id: [...Array(10)].map(() => (Math.random()*16|0).toString(16)).join(''),
      attackerId,
      defenderId,
      location,
      turns: [],
    };
    this.battles[battle.id] = battle;
    */
    return this.__deepCopy(this.battles[1]);
  }

  async getBattle(id: string): Promise<Battle> {
    if (!this.battles[id])
      this.battles[id] = {
        id,
        attackerId: 'mockerUserId',
        defenderId: null,
        location: [0,0],
        turns: [],
      };
    return this.battles[id];
  }

  // --- Armies -----
  async getArmiesForDomain(wid: string, Dx: number, Dy: number): Promise<Army[]> {
    if (!this.neutralGeneratedForDomain[`${Dx}_${Dy}`]) {
      let cntPerDomain = this.world.domainSize;
      let created = 0;
      for (let i = 0; i < this.world.domainSize; i++) 
        for (let j = 0; j < this.world.domainSize; j++) {
          const id = genUUID();
          const p = (cntPerDomain - created) / (this.world.domainSize ** 2);
          if (!this.world.isTresspassable([i, j]) || Math.random() > p) continue;

          this.armies[id] = {
              id,
              type: 'nature',
              heroId: null,
              location: [Dx*this.world.domainSize + i, Dy*this.world.domainSize + j],
              units: [...Array(Math.random()*5|0)].map(_ => unit()),
          };
          created++;
        }
      this.neutralGeneratedForDomain[`${Dx}_${Dy}`] = true;
    }
    
    return Object.values(this.armies).filter((a) =>
      (([armyDx, armyDy ]) => armyDx === Dx && armyDy === Dy)(this.world.convertCoord(...a.location))
    );
  }

  async getArmyDetails(id: string): Promise<ArmyDetails> {
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
        monster: { type: 'ogre', power: 1, ap: 3, hp: 15, capabilities: defaultCapabilities() },
      });
    })().next().value || null;

    this.armies[id] = this.armies[id] || {
      id,
      type: 'nature',
      heroId: id,
      location: [0, 0],
      units: [unit()],//, unit(), unit(), unit(), unit()],
    };
    return this.__deepCopy(this.armies[id]);
  }


  // ---- __private stuff -----
  __deepCopy(obj: any): any {
    return JSON.parse(JSON.stringify(obj));
  }

  async pushArmyActions(battleId: string, actions: BattleLog): Promise<BattleResult> {
    this.aiInterval && clearInterval(this.aiInterval);
    const { attackerId, defenderId } = this.battles[battleId];
    this.battles[battleId].turns.push(actions);
    const result = await this.playBattleLog(actions);
    console.log("actions played", actions, this.armies);
    if (result.complete) {
      this.stopAI();
      this.battles[battleId].winner = result.winner;
      const loser = [attackerId, defenderId].find(id => id !== result.winner)
      
      if (loser !== actions.playerId) {
        console.log(`DELETE army ${loser}`);
        delete this.armies[loser];
      }
    } else {
      this.makeUpAnAI(battleId, defenderId);
    }
    return result;
  }

  private async playBattleLog(actions: BattleLog): Promise<BattleResult> {
    const isTresspassabe = ([x, y]: [number, number], map: TerrainMap, armies: ArmyDetails[]): boolean => {
      if (!map.isTresspassable([x, y])) return false;
      return !armies.some(({units}) => units.some(({location}) => location[0] === x && location[1] === y));
    };

    for(const action of actions.events) {
      console.log(`PlaY: `, action, actions);
      if (action.type === 'end') break;
      switch (action.type) {
        case 'move':
          const newLocation = addDirection(this.armies[actions.playerId].units[action.unitInx].direction, this.armies[actions.playerId].units[action.unitInx].location);
          if (isTresspassabe(newLocation, this.battleGround, Object.values(this.armies)))
            this.armies[actions.playerId].units[action.unitInx].location = newLocation;
          else {
            console.log(`Played well, path is open on: [${newLocation[0]}, ${newLocation[1]}]`);
          }
          continue;
        case 'turn':
          this.armies[actions.playerId].units[action.unitInx].direction = action.direction;
          continue;
        case 'hit':
          console.log(`Army[${action.defenderUnitInx}], prepare yourself! Now at ${this.armies[action.defenderId].units[action.defenderUnitInx].health}`);
          this.armies[action.defenderId].units[action.defenderUnitInx].health -= action.damage;
          console.log(`Army[${action.defenderUnitInx}] sustained damage ~ ${action.damage} and now at ${this.armies[action.defenderId].units[action.defenderUnitInx].health}`);
          if (this.armies[action.defenderId].units[action.defenderUnitInx].health <= 0) {
            console.log(`#${action.defenderId} = ${action.defenderUnitInx} HP ~ ${this.armies[action.defenderId].units[action.defenderUnitInx].health}`)
            this.armies[action.defenderId].units.splice(action.defenderUnitInx, 1);
            if (!this.armies[action.defenderId].units.length) {
              alert(`USER-${actions.playerId} WON!!!`);
              return {
                valid: true,
                complete: true,
                winner: actions.playerId,
              };
            }
          }
          continue;
      }
    }
    return {
      valid: true,
      complete: false,
    };
  }

  private stopAI() {
    clearInterval(this.aiInterval);
    this.aiInterval = null;
  }

  private async makeUpAnAI(battleId: string, aiId: string): Promise<void> {
    let inx = 0;
    const events = nextAIActions({
      armies: this.armies,
      aiId,
      map: this.battleGround,
    }, inx);
    console.log("AI EVENTS:", events, this.armies[aiId].units);
    this.aiInterval = setInterval(async () => {
      const event = events.shift();
      if (!events.length) inx++;
      console.log("nextAction", event);
      this.notify(event);
      await this.playBattleLog({battleId, playerId: aiId, events: [event]});
      if (event.type === 'end') {
        this.stopAI();
      }
    }, 1000);
  }
}

export const ApiContext = React.createContext(new MockApi);