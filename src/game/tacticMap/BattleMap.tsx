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
    const {world, bottomArmy, topArmy} = this.props;
    return <div style={{position: 'relative'}}>
      <TerrainMap
        sz={20} tileSz={25} x={10} y={10}
        world={world}
      />
      {topArmy.units.map((unit, i) => <Unit key={i} active={false} z={100} color="red" unit={unit} />)}
      {bottomArmy.units.map((unit, i) => <Unit key={i}  active={i == 1} z={100} color="blue" unit={unit} />)}
    </div>;
  }
}
