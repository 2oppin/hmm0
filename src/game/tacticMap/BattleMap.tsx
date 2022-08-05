import * as React from "react";
import { Army } from "hmm0-types/monster/army";
import { WorldMap } from "../../models/worldmap";

import { TerrainMap } from "../components/Map";
import { Unit } from "./components/Unit";

type BattleProps = {
  world: WorldMap;
  topArmy: Army;
  bottomArmy: Army;
}
type BattleState = {
}
export class BattleMap extends React.Component<BattleProps, BattleState> {
  render() {
    const {world, bottomArmy} = this.props;
    return <>
      <TerrainMap
        sz={20} tileSz={25} x={10} y={10}
        world={world}
      />
      <Unit unit={bottomArmy.units[0]} z={100} color={false ? '#0f0' : '#f00'} />
    </>;
  }
}
