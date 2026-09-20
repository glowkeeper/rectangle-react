export const PUZZLES = [
  {
    id: 'first-steps-v1',
    title: 'First Steps',
    difficulty: 'Easy',
    board: '+--+\n|  |\n+--+\n    \n+--+\n|  |\n+--+',
    cornerCharacter: '+',
    designIntent: 'Two separated shapes introduce opposite-corner selection.',
  },
  {
    id: 'fixed-board-v1',
    title: 'Shared Paths',
    difficulty: 'Medium',
    board: '   +--+\n  ++  |\n+-++--+\n|  |  |\n+--+--+',
    cornerCharacter: '+',
    designIntent: 'Nested shapes and shared edges reward careful visual tracing.',
  },
  {
    id: 'woven-grid-v1',
    title: 'Woven Grid',
    difficulty: 'Hard',
    board: '+-+-+-+\n| | | |\n+-+-+-+\n| | | |\n+-+-+-+',
    cornerCharacter: '+',
    designIntent: 'Dense shared rows and columns create many overlapping scales.',
  },
]

export const DEFAULT_PUZZLE = PUZZLES[1]
