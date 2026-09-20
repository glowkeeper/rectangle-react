import { useCallback, useState } from 'react'

import { Artwork } from './Artwork'
import { getPuzzleStatus } from '../rectangleHuntPersistence'
import { PUZZLES } from '../puzzles'

const browserStorage = () => {
    try {
        return window.localStorage
    } catch {
        return null
    }
}

const STATUS_LABELS = {
    'not-started': 'Not started',
    'in-progress': 'In progress',
    submitted: 'Submitted',
}

const actionLabel = (puzzle, status) => {
    if (status === 'in-progress') return `Resume ${puzzle.title}`
    if (status === 'submitted') return `Play ${puzzle.title} again`
    return `Start ${puzzle.title}`
}

export const PuzzleLibrary = () => {
    const [selectedPuzzle, setSelectedPuzzle] = useState(null)
    const [, setStatusRevision] = useState(0)
    const refreshStatuses = useCallback(() => {
        setStatusRevision((revision) => revision + 1)
    }, [])

    if (selectedPuzzle !== null) {
        return (
            <Artwork
                key={selectedPuzzle.id}
                puzzle={selectedPuzzle}
                onExit={() => {
                    refreshStatuses()
                    setSelectedPuzzle(null)
                }}
                onStatusChange={refreshStatuses}
            />
        )
    }

    return (
        <section className="puzzle-library" aria-labelledby="puzzle-library-title">
            <div className="puzzle-library-intro">
                <p className="eyebrow">Choose a drawing</p>
                <h2 id="puzzle-library-title">Puzzle library</h2>
                <p>
                    Hunt at your own pace. Difficulty reflects visual complexity;
                    rectangle totals stay hidden until you submit.
                </p>
            </div>
            <div className="puzzle-list">
                {PUZZLES.map((puzzle) => {
                    const status = getPuzzleStatus(browserStorage(), puzzle)

                    return (
                        <article className="puzzle-card" key={puzzle.id}>
                            <div className="puzzle-card-meta">
                                <span className="difficulty-label">{puzzle.difficulty}</span>
                                <span className={`puzzle-status puzzle-status--${status}`}>
                                    {STATUS_LABELS[status]}
                                </span>
                            </div>
                            <h3>{puzzle.title}</h3>
                            <pre aria-hidden="true">{puzzle.board}</pre>
                            <button
                                type="button"
                                onClick={() => setSelectedPuzzle(puzzle)}
                            >
                                {actionLabel(puzzle, status)}
                            </button>
                        </article>
                    )
                })}
            </div>
        </section>
    )
}
