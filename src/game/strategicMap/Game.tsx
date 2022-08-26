import * as React from "react";
import {Component, useEffect, useReducer} from "react";
import { Hero as HeroModel, HeroType } from "../../models/actors/hero";
import { Creatures } from "../components/Creatures";
import { Hero } from "../components/Hero";

import {TerrainMap} from '../components/Map'
import { WorldMapContext } from "../contexts/WorldMapContext";
import { Stats } from "../components/stats";
import { alertDlg, Dialog, textDlg } from "../../components/dialog";
import { KeyboardHandler } from "../contexts/KeyboardContext";
import { GameProps, GameState, MAP_SZ, TILE_SZ } from "./GameTypes";
import { loadGameKeyboard } from "./GameKeyboard";
import { Domain } from "../../models/domain";
import { Monster } from "../../models/actors/monster";
import { Board } from "../components/Board";

type StrategicActions = {
  type: 'kbd' | 'upd',
  partial: Partial<GameState>,
};
type StrategicReducer = (state: GameState, action: StrategicActions) => GameState;

//export class Game extends Component<GameProps, Partial<GameState>> {
export const Game = (props: GameProps) => {
  const {domainSize} = props.world;

  const getLocalCreatures = () => {
    const {creatures, world} = props;
    const {x, y} = {x: domainSize/2|0, y: domainSize/2|0};
    const [Dx, Dy] = world.convertCoord(x, y);
    const adjDomains: Domain[] = [];
    for (let dx=-1; dx<=1; dx++)
    for (let dy=-1; dy<=1; dy++)
      adjDomains.push(world.getDomain(Dx + dx, Dy + dy));
    
    const localCreatures: Monster[] = adjDomains.reduce((a, d) => {
      const DC = creatures.getForDomain(d);
      return [...a, ...DC];
    }, []);
    return localCreatures;
  }

  const processStrategicActions = async (state: GameState, action: StrategicActions): Promise<GameState>  => {
    const {creatures, world} = props;
    const {enemy, hero, x, y} = state;
    let partialState: Partial<GameState> = {}; 
    if (enemy) {
      new Promise((rs, rj) =>
        partialState = {
          dialogContents:
            textDlg(
              `СИЛА МОНСТРА = ${enemy.power} СИЛА ГЕРОЯ = ${hero.power}`,
              [['ВПЕРЕД!!!', rs], ['ХМ...НЕ СЕЙЧАС', rj]],
            ),
            dialogClosable: false,
        }
      )
      .then(() => {
        // this.api
      })
      .then(() => {
        let dialogContents, dialogClosable = false, x = enemy.location[0], y = enemy.location[1];
        if (enemy.power == hero.power) {
          dialogContents = alertDlg("НИЧЬЯ");
          dialogClosable = true;
          x = state.x; y = state.y;
        } else if (enemy.power > hero.power) {
          dialogContents = alertDlg("КОНЕЦ ИГРЫ", () => window.location.href = '');
          dialogClosable = false;
        } else {
          dialogContents = alertDlg(`ПОБЕДА!!! СИЛА ГЕРОЯ = ${hero.power + 1}`);
          hero.power++;
          creatures.remove(enemy);
          dialogClosable = true;
        }
        hero.location = enemy.location;
        const localCreatures = getLocalCreatures();
        partialState = {...partialState, x, y, hero, dialogContents,localCreatures};
      })
      .catch(() => partialState.dialogContents = null);
      partialState.enemy = null;
    }
    const [pDx, pDy] = world.convertCoord(state.x, state.y);
    const [Dx, Dy] = world.convertCoord(x, y);
    if (pDx != Dx || pDy != Dy) {
      partialState.localCreatures = getLocalCreatures();
    }
    return {...state, ...partialState};
  }

  const [state, dispatch] = useReducer<StrategicReducer, GameState>(
    processStrategicActions as any as StrategicReducer, // F*CK U react
    {
      dx: 0, dy: 0,
      x: domainSize/2|0, y: domainSize/2|0,
      heroDirection: 's',
      hero: new HeroModel(5, (Math.random()*18|0) as HeroType, [domainSize/2|0, domainSize/2|0], 's'),
      dialogContents: null,
      dialogClosable: false,
      localCreatures: getLocalCreatures()
    } as any,
    (a) => a,
  );

  // const api = useContext(ApiContext);
  const kbHandler: KeyboardHandler = new KeyboardHandler();
  useEffect(() => {
    loadGameKeyboard(
      kbHandler,
      () => [props, state],
      (partial: Partial<GameState>) => dispatch({type: 'kbd', partial}),
    );
    return () => kbHandler.destroy();
  }, []);

  const {world, creatures} = props;
  const {x,y, dialogContents, hero, dialogClosable, localCreatures} = state;

  return (
    <WorldMapContext.Provider value={{world}}>
      <Board>
        <Stats world={world} creatures={creatures} hero={hero} />
        <div
          style={{
            position: "relative",
            width: MAP_SZ * TILE_SZ,
            height: MAP_SZ * TILE_SZ,
            left: 0,
            top: 0,
            right: 0,
            bottom: 0,
            margin: 'auto',
          }}
        >
        <TerrainMap sz={MAP_SZ} tileSz={TILE_SZ} world={props.world} x={x} y={y} />
        <Hero hero={hero} z={MAP_SZ/2}/>
        <Creatures x={x} y={y} sz={MAP_SZ} tileSz={TILE_SZ} creatures={localCreatures}/>
        <Dialog
          show={!!dialogContents}
          hasCloseButton={dialogClosable}
          onClose={() => dispatch({type: 'upd', partial: {dialogContents: null}})}
        >
          {dialogContents}
        </Dialog>
        </div>
      </Board>
    </WorldMapContext.Provider>
  );
}