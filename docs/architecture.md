# Architecture

## Purpose

Rectangles is a React and Vite application built around a pure rectangle
engine. The target game presents a fixed board and lets the player find every
rectangle by selecting opposite corners.

## Runtime boundary

Ordinary play is local-first, static-hostable, and account-free. The game must
not require an API, database, backend, or remote service to function. Changing
that boundary requires an explicit architectural decision.

## Rectangle engine

`src/getSolution.js` is the rules boundary.

- Input is board text plus the selected corner character.
- Output is rectangle coordinates: `{ top, left, bottom, right }`.
- The engine returns data, never HTML or React elements.
- Horizontal and vertical runs are labelled once; compatible sides are then
  combined in `O(rows² × columns + rectangles)` time.
- Board and result limits protect the browser from pathological input.

The engine is deterministic and independently testable. React presentation and
player-session state do not belong in it.

## Game state

The Rectangle Hunt session needs:

- the fixed board;
- the complete rectangle set produced by the engine;
- the set of rectangles found by the player;
- an optional first selected corner;
- an optional focused rectangle for reviewing discoveries;
- an explicit submitted result that freezes the player's discoveries.

A rectangle is identified by its four coordinates. Found rectangles are stored
as a set so the same rectangle cannot be counted twice. Solver completeness is
kept internal and never changes the player-visible state during play. Only the
player's explicit submission freezes the result and exposes the final total.

The intended separation is:

```text
fixed board
    ↓
pure rectangle engine
    ↓
Rectangle Hunt session state
    ↓
React board, selection, highlight, and feedback
```

## Selection

The player selects two diagonally opposite corners. The session normalises
their order into `{ top, left, bottom, right }` and checks that coordinate key
against the engine result set.

A valid new key is added to the found set. An existing key focuses that
rectangle without adding it again. An invalid key produces temporary feedback
without changing the found set. Input adapters for pointer, touch, and keyboard
must invoke the same selection action.

## Rendering and safety

Board text is rendered through React text nodes. Do not construct HTML from
board content or introduce `dangerouslySetInnerHTML`. Coordinates control
presentation without rewriting the board.

The fixed drawing must remain legible as rectangles overlap. Candidate, newest,
previously found, and focused states need structural or textual distinctions in
addition to colour. Interactive corners and controls need visible focus and
meaningful accessible names.

## Performance boundaries

The solver limits and performance tests remain the computational boundary. The
interface renders one board, not one complete board per rectangle. Adding a
rectangle to the found set and producing a submitted result should use
coordinate keys rather than repeatedly searching coordinate objects.

## Verification

- Canonical and regression tests protect rectangle detection.
- Session tests should cover valid, invalid, duplicate, all-found, and submitted
  states without leaking solution completeness during play.
- Component tests should cover safe rendering and selection feedback.
- Browser checks should exercise corner selection and discovery review with
  pointer, touch-sized controls, and keyboard.
- Accessibility review should confirm visible focus, understandable status
  updates, and colour-independent state.
