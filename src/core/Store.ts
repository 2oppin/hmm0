import { User } from "hmm0-types/user/user";
import { WorldMap } from "hmm0-types/worldmap";
import * as React from "react";

export type Store = {
  world?: WorldMap,
  user?: User,
};
export const StoreContext = React.createContext({} as Store);