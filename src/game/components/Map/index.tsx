import * as React from 'react';
import { DOMAIN_SIZE } from '../../../models/domain';
import { WorldMap } from '../../../models/worldmap';

type MapProps = {
  sz: number;
  tileSz: number;
  world: WorldMap;
  x: number;
  y: number;
}
type MapState = {

};
export class Map extends React.Component<MapProps, MapState> {
  constructor(props: MapProps) {
    super(props);
  }

  getTileBg(i: number) {
    const {world, sz, x, y} = this.props;
    const [cx, cy] = [x + i%sz - sz/2, y + (i/sz|0) - sz/2];
//console.log(`getTileBg(${i}) = ${cx}, ${cy}`);
    const tile = [[0, 1], [0, 0], [1, 0], [1, 1]].reduce((s, [dx, dy]) => 
      s + (world.isTresspassable(cx + dx, cy + dy) ? 1 : 0) + '_', '');
    return  `url(images/res/land/dungeon/${tile}1.png)`;
  }

  getTileX(i: number) {
    return `${i - (i / this.props.sz | 0) * this.props.sz * this.props.tileSz}px`;
  }

  getTileY(i: number) {
    return `${i - (i / this.props.sz | 0) * this.props.sz * this.props.tileSz}px`;
  }

  render() {
    // @TODO - replace with canvas
    return (
      <div className='bboard' style={{
        width: this.props.sz * this.props.tileSz + 'px',
        height: this.props.sz * this.props.tileSz + 'px',
        display: 'flex',
        flexWrap: 'wrap',
        margin: 'auto',
      }}>
        {[...Array(this.props.sz**2)].map((_, i) =>
          <div 
            key={i}
            style={{
              background: this.getTileBg(i),
              left: this.getTileX(i),
              top: this.getTileY(i),
              width: this.props.tileSz + 'px',
              height: this.props.tileSz + 'px',
            }}
            className='tile'>
          </div>
        )}
      </div>
    );
  }
}