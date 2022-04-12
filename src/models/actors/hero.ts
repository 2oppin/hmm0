type Ran<T extends number> = number extends T ? number :_Range<T, []>;
type _Range<T extends number, R extends unknown[]> = R['length'] extends T ? R[number] : _Range<T, [R['length'], ...R]>;

export type HeroType = Ran<18>;
export class Hero {
  constructor(
    public power: number,
    public type: HeroType,
    public location: [number, number],
  ) {}
}