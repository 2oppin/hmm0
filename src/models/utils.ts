export const singnedCoordsToUnsigned = (coords: [number, number]): [number, number] =>
  coords.map(c => c < 0 ? -c * 2 - 1: c * 2) as [number, number];

export const unsingnedCoordsToSigned = (coords: [number, number]): [number, number] =>
  coords.map(c => c % 2 ? -(c/2|0) : (c/2|0)) as [number, number];
