import { TerrainMap } from "hmm0-types/terrainmap";

/**
 *  Domain coords do not have [0,0] in the center,
 *  because it will not scale otherwise.
 */
export class Domain {
  constructor (
    protected Dx: number,
    protected Dy: number,
    protected map: TerrainMap,
  ) {}

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