import React, { useEffect, useState } from 'react'

import { UIText } from '../config'

const isOnPerimeter = (row, column, rectangle) => {
    if (!rectangle) return false

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

export const Solution = ({ result }) => {
    const [selectedIndex, setSelectedIndex] = useState(0)

    useEffect(() => {
        setSelectedIndex(0)
    }, [result.rectangles])

    const rectangleCount = result.rectangles.length
    const selectedRectangle = result.rectangles[selectedIndex] ?? null

    const selectPrevious = () => {
        setSelectedIndex((current) => {
            return (current - 1 + rectangleCount) % rectangleCount
        })
    }

    const selectNext = () => {
        setSelectedIndex((current) => {
            return (current + 1) % rectangleCount
        })
    }

    return (
        <>
            <p id="solutions">
                {UIText.outputSolutions}: {rectangleCount}
            </p>
            <div className="solution-viewer">
                {rectangleCount > 1 && (
                    <div className="solution-controls">
                        <button type="button" onClick={selectPrevious}>
                            previous
                        </button>
                        <output aria-live="polite">
                            rectangle {selectedIndex + 1} of {rectangleCount}
                        </output>
                        <button type="button" onClick={selectNext}>
                            next
                        </button>
                    </div>
                )}
                <div className="ascii-solution">
                    <RectangleSolution
                        asciiArt={result.asciiArt}
                        rectangle={selectedRectangle}
                        colour={result.colour}
                    />
                </div>
            </div>
        </>
    )
}
