import { findRectangles, validateBoard } from './getSolution'
import { PUZZLES } from './puzzles'

const EXPECTED_RECTANGLE_COUNTS = {
  'first-steps-v1': 2,
  'fixed-board-v1': 6,
  'woven-grid-v1': 18,
}

describe('curated puzzle library', () => {
  test('uses stable unique identities and three non-spoiling difficulty bands', () => {
    expect(new Set(PUZZLES.map(({ id }) => id)).size).toBe(PUZZLES.length)
    expect(new Set(PUZZLES.map(({ difficulty }) => difficulty)))
      .toEqual(new Set(['Easy', 'Medium', 'Hard']))

    PUZZLES.forEach((puzzle) => {
      expect(puzzle.id).toMatch(/^[a-z0-9-]+-v\d+$/)
      expect(puzzle.title).not.toMatch(/\d/)
      expect(puzzle.difficulty).not.toMatch(/\d/)
      expect(puzzle.designIntent).toBeTruthy()
    })
  })

  test.each(PUZZLES)('$title has valid, verified solver output', (puzzle) => {
    expect(() => validateBoard(puzzle.board)).not.toThrow()
    expect(findRectangles(puzzle.board, puzzle.cornerCharacter))
      .toHaveLength(EXPECTED_RECTANGLE_COUNTS[puzzle.id])
  })
})
