import { Domain } from "./domain";
import { TerrainMap } from "hmm0-types/terrainmap";
import { singnedCoordsToUnsigned, unsingnedCoordsToSigned } from "./utils";

export class WorldMap {
  constructor(
    private domains: Domain[][] = [],
    private DOMAIN_SIZE = 32*2,
  ) {
    this.domains = domains.length
      ? domains
      : [[new Domain(0, 0, new TerrainMap(DOMAIN_SIZE, 0.6, 'starting-point'))]];
    this.ensureAdjascent(0, 0);
  }
  get domainSize() {
    return this.DOMAIN_SIZE;
  }

  public ensureAdjascent(X: number, Y: number) {
    for (let dx = -1; dx <= 1; dx++) {
      for (let dy = -1; dy <= 1; dy++) {
        const [Dx, Dy] = singnedCoordsToUnsigned([X + dx, Y + dy]);
        this.ensureDomain(Dx, Dy);
      }
    }
  }

  public ensureDomain(n: number, m: number) {
    if (this.domains[n] === undefined) {
      this.domains[n] = [];
    }
    if (this.domains[n][m] === undefined) {
      const [rx, ry] = unsingnedCoordsToSigned([n, m]);
      // console.log(`Creating domain ${n}, ${m}  ~ as [${rx}, ${ry}]`);
      this.domains[n][m] = new Domain(rx, ry, new TerrainMap(this.DOMAIN_SIZE, 0.6));
    }
  }

  public convertCoord(x: number, y: number): [number, number, number, number] {
    const [X, Y] = [Math.floor(x/this.DOMAIN_SIZE), Math.floor(y/this.DOMAIN_SIZE)];
    return [
      X, Y,
      x - X*this.DOMAIN_SIZE,
      y - Y*this.DOMAIN_SIZE,
    ];
  }

  public toGlobalCoord(coords: [number,number, number, number]): [number, number] {
    return [
      coords[0] * this.DOMAIN_SIZE + coords[2],
      coords[1] * this.DOMAIN_SIZE + coords[3],
    ];
  }

  isTresspassable(x: number, y: number): boolean {
    if ([x, y].find((v) => Math.abs(v) > Number.MAX_SAFE_INTEGER))
      throw new Error(`Universe end's at MAX_INT ${Number.MAX_SAFE_INTEGER} (we'll do something about it later)`);

    const [Dx, Dy, dx, dy] = this.convertCoord(x, y);
    const [n, m] = singnedCoordsToUnsigned([Dx, Dy]);
    this.ensureDomain(n, m);
    return this.domains[n][m].isTresspassable(dx, dy);
  }

  getDomain(x: number, y: number): Domain {
    const [n, m] = singnedCoordsToUnsigned([x, y]);
    this.ensureDomain(n, m);
    return this.domains[n][m];
  }
}
