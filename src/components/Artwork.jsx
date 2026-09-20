import { useState } from 'react'

import { FixedBoardSelector } from './FixedBoardSelector'
import {
    cancelSelection,
    createRectangleHuntSession,
    focusNextRectangle,
    focusPreviousRectangle,
    getPlayState,
    restartSession,
    selectCorner,
} from '../rectangleHuntSession'
import { FIXED_BOARD, FIXED_BOARD_CORNER } from '../fixedBoard'

const sameRectangle = (first, second) => {
    return first !== null
        && second !== null
        && first.top === second.top
        && first.left === second.left
        && first.bottom === second.bottom
        && first.right === second.right
}

const foundLabel = (count) => `Found ${count} ${count === 1 ? 'rectangle' : 'rectangles'}.`

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

export const Artwork = () => {
    const [session, setSession] = useState(() => {
        return createRectangleHuntSession(FIXED_BOARD, FIXED_BOARD_CORNER)
    })
    const playState = getPlayState(session)
    const focusedIndex = playState.foundRectangles.findIndex((rectangle) => {
        return sameRectangle(rectangle, playState.focusedRectangle)
    })

    const handleSelectCorner = (corner) => {
        setSession((current) => selectCorner(current, corner))
    }

    const handleCancelSelection = () => {
        setSession((current) => cancelSelection(current))
    }

    return (
        <section className="rectangle-hunt" aria-labelledby="rectangle-hunt-title">
            <div className="hunt-heading">
                <div>
                    <h2 id="rectangle-hunt-title">Rectangle Hunt</h2>
                    <p className="hunt-progress">{foundLabel(playState.foundCount)}</p>
                </div>
                <button
                    type="button"
                    className="restart-button"
                    onClick={() => setSession((current) => restartSession(current))}
                >
                    Restart
                </button>
            </div>

            <FixedBoardSelector
                selectedCorner={playState.selectedCorner}
                foundRectangles={playState.foundRectangles}
                focusedRectangle={playState.focusedRectangle}
                onSelectCorner={handleSelectCorner}
                onCancelSelection={handleCancelSelection}
            />

            <p
                className="hunt-feedback"
                role="status"
                aria-label="Game status"
                aria-live="polite"
            >
                {feedbackMessage(playState)}
            </p>

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

            {playState.status === 'complete' && (
                <section className="completion-panel" aria-labelledby="completion-title">
                    <h3 id="completion-title">Puzzle complete!</h3>
                    <p>The drawing contains {playState.total} rectangles.</p>
                </section>
            )}
        </section>
    )
}
