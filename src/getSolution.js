export const BOARD_LIMITS = Object.freeze({
  maxRows: 50,
  maxColumns: 120,
  maxCells: 3000,
  maxRectangles: 1000,
})

const getLines = (asciiArt) => asciiArt === '' ? [] : asciiArt.split(/\r?\n/)

export const validateBoard = (asciiArt) => {
  const lines = getLines(asciiArt)
  const columns = lines.reduce((maximum, line) => {
    return Math.max(maximum, line.length)
  }, 0)
  const cells = lines.length * columns

  if (lines.length > BOARD_LIMITS.maxRows) {
    throw new RangeError(`Artwork cannot exceed ${BOARD_LIMITS.maxRows} rows.`)
  }

  if (columns > BOARD_LIMITS.maxColumns) {
    throw new RangeError(`Artwork cannot exceed ${BOARD_LIMITS.maxColumns} columns.`)
  }

  if (cells > BOARD_LIMITS.maxCells) {
    throw new RangeError(`Artwork cannot exceed ${BOARD_LIMITS.maxCells} cells.`)
  }

  return lines
}

const padLines = (lines) => {
  const width = lines.reduce((maximum, line) => {
    return Math.max(maximum, line.length)
  }, 0)

  return lines.map((line) => line.padEnd(width, ' '))
}

const createRunGrid = (rows, columns) => {
  return Array.from({ length: rows }, () => Array(columns).fill(0))
}

const labelHorizontalRuns = (lines, corner) => {
  const columns = lines[0]?.length ?? 0
  const runs = createRunGrid(lines.length, columns)
  let nextRun = 1

  for (let row = 0; row < lines.length; row += 1) {
    let currentRun = 0

    for (let column = 0; column < columns; column += 1) {
      const character = lines[row][column]

      if (character !== '-' && character !== corner) {
        currentRun = 0
        continue
      }

      if (currentRun === 0) {
        currentRun = nextRun
        nextRun += 1
      }

      runs[row][column] = currentRun
    }
  }

  return runs
}

const labelVerticalRuns = (lines, corner) => {
  const columns = lines[0]?.length ?? 0
  const runs = createRunGrid(lines.length, columns)
  let nextRun = 1

  for (let column = 0; column < columns; column += 1) {
    let currentRun = 0

    for (let row = 0; row < lines.length; row += 1) {
      const character = lines[row][column]

      if (character !== '|' && character !== corner) {
        currentRun = 0
        continue
      }

      if (currentRun === 0) {
        currentRun = nextRun
        nextRun += 1
      }

      runs[row][column] = currentRun
    }
  }

  return runs
}

export const findRectangles = (asciiArt, corner = '+') => {
  const lines = padLines(validateBoard(asciiArt))
  const rectangles = []
  const columns = lines[0]?.length ?? 0
  const horizontalRuns = labelHorizontalRuns(lines, corner)
  const verticalRuns = labelVerticalRuns(lines, corner)

  for (let top = 0; top < lines.length; top += 1) {
    for (let bottom = top + 1; bottom < lines.length; bottom += 1) {
      const leftColumnsByRuns = new Map()

      for (let right = 0; right < columns; right += 1) {
        if (lines[top][right] !== corner) continue
        if (lines[bottom][right] !== corner) continue
        if (verticalRuns[top][right] !== verticalRuns[bottom][right]) continue

        const runKey = `${horizontalRuns[top][right]}:${horizontalRuns[bottom][right]}`
        const leftColumns = leftColumnsByRuns.get(runKey) ?? []

        for (const left of leftColumns) {
          if (rectangles.length === BOARD_LIMITS.maxRectangles) {
            throw new RangeError(
              `Artwork cannot contain more than ${BOARD_LIMITS.maxRectangles} rectangles.`
            )
          }

          rectangles.push({ top, left, bottom, right })
        }

        leftColumns.push(right)
        leftColumnsByRuns.set(runKey, leftColumns)
      }
    }
  }

  return rectangles
}
