import { useRef, useState } from 'react'

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
    submitSession,
} from '../rectangleHuntSession'
import { FIXED_BOARD, FIXED_BOARD_CORNER } from '../fixedBoard'

export const submittedResultMessage = (foundCount, total) => {
    if (total === 1) {
        return foundCount === 1
            ? 'You found the rectangle.'
            : 'You did not find the rectangle.'
    }

    if (foundCount === total) {
        return `You found all ${total} rectangles.`
    }

    return `You found ${foundCount} of ${total} rectangles.`
}

const feedbackMessage = (playState) => {
    if (playState.status === 'submitted') {
        return submittedResultMessage(playState.foundCount, playState.total)
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
    const finishButtonRef = useRef(null)
    const finishDialogRef = useRef(null)
    const [session, setSession] = useState(() => {
        return createRectangleHuntSession(FIXED_BOARD, FIXED_BOARD_CORNER)
    })
    const playState = getPlayState(session)
    const submitted = playState.status === 'submitted'
    const focusedKey = playState.focusedRectangle === null
        ? null
        : rectangleCoordinatesKey(playState.focusedRectangle)
    const reviewRectangles = submitted
        ? [
            ...playState.foundRectangles.map((rectangle) => ({ rectangle, result: 'found' })),
            ...playState.missedRectangles.map((rectangle) => ({ rectangle, result: 'missed' })),
        ]
        : playState.foundRectangles.map((rectangle) => ({ rectangle, result: 'found' }))
    const focusedIndex = reviewRectangles.findIndex(({ rectangle }) => {
        return rectangleCoordinatesKey(rectangle) === focusedKey
    })
    const focusedResult = focusedIndex === -1
        ? null
        : reviewRectangles[focusedIndex].result
    const reviewCount = reviewRectangles.length

    const handleSelectCorner = (corner) => {
        setSession((current) => selectCorner(current, corner))
    }

    const handleCancelSelection = () => {
        setSession((current) => cancelSelection(current))
    }

    const openFinishDialog = () => {
        if (typeof finishDialogRef.current.showModal === 'function') {
            finishDialogRef.current.showModal()
        } else {
            finishDialogRef.current.setAttribute('open', '')
        }
    }

    const closeFinishDialog = () => {
        if (typeof finishDialogRef.current.close === 'function') {
            finishDialogRef.current.close()
        } else {
            finishDialogRef.current.removeAttribute('open')
            finishButtonRef.current?.focus()
        }
    }

    const handleSubmit = () => {
        closeFinishDialog()
        setSession((current) => submitSession(current))
    }

    return (
        <section className="rectangle-hunt" aria-label="Rectangle Hunt">
            <FixedBoardSelector
                selectedCorner={playState.selectedCorner}
                foundRectangles={playState.foundRectangles}
                focusedRectangle={playState.focusedRectangle}
                focusedRectangleResult={focusedResult ?? 'found'}
                onSelectCorner={handleSelectCorner}
                onCancelSelection={handleCancelSelection}
                disabled={submitted}
            />

            <div className={`hunt-status${submitted ? ' hunt-status--submitted' : ''}`}>
                <p
                    className="hunt-feedback"
                    role="status"
                    aria-label="Game status"
                    aria-live="polite"
                >
                    {feedbackMessage(playState)}
                </p>
                {!submitted && (
                    <output
                        className="hunt-progress"
                        aria-label={progressLabel(playState.foundCount)}
                    >
                        {playState.foundCount} found
                    </output>
                )}
            </div>

            {reviewCount > 0 && (
                <section className="discovery-review" aria-labelledby="discovery-title">
                    <h3 id="discovery-title">
                        {submitted ? 'Review result' : 'Review discoveries'}
                    </h3>
                    <div className="review-controls">
                        <button
                            type="button"
                            disabled={reviewCount < 2}
                            onClick={() => setSession((current) => focusPreviousRectangle(current))}
                        >
                            Previous
                        </button>
                        <output
                            aria-label={submitted
                                ? `${focusedResult === 'found' ? 'Found by you' : 'Missed'}, rectangle ${focusedIndex + 1} of ${reviewCount}`
                                : `Discovery ${focusedIndex + 1} of ${reviewCount}`}
                            aria-live="polite"
                        >
                            {submitted && (
                                <span className={`result-kind result-kind--${focusedResult}`}>
                                    {focusedResult === 'found' ? 'Found by you' : 'Missed'}
                                </span>
                            )}
                            <span>
                                {submitted ? 'Rectangle' : 'Discovery'}{' '}
                                {focusedIndex + 1} of {reviewCount}
                            </span>
                        </output>
                        <button
                            type="button"
                            disabled={reviewCount < 2}
                            onClick={() => setSession((current) => focusNextRectangle(current))}
                        >
                            Next
                        </button>
                    </div>
                </section>
            )}

            <div className="hunt-actions">
                {!submitted && (
                    <button
                        type="button"
                        className="finish-button"
                        ref={finishButtonRef}
                        onClick={openFinishDialog}
                    >
                        Finish hunt
                    </button>
                )}
                <button
                    type="button"
                    className="restart-button"
                    onClick={() => setSession((current) => restartSession(current))}
                >
                    Restart puzzle
                </button>
            </div>

            <dialog
                className="finish-dialog"
                ref={finishDialogRef}
                aria-labelledby="finish-dialog-title"
                aria-describedby="finish-dialog-description"
            >
                <h2 id="finish-dialog-title">Finish this hunt?</h2>
                <p id="finish-dialog-description">
                    Reveal the answer and end this attempt? You won&apos;t be able
                    to continue this hunt.
                </p>
                <div className="finish-dialog-actions">
                    <button type="button" autoFocus onClick={closeFinishDialog}>
                        Keep hunting
                    </button>
                    <button type="button" onClick={handleSubmit}>
                        Reveal answer
                    </button>
                </div>
            </dialog>
        </section>
    )
}
