import React, { useContext } from 'react'

import { StoreContext } from '../store'

export const Solution = () => {
    const store = useContext(StoreContext)

    let numSolutions = 0
    let rectangles = []
    let rowHeight = ''
    let columnWidth = ''
    if ( store.state.rectangles ) {
        numSolutions = store.state.rectangles.length
        rectangles = store.state.rectangles
        const asciiArt = store.state.asciiArt.split(/\n/);
        rowHeight = `${asciiArt.length}fr`
        columnWidth = `${asciiArt[0].length}ch`
    }

    return (
        <>
            { numSolutions > 0 && (
                <>
                    <h2>There are {numSolutions} solution(s)</h2>
                    <div 
                        style={{
                            display: 'grid',
                            gridTemplateColumns: `repeat(auto-fit, minmax(${columnWidth}, 1fr))`,
                            gridAutoRows: `${rowHeight}`,
                            gap: '8px',
                        }}
                    >
                        {rectangles.map((rectangle, index) => {
                            return (        
                                <div key={index} className="ascii-solution" dangerouslySetInnerHTML={{__html: rectangle}} />
                            )
                        })}
                    </div>
                </>
            )}
        </>
    )
};
