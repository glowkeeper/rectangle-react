import { findRectangles, validateBoard } from './getSolution'

const cloneCorner = (corner) => corner === null
  ? null
  : { row: corner.row, column: corner.column }

const cloneRectangle = (rectangle) => ({ ...rectangle })

const assertCorner = (corner) => {
  if (
    corner === null
    || typeof corner !== 'object'
    || !Number.isInteger(corner.row)
    || !Number.isInteger(corner.column)
  ) {
    throw new TypeError('A corner must have integer row and column coordinates.')
  }
}

const normaliseRectangle = (firstCorner, secondCorner) => {
  assertCorner(firstCorner)
  assertCorner(secondCorner)

  return {
    top: Math.min(firstCorner.row, secondCorner.row),
    left: Math.min(firstCorner.column, secondCorner.column),
    bottom: Math.max(firstCorner.row, secondCorner.row),
    right: Math.max(firstCorner.column, secondCorner.column),
  }
}

export const rectangleKey = (firstCorner, secondCorner) => {
  const rectangle = normaliseRectangle(firstCorner, secondCorner)

  return `${rectangle.top},${rectangle.left}:${rectangle.bottom},${rectangle.right}`
}

const rectangleCoordinatesKey = (rectangle) => rectangleKey(
  { row: rectangle.top, column: rectangle.left },
  { row: rectangle.bottom, column: rectangle.right }
)

const isEligibleCorner = (session, corner) => {
  return corner.row >= 0
    && corner.row < session.lines.length
    && corner.column >= 0
    && corner.column < session.lines[corner.row].length
    && session.lines[corner.row][corner.column] === session.cornerCharacter
}

const initialSession = (board, cornerCharacter) => {
  const lines = validateBoard(board)
  const rectangles = findRectangles(board, cornerCharacter)
  const rectanglesByKey = new Map(
    rectangles.map((rectangle) => [rectangleCoordinatesKey(rectangle), rectangle])
  )

  return {
    board,
    cornerCharacter,
    lines,
    rectanglesByKey,
    foundKeys: new Set(),
    selectedCorner: null,
    focusedKey: null,
    selectionResult: null,
  }
}

export const createRectangleHuntSession = (board, cornerCharacter = '+') => {
  return initialSession(board, cornerCharacter)
}

export const selectCorner = (session, corner) => {
  assertCorner(corner)

  if (!isEligibleCorner(session, corner)) {
    return {
      ...session,
      selectionResult: { type: 'ineligible-corner', corner: cloneCorner(corner) },
    }
  }

  if (session.selectedCorner === null) {
    return {
      ...session,
      selectedCorner: cloneCorner(corner),
      selectionResult: { type: 'selection-started', corner: cloneCorner(corner) },
    }
  }

  const key = rectangleKey(session.selectedCorner, corner)
  const rectangle = session.rectanglesByKey.get(key)

  if (rectangle === undefined) {
    return {
      ...session,
      selectedCorner: null,
      selectionResult: {
        type: 'invalid',
        corners: [cloneCorner(session.selectedCorner), cloneCorner(corner)],
      },
    }
  }

  if (session.foundKeys.has(key)) {
    return {
      ...session,
      selectedCorner: null,
      focusedKey: key,
      selectionResult: { type: 'duplicate', rectangle: cloneRectangle(rectangle) },
    }
  }

  const foundKeys = new Set(session.foundKeys)
  foundKeys.add(key)

  return {
    ...session,
    foundKeys,
    selectedCorner: null,
    focusedKey: key,
    selectionResult: { type: 'found', rectangle: cloneRectangle(rectangle) },
  }
}

export const cancelSelection = (session) => {
  if (session.selectedCorner === null) return session

  return {
    ...session,
    selectedCorner: null,
    selectionResult: { type: 'cancelled' },
  }
}

export const restartSession = (session) => {
  return initialSession(session.board, session.cornerCharacter)
}

export const getPlayState = (session) => {
  const complete = session.foundKeys.size === session.rectanglesByKey.size
  const foundRectangles = [...session.foundKeys].map((key) => {
    return cloneRectangle(session.rectanglesByKey.get(key))
  })
  const focusedRectangle = session.focusedKey === null
    ? null
    : cloneRectangle(session.rectanglesByKey.get(session.focusedKey))
  const playState = {
    status: complete ? 'complete' : 'playing',
    foundCount: session.foundKeys.size,
    selectedCorner: cloneCorner(session.selectedCorner),
    focusedRectangle,
    foundRectangles,
    selectionResult: session.selectionResult,
  }

  if (complete) playState.total = session.rectanglesByKey.size

  return playState
}
