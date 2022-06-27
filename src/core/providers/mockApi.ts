import * as React from "react";
import {Army} from 'hmm0-srv'

export class MockApi {
  async getArmy(id: string): Promise<Army[]> {
    return [];
  }
}

export const ApiContext = React.createContext(new MockApi);