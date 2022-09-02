import { Monster } from "./actors/monster";
import { Domain } from "hmm0-types/domain";
import { WorldMap } from "hmm0-types/worldmap";

import { singnedCoordsToUnsigned } from "./utils";

export class Creatures {
  private creatures: // Domain[x][y][Monsters[]]
  [[[Monster[]]]] = [[[[]]]];

  constructor(
    private world: WorldMap,
    knownCreatures: Monster[] = [],
  ) {
    for(const creature of knownCreatures) {
      const [x, y] = creature.location;
      const [Dx, Dy, dx, dy] = this.getStorageCoords([x, y]);
      this.creatures[Dx][Dy][dx][dy] = creature;
    }
  }

  private getStorageCoords([x, y]: [number, number]): [number, number, number, number] {
    const [Dx, Dy, dx, dy] = this.world.convertCoord(x, y);
    const [n, m] = singnedCoordsToUnsigned([Dx, Dy]);
    return [n, m, dx, dy];
  }

  get([x, y]: [number, number]): Monster | null {
    const [Dx, Dy, dx, dy] = this.getStorageCoords([x, y]);
    return (this.creatures[Dx] && this.creatures[Dx][Dy]
      && this.creatures[Dx][Dy][dx] && this.creatures[Dx][Dy][dx][dy]) || null;
  }

  private set([x, y]: [number, number], m: Monster): void {
    const [Dx, Dy, dx, dy] = this.getStorageCoords([x, y]);
    this.creatures[Dx] = this.creatures[Dx] || [[[]]];
    this.creatures[Dx][Dy] = this.creatures[Dx][Dy] || [[]];
    this.creatures[Dx][Dy][dx] = this.creatures[Dx][Dy][dx] || [];
    this.creatures[Dx][Dy][dx][dy] = m;
  }

  add(creature: Monster): void {
    const [x, y] = creature.location;
    if (this.get([x, y]))
      throw new Error(`Cannot add creature at ${x}:${y} (place is already occupied)`);
    this.set([x, y], creature);
  }

  remove(creature: Monster) {
    const [Dx, Dy, dx, dy] = this.getStorageCoords(creature.location);
    if (this.creatures[Dx][Dy][dx][dy]) {
        this.creatures[Dx][Dy][dx].splice(dy, 1);
    }
  }

  getForDomain(d: Domain): Monster[] {
    const [Dx, Dy] = singnedCoordsToUnsigned(d.coords);
    if (!this.creatures[Dx] || !this.creatures[Dx][Dy]) return [];
    return this.creatures[Dx][Dy].reduce((a, c) => [...a, ...c], [])
      .filter(m => !!m); /** @TODO remove nulls */
  }

  get count() {
      return this.creatures.reduce((DxS, restDx) =>
        DxS + restDx.reduce((DyS, restDy) =>
          DyS + restDy.reduce((dxS, restdx) =>
            dxS + restdx.reduce((dyS, dyVal) => dyVal ? dyS + 1: dyS
      , 0) , 0) , 0), 0);
  }

  seed(d: Domain, count = 10, skipCoords: {[key: number]: number} = {}): void {
    for (let x = 0, i=0; x < this.world.domainSize && count; x++)
    for (let y = 0; y < this.world.domainSize && count; y++, i++) {
      if (skipCoords[x] === y) continue;
      if (!d.isTresspassable(x, y)) continue;

      let pM = count / (d.dencity * (this.world.domainSize**2 - i));
      if (Math.random() < pM) {
        const real = this.world.toGlobalCoord([...d.coords, x, y]);
        count--;
        this.add(new Monster(Math.random()*10|0, "nature", real));
      }
    }
  }
}
