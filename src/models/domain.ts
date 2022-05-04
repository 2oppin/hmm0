import { TerrainMap } from "./terrainmap";

// @IMPORTANT: should be even number
export const DOMAIN_SIZE = 32*2;

/**
 *  Domain coords do not have [0,0] in the center,
 *  because it will not scale otherwise.
 */
export class Domain {
  constructor (
    protected Dx: number,
    protected Dy: number,
    protected startingPoint: boolean = false,
    protected map: TerrainMap = null,
  ) {
    console.log(`Domain created: ${this.Dx}, ${this.Dy}`);
    if (!map) {
      this.map = new TerrainMap(DOMAIN_SIZE, 0.6, startingPoint ? 5 : 0);
    }
  }

  get x() {
    return this.Dx;
  }

  get y() {
    return this.Dy;
  }

  get dencity(): number {
    return this.map.density;
  }

  get coords(): [number, number] {
    return [this.Dx, this.Dy];
  }

  isTresspassable(x: number, y: number): boolean {
    return this.map.get(x, y) === 1;
  }
}