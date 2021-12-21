import React, { useContext, useState } from 'react'

import { StoreContext, StoreActions } from '../store'

export const Artwork = () => {
    const [art, setArt] = useState({
        asciiArt: "",
        corner: ""
    })
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
        const name = event.target.name
        const value = event.target.value

        setArt({...art, [name]: value})
    }

    return (
        <>
            <form onSubmit={handleSubmit}>
                <label htmlFor="asciiArt">ASCII Art</label>
                <textarea
                    className="art-input"
                    id="asciiArt"
                    name="asciiArt"
                    required
                    autoFocus
                    onChange={handleChange}
                />
                <label htmlFor="corner">Corner</label>
                <input
                    className="corner-input"
                    type="text"
                    id="corner"
                    name="corner"
                    required
                    maxLength="1"
                    onChange={handleChange}
                    value={art.corner}
                />
                <button type="submit">Submit</button>
            </form> 
            <button onClick={handleClick}>Reset</button>      
        </>
    )
};
