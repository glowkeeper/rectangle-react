import React, { useContext, useState } from 'react'

import { StoreContext, StoreActions } from '../store'

const initialArt = {
    asciiArt: "",
    corner: ""
}

export const Artwork = () => {
    const [art, setArt] = useState(initialArt)
    const store = useContext(StoreContext)

    /* const asciiArt = `
    +---+--+----+
    |   +--+----+
    +---+--+    |
    |   +--+----+
    +---+--+--+-+
    +---+--+--+-+
    +------+  | |
              +-+`;

    const corner = "+";*/

    const handleSubmit = (event) => {
        event.preventDefault();

        store.dispatch({
            type: StoreActions.update,
            payload: art
        })
    }

    const handleChange = (event) => {
        const name = event.target.name
        const value = event.target.value

        setArt({...art, [name]: value})
    }

    const handleClick = (event) => {
        event.preventDefault();
        
        setArt(initialArt)

        store.dispatch({
            type: StoreActions.update,
            payload: initialArt
        })
    }

    return (
        <>
            <form onSubmit={handleSubmit}>
                <div id="seperator">&nbsp;</div>
                <div id="input-grid">
                    <div id="input-ascii">
                        <label id="ascii-label" htmlFor="asciiArt">ASCII Art:</label>
                        <textarea
                            className="art-input"
                            id="asciiArt"
                            name="asciiArt"
                            value={art.asciiArt}
                            required
                            autoFocus
                            onChange={handleChange}
                        />
                    </div>
                    <div id="form-buttons">
                        <div id="input-corner">
                            <label id="corner-label"  htmlFor="corner">Corner:</label>
                            <input
                                className="corner-input"
                                type="text"
                                id="corner"
                                name="corner"
                                placeholder="+"
                                required
                                maxLength="1"
                                onChange={handleChange}
                                value={art.corner}
                            />
                        </div>
                        <button type="submit">Submit</button>
                        <button onClick={handleClick}>Reset</button> 
                    </div>
                </div>
                <div id="seperator">&nbsp;</div>
            </form>  
        </>
    )
};
