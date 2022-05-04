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
    return (
      <div>
        Hero Power: {hero.power}<br />
        Monsters Left: {creatures.count}<br />
        Location: <b>{hero.location[0]} : {hero.location[1]}</b><br />
      </div>
    );
  }
}