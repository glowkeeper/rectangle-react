import { useState } from 'react'

import { FixedBoardSelector } from './FixedBoardSelector'
import {
    cancelSelection,
    createRectangleHuntSession,
    focusNextRectangle,
    focusPreviousRectangle,
    getPlayState,
    rectangleCoordinatesKey,
    restartSession,
    selectCorner,
} from '../rectangleHuntSession'
import { FIXED_BOARD, FIXED_BOARD_CORNER } from '../fixedBoard'

const feedbackMessage = (playState) => {
    if (playState.status === 'complete') {
        return `Puzzle complete! You found all ${playState.total} rectangles.`
    }

    switch (playState.selectionResult?.type) {
        case 'selection-started':
            return 'First corner selected. Choose the opposite corner.'
        case 'found':
            return 'Found a new rectangle.'
        case 'invalid':
            return 'That pair does not form a rectangle. Try again.'
        case 'duplicate':
            return 'Already found. Showing that rectangle.'
        case 'cancelled':
            return 'Selection cancelled.'
        case 'review':
            return 'Showing a found rectangle.'
        default:
            return 'Choose a corner to begin.'
    }
}

const progressLabel = (count) => {
    return `${count} ${count === 1 ? 'rectangle' : 'rectangles'} found`
}

export const Artwork = () => {
    const [session, setSession] = useState(() => {
        return createRectangleHuntSession(FIXED_BOARD, FIXED_BOARD_CORNER)
    })
    const playState = getPlayState(session)
    const focusedKey = playState.focusedRectangle === null
        ? null
        : rectangleCoordinatesKey(playState.focusedRectangle)
    const focusedIndex = playState.foundRectangles.findIndex((rectangle) => {
        return rectangleCoordinatesKey(rectangle) === focusedKey
    })

    const handleSelectCorner = (corner) => {
        setSession((current) => selectCorner(current, corner))
    }

    const handleCancelSelection = () => {
        setSession((current) => cancelSelection(current))
    }

    return (
        <section className="rectangle-hunt" aria-label="Rectangle Hunt">
            <FixedBoardSelector
                selectedCorner={playState.selectedCorner}
                foundRectangles={playState.foundRectangles}
                focusedRectangle={playState.focusedRectangle}
                onSelectCorner={handleSelectCorner}
                onCancelSelection={handleCancelSelection}
            />

            <div className={`hunt-status${playState.status === 'complete' ? ' hunt-status--complete' : ''}`}>
                <p
                    className="hunt-feedback"
                    role="status"
                    aria-label="Game status"
                    aria-live="polite"
                >
                    {feedbackMessage(playState)}
                </p>
                {playState.status !== 'complete' && (
                    <output
                        className="hunt-progress"
                        aria-label={progressLabel(playState.foundCount)}
                    >
                        {playState.foundCount} found
                    </output>
                )}
            </div>

            {playState.foundCount > 0 && (
                <section className="discovery-review" aria-labelledby="discovery-title">
                    <h3 id="discovery-title">Review discoveries</h3>
                    <div className="review-controls">
                        <button
                            type="button"
                            disabled={playState.foundCount < 2}
                            onClick={() => setSession((current) => focusPreviousRectangle(current))}
                        >
                            Previous
                        </button>
                        <output aria-label="Discovery position" aria-live="polite">
                            Discovery {focusedIndex + 1} of {playState.foundCount}
                        </output>
                        <button
                            type="button"
                            disabled={playState.foundCount < 2}
                            onClick={() => setSession((current) => focusNextRectangle(current))}
                        >
                            Next
                        </button>
                    </div>
                </section>
            )}

            <div className="hunt-actions">
                <button
                    type="button"
                    className="restart-button"
                    onClick={() => setSession((current) => restartSession(current))}
                >
                    Restart puzzle
                </button>
            </div>
        </section>
    )
}
