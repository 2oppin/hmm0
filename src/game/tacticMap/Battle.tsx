import * as React from "react";
import { useParams } from "react-router-dom";
import { ApiContext } from "../../core/providers/mockApi";
import { Hero } from "../../models/actors/hero";
import { Monster } from "../../models/actors/monster";
import { Player } from "../../models/player";
import { WorldMap } from "hmm0-types/worldmap";

import { Board } from "../components/Board";
import { Stats } from "./components/stats/BattleStats";
import { UnitStats } from "./components/stats/UnitStats";
import { useContext, useEffect, useReducer, useState } from "react";
import { BattleMap } from "./BattleMap";
import { ArmyDetails } from "hmm0-types/monster/army";
import { addDirection, TerrainMap } from "hmm0-types/terrainmap";
import { KeyboardHandler } from "../contexts/KeyboardContext";
import { loadBattleKeyboard } from "./BattleKeyboard";
import { Battle as BattleModel, BattleEvent, Hit } from "hmm0-types/battle/battle";
import { calculateDamage } from "hmm0-types/battle/attack";

import { StoreContext } from "../../core/Store";

type BattlePlayers = {
  player: Player;
  hero: Hero;
  army: Monster[];
}
type BattleState = {
  activeUnit: number;
  showCapabilities: boolean;
  enemyTurn: boolean;
}

type BattleAction = {
  type: 'changeActive' | 'battleEvent' | 'showCapabilities' | 'hideCapabilities',
  inx?: number,
  event?: BattleEvent,
}
let actionsMade: BattleEvent[] = [];
export const Battle = () => {
  const battleMapSz = 20;

  const {battleId} = useParams();
  const api = useContext(ApiContext);
  const {world} = useContext(StoreContext);

  const [players, setPlayers] = useState<BattlePlayers[]>([]);
  const [ready, setReady] = useState<boolean>(false);
  const [battle, setBattle] = useState<BattleModel>();
  const [battlefield, setBattlefield] = useState<TerrainMap>();
  const [attackers, setAttackers] = useState<ArmyDetails>();
  const [defenders, setDefenders] = useState<ArmyDetails>();

  const kbHandler: KeyboardHandler = new KeyboardHandler();
  const keyboardActions = (state: BattleState, action: BattleAction): BattleState => {
    console.log(JSON.stringify(action));
    const {activeUnit, enemyTurn} = state;
    const units = enemyTurn ? defenders.units : attackers.units;
    const enemies = enemyTurn ? attackers.units : defenders.units;
    switch (action.type) {
      case 'changeActive':
        const active = action.inx !== undefined
          ? action.inx
          : activeUnit == units.length - 1
              ? -1
              : (activeUnit + 1)%units.length;
        return {
          ...state,
          activeUnit: active
        };
      case 'showCapabilities':
        return {...state, showCapabilities: true};
      case 'hideCapabilities':
        return {...state, showCapabilities: false};
      case 'battleEvent':
        // Fill state-depended fields  
        if (action.event.type !== 'end') {
          action.event.unitInx = activeUnit;
        }

        // Do not duplicate "end" event; for a several ENTER hits for instance
        if (action.event.type !== 'end' || actionsMade[actionsMade.length-1]?.type !== 'end')
          actionsMade.push(action.event);

        switch (action.event.type) {
          case 'turn':
            units[action.event.unitInx].direction = action.event.direction;
            return {...state};
          case 'move':
            const unit = units[action.event.unitInx];
            if (unit && unit.ap) {
              let newLocation: [number, number] = addDirection(
                unit.direction,
                unit.location
              );
              newLocation = newLocation.map(v => Math.max(0, Math.min(battleMapSz, v))) as [number, number];
              const isTresspassable = battlefield.isTresspassable(newLocation);
              const isNonOccupied = !units.some((u) => u.location[0] == newLocation[0] && u.location[1] == newLocation[1]);
              const enemyInx = enemies.findIndex((u) => u.location[0] == newLocation[0] && u.location[1] == newLocation[1]);
              if (enemyInx >= 0 && !enemyTurn) {
                const hitEvent: Hit = {
                  type: 'hit',
                  unitInx: activeUnit,
                  ap: 1,
                  defenderId: '2',
                  defenderUnitInx: enemyInx,
                  attackType: 'melee',
                  damage: calculateDamage(unit, enemies[enemyInx], 'melee'), 
                };
                actionsMade.push(hitEvent);
                enemies[enemyInx].health -= hitEvent.damage;
                unit.ap--;
              } else if (isTresspassable && isNonOccupied) {
                unit.location = newLocation;
                unit.ap--;
              }
            }
            return {...state};
          case 'hit':
            enemies[action.event.defenderUnitInx].health -= action.event.damage;
            console.log(`DMG*${action.event.damage} ~ `);
            return {...state};
          case 'end':
            console.log("PUSH ACTIONS>>>", actionsMade);
            units.forEach(u => u.ap = u.monster.ap);
            !enemyTurn && api.pushArmyActions("1", {
              battleId: "1",
              playerId: "1",
              events: actionsMade,
            });
            actionsMade = [];
            return {enemyTurn: !enemyTurn, activeUnit: -1, showCapabilities: false};
          case 'skip':
            return {...state};
          default:
            throw new Error();
      }
      default:
        throw new Error();
    }
  }
  const [{activeUnit, showCapabilities, enemyTurn}, dispatch] = useReducer(
    keyboardActions,
    {activeUnit: -1, showCapabilities: false, enemyTurn: false}
  );

  const loadPlayers = async (): Promise<BattlePlayers[]> => {
    return [];
  }
  const loadBattle = async (): Promise<BattleModel> => await api.getBattle(battleId);
  const loadArmy = async (id: string): Promise<ArmyDetails> => await api.getArmyDetails(id);
  const loadTerrain = async (battle: BattleModel): Promise<TerrainMap> => {
    return api.getTerrainAt(battle.location);
  }
  useEffect(() => {
    loadBattleKeyboard(kbHandler, {
      onChangeActive: () => !enemyTurn && dispatch({type: 'changeActive'}),
      onDirectionChange: (d) => !enemyTurn &&
        dispatch({type: 'battleEvent', event: {type: 'turn', unitInx: activeUnit, direction: d}}),
      onMoveForward: () => !enemyTurn &&
        dispatch({type: 'battleEvent', event: {type: 'move', unitInx: activeUnit, ap: 1}}),
      onShowCapabilities: () => !enemyTurn && dispatch({type: 'showCapabilities'}),
      onHideCapabilities: () => !enemyTurn && dispatch({type: 'hideCapabilities'}),
      onMeleeHit: () => {
        return {
          type: 'battleEvent',
          event: {
            type: 'hit',
            ap: 1,
            attackType: 'melee',
            unitInx: -1,
            defenderId: -1,
            defenderUnitInx: -1,
            damage: 0,
          }
        };
      },
      onCompleteTurn: () => !enemyTurn &&
        dispatch({type: 'battleEvent', event: {type: 'end'}}),
    });
    api.subscribe((e: BattleEvent) => {
      console.log("EVT!!!", e);
      e.type !== 'end' && dispatch({type: 'changeActive', inx: e.unitInx});
      dispatch({type: 'battleEvent', event: e});
    });
    loadBattle().then(battle =>
      Promise.all([
        loadPlayers(),
        loadTerrain(battle),
        loadArmy(battle.attackerId),
        loadArmy(battle.defenderId),
      ]).then(async ([players, battlefield, attakingArmy, defendingArmy]) => {
        console.log(battle);
        setBattle(battle);
        setPlayers(players);
        setBattlefield(battlefield);
        setAttackers(attakingArmy);
        setDefenders(defendingArmy);
      }).then(() => setReady(true))
    );

    return () => {
      api.clearSubscribers();
      kbHandler.destroy();
    }
  }, []);

  return (
    <Board offset={30}>
      <Stats />
      {ready && <BattleMap
        world={world}
        sz={battleMapSz}
        enemyArmy={defenders}
        playerArmy={attackers}
        onUnitClick={(unitInx) => dispatch({type: 'changeActive', inx: unitInx})}
        activeUnitInx={activeUnit}
        enemyTurn={enemyTurn}
        showCapabilities={showCapabilities}
      />}
      {ready && activeUnit >= 0 && <UnitStats unit={attackers.units[activeUnit]}/>}
      {!ready && <div>Loading...</div>}
    </Board>
  );
}
