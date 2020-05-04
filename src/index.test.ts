import * as mod from '.'

describe('getting element from cube', () => {
  const cube = [
    [
      [
        null,
        null,
        null,
      ],
      [
        null,
        null,
        null,
      ],
      [
        null,
        null,
        null,
      ],
    ],
    [
      [
        null,
        null,
        null,
      ],
      [
        null,
        null,
        null,
      ],
      [
        null,
        null,
        null,
      ],
    ],
    [
      [
        null,
        null,
        null,
      ],
      [
        null,
        null,
        null,
      ],
      [
        null,
        null,
        null,
      ],
    ],
  ]

  it('should return value', () => {
    expect(mod.getElement(cube, 0, 0, 0)).toBe(cube[0][0][0])
  })

  it('should throw range error', () => {
    expect(() => {
      mod.getElement(cube, 0, 3, 0)
    }).toThrow('range')
  })
})

describe('face position', () => {
  describe('identifying centers', () => {
    test.each([
      ['000', false],
      [1, false],
      [222, false],
      [121, true],
    ])('.isCenter(%o, %s)', (coords, expected) => {
      expect(mod.isCenter(coords)).toBe(expected)
    })
  })

  describe('identifying corners', () => {
    test.each([
      ['000', true],
      [1, false],
      [222, true],
      [121, false],
    ])('.isCorner(%o, %s)', (coords, expected) => {
      expect(mod.isCorner(coords)).toBe(expected)
    })
  })

  describe('identifying edges', () => {
    test.each([
      ['000', false],
      [1, true],
      [222, false],
      [121, false],
    ])('.isEdge(%o, %s)', (coords, expected) => {
      expect(mod.isEdge(coords)).toBe(expected)
    })
  })
})
