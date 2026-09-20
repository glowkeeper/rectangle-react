import {
  focusPreviousRectangle,
  getPlayState,
  selectCorner,
  submitSession,
} from './rectangleHuntSession'
import { FIXED_BOARD, FIXED_BOARD_CORNER } from './fixedBoard'
import {
  clearSavedHunt,
  HUNT_PROGRESS_KEY,
  loadActiveHunt,
  saveActiveHunt,
} from './rectangleHuntPersistence'

const memoryStorage = () => {
  const values = new Map()

  return {
    getItem: (key) => values.get(key) ?? null,
    setItem: (key, value) => values.set(key, value),
    removeItem: (key) => values.delete(key),
  }
}

const choose = (session, firstCorner, secondCorner) => {
  return selectCorner(selectCorner(session, firstCorner), secondCorner)
}

describe('unfinished hunt persistence', () => {
  test('saves and restores discoveries, review focus, and a first corner', () => {
    const storage = memoryStorage()
    let session = loadActiveHunt(storage, FIXED_BOARD, FIXED_BOARD_CORNER)
    session = choose(session, { row: 0, column: 3 }, { row: 2, column: 6 })
    session = choose(session, { row: 1, column: 2 }, { row: 2, column: 3 })
    session = focusPreviousRectangle(session)
    session = selectCorner(session, { row: 4, column: 0 })

    saveActiveHunt(storage, session)
    const restored = getPlayState(
      loadActiveHunt(storage, FIXED_BOARD, FIXED_BOARD_CORNER)
    )

    expect(restored).toMatchObject({
      status: 'playing',
      foundCount: 2,
      selectedCorner: { row: 4, column: 0 },
      focusedRectangle: { top: 0, left: 3, bottom: 2, right: 6 },
      selectionResult: {
        type: 'selection-started',
        corner: { row: 4, column: 0 },
      },
    })
    expect(restored).not.toHaveProperty('total')
  })

  test('does not save submitted results as active attempts', () => {
    const storage = memoryStorage()
    let session = loadActiveHunt(storage, FIXED_BOARD, FIXED_BOARD_CORNER)
    session = choose(session, { row: 0, column: 3 }, { row: 2, column: 6 })
    saveActiveHunt(storage, session)

    saveActiveHunt(storage, submitSession(session))

    expect(storage.getItem(HUNT_PROGRESS_KEY)).toBeNull()
    expect(getPlayState(loadActiveHunt(storage, FIXED_BOARD, FIXED_BOARD_CORNER)))
      .toMatchObject({ status: 'playing', foundCount: 0 })
  })

  test('clear removes the saved attempt', () => {
    const storage = memoryStorage()
    let session = loadActiveHunt(storage, FIXED_BOARD, FIXED_BOARD_CORNER)
    session = selectCorner(session, { row: 0, column: 3 })
    saveActiveHunt(storage, session)

    clearSavedHunt(storage)

    expect(storage.getItem(HUNT_PROGRESS_KEY)).toBeNull()
  })

  test.each([
    ['corrupt JSON', '{not-json'],
    ['a version mismatch', JSON.stringify({ version: 999, puzzleId: 'fixed-board-v1' })],
    ['a puzzle mismatch', JSON.stringify({
      version: 1,
      puzzleId: 'different-puzzle',
      progress: {},
    })],
    ['invalid progress', JSON.stringify({
      version: 1,
      puzzleId: 'fixed-board-v1',
      progress: {
        foundRectangleKeys: ['99,99:100,100'],
        selectedCorner: null,
        focusedRectangleKey: null,
      },
    })],
  ])('clears %s and safely starts fresh', (_label, value) => {
    const storage = memoryStorage()
    storage.setItem(HUNT_PROGRESS_KEY, value)

    const restored = getPlayState(
      loadActiveHunt(storage, FIXED_BOARD, FIXED_BOARD_CORNER)
    )

    expect(restored).toMatchObject({ status: 'playing', foundCount: 0 })
    expect(storage.getItem(HUNT_PROGRESS_KEY)).toBeNull()
  })

  test('continues when browser storage is unavailable', () => {
    const storage = {
      getItem: () => { throw new Error('denied') },
      setItem: () => { throw new Error('denied') },
      removeItem: () => { throw new Error('denied') },
    }

    const session = loadActiveHunt(storage, FIXED_BOARD, FIXED_BOARD_CORNER)

    expect(getPlayState(session)).toMatchObject({ status: 'playing', foundCount: 0 })
    expect(() => saveActiveHunt(storage, session)).not.toThrow()
  })
})
