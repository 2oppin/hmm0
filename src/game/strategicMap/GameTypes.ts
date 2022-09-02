import { Hero } from "../../models/actors/hero";
import { Direction } from "hmm0-types/terrainmap";
import { ArmyDetails } from "hmm0-types/monster/army";

export const MAP_SZ = 12*2;
export const TILE_SZ = 25;

export type StrategicAction = {
  type: 'kbd' | 'upd' | 'move' | 'turn',
  d?: Direction,
  partial?: Partial<GameState>,
};

export type GameState = {
  x: number;
  y: number;
  dx: number;
  dy: number;
  hero: Hero;
}