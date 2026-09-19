/*
 * solution to https://exercism.org/tracks/javascript/exercises/rectangles
 * this solution is based on the idea that matching
 * corners on subsequent lines constitutes a rectangle
 */
import React from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from "react-router-dom"

import { App } from './components/App'

import './styles/styles.css'

createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <React.StrictMode>
      <App />
    </React.StrictMode>
  </BrowserRouter>
)
