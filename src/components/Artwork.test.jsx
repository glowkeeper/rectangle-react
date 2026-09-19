import { fireEvent, render, screen } from '@testing-library/react'

import { Artwork } from './Artwork'
import { BOARD_LIMITS } from '../getSolution'

describe('Artwork board limits', () => {
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
