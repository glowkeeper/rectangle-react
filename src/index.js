/*
 * solution to https://exercism.org/tracks/javascript/exercises/rectangles
 * this solution is based on the idea that matching
 * corners on subsequent lines constitutes a rectangle
 */

import React from 'react'
import ReactDOM from 'react-dom'

import { App } from './components/App'

import './styles/styles.css'

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
)