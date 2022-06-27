import * as React from "react";
import { Hero as HeroModel} from "../../../models/actors/hero";

type HeroProps = {
  z: number;
  hero: HeroModel;
}
export class Hero extends React.Component<HeroProps> {
  render() {
    const {z, hero} = this.props;
    return (
      <div className="hero-container">
        <div className={`char hero-type-${hero.type} walk-${hero.direction}`} style={{zIndex: z}}></div>
      </div>
    );
  }
}