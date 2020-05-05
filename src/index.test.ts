import * as mod from '.'
import { Corner } from '.'

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

describe('Corner', () => {
  describe('rotate', () => {
    it('should change axis CW', () => {
      const corner = new Corner('a', 'b', 'c')
      const result = mod.rotate(corner)
      expect(result.axis).toBe('c')
      expect(result.right).toBe('a')
      expect(result.left).toBe('b')
    })

    it('should change axis CCW', () => {
      const corner = new Corner('a', 'b', 'c')
      const result = mod.rotate(corner, true)
      expect(result.axis).toBe('b')
      expect(result.right).toBe('c')
      expect(result.left).toBe('a')
    })
  })

  describe('nextCorner', () => {
    it('should work CW', () => {
      const corner = new Corner('a', 'b', 'c')
      let result = mod.nextCorner(corner)
      expect(result.axis).toBe('a')
      expect(result.right).toBe('-c')
      expect(result.left).toBe('b')

      result = mod.nextCorner(result)
      expect(result.axis).toBe('a')
      expect(result.right).toBe('-b')
      expect(result.left).toBe('-c')

      result = mod.nextCorner(result)
      expect(result.axis).toBe('a')
      expect(result.right).toBe('c')
      expect(result.left).toBe('-b')

      result = mod.nextCorner(result)
      expect(result.axis).toBe('a')
      expect(result.right).toBe('b')
      expect(result.left).toBe('c')
    })

    it('should work CCW', () => {
      const corner = new Corner('a', 'b', 'c')
      let result = mod.nextCorner(corner, true)
      expect(result.axis).toBe('a')
      expect(result.right).toBe('c')
      expect(result.left).toBe('-b')

      result = mod.nextCorner(result, true)
      expect(result.axis).toBe('a')
      expect(result.right).toBe('-b')
      expect(result.left).toBe('-c')

      result = mod.nextCorner(result, true)
      expect(result.axis).toBe('a')
      expect(result.right).toBe('-c')
      expect(result.left).toBe('b')

      result = mod.nextCorner(result, true)
      expect(result.axis).toBe('a')
      expect(result.right).toBe('b')
      expect(result.left).toBe('c')
    })
  })

  describe('all corners', () => {
    it('should print each corner', () => {
      let corner = new Corner('r', 'w', 'b')
      const result = mod.getAllCorners(corner)
      expect(result).toEqual([
        { axis: 'r', right: 'w', left: 'b' },
        { axis: 'r', right: '-b', left: 'w' },
        { axis: 'r', right: '-w', left: '-b' },
        { axis: 'r', right: 'b', left: '-w' },
        { axis: '-r', right: '-w', left: 'b' },
        { axis: '-r', right: '-b', left: '-w' },
        { axis: '-r', right: 'w', left: '-b' },
        { axis: '-r', right: 'b', left: 'w' },
      ])
    })
  })

  describe('corner completion', () => {
    describe('given a corner with two faces', () => {
      const rwb = new Corner('r', 'w', 'b')
      const xyz = new Corner('x', 'y', 'z')

      it.each`
        axis | right | left | scheme
        ${'r'} | ${'w'} | ${'b'} | ${rwb}
        ${'r'} | ${'-b'} | ${'w'} | ${rwb}
        ${'r'} | ${'-w'} | ${'-b'} | ${rwb}
        ${'r'} | ${'b'} | ${'-w'} | ${rwb}
        ${'-r'} | ${'-w'} | ${'b'} | ${rwb}
        ${'-r'} | ${'-b'} | ${'-w'} | ${rwb}
        ${'-r'} | ${'w'} | ${'-b'} | ${rwb}
        ${'-r'} | ${'b'} | ${'w'} | ${rwb}
        ${'x'} | ${'y'} | ${'z'} | ${xyz}
      `('should return the third face', ({ axis, right, left, scheme }) => {
        // clock-wise
        let input: Corner = new Corner(axis, right, null)
        let output: Corner = mod.completeCorner(input, scheme)
        expect(output).toEqual({axis, right, left})

        // ccw
        input = new Corner(axis, null, left)
        output = mod.completeCorner(input, scheme)
        expect(output).toEqual({axis, right, left})

        // no axis
        input = new Corner(null, right, left)
        output = mod.completeCorner(input, scheme)
        expect(output).toEqual({axis, right, left})
      })
    })
  })
})
