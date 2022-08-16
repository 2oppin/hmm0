import { Hero } from "hmm0-types/hero";

import { Direction } from "../../models/terrainmap";
import { Monster } from "../../models/actors/monster";
import { Creatures } from "../../models/creatures";
import { WorldMap } from "../../models/worldmap";

export const MAP_SZ = 12*2;
export const TILE_SZ = 25;

export type BattleProps = {
  world: WorldMap;
  creatures: Creatures;
}
export type BattleState = {
  x: number;
  y: number;
  dx: number;
  dy: number;
  heroDirection: Direction;
  hero: Hero;

  // event State
  enemy: Monster | null;
  localCreatures: Monster[];

  // dialog
  dialogContents: React.ReactElement | null;
  dialogClosable: boolean;
}