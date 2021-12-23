import React, { useReducer, useMemo } from 'react'

import { StoreContext, rootReducer } from '../store'

import { Artwork } from './Artwork'
import { Solution } from './Solution'

import { UIText } from '../config'

export const App = () => {

    const [state, dispatch] = useReducer(rootReducer, [])

    const store = useMemo(() => {
        return { state: state, dispatch: dispatch }
    }, [state, dispatch])

    return (
        <>
            <main>
                <div dangerouslySetInnerHTML={{__html: UIText.title}} />
                <StoreContext.Provider value={store}>                     
                    <Artwork />
                    <Solution />
                </StoreContext.Provider>
            </main>
        </>
    )
}