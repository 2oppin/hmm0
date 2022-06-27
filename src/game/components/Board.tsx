import * as React from "react";

export class Board extends React.Component<{children: React.ReactElement[]}> {
  render(): any {
    return
      <div style={{
          outline: 'none',
          position: 'relative',
          display: 'flex',
        }}
      >
        {this.props.children}
      </div>
  }
}