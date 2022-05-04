import { HeroDirection } from "../models/actors/hero";
import { KeyboardHandler } from "./contexts/KeyboardContext";
import { GameProps, GameState } from "./GameTypes";

const readyToNorth = (props: GameProps, state: Partial<GameState>) => (e: KeyboardEvent): Partial<GameState> =>
  ({heroDirection: "n", hero: {...state.hero, direction: "n"}});
const readyToSouth = (props: GameProps, state: Partial<GameState>) => (e: KeyboardEvent): Partial<GameState> =>
  ({heroDirection: "s", hero: {...state.hero, direction: "s"}});
const readyToEast = (props: GameProps, state: Partial<GameState>) => (e: KeyboardEvent): Partial<GameState> =>
  ({heroDirection: "e", hero: {...state.hero, direction: "e"}});
const readyToWest = (props: GameProps, state: Partial<GameState>) => (e: KeyboardEvent): Partial<GameState> =>
  ({heroDirection: "w", hero: {...state.hero, direction: "w"}});
const readyToNorthEast = (props: GameProps, state: Partial<GameState>) => (e: KeyboardEvent): Partial<GameState> =>
  ({heroDirection: "ne", hero: {...state.hero, direction: "ne"}});
const readyToSouthEast = (props: GameProps, state: Partial<GameState>) => (e: KeyboardEvent): Partial<GameState> =>
  ({heroDirection: "se", hero: {...state.hero, direction: "se"}});
const readyToNorthWest = (props: GameProps, state: Partial<GameState>) => (e: KeyboardEvent): Partial<GameState> =>
  ({heroDirection: "nw", hero: {...state.hero, direction: "nw"}});
const readyToSouthWest = (props: GameProps, state: Partial<GameState>) => (e: KeyboardEvent): Partial<GameState> =>
  ({heroDirection: "sw", hero: {...state.hero, direction: "sw"}});

const goNorth = (props: GameProps, state: Partial<GameState>) => (e: KeyboardEvent): Partial<GameState> =>
  justGo(props, state)('n');
const goSouth = (props: GameProps, state: Partial<GameState>) => (e: KeyboardEvent): Partial<GameState> =>
  justGo(props, state)('s');;
const goEast = (props: GameProps, state: Partial<GameState>) => (e: KeyboardEvent): Partial<GameState> =>
  justGo(props, state)('e');
const goWest = (props: GameProps, state: Partial<GameState>) => (e: KeyboardEvent): Partial<GameState> =>
  justGo(props, state)('w');
const goNorthEast = (props: GameProps, state: Partial<GameState>) => (e: KeyboardEvent): Partial<GameState> =>
  justGo(props, state)('ne');
const goSouthEast = (props: GameProps, state: Partial<GameState>) => (e: KeyboardEvent): Partial<GameState> =>
  justGo(props, state)('se');
const goNorthWest = (props: GameProps, state: Partial<GameState>) => (e: KeyboardEvent): Partial<GameState> =>
  justGo(props, state)('nw');
const goSouthWest = (props: GameProps, state: Partial<GameState>) => (e: KeyboardEvent): Partial<GameState> =>
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

const justGo = (props: GameProps, state: Partial<GameState>) => (dir: HeroDirection) => {
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

export const loadGameKeyboard = (
  kbdh: KeyboardHandler,
  data: () => [GameProps, Partial<GameState>],
  cb: (upd: Partial<GameState>) => void,
): void => {
  Object.entries(KeyDown).forEach(([key, hndl]) => kbdh.listenToDown(key, (e) => cb(hndl(...data())(e))));
  Object.entries(KeyUp).forEach(([key, hndl]) => kbdh.listenToUp(key, (e) => cb(hndl(...data())(e))));
}
