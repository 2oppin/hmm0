import { TerrainMap } from "./terrainmap";

// @IMPORTANT: should be even number
export const DOMAIN_SIZE = 64;

export class Domain {
  constructor (
    protected x: number,
    protected y: number,
    protected startingPoint: boolean = false,
    protected map: TerrainMap = null,
  ) {
    if (!map) {
      this.map = new TerrainMap(DOMAIN_SIZE, 0.6, startingPoint ? 5 : 0);
    }
  }

  isTresspassable(x: number, y: number): boolean {
    return this.map.get(x, y) === 1;
  }
}