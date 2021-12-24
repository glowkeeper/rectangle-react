import React, { useState, useMemo } from 'react'

import { CompactPicker } from 'react-color'

import { Solution } from './Solution'

import { GetRectangles } from '../getSolution'

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

    const store = useMemo(() => {
        return { state: state, dispatch: dispatch }
    }, [state, dispatch])


    const handleSubmit = (event) => {
        event.preventDefault();
        const userHasSubmitted = true;

        store.dispatch(
            GetRectangles(store.dispatch, userHasSubmitted, art.asciiArt, art.corner, art.colour)
        )
    }

    const handleChangeInput = (event) => {
        const name = event.target.name
        const value = event.target.value

        setArt({...art, [name]: value})
    }

    const handleChangeColour = (colour) => {
        // console.log('my colour', colour)
        setArt({...art, colour: colour.hex})
    }

    const handleClick = (event) => {
        event.preventDefault();

        const cleared = {
            userHasSubmitted: false,
            asciiArt: "",
            corner: "",
            colour: initialState.colour,
            rectangles: []
        }
        
        setArt(cleared)

        store.dispatch({
            type: StoreActions.update,
            payload: cleared
        })        
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
                            <button onClick={handleClick}>{UIText.buttonClear}</button> 
                        </div>
                    </div>
                </div>
                <div id="seperator">&nbsp;</div>
            </form>  
            <StoreContext.Provider value={store}>   
                <Solution />
            </StoreContext.Provider>
        </>
    )
};
