const outOfRange = (value: number): boolean => {
  return value < 0 || value > 2
}

export const getElement = (cube: any[][][], x: number, y: number, z: number): any => {
  if (outOfRange(x)
    || outOfRange(y)
    || outOfRange(z)
  ) {
    throw new Error(`invalid range for cube: ${x}, ${y}, ${z}`)
  }
  return cube[x][y][z]
}


type Coords = string | number

const coordsToInt = (coords: Coords): number => {
  if (typeof coords === 'string') {
    return parseInt(coords)
  }
  return coords
}

const padLeft = (char: string, length: number) => (input: string): string => {
  let result = input
  while (result.length < length) {
    result = `${char}${result}`
  }
  return result
}

const padLeftCoords = padLeft('0', 3)

const coordsToString = (coords: Coords): string => {
  if (typeof coords === 'string') {
    return coords
  }
  return padLeftCoords(`${coords}`)
}


type CoordsTally = {
  middles: number;
  ends: number;
}

const tallyCoords = (coords: string): CoordsTally => {
  const middles = coords.replace(/[02]+/g, '').length
  return {
    middles,
    ends: 3 - middles,
  }
}

export const isCenter = (coords: Coords) => {
  const tally: CoordsTally = tallyCoords(coordsToString(coords))
  return tally.ends === 1
}

export const isCorner = (coords: Coords) => {
  const tally: CoordsTally = tallyCoords(coordsToString(coords))
  return tally.ends === 3
}

export const isEdge = (coords: Coords) => {
  const tally: CoordsTally = tallyCoords(coordsToString(coords))
  return tally.ends === 2
}
