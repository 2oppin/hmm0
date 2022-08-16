import { Direction } from "../../models/terrainmap";
import { KeyboardHandler } from "../contexts/KeyboardContext";

export type BattleMapActions =  {
  onChangeActive?: () => void,
  onShowCapabilities?: () => void,
  onHideCapabilities?: () => void,
  onDirectionChange?: (direction: Direction) => void,
  onDirectionChangeReady?: (direction: Direction) => void,
}

export const loadBattleMapKeyboard = (
  kbdh: KeyboardHandler,
  actions: BattleMapActions,
): void => {
  const KeyToDirection: {[key: string]: Direction} = {
    "ArrowUp": 'n',
    "ArrowDown": 's',
    "ArrowLeft": 'w',
    "ArrowRight": 'e',
    "ArrowLeft+ArrowUp": 'nw',
    "ArrowRight+ArrowUp": 'ne',
    "ArrowDown+ArrowLeft": 'sw',
    "ArrowDown+ArrowRight": 'se',
  };

  Object.entries(KeyToDirection).forEach(([key, dir]) => {
    kbdh.listenToDown(key, (e) => {
      console.log(`keydown: ${key}`);
      actions.onDirectionChangeReady(dir);
    });
    kbdh.listenToUp(key, (e) => {
      console.log(`keyup: ${key}`);
      actions.onDirectionChange(dir);
    });
  });
  kbdh.listenToDown("Tab", (e) => {
    console.log(`keydown: Tab`, e);
    e.stopPropagation();
    e.preventDefault();
  });
  kbdh.listenToUp("Tab", (e) => {
    console.log(`keydown: Tab`, e);
    actions.onChangeActive();
  });
  kbdh.listenToDown("Shift", (e) => {
    console.log(`keydown: Shift`, e);
    actions.onShowCapabilities();
  });
  kbdh.listenToUp("Shift", (e) => {
    console.log(`keydown: Shift`, e);
    actions.onHideCapabilities();
  });
}
