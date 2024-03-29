import * as React from "react";

import { ArmyDetails } from "hmm0-types/monster/army";

import { TerrainMap as TerrainMapModel } from "hmm0-types/terrainmap";
import { TerrainMap } from "../components/Map";

import { Unit } from "./components/Unit";


type BattleMapProps = {
  map: TerrainMapModel;
  enemyArmy: ArmyDetails;
  playerArmy: ArmyDetails;
  enemyTurn: boolean;
  sz?: number;
  activeUnitInx?: number;
  showCapabilities?: boolean;
  onUnitClick?: (unitInx: number) => void;
}

export const BattleMap = ({
  map,
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
      width={sz} height={sz} tileSz={25} x={10} y={10}
      map={map}
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
