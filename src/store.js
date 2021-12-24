import React, { useReducer } from 'react'

export const StoreContext = React.createContext()

export class StoreActions {
  static update = 'Update'
}

export const rootReducer = (state, action) => {
  switch (action.type) {
    case StoreActions.update:
      //console.log('made it here', action)
      return {...state, ...action.payload}
    default:
      return state
  }
}

export const initialState = {
  userHasSubmitted: false,
  asciiArt: "   +--+\n  ++  |\n+-++--+\n|  |  |\n+--+--+",
  corner: "+",
  colour: "#ff0000",
  rectangles: [],
}

export const useReducerWithThunk = (reducer, initialState) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  const customDispatch = (action) => {
    if (typeof action === 'function') {
        action(customDispatch);
    } else {
        dispatch(action); 
    }
  };
  
  return [state, customDispatch];
}
