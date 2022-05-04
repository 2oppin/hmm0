
export type HeroDirection = 'n' | 'e' | 's' | 'w' | 'nw' | 'ne' | 'sw' | 'se';
export type HeroType = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | 13 | 14 | 15 | 16 | 17 |18;
export class Hero {
  constructor(
    public power: number,
    public type: HeroType,
    public location: [number, number],
    public direction: HeroDirection,
  ) {}
}