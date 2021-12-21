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
                    {rectangles.map((rectangle, index) => {
                        return (
                            <div key={index} dangerouslySetInnerHTML={{__html: rectangle}} />
                        )
                    })}
                </>
            )}
        </>
    )
};
