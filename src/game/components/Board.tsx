import * as React from "react";

export const Board = ({offset = undefined, children}: {offset?: number, children: React.ReactElement[]}) => {
  return (
    <div style={{
        outline: 'none',
        position: 'relative',
        display: 'flex',
        marginTop: offset || 'auto',
      }}
    >
      {children}
    </div>
  );
}