import * as React from "react";
import {Component, KeyboardEvent} from "react";
import { Monster } from "../models/actors/monster";
import { Hero as HeroModel, HeroType } from "../models/actors/hero";
import { WorldMap } from "../models/worldmap";
import { Creatures } from "./components/Creatures";
import { Hero, HeroDirection } from "./components/Hero";

import {Map} from './components/Map'
import { WorldMapContext } from "./contexts/WorldMapContext";
import { DOMAIN_SIZE } from "../models/domain";

type GameProps = {
  world: WorldMap;
}
type GameState = {
  x: number;
  y: number;
  dx: number;
  dy: number;
  heroDirection: HeroDirection;
  hero: HeroModel;
  creatures: Monster[];
}
const MAP_SZ = 26;
const TILE_SZ = 25;
export class Game extends Component<GameProps, GameState> {
  constructor(props: GameProps) {
    super(props);
    this.state = {
      x: 0, y: 0,
      dx: 0, dy: 0,
      heroDirection: 's',
      hero: new HeroModel(5, Math.random()*18 as HeroType, [0, 0]),
      creatures: [...Array(10)].map(_ => {
        let x,y;
        do [x, y] = [Math.random()*DOMAIN_SIZE|0 - DOMAIN_SIZE/2, Math.random()*DOMAIN_SIZE|0 - DOMAIN_SIZE/2];
        while(!this.props.world.isTresspassable(x, y));
        return new Monster(Math.random()*10|0, "nature", [x, y]);
      }),
    };
  }

  onKeyDown(e: KeyboardEvent) {
    let dx =0, dy = 0; 
    switch (e.key) {
      case 'ArrowUp':
        dy = -1;
        break;
      case 'ArrowDown':
        dy = 1;
        break;
      case 'ArrowLeft':
        dx = -1;
        break;
      case 'ArrowRight':
        dx = 1;
        break;
    }
    const heroDirection = ({'0-1': 'n', '-1-1': 'nw', '-10': 'w', '-11': 'sw', '01': 's', '11': 'se', '10': 'e', '1-1': 'ne'} as any)
      [`${dx || this.state.dx}${dy || this.state.dy}`];
    dx && this.setState({dx, heroDirection});
    dy && this.setState({dy, heroDirection});
  }

  onKeyUp(e: KeyboardEvent) {
    const {dx, dy, x, y, hero, creatures} = this.state;
    if (dx || dy) {
      const upd: Partial<GameState> = {dx: 0, dy: 0, x: x + dx, y: y + dy};
      if (!this.props.world.isTresspassable(upd.x, upd.y)) {
        upd.x = x;
        upd.y = y;
      } else {
        const enemy = creatures.find(({location: [cx, cy]}) => cx === upd.x && cy === upd.y);
        if (enemy) {
          if (!confirm(`СИЛА МОНСТРА = ${enemy.power} СИЛА ГЕРОЯ = ${hero.power}`)) return;

          if (enemy.power == hero.power) {
            alert('НИЧЬЯ');
            delete upd.x;
            delete upd.y;
          } else if (enemy.power > hero.power) {
            alert('КОНЕЦ ИГРЫ');
            window.location.href = '';
          } else {
            alert(`ПОБЕДА!!! СИЛА ГЕРОЯ = ${hero.power + 1}`);
            hero.power++;
            upd.creatures = creatures.filter(({location: [cx, cy]}) => cx !== upd.x || cy !== upd.y);
          }
        }
      }
      this.setState(upd as GameState);
    }
  }

  render() {
    const {x,y, heroDirection, creatures} = this.state;
    return (
      <WorldMapContext.Provider value={{world: this.props.world}}>
        <div
          tabIndex={-1}
          onKeyDown={(e) => this.onKeyDown(e)}
          onKeyUp={(e) => this.onKeyUp(e)}
          style={{
            outline: 'none',
            position: 'relative',
          }}
        >
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
          <Hero direction={heroDirection} z={MAP_SZ/2}/>
          <Creatures x={x} y={y} sz={MAP_SZ} tileSz={TILE_SZ} creatures={creatures}/>
          </div>
        </div>
      </WorldMapContext.Provider>
    );
  }
}