import { Direction } from "../../models/terrainmap";
import { KeyboardHandler } from "../contexts/KeyboardContext";
import { BattleProps, BattleState } from "./BattleTypes";

const readyToNorth = (props: BattleProps, state: Partial<BattleState>) => (e: KeyboardEvent): Partial<BattleState> =>
  ({heroDirection: "n", hero: {...state.hero, direction: "n"}});
const readyToSouth = (props: BattleProps, state: Partial<BattleState>) => (e: KeyboardEvent): Partial<BattleState> =>
  ({heroDirection: "s", hero: {...state.hero, direction: "s"}});
const readyToEast = (props: BattleProps, state: Partial<BattleState>) => (e: KeyboardEvent): Partial<BattleState> =>
  ({heroDirection: "e", hero: {...state.hero, direction: "e"}});
const readyToWest = (props: BattleProps, state: Partial<BattleState>) => (e: KeyboardEvent): Partial<BattleState> =>
  ({heroDirection: "w", hero: {...state.hero, direction: "w"}});
const readyToNorthEast = (props: BattleProps, state: Partial<BattleState>) => (e: KeyboardEvent): Partial<BattleState> =>
  ({heroDirection: "ne", hero: {...state.hero, direction: "ne"}});
const readyToSouthEast = (props: BattleProps, state: Partial<BattleState>) => (e: KeyboardEvent): Partial<BattleState> =>
  ({heroDirection: "se", hero: {...state.hero, direction: "se"}});
const readyToNorthWest = (props: BattleProps, state: Partial<BattleState>) => (e: KeyboardEvent): Partial<BattleState> =>
  ({heroDirection: "nw", hero: {...state.hero, direction: "nw"}});
const readyToSouthWest = (props: BattleProps, state: Partial<BattleState>) => (e: KeyboardEvent): Partial<BattleState> =>
  ({heroDirection: "sw", hero: {...state.hero, direction: "sw"}});

const goNorth = (props: BattleProps, state: Partial<BattleState>) => (e: KeyboardEvent): Partial<BattleState> =>
  justGo(props, state)('n');
const goSouth = (props: BattleProps, state: Partial<BattleState>) => (e: KeyboardEvent): Partial<BattleState> =>
  justGo(props, state)('s');;
const goEast = (props: BattleProps, state: Partial<BattleState>) => (e: KeyboardEvent): Partial<BattleState> =>
  justGo(props, state)('e');
const goWest = (props: BattleProps, state: Partial<BattleState>) => (e: KeyboardEvent): Partial<BattleState> =>
  justGo(props, state)('w');
const goNorthEast = (props: BattleProps, state: Partial<BattleState>) => (e: KeyboardEvent): Partial<BattleState> =>
  justGo(props, state)('ne');
const goSouthEast = (props: BattleProps, state: Partial<BattleState>) => (e: KeyboardEvent): Partial<BattleState> =>
  justGo(props, state)('se');
const goNorthWest = (props: BattleProps, state: Partial<BattleState>) => (e: KeyboardEvent): Partial<BattleState> =>
  justGo(props, state)('nw');
const goSouthWest = (props: BattleProps, state: Partial<BattleState>) => (e: KeyboardEvent): Partial<BattleState> =>
  justGo(props, state)('sw');

const mapDirToCoords: {[dir: string]: [-1|0|1, -1|0|1]} = {
  'n': [0, -1],
  's': [0, 1],
  'e': [1, 0],
  'w': [-1, 0],
  'nw': [-1, -1],
  'ne': [1, -1],
  'sw': [-1, 1],
  'se': [1, 1],
};

const justGo = (props: BattleProps, state: Partial<BattleState>) => (dir: Direction) => {
  let x = state.x, y = state.y;
  let [dx, dy] = mapDirToCoords[dir];
  if (!props.world.isTresspassable(x + dx, y + dy))
    return {dx: 0, dy: 0};

  const enemy = props.creatures.get([x + dx, y + dy]);
  if (!enemy) {
    state.hero.location = [x + dx, y + dy];
    return {dx: 0, dy: 0, x: x + dx, y: y + dy};
  }
  return {dx: 0, dy: 0, enemy};
}

const KeyDown = {
  "ArrowUp": readyToNorth,
  "ArrowDown": readyToSouth,
  "ArrowLeft": readyToWest,
  "ArrowRight": readyToEast,
  "ArrowLeft+ArrowUp": readyToNorthWest,
  "ArrowRight+ArrowUp": readyToNorthEast,
  "ArrowDown+ArrowLeft": readyToSouthWest,
  "ArrowDown+ArrowRight": readyToSouthEast,
};
const KeyUp = {
  "ArrowUp": goNorth,
  "ArrowDown": goSouth,
  "ArrowLeft": goWest,
  "ArrowRight": goEast,
  "ArrowLeft+ArrowUp": goNorthWest,
  "ArrowRight+ArrowUp": goNorthEast,
  "ArrowDown+ArrowLeft": goSouthWest,
  "ArrowDown+ArrowRight": goSouthEast,
};

export const loadBattleKeyboard = (
  kbdh: KeyboardHandler,
  data: () => [BattleProps, Partial<BattleState>],
  cb: (upd: Partial<BattleState>) => void,
): void => {
  Object.entries(KeyDown).forEach(([key, hndl]) => kbdh.listenToDown(key, (e) => cb(hndl(...data())(e))));
  Object.entries(KeyUp).forEach(([key, hndl]) => kbdh.listenToUp(key, (e) => cb(hndl(...data())(e))));
}
