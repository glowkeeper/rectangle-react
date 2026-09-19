import React, { useContext } from 'react'

import { StoreContext } from '../store'
import { UIText } from '../config'

const isOnPerimeter = (row, column, rectangle) => {
    const { top, left, bottom, right } = rectangle
    const isHorizontalEdge = (row === top || row === bottom)
        && column >= left
        && column <= right
    const isVerticalEdge = (column === left || column === right)
        && row >= top
        && row <= bottom

    return isHorizontalEdge || isVerticalEdge
}

export const RectangleSolution = ({ asciiArt, rectangle, colour }) => {
    const lines = asciiArt.split(/\n/)

    return (
        <pre>
            {lines.map((line, row) => (
                <React.Fragment key={row}>
                    {line.split('').map((character, column) => (
                        isOnPerimeter(row, column, rectangle) ? (
                            <span key={column} style={{ color: colour }}>
                                {character}
                            </span>
                        ) : character
                    ))}
                    {row < lines.length - 1 ? '\n' : null}
                </React.Fragment>
            ))}
        </pre>
    )
}

export const Solution = () => {
    const { state } = useContext(StoreContext)

    if (!state.hasSolution) {
        return (
            <div id="spinner">
                <div className="spinner-2">&nbsp;</div>
            </div>
        )
    }

    const lines = state.asciiArt.split(/\n/)
    const columnWidth = lines.reduce((maximum, line) => {
        return Math.max(maximum, line.length)
    }, 0)

    return (
        <>
            <p id="solutions">
                {UIText.outputSolutions}: {state.rectangles.length}
            </p>
            <div
                style={{
                    display: 'grid',
                    gridTemplateColumns: `repeat(auto-fit, minmax(${columnWidth}ch, 1fr))`,
                    gap: '8px',
                }}
            >
                {state.rectangles.map((rectangle) => (
                    <div
                        key={`${rectangle.top}-${rectangle.left}-${rectangle.bottom}-${rectangle.right}`}
                        className="ascii-solution"
                    >
                        <RectangleSolution
                            asciiArt={state.asciiArt}
                            rectangle={rectangle}
                            colour={state.colour}
                        />
                    </div>
                ))}
            </div>
        </>
    )
}
