import { fireEvent, render, screen } from '@testing-library/react'

import { RectangleSolution, Solution } from './Solution'

describe('RectangleSolution', () => {
    test('preserves the original drawing and colours only the perimeter', () => {
        const { container } = render(
            <RectangleSolution
                asciiArt={'+--+\n| x|\n+--+'}
                rectangle={{ top: 0, left: 0, bottom: 2, right: 3 }}
                colour="#ff0000"
            />
        )

        expect(container.querySelector('pre').textContent).toBe('+--+\n| x|\n+--+')
        expect(container.querySelectorAll('span')).toHaveLength(10)
        expect(container.querySelector('pre').textContent).toContain('x')
    })

    test('renders user-authored markup as inert text', () => {
        const markup = '<img src=x onerror=alert(1)>'
        const padding = ' '.repeat(markup.length + 1)
        const asciiArt = `${markup} +-+\n${padding}| |\n${padding}+-+`
        const left = markup.length + 1
        const { container } = render(
            <RectangleSolution
                asciiArt={asciiArt}
                rectangle={{ top: 0, left, bottom: 2, right: left + 2 }}
                colour="#ff0000"
            />
        )

        expect(container.querySelector('img')).toBeNull()
        expect(container.querySelector('pre').textContent).toContain(markup)
    })
})

describe('Solution', () => {
    const renderSolution = (state) => {
        return render(<Solution result={state} />)
    }

    test('shows a single unhighlighted board when there are no rectangles', () => {
        const { container } = renderSolution({
            asciiArt: 'no rectangles',
            colour: '#ff0000',
            rectangles: [],
        })

        expect(screen.getByText('number of solutions: 0')).toBeInTheDocument()
        expect(container.querySelectorAll('.ascii-solution')).toHaveLength(1)
        expect(container.querySelectorAll('.ascii-solution span')).toHaveLength(0)
        expect(screen.queryByRole('button', { name: 'next' })).not.toBeInTheDocument()
    })

    test('navigates rectangles while retaining one rendered board', () => {
        const { container } = renderSolution({
            asciiArt: '+--+-+\n|  | |\n+--+-+',
            colour: '#ff0000',
            rectangles: [
                { top: 0, left: 0, bottom: 2, right: 3 },
                { top: 0, left: 0, bottom: 2, right: 5 },
            ],
        })

        expect(container.querySelectorAll('.ascii-solution')).toHaveLength(1)
        expect(container.querySelectorAll('.ascii-solution span')).toHaveLength(10)
        expect(screen.getByText('rectangle 1 of 2')).toBeInTheDocument()

        fireEvent.click(screen.getByRole('button', { name: 'next' }))

        expect(container.querySelectorAll('.ascii-solution')).toHaveLength(1)
        expect(container.querySelectorAll('.ascii-solution span')).toHaveLength(14)
        expect(screen.getByText('rectangle 2 of 2')).toBeInTheDocument()

        fireEvent.click(screen.getByRole('button', { name: 'next' }))

        expect(screen.getByText('rectangle 1 of 2')).toBeInTheDocument()
    })
})
