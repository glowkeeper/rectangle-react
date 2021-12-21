import React from 'react'

export const StoreContext = React.createContext()

export class StoreActions {
  static update = 'Update'
}

export const rootReducer = (state, action) => {
  switch (action.type) {
    case StoreActions.update:
      return {...state, ...action.payload}
    default:
      return state
  }
}

export const initialState = {
  art: "",
  corner: "",
  rectangles: [],
}
