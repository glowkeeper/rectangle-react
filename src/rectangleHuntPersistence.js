import {
  createRectangleHuntSession,
  getSessionProgress,
  restoreRectangleHuntSession,
} from './rectangleHuntSession'

export const HUNT_PROGRESS_KEY = 'rectangle-hunt:active-attempt'
export const HUNT_PROGRESS_VERSION = 1
export const FIXED_PUZZLE_ID = 'fixed-board-v1'

const hasMeaningfulProgress = (progress) => {
  return progress.foundRectangleKeys.length > 0 || progress.selectedCorner !== null
}

export const clearSavedHunt = (storage) => {
  try {
    storage?.removeItem(HUNT_PROGRESS_KEY)
  } catch {
    // Storage can be unavailable or denied without preventing play.
  }
}

export const saveActiveHunt = (storage, session, puzzleId = FIXED_PUZZLE_ID) => {
  const progress = getSessionProgress(session)

  if (progress === null || !hasMeaningfulProgress(progress)) {
    clearSavedHunt(storage)
    return
  }

  try {
    storage?.setItem(HUNT_PROGRESS_KEY, JSON.stringify({
      version: HUNT_PROGRESS_VERSION,
      puzzleId,
      progress,
    }))
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
    const savedValue = storage?.getItem(HUNT_PROGRESS_KEY)
    if (savedValue === null || savedValue === undefined) return freshSession()

    const saved = JSON.parse(savedValue)
    if (
      saved === null
      || typeof saved !== 'object'
      || saved.version !== HUNT_PROGRESS_VERSION
      || saved.puzzleId !== puzzleId
    ) {
      clearSavedHunt(storage)
      return freshSession()
    }

    return restoreRectangleHuntSession(board, cornerCharacter, saved.progress)
  } catch {
    clearSavedHunt(storage)
    return freshSession()
  }
}
