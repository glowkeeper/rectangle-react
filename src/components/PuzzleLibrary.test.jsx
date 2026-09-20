import { beforeEach } from 'vitest'
import { fireEvent, render, screen } from '@testing-library/react'

import { PuzzleLibrary } from './PuzzleLibrary'

beforeEach(() => {
    window.localStorage.clear()
})

const selectCorner = (row, column) => {
    fireEvent.click(screen.getByRole('button', {
        name: new RegExp(`Corner at row ${row}, column ${column}`),
    }))
}

describe('Puzzle library', () => {
    test('offers three difficulty bands without revealing solution totals', () => {
        render(<PuzzleLibrary />)

        expect(screen.getByRole('heading', { name: 'Puzzle library' }))
            .toBeInTheDocument()
        expect(screen.getByText('Easy')).toBeInTheDocument()
        expect(screen.getByText('Medium')).toBeInTheDocument()
        expect(screen.getByText('Hard')).toBeInTheDocument()
        expect(screen.getAllByText('Not started')).toHaveLength(3)
        expect(screen.queryByText(/\d+ rectangles/)).not.toBeInTheDocument()
    })

    test('returns to the library and resumes an unfinished puzzle', () => {
        render(<PuzzleLibrary />)
        fireEvent.click(screen.getByRole('button', { name: 'Start First Steps' }))
        selectCorner(1, 1)
        selectCorner(3, 4)
        fireEvent.click(screen.getByRole('button', { name: 'Back to puzzles' }))

        expect(screen.getByText('In progress')).toBeInTheDocument()
        fireEvent.click(screen.getByRole('button', { name: 'Resume First Steps' }))
        expect(screen.getByLabelText('1 rectangle found')).toHaveTextContent('1 found')
    })

    test('marks a submitted puzzle without exposing its result in the library', () => {
        render(<PuzzleLibrary />)
        fireEvent.click(screen.getByRole('button', { name: 'Start First Steps' }))
        fireEvent.click(screen.getByRole('button', { name: 'Finish hunt' }))
        fireEvent.click(screen.getByRole('button', { name: 'Reveal answer' }))
        fireEvent.click(screen.getByRole('button', { name: 'Back to puzzles' }))

        expect(screen.getByText('Submitted')).toBeInTheDocument()
        expect(screen.getByRole('button', { name: 'Play First Steps again' }))
            .toBeInTheDocument()
        expect(screen.queryByText(/0 of 2/)).not.toBeInTheDocument()
    })
})
