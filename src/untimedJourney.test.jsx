import { beforeEach } from 'vitest'
import { fireEvent, render, screen } from '@testing-library/react'

import { Artwork } from './components/Artwork'
import { findRectangles } from './getSolution'
import { PUZZLES } from './puzzles'

beforeEach(() => {
  window.localStorage.clear()
})

const selectCorner = ({ row, column }) => {
  fireEvent.click(screen.getByRole('button', {
    name: new RegExp(`Corner at row ${row + 1}, column ${column + 1}`),
  }))
}

const selectRectangle = (rectangle) => {
  selectCorner({ row: rectangle.top, column: rectangle.left })
  selectCorner({ row: rectangle.bottom, column: rectangle.right })
}

const submitHunt = () => {
  fireEvent.click(screen.getByRole('button', { name: 'Finish hunt' }))
  fireEvent.click(screen.getByRole('button', { name: 'Reveal answer' }))
}

describe.each(PUZZLES)('$title complete journey', (puzzle) => {
  const rectangles = findRectangles(puzzle.board, puzzle.cornerCharacter)

  test('keeps completeness secret until an all-found submission', () => {
    render(<Artwork puzzle={puzzle} />)

    rectangles.forEach((rectangle, index) => {
      selectRectangle(rectangle)

      expect(screen.getByRole('status', { name: 'Game status' }))
        .toHaveTextContent(/^Found a new rectangle\.$/)
      expect(screen.queryByText(
        /You found all|You found \d+ of \d+|drawing contains/i
      )).not.toBeInTheDocument()
      expect(screen.getByLabelText(
        `${index + 1} ${index === 0 ? 'rectangle' : 'rectangles'} found`
      )).toBeInTheDocument()
      expect(screen.getByRole('button', { name: 'Finish hunt' }))
        .toBeEnabled()
      expect(screen.queryByRole('heading', { name: 'Review result' }))
        .not.toBeInTheDocument()
    })

    submitHunt()

    expect(screen.getByRole('status', { name: 'Game status' }))
      .toHaveTextContent(`You found all ${rectangles.length} rectangles.`)
    expect(screen.getByLabelText(
      `Found by you, rectangle ${rectangles.length} of ${rectangles.length}`
    )).toBeInTheDocument()
    expect(screen.queryByText('Missed')).not.toBeInTheDocument()
  })

  test('reports and reviews an incomplete submission accurately', () => {
    const { container } = render(<Artwork puzzle={puzzle} />)
    selectRectangle(rectangles[0])

    submitHunt()

    expect(screen.getByRole('status', { name: 'Game status' }))
      .toHaveTextContent(`You found 1 of ${rectangles.length} rectangles.`)
    expect(screen.getByLabelText(
      `Found by you, rectangle 1 of ${rectangles.length}`
    )).toBeInTheDocument()

    fireEvent.click(screen.getByRole('button', { name: 'Next' }))

    expect(screen.getByLabelText(
      `Missed, rectangle 2 of ${rectangles.length}`
    )).toBeInTheDocument()
    expect(container.querySelectorAll('[data-rectangle-state="focused"]'))
      .toHaveLength(1)
    expect(container.querySelector('[data-rectangle-state="focused"]'))
      .toHaveAttribute('data-rectangle-result', 'missed')
  })
})
