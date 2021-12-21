import React, { useContext } from 'react'

import { StoreContext } from '../store'

export const Solution = () => {
    const store = useContext(StoreContext)

    let length = 0
    let rectangles = []
    if ( store.state.rectangles ) {
        length = store.state.rectangles.length
        rectangles = store.state.rectangles
    }

    return (
        <>
            { length > 0 && (
                <>
                    <h2>There are {length} solution(s)</h2>
                    <ul className="ascii responsive-grid">
                    {rectangles.map((rectangle, index) => {
                        return (                            
                            <li key={index} className="ascii-solution">
                                <div key={index} dangerouslySetInnerHTML={{__html: rectangle}} />
                            </li>
                        )
                    })}
                    </ul>
                </>
            )}
        </>
    )
};
