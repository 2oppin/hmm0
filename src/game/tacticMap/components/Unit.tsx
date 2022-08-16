import * as React from "react";
import { Unit as UnitModel} from "hmm0-types/monster/army";

type UnitProps = {
  z: number;
  color: string;
  unit: UnitModel;
  active: boolean;
  showCapabilities: boolean;
  onClick?: (e: any) => void;
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
    const {z, unit, color, active, showCapabilities, onClick = () => {}} = this.props;
    const [x, y] = unit.location;
    const capSzPos = (v: number) => ({
      width: 25 + v*2,
      height: 25 + v*2,
      left: 0 - v,
      top: 0 - v,
    });
    const dotZInx = (i: number) => (i%3 === 1 ? 10 : 1) * (3-(i/3|0));
    return (
      <div className="army-container" style={{left: x*25, top: y*25}} onClick={onClick}>
        {active && <div className={`army-active`}></div>}
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
          style={{zIndex: active ? z*20 + 1 : z}}
        ></div>
        {showCapabilities && active && <div
          className="army-capabilities"
          style={{zIndex: z*20}}
        >
          {[...Array(9)].map((_, i) => <div key={i} className="army-capabilities-dot" style={{zIndex: dotZInx(i)}}>
            {unit.monster.capabilities.melee[i] > 0 && 
              <div className="army-capabilities-dot-attack" style={{...capSzPos(unit.monster.capabilities.melee[i])}}></div>
            }
            {unit.monster.capabilities.defence[i] > 0 && 
              <div className="army-capabilities-dot-defence" style={{...capSzPos(unit.monster.capabilities.defence[i])}}></div>
            }
            {unit.monster.capabilities.defence[i] < 0 && 
              <div className="army-capabilities-dot-vulnerable" style={{...capSzPos(unit.monster.capabilities.defence[i])}}></div>
            }
          </div>)}
        </div>}
      </div>
    );
  }
}