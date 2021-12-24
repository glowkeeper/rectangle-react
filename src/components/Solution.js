import React, { useEffect, useContext, useState } from 'react'

import { StoreContext } from '../store'
import { UIText } from '../config'

const initialState = {
    hasInitialised: false,
    hasSolution: false,
    numSolutions: 0,
    rowHeight: '',
    columnWidth: '',
    rectangles: []
}

export const Solution = () => {
    const store = useContext(StoreContext)
    const [solutions, setSolutions ] = useState(initialState)

    useEffect(() => {

        if (!store.state.hasInitialised && !store.state.hasInitialised) {
            return (solutions) => {
                setSolutions({...initialState})
            }
        }
    }, [store])

    useEffect(() => {

        if (store.state.hasInitialised) {
            return (solutions) => {
                setSolutions({...initialState, hasInitialised: true})
            }
        }
    }, [store])

    useEffect(() => {

        let timer
        if ( store.state.hasSolution ) {  
            const myRectangles = store.state.rectangles.map((rectangle, index) => {
                return (        
                    <div key={index} className="ascii-solution" dangerouslySetInnerHTML={{__html: rectangle}} />
                )
            })
            const asciiArt = store.state.asciiArt.split(/\n/);
            const mySolutions = {
                hasInitialised: false,
                hasSolution: true,
                numSolutions: store.state.rectangles.length,
                rowHeight: `${asciiArt.length}fr`,
                columnWidth: `${asciiArt[0].length}ch`,
                rectangles: myRectangles
            }
            timer = setTimeout(() => {
                setSolutions(mySolutions)
            }, 1000)
        }

        return () => {
            clearTimeout(timer)
        }
    }, [store])    

    return (
        <>
            { solutions.hasSolution ? (
                <>
                    <p id="solutions">{UIText.outputSolutions}: {solutions.numSolutions}</p>
                    <div 
                        style={{
                            display: 'grid',
                            gridTemplateColumns: `repeat(auto-fit, minmax(${solutions.columnWidth}, 1fr))`,
                            gridAutoRows: `${solutions.rowHeight}`,
                            gap: '8px',
                        }}
                    >
                        {solutions.rectangles}
                    </div>
                </>
            ) : (
                <>
                    { solutions.hasInitialised && (                    
                        <div id="spinner">
                            <div className="spinner-2">&nbsp;</div>
                        </div>
                    )}
                </>
            )}
        </>
    )
};
