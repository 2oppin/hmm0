import * as React from "react";
import { useEffect, useReducer, useState } from "react";

import { Army } from "hmm0-types/monster/army";
import { addDirection, Direction } from "hmm0-types/terrainmap";

import { WorldMap } from "../../models/worldmap";
import { TerrainMap } from "../components/Map";

import { loadBattleMapKeyboard } from "./BattleMapKeyboard";
import { Unit } from "./components/Unit";
import { KeyboardHandler } from "../../game/contexts/KeyboardContext";


type BattleMapProps = {
  world: WorldMap;
  challengerArmy: Army;
  playerArmy: Army;
  sz?: number;
  activeUnit?: Unit;
}

type BattleMapState = {
  topArmy: Army;
  bottomArmy: Army;
  activeUnit: number;
  showCapabilities: boolean;
}
type BattleMapAction = {
  type: 'changeActive' | 'orientActiveUnit' | 'moveActiveUnit' | 'showCapabilities' | 'hideCapabilities',
  d?: Direction,
  active?: number,
}

export const BattleMap = ({world, playerArmy, challengerArmy, sz = 20}: BattleMapProps) =>  {
  const kbHandler: KeyboardHandler = new KeyboardHandler();
  const reducer = (state: BattleMapState, action: BattleMapAction): BattleMapState => {
    const {activeUnit, bottomArmy, topArmy} = state;
    switch (action.type) {
      case 'changeActive':
        const active = action.active !== undefined
          ? action.active
          : activeUnit == bottomArmy.units.length - 1
              ? -1
              : (activeUnit + 1)%bottomArmy.units.length;
        return {
          ...state,
          activeUnit: active
        };
      case 'orientActiveUnit':
        if (activeUnit >= 0) {
          console.log("ORIENT", action.d, activeUnit);
          bottomArmy.units[activeUnit].direction = action.d;
        }
        return {...state, bottomArmy};
      case 'moveActiveUnit':
        if (activeUnit >= 0) {
          console.log("MOVE", action.d, activeUnit);
          let newLocation: [number, number] = addDirection(action.d, bottomArmy.units[activeUnit].location);
          newLocation = newLocation.map(v => Math.max(0, Math.min(sz, v))) as [number, number];
          if (world.isTresspassable(...newLocation))
            bottomArmy.units[activeUnit].location = newLocation;
        }
        return {...state, bottomArmy};
      case 'showCapabilities':
        return {...state, showCapabilities: true};
      case 'hideCapabilities':
        return {...state, showCapabilities: false};
      default:
        throw new Error();
    }
  }
  const [state, dispatch] = useReducer(
    reducer,
    {topArmy: playerArmy, bottomArmy: challengerArmy, activeUnit: -1, showCapabilities: false}
  );

  useEffect(() => {
    loadBattleMapKeyboard(kbHandler, {
      onChangeActive: () => dispatch({type: 'changeActive'}),
      onDirectionChangeReady: (d) => dispatch({type: 'orientActiveUnit', d}),
      onDirectionChange: (d) => dispatch({type: 'moveActiveUnit', d}),
      onShowCapabilities: () => dispatch({type: 'showCapabilities'}),
      onHideCapabilities: () => dispatch({type: 'hideCapabilities'}),
    });
    return () => kbHandler.destroy();
  }, []);

  return <div style={{position: 'relative'}}>
    <TerrainMap
      sz={sz} tileSz={25} x={10} y={10}
      world={world}
    />
    {state.topArmy.units.map((unit, i) =>
      <Unit
        key={i}
        showCapabilities={false}
        active={false}
        z={100}
        color="red"
        unit={unit}
      />)}
    {state.bottomArmy.units.map((unit, i) =>
      <Unit
        key={i}
        showCapabilities={state.showCapabilities}
        active={i == state.activeUnit}
        onClick={() => {
          console.log("Click!", i);
          dispatch({type: 'changeActive', active: i})}
        }
        z={100}
        color="blue"
        unit={unit}
      />)}
  </div>;
}
