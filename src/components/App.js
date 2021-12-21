import React, { useReducer, useMemo } from 'react'

import { StoreContext, rootReducer } from '../store'

import { Artwork } from './Artwork'
import { Solution } from './Solution'

export const App = () => {

    const [state, dispatch] = useReducer(rootReducer, [])

    const store = useMemo(() => {
        return { state: state, dispatch: dispatch }
    }, [state, dispatch])

    return (
        <>
            <main>
                <StoreContext.Provider value={store}>            

                    <h1>ASCII Art Rectangle Counter</h1>
                    <Artwork />
                    <Solution />
                </StoreContext.Provider>
            </main>
        </>
    )
}