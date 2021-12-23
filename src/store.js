import React from 'react'

import { foundRectangles } from './getSolution';

export const StoreContext = React.createContext()

export class StoreActions {
  static update = 'Update'
}

export const rootReducer = (state, action) => {
  switch (action.type) {
    case StoreActions.update:
      //console.log('made it here', action)
      const thisUpdate = {
        asciiArt: action.payload.asciiArt,
        corner: action.payload.corner,
        rectangles: []       
      }
      const theseRectangles = foundRectangles(thisUpdate.asciiArt, thisUpdate.corner)
      //console.log('these', theseRectangles)
      thisUpdate.rectangles = theseRectangles
      return {...state, ...thisUpdate}
    default:
      return state
  }
}

export const initialState = {
  asciiArt: "",
  corner: "",
  rectangles: [],
}
