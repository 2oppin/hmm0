import * as React from 'react';
import { AbstractMap } from 'hmm0-types/map';

type MapProps = {
  width: number;
  height: number;
  tileSz: number;
  map: AbstractMap;
  x: number;
  y: number;
}
type MapState = {
  tilesPreloaded: boolean
};
export class TerrainMap extends React.Component<MapProps, MapState> {
  private static imageBank: ImageBitmap[] = [];
  private static preloaded = false;
  constructor(props: MapProps) {
    super(props);
    this.preloadImages();
    this.state = {tilesPreloaded: TerrainMap.preloaded};
  }

  preloadImages() {
    Promise.all(
      TerrainMap.preloaded
        ? []
        : [...Array(1 << 5)].map(async (_, i) => {
        const img = new Image();
        const p = new Promise(r =>
          img.onload = async () =>
            r(TerrainMap.imageBank[i] = await createImageBitmap(img, 0, 0, img.width, img.height))
        );
        img.src = `/images/res/land/dungeon/${i&1}_${(i&2)>>1}_${(i&4)>>2}_${(i&8)>>3}_1.png`;
        return await p;
      })
    ).then(() => this.setState({tilesPreloaded: true}));
  }

  componentDidUpdate(): void {
    if (this.state.tilesPreloaded) {
      const {tileSz, map, width, height, x, y} = this.props;
      const canvas = document.getElementById('bboard-canvas') as HTMLCanvasElement;
      const ctx = canvas.getContext('2d');

      for (let i = 0; i < width * height; i++) {
        const [cx, cy] = [x + i%width - width/2, y + (i/width|0) - height/2];
        const tile = [[0, 1], [0, 0], [1, 0], [1, 1]].reduce((a, [dx, dy], i) => 
          a + ((+map.isTresspassable([cx + dx, cy + dy])) << i), 0
        );
        ctx.drawImage(TerrainMap.imageBank[tile], (i%width) * tileSz, (i/width|0) * tileSz, tileSz, tileSz);
      }
    }
  }

  render() {
    const {width, height, tileSz} = this.props;

    return (
      <React.Fragment>
      {this.state.tilesPreloaded &&
        <canvas id="bboard-canvas" width={tileSz*width} height={tileSz*height} ></canvas>
      }
      </React.Fragment>
    );
  }
}
