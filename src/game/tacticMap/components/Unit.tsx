import * as React from "react";
import { Direction } from "../../../models/terrainmap";
import { Monster } from "../../../models/actors/monster";

type UnitProps = {
  z: number;
  direction: Direction;
  monster: Monster;
}
export class Unit extends React.Component<UnitProps> {
  render() {
    const {z, monster, direction} = this.props;
    return (
      <div className="unit-container">
        <div className={`char uniy-type-${monster.type} walk-${direction}`} style={{zIndex: z}}></div>
      </div>
    );
  }
}