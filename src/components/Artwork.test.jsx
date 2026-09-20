import { fireEvent, render, screen } from '@testing-library/react'

import { Artwork } from './Artwork'

const selectCorner = (row, column) => {
    fireEvent.click(screen.getByRole('button', {
        name: new RegExp(`Corner at row ${row}, column ${column}`),
    }))
}

const selectRectangle = (first, second) => {
    selectCorner(...first)
    selectCorner(...second)
}

describe('Rectangle Hunt game loop', () => {
    test('starts on the fixed drawing with a hidden total', () => {
        render(<Artwork />)

        expect(screen.getByRole('group', { name: 'Rectangle Hunt drawing' }))
            .toBeInTheDocument()
        expect(screen.queryByText('Found 0 rectangles.')).not.toBeInTheDocument()
        expect(screen.queryByText(/drawing contains/i)).not.toBeInTheDocument()
        expect(screen.queryByLabelText('art:')).not.toBeInTheDocument()
    })

    test('records and focuses a valid new rectangle', () => {
        const { container } = render(<Artwork />)

        selectRectangle([1, 4], [3, 7])

        expect(screen.getByRole('status', { name: 'Game status' }))
            .toHaveTextContent('Found a new rectangle.')
        expect(container.querySelectorAll('[data-rectangle-state="focused"]'))
            .toHaveLength(1)
        expect(screen.getByText('Discovery 1 of 1')).toBeInTheDocument()
    })

    test('reports an invalid pair without changing progress', () => {
        render(<Artwork />)

        selectRectangle([1, 4], [1, 7])

        expect(screen.queryByText(/Found \d+ rectangles?\./)).not.toBeInTheDocument()
        expect(screen.getByRole('status', { name: 'Game status' }))
            .toHaveTextContent('That pair does not form a rectangle. Try again.')
    })

    test('does not recount a duplicate and focuses the discovery', () => {
        const { container } = render(<Artwork />)

        selectRectangle([1, 4], [3, 7])
        selectRectangle([3, 7], [1, 4])

        expect(screen.getByRole('status', { name: 'Game status' }))
            .toHaveTextContent('Already found. Showing that rectangle.')
        expect(container.querySelectorAll('[data-rectangle-state="focused"]'))
            .toHaveLength(1)
    })

    test('reviews found rectangles backward and forward', () => {
        render(<Artwork />)

        selectRectangle([1, 4], [3, 7])
        selectRectangle([2, 3], [3, 4])

        expect(screen.getByText('Discovery 2 of 2')).toBeInTheDocument()
        fireEvent.click(screen.getByRole('button', { name: 'Previous' }))
        expect(screen.getByText('Discovery 1 of 2')).toBeInTheDocument()
        fireEvent.click(screen.getByRole('button', { name: 'Next' }))
        expect(screen.getByText('Discovery 2 of 2')).toBeInTheDocument()
    })

    test('reveals the total only after the final rectangle and can restart', () => {
        render(<Artwork />)
        const rectangles = [
            [[1, 4], [3, 7]],
            [[1, 4], [5, 7]],
            [[2, 3], [3, 4]],
            [[3, 1], [5, 4]],
            [[3, 1], [5, 7]],
            [[3, 4], [5, 7]],
        ]

        rectangles.forEach(([first, second]) => selectRectangle(first, second))

        expect(screen.getByRole('status', { name: 'Game status' }))
            .toHaveTextContent('Puzzle complete! You found all 6 rectangles.')
        expect(screen.queryByText('The drawing contains 6 rectangles.'))
            .not.toBeInTheDocument()

        fireEvent.click(screen.getByRole('button', { name: 'Restart puzzle' }))

        expect(screen.getByRole('status', { name: 'Game status' }))
            .toHaveTextContent('Choose a corner to begin.')
        expect(screen.queryByText(/drawing contains/i)).not.toBeInTheDocument()
    })
})
