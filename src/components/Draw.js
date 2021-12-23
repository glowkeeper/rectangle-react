import React, { useReducer, useMemo } from 'react'

import { StoreContext, rootReducer, initialState } from '../store'

import { Artwork } from './Artwork'
import { Solution } from './Solution'

export const Draw = () => {

    const [state, dispatch] = useReducer(rootReducer, initialState)

    const store = useMemo(() => {
        return { state: state, dispatch: dispatch }
    }, [state, dispatch])

    return (
        <>
            <StoreContext.Provider value={store}>                     
                <Artwork />
                <Solution />
            </StoreContext.Provider>
        </>
    )
}