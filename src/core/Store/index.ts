import * as React from "react";

export const store: {[key: string]: any} = {};
export const StoreContext = React.createContext({store});