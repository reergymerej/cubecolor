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

const tallyCoords = (() => {
  const cache: Map<string, CoordsTally> = new Map()
  return (coords: string): CoordsTally => {
    if (!cache.has(coords)) {
      const middles = coords.replace(/[02]+/g, '').length
      const tally: CoordsTally = {
        middles,
        ends: 3 - middles,
      }
      cache.set(coords, tally)
    }
    return <CoordsTally>cache.get(coords)
  }
})()

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
