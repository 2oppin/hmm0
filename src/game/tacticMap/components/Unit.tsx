import * as React from "react";
import { Unit as UnitModel} from "hmm0-types/monster/army";

type UnitProps = {
  z: number;
  color: string;
  unit: UnitModel;
}
export class Unit extends React.Component<UnitProps> {
  calcArmyHealthCss(health: number, defender: boolean) {
    const { color } = this.props;

    var deg = 360 * health;
    if (deg <= 180){
        return `linear-gradient(${90+deg}deg, transparent 50%, #000000 50%),linear-gradient(90deg, #000000 50%, transparent 50%)`;
    }
    else{
      return `linear-gradient(${deg-90}deg, transparent 50%, ${color} 50%),linear-gradient(90deg, #000000 50%, transparent 50%)`;
    }
  }
  render() {
    const {z, unit, color} = this.props;
    const [x, y] = unit.location;
    return (
      <div className="army-container" style={{left: x*25, top: 475 - y*25}}>
        <div
          className={`army-health`}
          style={{
            zIndex: z-1,
            opacity: 0.65,
            backgroundImage: this.calcArmyHealthCss(unit.health, true),
            backgroundColor: color,
            transform: 'rotate(180deg)'
          }}>
        
        </div>
        <div
          className={`char army-type-${unit.monster.type} walk-${unit.direction}`}
          style={{zIndex: z}}
        ></div>
      </div>
    );
  }
}