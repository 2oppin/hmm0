import * as React from "react";
import { Army } from "hmm0-types/monster/army";

type CreaturesProps = {
  creatures: Army[];
  visibleBox?: [number, number, number, number];
  tileSz: number;
}
type CreaturesState = {
  visibleCreatures: Army[];
}
export class Creatures extends React.Component<CreaturesProps, CreaturesState> {
  constructor(props: CreaturesProps) {
    super(props);
    this.state = {
      visibleCreatures: this.filterCreatures(props.creatures),
    };
  }
  componentDidUpdate(prevProps: Readonly<CreaturesProps>, prevState: Readonly<CreaturesState>, snapshot?: any): void {
    const {creatures, visibleBox: [x, y, w, h]} = this.props;
    const {visibleBox: [x0, y0, w0, h0]} = prevProps;
    if (x0 !== x || y0 !== y || w != w0 || h != h0)
      this.setState({visibleCreatures: this.filterCreatures(creatures)});
  }
  private filterCreatures(creatures: Army[]) {
    const {visibleBox: [x, y, w, h]} = this.props;
    const btw = (p: number, d: number) => (a: number) => Math.abs(a - p) < d / 2;
    const visibleCreatures = creatures.filter(({location: [cx, cy]}) => btw(cx, w)(x) && btw(cy, h)(y));
    return visibleCreatures;
  }
  getPosition(c: Army) {
    const {tileSz, visibleBox: [x, y, w, h]} = this.props;
    const [cx, cy] = c.location;
    return [(w/2 - x + cx) * tileSz, (h/2 - y + cy) * tileSz, (h/2 - y + cy)];
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