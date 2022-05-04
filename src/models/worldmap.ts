import { Domain, DOMAIN_SIZE } from "./domain";
import { singnedCoordsToUnsigned, unsingnedCoordsToSigned } from "./utils";

export class WorldMap {
  private domains: Domain[][] = [];

  constructor() {
    this.domains[0] = [new Domain(0, 0, true)];
    this.ensureAdjascent(0, 0);
  }

  public ensureAdjascent(X: number, Y: number) {
    for (let dx = 0; dx <= 2; dx++) {
      for (let dy = 0; dy <= 2; dy++) {
        this.ensureDomain(X + dx, Y + dy);
      }
    }
  }

  public ensureDomain(n: number, m: number) {
    if (this.domains[n] === undefined) {
      this.domains[n] = [];
    }
    if (this.domains[n][m] === undefined) {
      const [rx, ry] = unsingnedCoordsToSigned([n, m]);
      console.log(`Creating domain ${n}, ${m}  ~ as [${rx}, ${ry}]`);
      this.domains[n][m] = new Domain(rx+1, ry+1);
    }
  }

  public static convertCoord(x: number, y: number): [number, number, number, number] {
    const [X, Y] = singnedCoordsToUnsigned([x/DOMAIN_SIZE|0, y/DOMAIN_SIZE|0]);
    return [
      X, Y,
      Math.abs(x + DOMAIN_SIZE/2)%DOMAIN_SIZE,
      Math.abs(y + DOMAIN_SIZE/2)%DOMAIN_SIZE,
    ];
  }

  public static toGlobalCoord(coords: [number,number, number, number]): [number, number] {
    return [
      coords[0] * DOMAIN_SIZE + coords[2],
      coords[1] * DOMAIN_SIZE + coords[3],
    ];
  }

  isTresspassable(x: number, y: number): boolean {
    if ([x, y].find((v) => Math.abs(v) > Number.MAX_SAFE_INTEGER))
      throw new Error(`Universe end's at MAX_INT ${Number.MAX_SAFE_INTEGER} (we'll do something about it later)`);
    
    const [n, m, Dx, Dy] = WorldMap.convertCoord(x, y);
    this.ensureDomain(n, m);
    
    return this.domains[n][m].isTresspassable(Dx, Dy);
  }

  getDomain(x: number, y: number): Domain {
    const [n, m] = singnedCoordsToUnsigned([x, y]);
    this.ensureDomain(n, m);
    return this.domains[n][m];
  }
}
