import * as React from "react";
import { ApiContext } from "../../core/providers/mockApi";
import { Hero } from "../../models/actors/hero";
import { Monster } from "../../models/actors/monster";
import { Player } from "../../models/player";
import { WorldMap } from "../../models/worldmap";
import { TerrainMap } from "../components/Map";

type BattlePlayers = {
  player: Player;
  hero: Hero;
  army: Monster[];
}
type BattleProps = {
  world: WorldMap;
  attacker: string;
  defender: string;
}
type BattleState = {
  players: BattlePlayers[];
  ready: boolean;
}
export class Battle extends React.Component<BattleProps, BattleState> {
  constructor(props: BattleProps) {
    super(props);
    this.state = {
      players: [],
      ready: false,
    };
  }

  async componentDidMount() {
    this.setState({players: await this.loadPlayers()});
  }

  async loadPlayers(): Promise<BattlePlayers[]> {
    return [];
  }

  render() {
    return <ApiContext.Consumer>{api => <>
      <TerrainMap sz={0} tileSz={0} world={new WorldMap} x={0} y={0} />
    </>}
    </ApiContext.Consumer>
  }
}