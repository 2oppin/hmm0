import { Domain, DOMAIN_SIZE } from "./domain";

export class WorldMap {
  private domains: Domain[][] = [];
  private currentDomain: [number, number] = [0, 0];

  constructor() {
    this.domains[0] = [new Domain(0, 0, true)];
    this.ensureAdjascent(0, 0);
    this.currentDomain = [0, 0];
  }

  public ensureAdjascent(X: number, Y: number) {
    for (let dx = -1; dx <= 1; dx++) {
      for (let dy = -1; dy <= 1; dy++) {
        this.ensureDomain(X + dx, Y + dy);
      }
    }
  }

  public ensureDomain(X: number, Y: number) {
    const [n, m] = this.domainCoord(X, Y);
    if (this.domains[n] === undefined) {
      this.domains[n] = [];
    }
    if (this.domains[n][m] === undefined) {
      this.domains[n][m] = new Domain(X, Y);
    }
  }

  private domainCoord(X: number, Y: number) {
    return [
      X < 0 ? -X * 2 - 1 : X * 2,
      Y < 0 ? -Y * 2 - 1 : Y * 2,
    ];
  }

  private convertCoord(x: number, y: number, ensure = false) {
    const sgn = (a: number) => (b: number) => a > 0 ? b : -b;
    const X = x/DOMAIN_SIZE + sgn(x)(0.5) | 0, Y = y/DOMAIN_SIZE + sgn(y)(0.5) | 0;
    ensure && this.ensureDomain(X, Y);
    return [
      ...this.domainCoord(X, Y),
      Math.abs(x + DOMAIN_SIZE/2)%DOMAIN_SIZE,
      Math.abs(y + DOMAIN_SIZE/2)%DOMAIN_SIZE,
    ];
  }

  isTresspassable(x: number, y: number): boolean {
    if ([x, y].find((v) => Math.abs(v) > Number.MAX_SAFE_INTEGER))
      throw new Error(`Universe end's at MAX_INT ${Number.MAX_SAFE_INTEGER} (we'll do something about it later)`);
    
    const [n, m, Dx, Dy] = this.convertCoord(x, y, true);
    
    return this.domains[n][m].isTresspassable(Dx, Dy);
  }
}