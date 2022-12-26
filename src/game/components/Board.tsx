import * as React from "react";
import { useEffect } from "react";

export type ResizeCallback = (dim: [number, number]) => void;

export const Board = ({onResize= null, offset = undefined, children}: {onResize?: ResizeCallback, offset?: number, children: React.ReactElement[]}) => {
  let timer: NodeJS.Timeout = null;
  const onResizeHandler = () => {
    const {width, height} = document.getElementById('game-board').getBoundingClientRect();
    console.log("NEW DIM:", [width, height], ` RSZ~${!onResize!} trottle...`);
    timer && clearTimeout(timer)
    timer = setTimeout(() => {
      console.log("GO RESIZE!!!");
      onResize && onResize([width, height]);
    }, 1000);
  };

  useEffect(() => {
    onResizeHandler();
    window.addEventListener('resize', onResizeHandler);
    return () =>
      window.removeEventListener('resize', onResizeHandler);
  }, [])

  return (
    <div
      id="game-board"
      style={{
        outline: 'none',
        position: 'absolute',
        left: 0,
        top: 0,
        width: '100%',
        height: '100%',
        display: 'block',
        marginTop: offset || 'auto',
      }}
    >
      {children}
    </div>
  );
}