import * as React from "react";
import { WorldMap } from "../../models/worldmap";

export const WorldMapContext = React.createContext<{world: WorldMap}>({
  world: new WorldMap()
});