import { fireEvent, render, screen } from '@testing-library/react'

import { FIXED_BOARD } from '../fixedBoard'
import { FixedBoardSelector } from './FixedBoardSelector'

const defaultProps = {
  onSelectCorner: vi.fn(),
  onCancelSelection: vi.fn(),
}

describe('FixedBoardSelector', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  test('renders the fixed drawing with only corner characters selectable', () => {
    const { container } = render(<FixedBoardSelector {...defaultProps} />)
    const expectedCorners = [...FIXED_BOARD].filter((character) => character === '+')

    expect(screen.getByRole('group', { name: 'Rectangle Hunt drawing' }))
      .toHaveAccessibleDescription(/Choose two opposite corners/)
    expect(screen.getAllByRole('button', { name: /Corner at row/ }))
      .toHaveLength(expectedCorners.length)
    expect(container.querySelectorAll('[data-board-cell]')).toHaveLength(5 * 7)
  })

  test('pointer activation reports the selected coordinate', () => {
    const onSelectCorner = vi.fn()
    render(
      <FixedBoardSelector
        {...defaultProps}
        onSelectCorner={onSelectCorner}
      />
    )

    fireEvent.click(screen.getByRole('button', {
      name: 'Corner at row 1, column 4',
    }))

    expect(onSelectCorner).toHaveBeenCalledWith({ row: 0, column: 3 })
  })

  test('uses native buttons for keyboard and pointer activation', () => {
    const onSelectCorner = vi.fn()
    render(
      <FixedBoardSelector
        {...defaultProps}
        onSelectCorner={onSelectCorner}
      />
    )
    const corner = screen.getByRole('button', {
      name: 'Corner at row 1, column 4',
    })

    fireEvent.keyDown(corner, { key: 'Enter' })
    expect(onSelectCorner).not.toHaveBeenCalled()

    fireEvent.click(corner)

    expect(corner.tagName).toBe('BUTTON')
    expect(onSelectCorner).toHaveBeenCalledTimes(1)
    expect(onSelectCorner).toHaveBeenCalledWith({ row: 0, column: 3 })
  })

  test('distinguishes the first corner from a focused candidate', () => {
    render(
      <FixedBoardSelector
        {...defaultProps}
        selectedCorner={{ row: 0, column: 3 }}
      />
    )
    const selected = screen.getByRole('button', { name: /row 1, column 4/ })
    const candidate = screen.getByRole('button', { name: 'Corner at row 1, column 7' })

    fireEvent.focus(candidate)

    expect(selected).toHaveAttribute('data-corner-state', 'selected')
    expect(selected).toHaveAccessibleName(/first corner selected/)
    expect(candidate).toHaveAttribute('data-corner-state', 'candidate')
    expect(candidate).toHaveAccessibleName(/candidate second corner/)
  })

  test('Escape cancels an incomplete selection', () => {
    const onCancelSelection = vi.fn()
    render(
      <FixedBoardSelector
        {...defaultProps}
        selectedCorner={{ row: 0, column: 3 }}
        onCancelSelection={onCancelSelection}
      />
    )
    const board = screen.getByRole('group', { name: 'Rectangle Hunt drawing' })

    fireEvent.keyDown(board, { key: 'Escape' })

    expect(onCancelSelection).toHaveBeenCalledTimes(1)
  })

  test('clears a candidate when that corner is activated', () => {
    render(
      <FixedBoardSelector
        {...defaultProps}
        selectedCorner={{ row: 0, column: 3 }}
      />
    )
    const candidate = screen.getByRole('button', {
      name: 'Corner at row 1, column 7',
    })

    fireEvent.pointerEnter(candidate)
    expect(candidate).toHaveAttribute('data-corner-state', 'candidate')

    fireEvent.click(candidate)
    expect(candidate).toHaveAttribute('data-corner-state', 'available')
  })

  test('renders board characters as text rather than markup', () => {
    const unsafeBoard = '<img src=x onerror=alert(1)>+'
    const { container } = render(
      <FixedBoardSelector {...defaultProps} board={unsafeBoard} />
    )

    expect(container).toHaveTextContent('<img src=x onerror=alert(1)>+')
    expect(container.querySelector('img')).not.toBeInTheDocument()
  })
})
