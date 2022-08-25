import * as React from "react";

import { Army } from "hmm0-types/monster/army";
import { Direction } from "hmm0-types/terrainmap";

import { WorldMap } from "../../models/worldmap";
import { TerrainMap } from "../components/Map";

import { Unit } from "./components/Unit";


type BattleMapProps = {
  world: WorldMap;
  enemyArmy: Army;
  playerArmy: Army;
  enemyTurn: boolean;
  sz?: number;
  activeUnitInx?: number;
  showCapabilities?: boolean;
  onUnitClick?: (unitInx: number) => void;
}

export const BattleMap = ({
  world,
  playerArmy,
  enemyArmy,
  enemyTurn,
  sz,
  activeUnitInx,
  showCapabilities,
  onUnitClick,
}: BattleMapProps) =>  {
  return <div style={{position: 'relative'}}>
    <TerrainMap
      sz={sz} tileSz={25} x={10} y={10}
      world={world}
    />
    {enemyArmy.units.map((unit, i) =>
      <Unit
        key={i}
        showCapabilities={false}
        active={enemyTurn && i == activeUnitInx}
        z={100}
        color="red"
        unit={unit}
      />)}
    {playerArmy.units.map((unit, i) =>
      <Unit
        key={i}
        showCapabilities={showCapabilities}
        active={!enemyTurn && i == activeUnitInx}
        onClick={() => onUnitClick && onUnitClick(i)}
        z={100}
        color="blue"
        unit={unit}
      />)}
  </div>;
}
