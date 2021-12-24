import React, { useState, useMemo } from 'react'

import { CompactPicker } from 'react-color'

import { Solution } from './Solution'

import { findRectangles } from '../getSolution'

import { 
    StoreContext, 
    StoreActions, 
    rootReducer,
    initialState, 
    useReducerWithThunk 
} from '../store'

import { UIText } from '../config'

export const Artwork = () => {
    const [state, dispatch] = useReducerWithThunk(rootReducer, initialState)
    const [art, setArt] = useState(initialState)
    const [hasSubmitted, setHasSubmitted] = useState(false)

    const store = useMemo(() => {
        return { state: state, dispatch: dispatch }
    }, [state, dispatch])


    const handleSubmit = (event) => {
        event.preventDefault();
        setHasSubmitted(true)
        store.dispatch({
            type: StoreActions.init,
            payload: {}
        })
        store.dispatch(
            findRectangles(store.dispatch, art.asciiArt, art.corner, art.colour)
        )
    }

    const handleChangeInput = (event) => {
        const name = event.target.name
        const value = event.target.value

        if (hasSubmitted) setHasSubmitted(false)
        setArt({...art, [name]: value})
    }

    const handleChangeColour = (colour) => {
        // console.log('my colour', colour)
        if (hasSubmitted) setHasSubmitted(false)
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
        
        /*store.dispatch({
            type: StoreActions.reset,
            payload: reset
        })*/
        if (hasSubmitted) setHasSubmitted(false)

    }

    const handleClickInit = (event) => {        
        event.preventDefault();       
        setArt(initialState)
        if (hasSubmitted) setHasSubmitted(false)   
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
                        />
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
