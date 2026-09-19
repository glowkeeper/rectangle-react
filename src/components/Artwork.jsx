import React, { useState, useMemo, useReducer } from 'react'

import { CompactPicker } from 'react-color'

import { Solution } from './Solution'

import { findRectangles } from '../getSolution'

import { 
    StoreContext,
    StoreActions,
    rootReducer,
    initialState
} from '../store'

import { UIText } from '../config'

export const Artwork = () => {
    const [state, dispatch] = useReducer(rootReducer, initialState)
    const [art, setArt] = useState(initialState)
    const [hasSubmitted, setHasSubmitted] = useState(false)
    const [error, setError] = useState('')

    const store = useMemo(() => {
        return { state: state, dispatch: dispatch }
    }, [state, dispatch])


    const handleSubmit = (event) => {
        event.preventDefault();

        try {
            const rectangles = findRectangles(art.asciiArt, art.corner)

            dispatch({
                type: StoreActions.update,
                payload: {
                    hasInitialised: false,
                    hasSolution: true,
                    asciiArt: art.asciiArt,
                    corner: art.corner,
                    colour: art.colour,
                    rectangles
                }
            })
            setError('')
            setHasSubmitted(true)
        } catch (submitError) {
            setError(submitError.message)
            setHasSubmitted(false)
        }
    }

    const handleChangeInput = (event) => {
        const name = event.target.name
        const value = event.target.value

        if (hasSubmitted) setHasSubmitted(false)
        if (error) setError('')
        setArt({...art, [name]: value})
    }

    const handleChangeColour = (colour) => {
        // console.log('my colour', colour)
        if (hasSubmitted) setHasSubmitted(false)
        if (error) setError('')
        setArt({...art, colour: colour.hex})
    }

    const handleClickClear = (event) => {
        event.preventDefault();
        
        const reset = {
            hasInitialised: false,
            hasSolution: false,
            asciiArt: "",
            corner: "",
            colour: initialState.colour,
            rectangles: []
        }
        
        setArt(reset)
        
        if (hasSubmitted) setHasSubmitted(false)
        if (error) setError('')

    }

    const handleClickInit = (event) => {        
        event.preventDefault();       
        setArt(initialState)
        if (hasSubmitted) setHasSubmitted(false)   
        if (error) setError('')
    }

    return (
        <>
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
                            value={art.asciiArt}
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
                            <label id="corner-label"  htmlFor="corner">{UIText.inputCorner}:</label>
                            <input
                                className="corner-input"
                                type="text"
                                id="corner"
                                name="corner"
                                required
                                maxLength="1"
                                onChange={handleChangeInput}
                                value={art.corner}
                            />
                        </div>
                        <div id="input-colour">
                            <label id="colour-label" htmlFor="colour">{UIText.inputColour}:</label>
                            <CompactPicker
                                id="colour"
                                name="colour"
                                color={art.colour}
                                onChange={handleChangeColour} 
                            />
                        </div>
                        <div id="form-buttons">
                            <button type="submit">{UIText.buttonSubmit}</button>
                            <button onClick={handleClickClear}>{UIText.buttonClear}</button> 
                            <button onClick={handleClickInit}>{UIText.buttonInit}</button> 
                        </div>
                    </div>
                </div>
                <div id="seperator">&nbsp;</div>
            </form>
            { hasSubmitted && (
                <StoreContext.Provider value={store}>   
                    <Solution />
                </StoreContext.Provider>
            )}
        </>
    )
};
