export type MonsterType = "nature";// | "humanoid" | "undead" | "beast" | "construct" | "magical" | "elemental" | "aberration";
export class Monster { 
  constructor(
    public power: number,
    public type: MonsterType,
    public location: [number, number],
  ) {}
}