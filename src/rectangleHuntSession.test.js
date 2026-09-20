import {
  cancelSelection,
  createRectangleHuntSession,
  focusNextRectangle,
  focusPreviousRectangle,
  getPlayState,
  rectangleCoordinatesKey,
  rectangleKey,
  restartSession,
  selectCorner,
  submitSession,
} from './rectangleHuntSession'

const ONE_RECTANGLE = '+-+\n| |\n+-+'
const TWO_RECTANGLES = '+-+ +-+\n| | | |\n+-+ +-+'

const choose = (session, firstCorner, secondCorner) => {
  return selectCorner(selectCorner(session, firstCorner), secondCorner)
}

describe('rectangleKey', () => {
  test('is stable regardless of selection order', () => {
    const topLeft = { row: 1, column: 2 }
    const bottomRight = { row: 4, column: 7 }

    expect(rectangleKey(topLeft, bottomRight)).toBe('1,2:4,7')
    expect(rectangleKey(bottomRight, topLeft)).toBe('1,2:4,7')
  })

  test('rejects malformed coordinates', () => {
    expect(() => rectangleKey({ row: 0, column: 0 }, { row: 1.5, column: 2 }))
      .toThrow('A corner must have integer row and column coordinates.')
  })

  test('uses the same identity for solver rectangles and selected corners', () => {
    const rectangle = { top: 1, left: 2, bottom: 4, right: 7 }

    expect(rectangleCoordinatesKey(rectangle)).toBe(rectangleKey(
      { row: 1, column: 2 },
      { row: 4, column: 7 }
    ))
  })
})

describe('Rectangle Hunt selection', () => {
  test('an eligible first corner begins a candidate selection', () => {
    const session = selectCorner(
      createRectangleHuntSession(ONE_RECTANGLE),
      { row: 0, column: 0 }
    )

    expect(getPlayState(session)).toMatchObject({
      foundCount: 0,
      selectedCorner: { row: 0, column: 0 },
      selectionResult: {
        type: 'selection-started',
        corner: { row: 0, column: 0 },
      },
    })
  })

  test('an ineligible position does not begin a selection', () => {
    const session = selectCorner(
      createRectangleHuntSession(ONE_RECTANGLE),
      { row: 0, column: 1 }
    )

    expect(getPlayState(session)).toMatchObject({
      foundCount: 0,
      selectedCorner: null,
      selectionResult: { type: 'ineligible-corner' },
    })
  })

  test('a valid pair records and focuses the rectangle', () => {
    const session = choose(
      createRectangleHuntSession(TWO_RECTANGLES),
      { row: 0, column: 0 },
      { row: 2, column: 2 }
    )

    expect(getPlayState(session)).toMatchObject({
      status: 'playing',
      foundCount: 1,
      selectedCorner: null,
      focusedRectangle: { top: 0, left: 0, bottom: 2, right: 2 },
      foundRectangles: [{ top: 0, left: 0, bottom: 2, right: 2 }],
      selectionResult: { type: 'found' },
    })
  })

  test('an invalid pair clears the candidate without altering discoveries', () => {
    const foundSession = choose(
      createRectangleHuntSession(TWO_RECTANGLES),
      { row: 0, column: 0 },
      { row: 2, column: 2 }
    )
    const session = choose(
      foundSession,
      { row: 0, column: 0 },
      { row: 0, column: 2 }
    )

    expect(getPlayState(session)).toMatchObject({
      foundCount: 1,
      selectedCorner: null,
      selectionResult: { type: 'invalid' },
    })
  })

  test('a duplicate does not increment the count and focuses the discovery', () => {
    const firstFind = choose(
      createRectangleHuntSession(TWO_RECTANGLES),
      { row: 0, column: 0 },
      { row: 2, column: 2 }
    )
    const duplicate = choose(
      firstFind,
      { row: 2, column: 2 },
      { row: 0, column: 0 }
    )

    expect(getPlayState(duplicate)).toMatchObject({
      foundCount: 1,
      focusedRectangle: { top: 0, left: 0, bottom: 2, right: 2 },
      selectionResult: { type: 'duplicate' },
    })
  })

  test('public selection results cannot mutate session state', () => {
    const selecting = selectCorner(
      createRectangleHuntSession(ONE_RECTANGLE),
      { row: 0, column: 0 }
    )
    const publicState = getPlayState(selecting)

    publicState.selectionResult.corner.row = 99

    expect(getPlayState(selecting)).toMatchObject({
      selectedCorner: { row: 0, column: 0 },
      selectionResult: {
        type: 'selection-started',
        corner: { row: 0, column: 0 },
      },
    })

    const invalid = selectCorner(selecting, { row: 0, column: 2 })
    const invalidPublicState = getPlayState(invalid)

    invalidPublicState.selectionResult.corners[0].column = 99

    expect(getPlayState(invalid).selectionResult.corners[0]).toEqual({
      row: 0,
      column: 0,
    })

    const found = selectCorner(selecting, { row: 2, column: 2 })
    const foundPublicState = getPlayState(found)

    foundPublicState.selectionResult.rectangle.bottom = 99

    expect(getPlayState(found).selectionResult.rectangle).toEqual({
      top: 0,
      left: 0,
      bottom: 2,
      right: 2,
    })
  })
})

describe('Rectangle Hunt lifecycle', () => {
  test('the total remains hidden after every rectangle has been found', () => {
    const startState = getPlayState(createRectangleHuntSession(ONE_RECTANGLE))

    expect(startState).toMatchObject({ status: 'playing', foundCount: 0 })
    expect(startState).not.toHaveProperty('total')

    const allFoundSession = choose(
      createRectangleHuntSession(ONE_RECTANGLE),
      { row: 0, column: 0 },
      { row: 2, column: 2 }
    )

    expect(getPlayState(allFoundSession)).toMatchObject({
      status: 'playing',
      foundCount: 1,
    })
    expect(getPlayState(allFoundSession)).not.toHaveProperty('total')
  })

  test('submission reveals and freezes an incomplete result', () => {
    const firstFind = choose(
      createRectangleHuntSession(TWO_RECTANGLES),
      { row: 0, column: 0 },
      { row: 2, column: 2 }
    )
    const submitted = submitSession(firstFind)
    const attemptedFind = choose(submitted, { row: 0, column: 4 }, { row: 2, column: 6 })

    expect(getPlayState(firstFind)).not.toHaveProperty('total')
    expect(getPlayState(submitted)).toMatchObject({
      status: 'submitted',
      foundCount: 1,
      total: 2,
      foundRectangles: [{ top: 0, left: 0, bottom: 2, right: 2 }],
      missedRectangles: [{ top: 0, left: 4, bottom: 2, right: 6 }],
    })
    expect(attemptedFind).toBe(submitted)
  })

  test('submission reveals an all-found result without signalling it beforehand', () => {
    const firstFind = choose(
      createRectangleHuntSession(TWO_RECTANGLES),
      { row: 0, column: 0 },
      { row: 2, column: 2 }
    )
    const allFound = choose(firstFind, { row: 0, column: 4 }, { row: 2, column: 6 })

    expect(getPlayState(allFound)).toMatchObject({ status: 'playing', foundCount: 2 })
    expect(getPlayState(allFound)).not.toHaveProperty('total')

    expect(getPlayState(submitSession(allFound))).toMatchObject({
      status: 'submitted',
      foundCount: 2,
      total: 2,
      missedRectangles: [],
    })
  })

  test('submitting is idempotent', () => {
    const submitted = submitSession(createRectangleHuntSession(ONE_RECTANGLE))

    expect(submitSession(submitted)).toBe(submitted)
  })

  test('public submitted results cannot mutate session state', () => {
    const submitted = submitSession(createRectangleHuntSession(ONE_RECTANGLE))
    const publicState = getPlayState(submitted)

    publicState.missedRectangles[0].bottom = 99

    expect(getPlayState(submitted).missedRectangles).toEqual([
      { top: 0, left: 0, bottom: 2, right: 2 },
    ])
  })

  test('cancelling clears an incomplete selection and preserves progress', () => {
    const foundSession = choose(
      createRectangleHuntSession(TWO_RECTANGLES),
      { row: 0, column: 0 },
      { row: 2, column: 2 }
    )
    const selecting = selectCorner(foundSession, { row: 0, column: 2 })
    const cancelled = cancelSelection(selecting)

    expect(getPlayState(cancelled)).toMatchObject({
      foundCount: 1,
      selectedCorner: null,
      selectionResult: { type: 'cancelled' },
    })
    expect(cancelSelection(cancelled)).toBe(cancelled)
  })

  test('restarting returns the same board to its initial play state', () => {
    const submitted = submitSession(choose(
      createRectangleHuntSession(ONE_RECTANGLE),
      { row: 0, column: 0 },
      { row: 2, column: 2 }
    ))
    const restarted = restartSession(submitted)

    expect(getPlayState(restarted)).toEqual({
      status: 'playing',
      foundCount: 0,
      selectedCorner: null,
      focusedRectangle: null,
      foundRectangles: [],
      selectionResult: null,
    })
  })

  test('moves backward and forward through found rectangles', () => {
    const firstFind = choose(
      createRectangleHuntSession(TWO_RECTANGLES),
      { row: 0, column: 0 },
      { row: 2, column: 2 }
    )
    const secondFind = choose(
      firstFind,
      { row: 0, column: 4 },
      { row: 2, column: 6 }
    )
    const previous = focusPreviousRectangle(secondFind)
    const next = focusNextRectangle(previous)

    expect(getPlayState(previous)).toMatchObject({
      focusedRectangle: { top: 0, left: 0, bottom: 2, right: 2 },
      selectionResult: { type: 'review' },
    })
    expect(getPlayState(next)).toMatchObject({
      focusedRectangle: { top: 0, left: 4, bottom: 2, right: 6 },
      selectionResult: { type: 'review' },
    })
    expect(getPlayState(focusPreviousRectangle(previous)).focusedRectangle)
      .toEqual({ top: 0, left: 4, bottom: 2, right: 6 })
    expect(getPlayState(focusNextRectangle(next)).focusedRectangle)
      .toEqual({ top: 0, left: 0, bottom: 2, right: 2 })
  })

  test('a board without rectangles remains playing until submitted', () => {
    expect(getPlayState(createRectangleHuntSession('+'))).toMatchObject({
      status: 'playing',
      foundCount: 0,
    })
    expect(getPlayState(createRectangleHuntSession('+'))).not.toHaveProperty('total')

    expect(getPlayState(submitSession(createRectangleHuntSession('+')))).toMatchObject({
      status: 'submitted',
      foundCount: 0,
      total: 0,
      missedRectangles: [],
    })
  })
})
