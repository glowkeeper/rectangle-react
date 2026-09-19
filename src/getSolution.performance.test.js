import { performance } from 'node:perf_hooks'

import { findRectangles } from './getSolution'

const expectToFinishWithin = (milliseconds, operation) => {
  const startedAt = performance.now()
  const result = operation()
  const duration = performance.now() - startedAt

  expect(duration).toBeLessThan(milliseconds)
  return result
}

describe('findRectangles performance', () => {
  test('scans a maximum-area sparse board within one second', () => {
    const board = Array(25).fill(' '.repeat(120)).join('\n')
    const rectangles = expectToFinishWithin(1000, () => findRectangles(board))

    expect(rectangles).toEqual([])
  })

  test('finds 8,281 rectangles on a dense board within one second', () => {
    const board = Array(14).fill('+'.repeat(14)).join('\n')
    const rectangles = expectToFinishWithin(1000, () => findRectangles(board))

    expect(rectangles).toHaveLength(8281)
  })
})
