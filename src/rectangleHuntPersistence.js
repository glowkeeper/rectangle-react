import {
  createRectangleHuntSession,
  getSessionProgress,
  restoreRectangleHuntSession,
} from './rectangleHuntSession'

export const HUNT_PROGRESS_KEY = 'rectangle-hunt:active-attempt'
export const HUNT_PROGRESS_VERSION = 1
export const FIXED_PUZZLE_ID = 'fixed-board-v1'
export const PUZZLE_RESULTS_KEY = 'rectangle-hunt:submitted-puzzles'

const huntProgressKey = (puzzleId) => {
  return puzzleId === FIXED_PUZZLE_ID
    ? HUNT_PROGRESS_KEY
    : `${HUNT_PROGRESS_KEY}:${puzzleId}`
}

const readSubmittedPuzzleIds = (storage) => {
  try {
    const savedValue = storage?.getItem(PUZZLE_RESULTS_KEY)
    if (savedValue === null || savedValue === undefined) return new Set()

    const saved = JSON.parse(savedValue)
    if (
      saved === null
      || typeof saved !== 'object'
      || saved.version !== HUNT_PROGRESS_VERSION
      || !Array.isArray(saved.puzzleIds)
      || !saved.puzzleIds.every((id) => typeof id === 'string')
    ) {
      storage?.removeItem(PUZZLE_RESULTS_KEY)
      return new Set()
    }

    return new Set(saved.puzzleIds)
  } catch {
    try {
      storage?.removeItem(PUZZLE_RESULTS_KEY)
    } catch {
      // Storage can be unavailable or denied without preventing play.
    }
    return new Set()
  }
}

const writeSubmittedPuzzleIds = (storage, puzzleIds) => {
  try {
    if (puzzleIds.size === 0) {
      storage?.removeItem(PUZZLE_RESULTS_KEY)
      return
    }

    storage?.setItem(PUZZLE_RESULTS_KEY, JSON.stringify({
      version: HUNT_PROGRESS_VERSION,
      puzzleIds: [...puzzleIds],
    }))
  } catch {
    // Storage can be unavailable or denied without preventing play.
  }
}

const clearSubmittedPuzzle = (storage, puzzleId) => {
  const submittedPuzzleIds = readSubmittedPuzzleIds(storage)
  if (!submittedPuzzleIds.delete(puzzleId)) return
  writeSubmittedPuzzleIds(storage, submittedPuzzleIds)
}

const hasMeaningfulProgress = (progress) => {
  return progress.foundRectangleKeys.length > 0 || progress.selectedCorner !== null
}

export const clearSavedHunt = (storage, puzzleId = FIXED_PUZZLE_ID) => {
  try {
    storage?.removeItem(huntProgressKey(puzzleId))
  } catch {
    // Storage can be unavailable or denied without preventing play.
  }
}

export const saveActiveHunt = (storage, session, puzzleId = FIXED_PUZZLE_ID) => {
  const progress = getSessionProgress(session)

  if (progress === null || !hasMeaningfulProgress(progress)) {
    clearSavedHunt(storage, puzzleId)
    return
  }

  try {
    storage?.setItem(huntProgressKey(puzzleId), JSON.stringify({
      version: HUNT_PROGRESS_VERSION,
      puzzleId,
      progress,
    }))
    clearSubmittedPuzzle(storage, puzzleId)
  } catch {
    // Storage failure must not interrupt the hunt.
  }
}

export const loadActiveHunt = (
  storage,
  board,
  cornerCharacter,
  puzzleId = FIXED_PUZZLE_ID
) => {
  const freshSession = () => createRectangleHuntSession(board, cornerCharacter)

  try {
    const savedValue = storage?.getItem(huntProgressKey(puzzleId))
    if (savedValue === null || savedValue === undefined) return freshSession()

    const saved = JSON.parse(savedValue)
    if (
      saved === null
      || typeof saved !== 'object'
      || saved.version !== HUNT_PROGRESS_VERSION
      || saved.puzzleId !== puzzleId
    ) {
      clearSavedHunt(storage, puzzleId)
      return freshSession()
    }

    return restoreRectangleHuntSession(board, cornerCharacter, saved.progress)
  } catch {
    clearSavedHunt(storage, puzzleId)
    return freshSession()
  }
}

export const markPuzzleSubmitted = (storage, puzzleId) => {
  clearSavedHunt(storage, puzzleId)
  const submittedPuzzleIds = readSubmittedPuzzleIds(storage)
  submittedPuzzleIds.add(puzzleId)
  writeSubmittedPuzzleIds(storage, submittedPuzzleIds)
}

export const clearPuzzleProgress = (storage, puzzleId) => {
  clearSavedHunt(storage, puzzleId)
  clearSubmittedPuzzle(storage, puzzleId)
}

export const getPuzzleStatus = (storage, puzzle) => {
  loadActiveHunt(storage, puzzle.board, puzzle.cornerCharacter, puzzle.id)

  try {
    const savedValue = storage?.getItem(huntProgressKey(puzzle.id))
    if (savedValue !== null && savedValue !== undefined) {
      return 'in-progress'
    }
  } catch {
    return 'not-started'
  }

  return readSubmittedPuzzleIds(storage).has(puzzle.id)
    ? 'submitted'
    : 'not-started'
}
