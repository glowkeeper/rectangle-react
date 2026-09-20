import { fireEvent, render, screen } from '@testing-library/react'

import { Artwork, submittedResultMessage } from './Artwork'

const selectCorner = (row, column) => {
    fireEvent.click(screen.getByRole('button', {
        name: new RegExp(`Corner at row ${row}, column ${column}`),
    }))
}

const selectRectangle = (first, second) => {
    selectCorner(...first)
    selectCorner(...second)
}

const openFinishDialog = () => {
    fireEvent.click(screen.getByRole('button', { name: 'Finish hunt' }))
    return screen.getByRole('dialog', { name: 'Finish this hunt?' })
}

describe('submittedResultMessage', () => {
    test('uses singular wording when the only rectangle is found', () => {
        expect(submittedResultMessage(1, 1)).toBe('You found the rectangle.')
    })

    test('uses singular wording when the only rectangle is missed', () => {
        expect(submittedResultMessage(0, 1)).toBe('You did not find the rectangle.')
    })
})

describe('Rectangle Hunt game loop', () => {
    test('starts on the fixed drawing with a hidden total', () => {
        render(<Artwork />)

        expect(screen.getByRole('group', { name: 'Rectangle Hunt drawing' }))
            .toBeInTheDocument()
        expect(screen.getByRole('status', { name: 'Game status' }))
            .toHaveTextContent('Choose a corner to begin.')
        expect(screen.getByLabelText('0 rectangles found')).toHaveTextContent('0 found')
        expect(screen.queryByText(/drawing contains/i)).not.toBeInTheDocument()
        expect(screen.queryByLabelText('art:')).not.toBeInTheDocument()
    })

    test('records and focuses a valid new rectangle', () => {
        const { container } = render(<Artwork />)

        selectRectangle([1, 4], [3, 7])

        expect(screen.getByRole('status', { name: 'Game status' }))
            .toHaveTextContent('Found a new rectangle.')
        expect(screen.getByLabelText('1 rectangle found')).toHaveTextContent('1 found')
        expect(container.querySelectorAll('[data-rectangle-state="focused"]'))
            .toHaveLength(1)
        expect(screen.getByText('Discovery 1 of 1')).toBeInTheDocument()
    })

    test('reports an invalid pair without changing progress', () => {
        render(<Artwork />)

        selectRectangle([1, 4], [1, 7])

        expect(screen.getByLabelText('0 rectangles found')).toHaveTextContent('0 found')
        expect(screen.getByRole('status', { name: 'Game status' }))
            .toHaveTextContent('That pair does not form a rectangle. Try again.')
    })

    test('does not recount a duplicate and focuses the discovery', () => {
        const { container } = render(<Artwork />)

        selectRectangle([1, 4], [3, 7])
        selectRectangle([3, 7], [1, 4])

        expect(screen.getByRole('status', { name: 'Game status' }))
            .toHaveTextContent('Already found. Showing that rectangle.')
        expect(screen.getByLabelText('1 rectangle found')).toHaveTextContent('1 found')
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

    test('cancelling the finish confirmation preserves the active hunt', () => {
        render(<Artwork />)
        selectRectangle([1, 4], [3, 7])

        expect(openFinishDialog()).toHaveTextContent(
            "Reveal the answer and end this attempt? You won't be able to continue this hunt."
        )
        fireEvent.click(screen.getByRole('button', { name: 'Keep hunting' }))

        expect(screen.queryByRole('dialog', { name: 'Finish this hunt?' }))
            .not.toBeInTheDocument()
        expect(screen.getByLabelText('1 rectangle found')).toHaveTextContent('1 found')
        expect(screen.getByRole('button', { name: 'Finish hunt' })).toBeInTheDocument()
    })

    test('submitting an incomplete hunt reveals the result and ends selection', () => {
        const { container } = render(<Artwork />)
        selectRectangle([1, 4], [3, 7])

        openFinishDialog()
        fireEvent.click(screen.getByRole('button', { name: 'Reveal answer' }))

        expect(screen.getByRole('status', { name: 'Game status' }))
            .toHaveTextContent('You found 1 of 6 rectangles.')
        expect(screen.queryByRole('button', { name: 'Finish hunt' }))
            .not.toBeInTheDocument()
        expect(screen.queryByLabelText('1 rectangle found')).not.toBeInTheDocument()
        expect(screen.getByRole('button', { name: /Corner at row 1, column 4/ }))
            .toBeDisabled()
        expect(screen.getByRole('heading', { name: 'Review result' })).toBeInTheDocument()
        expect(screen.getByLabelText('Found by you, rectangle 1 of 6'))
            .toBeInTheDocument()

        fireEvent.click(screen.getByRole('button', { name: 'Next' }))

        expect(screen.getByLabelText('Missed, rectangle 2 of 6')).toBeInTheDocument()
        expect(screen.getByRole('status', { name: 'Game status' }))
            .toHaveTextContent('You found 1 of 6 rectangles.')
        expect(container.querySelectorAll('[data-rectangle-state="focused"]'))
            .toHaveLength(1)
        expect(container.querySelector('[data-rectangle-state="focused"]'))
            .toHaveAttribute('data-rectangle-result', 'missed')

        fireEvent.click(screen.getByRole('button', { name: 'Previous' }))
        expect(screen.getByLabelText('Found by you, rectangle 1 of 6'))
            .toBeInTheDocument()
    })

    test('does not reveal completion after the final rectangle and can restart', () => {
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
            .toHaveTextContent('Found a new rectangle.')
        expect(screen.getByLabelText('6 rectangles found')).toHaveTextContent('6 found')
        expect(screen.queryByText('The drawing contains 6 rectangles.'))
            .not.toBeInTheDocument()

        openFinishDialog()
        fireEvent.click(screen.getByRole('button', { name: 'Reveal answer' }))

        expect(screen.getByRole('status', { name: 'Game status' }))
            .toHaveTextContent('You found all 6 rectangles.')
        expect(screen.queryByRole('button', { name: 'Finish hunt' }))
            .not.toBeInTheDocument()
        expect(screen.getByLabelText('Found by you, rectangle 6 of 6'))
            .toBeInTheDocument()
        expect(screen.queryByText('Missed')).not.toBeInTheDocument()

        fireEvent.click(screen.getByRole('button', { name: 'Restart puzzle' }))

        expect(screen.getByRole('status', { name: 'Game status' }))
            .toHaveTextContent('Choose a corner to begin.')
        expect(screen.getByLabelText('0 rectangles found')).toHaveTextContent('0 found')
        expect(screen.getByRole('button', { name: 'Finish hunt' })).toBeInTheDocument()
        expect(screen.queryByText(/drawing contains/i)).not.toBeInTheDocument()
    })
})
