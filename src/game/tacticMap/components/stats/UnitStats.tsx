import * as React from "react";

import { Unit } from "hmm0-types/monster/army";

type StatsProps = {
  unit?: Unit;
}

export class UnitStats extends React.Component<StatsProps> {
  render() {
    const { unit } = this.props;
    return (
      <div>
        {unit && <div>
          <img src={`img/res/monster/${unit.monster.type}`}/>
          HP: ${unit.health}<br />
          Power: ${unit.monster.power}<br />
          AP: ${unit.ap}<br />
        </div>}
        {!unit && <div>No unit selected</div>}
      </div>
    );
  }
}