import { Direction } from "hmm0-types/terrainmap";
import { KeyboardHandler } from "../contexts/KeyboardContext";
import { StrategicAction } from "./GameTypes";


const KeyDirections: {[key: string]: Direction} = {
  "ArrowUp": 'n',
  "ArrowDown": 's',
  "ArrowLeft": 'w',
  "ArrowRight": 'e',
  "ArrowLeft+ArrowUp": 'nw',
  "ArrowRight+ArrowUp": 'ne',
  "ArrowDown+ArrowLeft": 'sw',
  "ArrowDown+ArrowRight": 'se',
};

export const loadGameKeyboard = (
  kbdh: KeyboardHandler,
  cb: (action: StrategicAction) => void,
): void => {
  Object.entries(KeyDirections).forEach(([key, d]) => kbdh.listenToDown(key, (e) => cb({type: 'turn', d})));
  Object.entries(KeyDirections).forEach(([key, d]) => kbdh.listenToUp(key, (e) => cb({type: 'move', d})));
}
