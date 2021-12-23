import React, { useContext, useState } from 'react'

import { CompactPicker } from 'react-color'

import { StoreContext, StoreActions, initialState } from '../store'

import { UIText } from '../config'

const initialArt = {
    userHasSubmitted: initialState.userHasSubmitted,
    asciiArt: initialState.asciiArt,
    corner: initialState.corner,
    colour: initialState.colour
}

export const Artwork = () => {
    const [art, setArt] = useState(initialArt)
    const store = useContext(StoreContext)

    const handleSubmit = (event) => {
        event.preventDefault();

        store.dispatch({
            type: StoreActions.update,
            payload: { ...art, userHasSubmitted: true}
        })
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
            colour: initialState.colour
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
        </>
    )
};
