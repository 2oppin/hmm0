export type Direction = 'n' | 'e' | 's' | 'w' | 'nw' | 'ne' | 'sw' | 'se';
export class TerrainMap {
  // @TODO store as a sting
  private map: (0|1)[][];

  constructor(
    public domainSize: number,
    public density: number,
    public startSize: number = 0,
  ){
    const ci = domainSize / 2, cj = ci;
    this.map = [...Array(domainSize)].map((_, i) => [...Array(domainSize)].map((__, j) =>
      (i-ci)**2 + (j-cj)**2 < startSize**2
      || Math.random() < density ? 1 : 0
    ));
  }

  get(i: number, j: number): 0|1 {
    return this.map[i][j];
  }

  set(i: number, j: number, value: 0|1) {
    this.map[i][j] = value;
  }

  toString() {
    let cp = this.map.reduce((a,b) => a.concat(b), []), compact = [];
    while(cp.length) {
      let part = cp.splice(0, 16)
        .reduce((a,b) => (a << 1) + b, 0);
      compact.push(part);
    }
    return String.fromCharCode(...compact);
  }
}
