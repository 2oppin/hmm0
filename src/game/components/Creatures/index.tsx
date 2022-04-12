import * as React from "react";
import { Monster } from "../../../models/actors/monster";

type CreaturesProps = {
  creatures: Monster[];
  x: number;
  y: number;
  sz: number;
  tileSz: number;
}
type CreaturesState = {
  visibleCreatures: Monster[];
}
export class Creatures extends React.Component<CreaturesProps, CreaturesState> {
  constructor(props: CreaturesProps) {
    super(props);
    this.state = {
      visibleCreatures: this.filterCreatures(props.creatures),
    };
  }
  componentDidUpdate(prevProps: Readonly<CreaturesProps>, prevState: Readonly<CreaturesState>, snapshot?: any): void {
    const {creatures, x, y, sz} = this.props;
    if (prevProps.x !== x || prevProps.y !== y)
      this.setState({visibleCreatures: this.filterCreatures(creatures)});
  }
  private filterCreatures(creatures: Monster[]) {
    const {x, y, sz} = this.props;
    const btw = (p: number) => (a: number) => Math.abs(a - p) < sz / 2;
    const visibleCreatures = creatures.filter(({location: [cx, cy]}) => btw(cx)(x) && btw(cy)(y));
    console.log(`Filtered: [${x}:${y}] X ${sz/2}`, visibleCreatures);
    return visibleCreatures;
  }
  getPosition(c: Monster) {
    const {tileSz, sz, x, y} = this.props;
    const [cx, cy] = c.location;
    return [(sz/2 - x + cx) * tileSz, (sz/2 - y + cy) * tileSz, (sz/2 - y + cy)];
  }
  render() {
    const {visibleCreatures} = this.state;
    return <div className="creature-container">
      {visibleCreatures.map((c, i) => {
        const [left, top, zIndex] = this.getPosition(c);
        return <div key={i} className={`creature ${c.type}-0 type-0-0`} style={{
          left: `${left}px`,
          top: `${top}px`,
          zIndex,
        }}
      ></div>
      })}
    </div>
  }
}