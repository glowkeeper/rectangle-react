import { render } from '@testing-library/react'

import { RectangleSolution } from './Solution'

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
