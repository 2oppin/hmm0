import * as React from "react";
import { WorldMap } from "../../models/worldmap";

import { TerrainMap } from "../components/Map";

type BattleProps = {
  world: WorldMap;
}
type BattleState = {
}
export class BattleMap extends React.Component<BattleProps, BattleState> {
  render() {
    const {world} = this.props;
    return <TerrainMap
      sz={20} tileSz={25} x={0} y={0}
      world={world}
    />
  }
}
