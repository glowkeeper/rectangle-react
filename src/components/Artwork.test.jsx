import { fireEvent, render, screen } from '@testing-library/react'

import { Artwork } from './Artwork'
import { BOARD_LIMITS } from '../getSolution'

describe('Artwork board limits', () => {
    test('connects fixed-board corner selection to the session model', () => {
        render(<Artwork />)

        const corner = screen.getByRole('button', {
            name: 'Corner at row 1, column 4',
        })
        fireEvent.click(corner)

        expect(screen.getByRole('button', { name: /row 1, column 4/ }))
            .toHaveAttribute('data-corner-state', 'selected')
    })

    test('does not move initial focus past the fixed-board controls', () => {
        render(<Artwork />)

        expect(screen.getByLabelText('art:')).not.toHaveAttribute('autofocus')
        expect(screen.getByLabelText('art:')).not.toHaveFocus()
    })

    test('uses the native colour input', () => {
        render(<Artwork />)

        const colourInput = screen.getByLabelText('colour:')

        expect(colourInput).toHaveAttribute('type', 'color')
        expect(colourInput).toHaveValue('#ff0000')
    })

    test('shows an accessible error instead of attempting an oversized board', () => {
        render(<Artwork />)

        const textarea = screen.getByLabelText('art:')
        fireEvent.change(textarea, {
            target: { value: ' '.repeat(BOARD_LIMITS.maxColumns + 1) },
        })
        fireEvent.click(screen.getByRole('button', { name: 'submit' }))

        expect(screen.getByRole('alert')).toHaveTextContent(
            `Artwork cannot exceed ${BOARD_LIMITS.maxColumns} columns.`
        )
        expect(textarea).toHaveAttribute('aria-invalid', 'true')
    })
})
