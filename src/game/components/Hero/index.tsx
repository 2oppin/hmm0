import * as React from "react";

export type HeroDirection = 'n' | 'e' | 's' | 'w' | 'nw' | 'ne' | 'sw' | 'se';
type HeroProps = {
  direction: HeroDirection;
  z: number;
}
export class Hero extends React.Component<HeroProps> {
  render() {
    const {z, direction} = this.props;
    return (
      <div className="hero-container">
        <div className={`char hero-type-1 walk-${direction}`} style={{zIndex: z}}></div>
      </div>
    );
  }
}