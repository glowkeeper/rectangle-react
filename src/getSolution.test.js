import { BOARD_LIMITS, findRectangles, validateBoard } from './getSolution'

const canonicalCases = [
  ['no rows', '', 0],
  ['no columns', '', 0],
  ['no rectangles', ' ', 0],
  ['one rectangle', '+-+\n| |\n+-+', 1],
  [
    'two rectangles without shared parts',
    '  +-+\n  | |\n+-+-+\n| |  \n+-+  ',
    2,
  ],
  [
    'five rectangles with shared parts',
    '  +-+\n  | |\n+-+-+\n| | |\n+-+-+',
    5,
  ],
  ['rectangle of height 1 is counted', '+--+\n+--+', 1],
  ['rectangle of width 1 is counted', '++\n||\n++', 1],
  ['1x1 square is counted', '++\n++', 1],
  [
    'only complete rectangles are counted',
    '  +-+\n    |\n+-+-+\n| | -\n+-+-+',
    1,
  ],
  [
    'rectangles can be of different sizes',
    '+------+----+\n|      |    |\n+---+--+    |\n|   |       |\n+---+-------+',
    3,
  ],
  [
    'corner is required for a rectangle to be complete',
    '+------+----+\n|      |    |\n+------+    |\n|   |       |\n+---+-------+',
    2,
  ],
  [
    'large input with many rectangles',
    '+---+--+----+\n|   +--+----+\n+---+--+    |\n|   +--+----+\n+---+--+--+-+\n+---+--+--+-+\n+------+  | |\n          +-+',
    60,
  ],
  [
    'rectangles must have four sides',
    '+-+ +-+\n| | | |\n+-+-+-+\n  | |  \n+-+-+-+\n| | | |\n+-+ +-+',
    5,
  ],
]

describe('findRectangles canonical Exercism cases', () => {
  test.each(canonicalCases)('%s', (_description, asciiArt, expected) => {
    expect(findRectangles(asciiArt)).toHaveLength(expected)
  })
})

describe('findRectangles regressions', () => {
  test.each([
    ['missing horizontal edges', '+  +\n|  |\n+  +'],
    ['broken top edge', '+ -+\n|  |\n+--+'],
    ['broken bottom edge', '+--+\n|  |\n+- +'],
    ['broken left edge', '+--+\n   |\n+--+'],
    ['broken right edge', '+--+\n|   \n+--+'],
  ])('%s are not counted', (_description, asciiArt) => {
    expect(findRectangles(asciiArt)).toEqual([])
  })

  test('returns coordinates for each rectangle', () => {
    expect(findRectangles('+-+\n| |\n+-+')).toEqual([
      { top: 0, left: 0, bottom: 2, right: 2 },
    ])
  })

  test('never returns user-authored markup', () => {
    const markup = '<img src=x onerror=alert(1)> '
    const padding = ' '.repeat(markup.length)
    const asciiArt = `${markup}+-+\n${padding}| |\n${padding}+-+`
    const rectangles = findRectangles(asciiArt)

    expect(rectangles).toEqual([
      { top: 0, left: markup.length, bottom: 2, right: markup.length + 2 },
    ])
    expect(rectangles.every((rectangle) => typeof rectangle === 'object')).toBe(true)
    expect(JSON.stringify(rectangles)).not.toContain('<')
  })
})

describe('board limits', () => {
  test('accepts a board at the total-cell limit', () => {
    const rows = Array(25).fill(' '.repeat(120)).join('\n')

    expect(() => validateBoard(rows)).not.toThrow()
  })

  test('rejects too many rows', () => {
    const rows = Array(BOARD_LIMITS.maxRows + 1).fill(' ').join('\n')

    expect(() => findRectangles(rows)).toThrow(
      `Artwork cannot exceed ${BOARD_LIMITS.maxRows} rows.`
    )
  })

  test('rejects too many columns', () => {
    const row = ' '.repeat(BOARD_LIMITS.maxColumns + 1)

    expect(() => findRectangles(row)).toThrow(
      `Artwork cannot exceed ${BOARD_LIMITS.maxColumns} columns.`
    )
  })

  test('rejects too many total cells', () => {
    const rows = Array(26).fill(' '.repeat(116)).join('\n')

    expect(() => findRectangles(rows)).toThrow(
      `Artwork cannot exceed ${BOARD_LIMITS.maxCells} cells.`
    )
  })

  test('stops pathological boards with too many rectangles', () => {
    const denseBoard = Array(9).fill('+'.repeat(9)).join('\n')

    expect(() => findRectangles(denseBoard)).toThrow(
      `Artwork cannot contain more than ${BOARD_LIMITS.maxRectangles} rectangles.`
    )
  })
})
