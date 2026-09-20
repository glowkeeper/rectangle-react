import { useId, useState } from 'react'

import { FIXED_BOARD, FIXED_BOARD_CORNER } from '../fixedBoard'
import { rectangleCoordinatesKey } from '../rectangleHuntSession'

const cornerKey = ({ row, column }) => `${row}:${column}`

const getLines = (board) => {
  const lines = board.split(/\r?\n/)
  const columns = lines.reduce((maximum, line) => Math.max(maximum, line.length), 0)

  return {
    columns,
    lines: lines.map((line) => line.padEnd(columns, ' ')),
  }
}

const cornerName = (corner, state) => {
  const location = `Corner at row ${corner.row + 1}, column ${corner.column + 1}`

  if (state === 'selected') return `${location}, first corner selected`
  if (state === 'candidate') return `${location}, candidate second corner`
  return location
}

export const FixedBoardSelector = ({
  board = FIXED_BOARD,
  cornerCharacter = FIXED_BOARD_CORNER,
  selectedCorner = null,
  foundRectangles = [],
  focusedRectangle = null,
  focusedRectangleResult = 'found',
  onSelectCorner,
  onCancelSelection,
  disabled = false,
}) => {
  const headingId = useId()
  const instructionsId = useId()
  const [candidateKey, setCandidateKey] = useState(null)
  const { columns, lines } = getLines(board)
  const selectedKey = selectedCorner === null ? null : cornerKey(selectedCorner)
  const focusedKey = focusedRectangle === null
    ? null
    : rectangleCoordinatesKey(focusedRectangle)
  const displayRectangles = foundRectangles.map((rectangle) => ({
    rectangle,
    result: 'found',
  }))

  if (
    focusedRectangle !== null
    && !foundRectangles.some((rectangle) => rectangleCoordinatesKey(rectangle) === focusedKey)
  ) {
    displayRectangles.push({
      rectangle: focusedRectangle,
      result: focusedRectangleResult,
    })
  }

  const orderedRectangles = displayRectangles.sort((first, second) => {
    const firstFocused = rectangleCoordinatesKey(first.rectangle) === focusedKey
    const secondFocused = rectangleCoordinatesKey(second.rectangle) === focusedKey

    return Number(firstFocused) - Number(secondFocused)
  })

  const getCornerState = (corner) => {
    const key = cornerKey(corner)

    if (key === selectedKey) return 'selected'
    if (selectedKey !== null && key === candidateKey) return 'candidate'
    return 'available'
  }

  const updateCandidate = (corner) => {
    if (selectedKey !== null && cornerKey(corner) !== selectedKey) {
      setCandidateKey(cornerKey(corner))
    }
  }

  const clearCandidate = (corner) => {
    if (candidateKey === cornerKey(corner)) setCandidateKey(null)
  }

  const selectCorner = (corner) => {
    setCandidateKey(null)
    onSelectCorner(corner)
  }

  const handleBoardKeyDown = (event) => {
    if (event.key !== 'Escape' || selectedCorner === null) return

    event.preventDefault()
    setCandidateKey(null)
    onCancelSelection()
  }

  return (
    <section className="fixed-board-selector" aria-labelledby={headingId}>
      <h3 id={headingId}>Find the rectangles</h3>
      <p id={instructionsId}>
        {disabled
          ? 'Hunt submitted. Corner selection is closed.'
          : 'Choose two opposite corners. Use Tab to move between corners and Escape to cancel the first corner.'}
      </p>
      <div
        className="rectangle-board"
        role="group"
        aria-label="Rectangle Hunt drawing"
        aria-describedby={instructionsId}
        onKeyDown={handleBoardKeyDown}
      >
        <div
          className="rectangle-board-grid"
          style={{ '--board-columns': columns }}
        >
          {orderedRectangles.map(({ rectangle, result }) => {
            const key = rectangleCoordinatesKey(rectangle)
            const focused = key === focusedKey

            return (
              <span
                className={focused
                  ? `rectangle-highlight rectangle-highlight--focused rectangle-highlight--focused-${result}`
                  : 'rectangle-highlight rectangle-highlight--found'}
                aria-hidden="true"
                data-rectangle-state={focused ? 'focused' : 'found'}
                data-rectangle-result={result}
                key={key}
                style={{
                  gridColumn: `${rectangle.left + 1} / ${rectangle.right + 2}`,
                  gridRow: `${rectangle.top + 1} / ${rectangle.bottom + 2}`,
                }}
              />
            )
          })}
          {lines.flatMap((line, row) => {
            return [...line].map((character, column) => {
              const corner = { row, column }
              const key = cornerKey(corner)

              if (character !== cornerCharacter) {
                return (
                  <span
                    className="board-character"
                    aria-hidden="true"
                    data-board-cell
                    key={key}
                    style={{ gridColumn: column + 1, gridRow: row + 1 }}
                  >
                    {character === ' ' ? '\u00a0' : character}
                  </span>
                )
              }

              const state = getCornerState(corner)

              return (
                <button
                  type="button"
                  className={`board-corner board-corner--${state}`}
                  aria-label={cornerName(corner, state)}
                  data-board-cell
                  data-corner-state={state}
                  disabled={disabled}
                  key={key}
                  style={{ gridColumn: column + 1, gridRow: row + 1 }}
                  onClick={() => selectCorner(corner)}
                  onFocus={() => updateCandidate(corner)}
                  onBlur={() => clearCandidate(corner)}
                  onPointerEnter={() => updateCandidate(corner)}
                  onPointerLeave={() => clearCandidate(corner)}
                >
                  {character}
                </button>
              )
            })
          })}
        </div>
      </div>
    </section>
  )
}
