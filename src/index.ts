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

export class Corner {
  constructor(
    public axis: any,
    public right: any,
    public left: any,
  ) {}
}

export const rotate = (corner: Corner, ccw?: boolean): Corner => {
  return ccw
    ? new Corner(
      corner.right,
      corner.left,
      corner.axis,
    )
    : new Corner(
      corner.left,
      corner.axis,
      corner.right,
    )
}

const invert = (face: string): string => {
  return face[0] === '-'
    ? face.substring(1)
    : `-${face}`
}

export const nextCorner = (corner: Corner, ccw?: boolean): Corner => {
  return ccw
    ? new Corner(
      corner.axis,
      corner.left,
      invert(corner.right),
    )
    : new Corner(
      corner.axis,
      invert(corner.left),
      corner.right,
    )
}

// The baseCorner tells us what the scheme is for the cube.
export const getAllCorners = (baseCorner: Corner): Corner[] => {
    const corners: Corner[] = []
    // rotate around one plane
    corners.push(baseCorner)
    let corner = nextCorner(baseCorner)
    corners.push(corner)
    corner = nextCorner(corner)
    corners.push(corner)
    corner = nextCorner(corner)
    corners.push(corner)
    // move to bottom
    corner = rotate(corner, true)
    corner = nextCorner(corner)
    corner = rotate(corner, true)
    corners.push(corner)
    // rotate around this plane
    corner = nextCorner(corner)
    corners.push(corner)
    corner = nextCorner(corner)
    corners.push(corner)
    corner = nextCorner(corner)
    corners.push(corner)
    return corners
}

const cornersMatch = (a: Corner) => (b: Corner): boolean => {
  let reorientedA = a
  let reorientedB = b
  let match = false
  let turns = 3
  while (reorientedA.axis === null) {
    reorientedA = rotate(reorientedA)
  }
  while (!match && turns--) {
    match = reorientedA.axis === reorientedB.axis
      && (reorientedA.right === reorientedB.right
      || reorientedA.left === reorientedB.left)
    reorientedB = rotate(reorientedB)
  }
  return match
}

const getMatchingCorner = (corners: Corner[]) => (corner: Corner): Corner | undefined => {
  return corners.find(cornersMatch(corner))
}

export const completeCorner = (corner: Corner, baseCorner: Corner): Corner => {
  // Don't do it in terms of absolute volues.  We need a base corner, rwb, xyz,
  // that we can use.  The baseCorner tells us what the scheme is for the cube.
  const allCorners: Corner[] = getAllCorners(baseCorner)
  // find a matching corner
  const matchedCorner: Corner | undefined = getMatchingCorner(allCorners)(corner)
  if (!matchedCorner) {
    console.error(corner)
    throw new Error('invalid corner')
  }
  return matchedCorner
}
