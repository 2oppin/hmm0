import * as React from "react";

type StatsProps = {
}

export class Stats extends React.Component<StatsProps> {
  render() {
    return (
      <div>
        Attacker: - - -<br />
        Defender: - - -<br />
      </div>
    );
  }
}