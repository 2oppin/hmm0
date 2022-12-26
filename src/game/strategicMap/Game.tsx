import * as React from "react";
import { useContext, useEffect, useReducer, useState} from "react";

import { Hero as HeroModel, HeroType } from "../../models/actors/hero";
import { Creatures } from "../components/Creatures";
import { Hero } from "../components/Hero";

import {TerrainMap} from '../components/Map'
import { Stats } from "../components/stats";
import { Dialog, textDlg } from "../../components/dialog";
import { KeyboardHandler } from "../contexts/KeyboardContext";
import { GameState, StrategicAction, TILE_SZ } from "./GameTypes";
import { loadGameKeyboard } from "./GameKeyboard";
import { Army, ArmyDetails } from "hmm0-types/monster";
import { Board } from "../components/Board";
import { ApiContext } from "../../core/providers/mockApi";
import { StoreContext } from "../../core/Store";
import { addDirection } from "hmm0-types/terrainmap";
import { useNavigate } from "react-router-dom";

type StrategicReducer = (state: GameState, action: StrategicAction) => GameState;

type EnemyReducer = (prev: ArmyDetails, next: ArmyDetails) => ArmyDetails;

type DialogState = {
  dialogContents?: React.ReactElement | null;
  dialogClosable?: boolean;
}
export const Game = () => {
  const navigate = useNavigate();
  const api = useContext(ApiContext);
  const store = useContext(StoreContext);
  console.log(store);
  const {world, user} = store; 
  const {domainSize} = world;
  const [localArmies, setLocalArmies] = useState<Army[]>([]);
  const [dim, setDim] = useState<[number, number]>([ 1200 / TILE_SZ | 0, 600 / TILE_SZ | 0]);

  const [dialog, setDialog] = useState<DialogState>({});
  const [enemy, setEnemy] = useReducer<EnemyReducer, ArmyDetails>(
    (prev: ArmyDetails, army: ArmyDetails) => {
      if (!army) return null;
      console.log('ARMY: ENEMY:', army);
      new Promise((rs, rj) => setDialog({
          dialogContents:
            textDlg(
              `СИЛА МОНСТРА = ${army.units[0].monster.power}`,
              [['ВПЕРЕД!!!', rs], ['ХМ...НЕ СЕЙЧАС', rj]],
            ),
          dialogClosable: false,
      }))
      .then(async () => {
        const b = await api.createBattle(user.id, army.heroId, [x, y]);
        console.log("Battle", b);
        return b;
      })
      .then(({id}) => {
        setDialog({dialogContents: null});
        navigate(`/battle/${id}`);
        return;
      })
      .catch((e) => {
        console.log(e);
        setDialog({dialogContents: null});
      });
    },
    null,
    (s) => s,
  );
  const [[Dx, Dy], setDomain] = useState<[number, number]>([NaN, NaN]);

  const updateLocation = async (x: number, y: number) => {
    // TODO - optimize / cache values
    const [curDx, curDy] = world.convertCoord(x, y);
    if (curDx !== Dx || curDy !== Dy) {
      console.log('Domains:', `world.getVisibleDomains([${x}, ${y}], ${dim})`, world.getVisibleDomains([x, y], dim));
      const localA: Army[] = await Promise.all(
        world.getVisibleDomains([x, y], dim).map(d => {
          const armies = api.getArmiesForDomain(world.id, d[0], d[1]);
          console.log(`getArmiesForDomain(${world.id}, ${d[0]}, ${d[1]})`, armies);
          return armies;
        })
      ).then(armies =>
        armies.reduce((a: Army[], army: Army[]) => a.concat(army), [])
      );
      setLocalArmies(localA);
      setDomain([curDx, curDy]);
      console.log(`location UPDATED WRLD #${world.id}: armies = ${localA.length}`);
    }
  }

  const processStrategicAction = (s: GameState, action: StrategicAction): GameState  => {
    console.log("da Game acion:", action, s);
    const {hero, x, y} = s;
    let partialState: Partial<GameState> = {};
    if (action.type === 'turn') {
      s.hero.direction = action.d;
      return {...s};
    }
    if (action.type === 'move') {

      let [nx, ny] = addDirection(action.d, [x, y]);

      if (!world.isTresspassable([nx, ny]))
        return s;

      const enemyArmy = localArmies.find(({location: [ax, ay]}) => ax === nx && ay === ny);
      if (!enemyArmy) {
        s.hero.location = [nx, ny];
        updateLocation(nx, ny);
        return {...s, x: nx, y: ny};
      } else {
        console.log('Enemy:', enemyArmy);
        (async () => setEnemy(await api.getArmyDetails(enemyArmy.id)))();
        return s;
      }
    }

    return {...s, ...partialState};
  }
  const [state, dispatch] = useReducer<StrategicReducer, GameState>(
    processStrategicAction,
    {
      dx: 0, dy: 0,
      x: domainSize/2|0, y: domainSize/2|0,
      heroDirection: 's',
      hero: new HeroModel(5, (Math.random()*18|0) as HeroType, [domainSize/2|0, domainSize/2|0], 's'),
    } as any,
    (s) => s,
  );

  const kbHandler: KeyboardHandler = new KeyboardHandler();
  useEffect(() => {
    loadGameKeyboard(kbHandler, dispatch);
    updateLocation(state.x, state.y);
    return () => kbHandler.destroy();
  }, []);

  const [MAP_W, MAP_H] = dim;

  const {x,y,hero} = state || {};
  const {dialogContents, dialogClosable} = dialog;
  console.log(`RNDR: dlg ~`, dialog);
  return (
    <Board onResize={([w,h]) => {
        setDim([2*(w/(TILE_SZ*2)|0), 2*(h/(TILE_SZ*2)|0)]);
      }}>
      <Stats collapsed={false} world={world} creatures={localArmies} hero={hero} />
      <div
        style={{
          position: "relative",
          width: MAP_W * TILE_SZ,
          height: MAP_H * TILE_SZ,
          left: 0,
          top: 0,
          right: 0,
          bottom: 0,
          margin: 'auto',
        }}
      >
      <TerrainMap width={MAP_W} height={MAP_H} tileSz={TILE_SZ} map={world} x={x} y={y} />
      <Hero hero={hero} z={MAP_W}/>
      {localArmies.length && <Creatures visibleBox={[x, y, MAP_W, MAP_H]} tileSz={TILE_SZ} creatures={localArmies}/>}
      <Dialog
        show={!!dialogContents}
        hasCloseButton={dialogClosable}
        onClose={() => setDialog({dialogContents: null, dialogClosable: false})}
      >
        {dialogContents}
      </Dialog>
      </div>
    </Board>
  );
}