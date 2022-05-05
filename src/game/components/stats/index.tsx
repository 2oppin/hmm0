import * as React from "react";
import { Hero } from "../../../models/actors/hero";
import { Creatures } from "../../../models/creatures";
import { WorldMap } from "../../../models/worldmap";

type StatsProps = {
  world: WorldMap;
  creatures: Creatures;
  hero: Hero;
}

export class Stats extends React.Component<StatsProps> {
  render() {
    const {world, creatures, hero} = this.props;
    const [x,y] = hero.location;
    const [Dx, Dy, dx, dy] = WorldMap.convertCoord(x, y);
    return (
      <div>
        Hero Power: {hero.power}<br />
        Monsters Left: {creatures.count}<br />
        Location: <b>{x} : {y}</b><br />
        D[<b>{Dx} : {Dy}</b>] -&gt; [{dx} : {dy}]<br />
      </div>
    );
  }
}