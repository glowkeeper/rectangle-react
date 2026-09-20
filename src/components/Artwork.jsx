import { useState } from 'react'

import { Solution } from './Solution'
import { FixedBoardSelector } from './FixedBoardSelector'
import { findRectangles } from '../getSolution'
import {
    cancelSelection,
    createRectangleHuntSession,
    getPlayState,
    selectCorner,
} from '../rectangleHuntSession'
import { FIXED_BOARD, FIXED_BOARD_CORNER } from '../fixedBoard'
import { UIText } from '../config'

const initialArtwork = {
    asciiArt: FIXED_BOARD,
    corner: FIXED_BOARD_CORNER,
    colour: '#ff0000',
}

export const Artwork = () => {
    const [huntSession, setHuntSession] = useState(() => {
        return createRectangleHuntSession(FIXED_BOARD, FIXED_BOARD_CORNER)
    })
    const [draft, setDraft] = useState(initialArtwork)
    const [result, setResult] = useState(null)
    const [error, setError] = useState('')

    const clearResult = () => {
        setResult(null)
        setError('')
    }

    const handleSubmit = (event) => {
        event.preventDefault()

        try {
            const rectangles = findRectangles(draft.asciiArt, draft.corner)

            setResult({
                asciiArt: draft.asciiArt,
                colour: draft.colour,
                rectangles,
            })
            setError('')
        } catch (submitError) {
            setResult(null)
            setError(submitError.message)
        }
    }

    const handleChangeInput = (event) => {
        const { name, value } = event.target

        clearResult()
        setDraft((current) => ({ ...current, [name]: value }))
    }

    const handleClickClear = () => {
        setDraft({
            asciiArt: '',
            corner: '',
            colour: initialArtwork.colour,
        })
        clearResult()
    }

    const handleClickInit = () => {
        setDraft(initialArtwork)
        clearResult()
    }

    const handleSelectCorner = (corner) => {
        setHuntSession((current) => selectCorner(current, corner))
    }

    const handleCancelSelection = () => {
        setHuntSession((current) => cancelSelection(current))
    }

    const huntState = getPlayState(huntSession)

    return (
        <>
            <h2>Rectangle Hunt</h2>
            <FixedBoardSelector
                selectedCorner={huntState.selectedCorner}
                onSelectCorner={handleSelectCorner}
                onCancelSelection={handleCancelSelection}
            />
            <div id="seperator">&nbsp;</div>
            <h2>{UIText.appTitleHome}</h2>
            <div id="seperator">&nbsp;</div>
            <form onSubmit={handleSubmit}>
                <div id="input-grid">
                    <div id="input-ascii">
                        <label id="ascii-label" htmlFor="asciiArt">{UIText.inputText}:</label>
                        <textarea
                            className="art-input"
                            id="asciiArt"
                            name="asciiArt"
                            value={draft.asciiArt}
                            required
                            autoFocus
                            onChange={handleChangeInput}
                            aria-invalid={Boolean(error)}
                            aria-describedby={error ? 'board-error' : undefined}
                        />
                        {error && (
                            <p id="board-error" role="alert">{error}</p>
                        )}
                    </div>
                    <div id="info">
                        <div id="input-corner">
                            <label id="corner-label" htmlFor="corner">{UIText.inputCorner}:</label>
                            <input
                                className="corner-input"
                                type="text"
                                id="corner"
                                name="corner"
                                required
                                maxLength="1"
                                onChange={handleChangeInput}
                                value={draft.corner}
                            />
                        </div>
                        <div id="input-colour">
                            <label id="colour-label" htmlFor="colour">{UIText.inputColour}:</label>
                            <input
                                className="colour-input"
                                type="color"
                                id="colour"
                                name="colour"
                                value={draft.colour}
                                onChange={handleChangeInput}
                            />
                        </div>
                        <div id="form-buttons">
                            <button type="submit">{UIText.buttonSubmit}</button>
                            <button type="button" onClick={handleClickClear}>
                                {UIText.buttonClear}
                            </button>
                            <button type="button" onClick={handleClickInit}>
                                {UIText.buttonInit}
                            </button>
                        </div>
                    </div>
                </div>
                <div id="seperator">&nbsp;</div>
            </form>
            {result && <Solution result={result} />}
        </>
    )
}
