import { findRectangles, validateBoard } from './getSolution'

const cloneCorner = (corner) => corner === null
  ? null
  : { row: corner.row, column: corner.column }

const cloneRectangle = (rectangle) => ({ ...rectangle })

const cloneSelectionResult = (selectionResult) => {
  if (selectionResult === null) return null

  const clone = { ...selectionResult }

  if (selectionResult.corner !== undefined) {
    clone.corner = cloneCorner(selectionResult.corner)
  }

  if (selectionResult.corners !== undefined) {
    clone.corners = selectionResult.corners.map(cloneCorner)
  }

  if (selectionResult.rectangle !== undefined) {
    clone.rectangle = cloneRectangle(selectionResult.rectangle)
  }

  return clone
}

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

export const rectangleCoordinatesKey = (rectangle) => rectangleKey(
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
    submittedFoundKeys: null,
    selectedCorner: null,
    focusedKey: null,
    selectionResult: null,
  }
}

export const createRectangleHuntSession = (board, cornerCharacter = '+') => {
  return initialSession(board, cornerCharacter)
}

export const getSessionProgress = (session) => {
  if (session.submittedFoundKeys !== null) return null

  return {
    foundRectangleKeys: [...session.foundKeys],
    selectedCorner: cloneCorner(session.selectedCorner),
    focusedRectangleKey: session.focusedKey,
  }
}

export const restoreRectangleHuntSession = (
  board,
  cornerCharacter = '+',
  progress
) => {
  const session = initialSession(board, cornerCharacter)

  if (
    progress === null
    || typeof progress !== 'object'
    || !Array.isArray(progress.foundRectangleKeys)
    || !progress.foundRectangleKeys.every((key) => typeof key === 'string')
    || new Set(progress.foundRectangleKeys).size !== progress.foundRectangleKeys.length
  ) {
    throw new TypeError('Saved hunt progress is invalid.')
  }

  const foundKeys = new Set(progress.foundRectangleKeys)
  if ([...foundKeys].some((key) => !session.rectanglesByKey.has(key))) {
    throw new TypeError('Saved hunt progress contains an unknown rectangle.')
  }

  const selectedCorner = progress.selectedCorner
  if (selectedCorner !== null) {
    assertCorner(selectedCorner)
    if (!isEligibleCorner(session, selectedCorner)) {
      throw new TypeError('Saved hunt progress contains an ineligible corner.')
    }
  }

  const focusedKey = progress.focusedRectangleKey
  if (focusedKey !== null && (!foundKeys.has(focusedKey) || typeof focusedKey !== 'string')) {
    throw new TypeError('Saved hunt progress contains an unknown focus.')
  }

  return {
    ...session,
    foundKeys,
    selectedCorner: cloneCorner(selectedCorner),
    focusedKey,
    selectionResult: selectedCorner === null
      ? null
      : { type: 'selection-started', corner: cloneCorner(selectedCorner) },
  }
}

export const selectCorner = (session, corner) => {
  assertCorner(corner)

  if (session.submittedFoundKeys !== null) return session

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

export const submitSession = (session) => {
  if (session.submittedFoundKeys !== null) return session

  const submittedFoundKeys = new Set(session.foundKeys)
  const firstResultKey = submittedFoundKeys.values().next().value
    ?? session.rectanglesByKey.keys().next().value
    ?? null

  return {
    ...session,
    submittedFoundKeys,
    selectedCorner: null,
    focusedKey: session.focusedKey ?? firstResultKey,
    selectionResult: null,
  }
}

const reviewKeys = (session) => {
  if (session.submittedFoundKeys === null) return [...session.foundKeys]

  const missedKeys = [...session.rectanglesByKey.keys()].filter((key) => {
    return !session.submittedFoundKeys.has(key)
  })

  return [...session.submittedFoundKeys, ...missedKeys]
}

const focusRectangleByOffset = (session, offset) => {
  const keys = reviewKeys(session)
  const currentIndex = keys.indexOf(session.focusedKey)

  if (currentIndex === -1 || keys.length < 2) {
    return session
  }

  const nextIndex = (currentIndex + offset + keys.length) % keys.length
  const focusedKey = keys[nextIndex]
  const rectangle = session.rectanglesByKey.get(focusedKey)

  return {
    ...session,
    focusedKey,
    selectionResult: { type: 'review', rectangle: cloneRectangle(rectangle) },
  }
}

export const focusPreviousRectangle = (session) => {
  return focusRectangleByOffset(session, -1)
}

export const focusNextRectangle = (session) => {
  return focusRectangleByOffset(session, 1)
}

export const getPlayState = (session) => {
  const submitted = session.submittedFoundKeys !== null
  const resultKeys = submitted ? session.submittedFoundKeys : session.foundKeys
  const foundRectangles = [...resultKeys].map((key) => {
    return cloneRectangle(session.rectanglesByKey.get(key))
  })
  const focusedRectangle = session.focusedKey === null
    ? null
    : cloneRectangle(session.rectanglesByKey.get(session.focusedKey))
  const playState = {
    status: submitted ? 'submitted' : 'playing',
    foundCount: resultKeys.size,
    selectedCorner: cloneCorner(session.selectedCorner),
    focusedRectangle,
    foundRectangles,
    selectionResult: cloneSelectionResult(session.selectionResult),
  }

  if (submitted) {
    playState.total = session.rectanglesByKey.size
    playState.missedRectangles = [...session.rectanglesByKey]
      .filter(([key]) => !session.submittedFoundKeys.has(key))
      .map(([, rectangle]) => cloneRectangle(rectangle))
    playState.focusedRectangleResult = session.focusedKey === null
      ? null
      : session.submittedFoundKeys.has(session.focusedKey) ? 'found' : 'missed'
  }

  return playState
}
