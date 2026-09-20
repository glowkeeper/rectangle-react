import { useId, useState } from 'react'

import { FIXED_BOARD, FIXED_BOARD_CORNER } from '../fixedBoard'

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
  onSelectCorner,
  onCancelSelection,
}) => {
  const headingId = useId()
  const instructionsId = useId()
  const [candidateKey, setCandidateKey] = useState(null)
  const { columns, lines } = getLines(board)
  const selectedKey = selectedCorner === null ? null : cornerKey(selectedCorner)

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

  const handleCornerKeyDown = (event, corner) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault()
      selectCorner(corner)
    }
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
        Choose two opposite corners. Use Tab to move between corners and Escape to cancel the first corner.
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
                  key={key}
                  onClick={() => selectCorner(corner)}
                  onKeyDown={(event) => handleCornerKeyDown(event, corner)}
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
