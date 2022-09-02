import * as React from "react";

import { Army } from "hmm0-types/monster";
import { WorldMap } from "hmm0-types/worldmap";

import { Hero } from "../../../models/actors/hero";

type StatsProps = {
  world: WorldMap;
  creatures: Army[];
  hero: Hero;
}

export const Stats = (props: StatsProps) => {

  console.log('stats::: ', props);

  const {world, creatures, hero} = props;
  const [x,y] = hero?.location || [];
  const [Dx, Dy, dx, dy] = world.convertCoord(x, y);
  return (
    <div>
      {hero && <>
        Hero Power: {hero.power}<br />
        Location: <b>{x} : {y}</b><br />
      </>}
      Monsters Left: {creatures.length}<br />
      D[<b>{Dx} : {Dy}</b>] -&gt; [{dx} : {dy}]<br />
    </div>
  );
}