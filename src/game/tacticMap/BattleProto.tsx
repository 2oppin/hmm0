import * as React from "react";
import {Component, KeyboardEvent} from "react";
import { Hero as HeroModel, HeroType } from "../../models/actors/hero";
import { Creatures } from "../components/Creatures";
import { Hero } from "../components/Hero";

import {Map} from '../components/Map'
import { WorldMapContext } from "../contexts/WorldMapContext";
import { Stats } from "../components/stats";
import { alertDlg, Dialog, textDlg } from "../../components/dialog";
import { KeyboardHandler } from "../contexts/KeyboardContext";
import { BattleProps, BattleState, MAP_SZ, TILE_SZ } from "./BattleTypes";
import { loadBattleKeyboard } from "./BattleKeyboard";
import { WorldMap } from "../../models/worldmap";
import { Domain, DOMAIN_SIZE } from "../../models/domain";
import { Monster } from "../../models/actors/monster";

export class BattleProto extends Component<BattleProps, Partial<BattleState>> {
  protected kbHandler: KeyboardHandler = null;
  constructor(props: BattleProps) {
    super(props);

    this.kbHandler = new KeyboardHandler();
    // pre-init, to calc localCreatures
    this.state = {x: DOMAIN_SIZE/2|0, y: DOMAIN_SIZE/2|0};
    this.state = {
      dx: 0, dy: 0,
      x: DOMAIN_SIZE/2|0, y: DOMAIN_SIZE/2|0,
      heroDirection: 's',
      hero: new HeroModel(5, (Math.random()*18|0) as HeroType, [DOMAIN_SIZE/2|0, DOMAIN_SIZE/2|0], 's'),
      dialogContents: null,
      dialogClosable: false,
      localCreatures: this.getLocalCreatures()
    };
    loadBattleKeyboard(this.kbHandler, () => [this.props, this.state], (upd: Partial<BattleState>) => this.setState(upd));
  }

  private getLocalCreatures() {
    const {creatures, world} = this.props;
    const {x, y} = this.state;
    const [Dx, Dy] = WorldMap.convertCoord(x, y);
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

  componentDidUpdate(prevProps: Readonly<BattleProps>, prevState: Readonly<Partial<BattleState>>, snapshot?: any): void {
    const {creatures} = this.props;
    const {enemy, hero, x, y} = this.state;
    if (enemy) {
      new Promise((rs, rj) =>
        this.setState({
          dialogContents:
            textDlg(
              `СИЛА МОНСТРА = ${enemy.power} СИЛА ГЕРОЯ = ${hero.power}`,
              [['ВПЕРЕД!!!', rs], ['ХМ...НЕ СЕЙЧАС', rj]],
            ),
            dialogClosable: false,
          })
        )
        .then(() => {
          let dialogContents, dialogClosable = false, x = enemy.location[0], y = enemy.location[1];
          if (enemy.power == hero.power) {
            dialogContents = alertDlg("НИЧЬЯ");
            dialogClosable = true;
            x = this.state.x; y = this.state.y;
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
          const localCreatures = this.getLocalCreatures();
          this.setState({x, y, hero, dialogContents,localCreatures});
        })
        .catch(() => this.setState({dialogContents: null}));
      this.setState({enemy: null});
    }
    const [pDx, pDy] = WorldMap.convertCoord(prevState.x, prevState.y);
    const [Dx, Dy] = WorldMap.convertCoord(x, y);
    if (pDx != Dx || pDy != Dy) {
      this.setState({localCreatures: this.getLocalCreatures()});
    }
  }

  componentWillUnmount(): void {
    this.kbHandler.destroy();
  }

  render() {
    const {world, creatures} = this.props;
    const {x,y, dialogContents, hero, dialogClosable, localCreatures} = this.state;

    return (
      <WorldMapContext.Provider value={{world}}>
        <div
          style={{
            outline: 'none',
            position: 'relative',
            display: 'flex',
          }}
        >
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
          <Map sz={MAP_SZ} tileSz={TILE_SZ} world={this.props.world} x={x} y={y} />
          <Hero hero={hero} z={MAP_SZ/2}/>
          <Creatures x={x} y={y} sz={MAP_SZ} tileSz={TILE_SZ} creatures={localCreatures}/>
          <Dialog show={!!dialogContents} hasCloseButton={dialogClosable} onClose={() => this.setState({dialogContents: null})}>
            {dialogContents}
          </Dialog>
          </div>
        </div>
      </WorldMapContext.Provider>
    );
  }
}