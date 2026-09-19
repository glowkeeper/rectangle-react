# Architecture

## Purpose

Rectangles is currently a static React application that accepts an ASCII board,
finds every valid rectangle, and lets the player inspect results. This document
records the technical foundation that future game work should preserve unless
an issue explicitly changes it.

## Runtime boundary

The application is built with React and Vite and is deployable as static files.
Ordinary play is local-first and requires no account, API, database, or server.
Browser storage may later preserve local progress when an agreed issue defines
the data and lifecycle.

Adding a backend, remote persistence, telemetry, user accounts, or public
content changes the product's privacy and operational model and requires an
explicit architecture decision.

## Rectangle engine

`src/getSolution.js` is the domain boundary for rectangle detection.

- Input is text plus the selected corner character.
- Output is rectangle coordinates: `{ top, left, bottom, right }`.
- The engine returns data, never HTML or React elements.
- Horizontal and vertical runs are labelled once, after which compatible sides
  are combined in `O(rows² × columns + rectangles)` time.
- Board and result limits protect the browser from pathological input.

The engine must remain deterministic and independently testable. UI state,
animation, persistence, scoring, and level progression do not belong in it.

## Application layers

The intended separation is:

```text
level or workshop input
        ↓
pure board and objective rules
        ↓
session state and player actions
        ↓
React presentation and feedback
```

The current `Artwork` component owns the editable draft and last submitted
result. `Solution` renders one board and navigates detected rectangles. Game
work may replace this small arrangement with an explicit session model, but it
should not put rules into React components.

## Level data

The level contract has not yet been agreed. When defined, it should be plain,
versionable data with stable identifiers and explicit objectives. Level rules
must be testable without rendering the interface. Saved progress should refer
to stable level identifiers rather than array positions.

## Rendering and safety

User-authored board text is rendered through React text nodes. Do not construct
HTML from board content or introduce `dangerouslySetInnerHTML`. Rectangle
coordinates select presentation; they do not rewrite the source board.

Colour may reinforce state but must not be its only signal. Interactive cells
and controls must retain keyboard semantics and visible focus.

## Performance boundaries

The current limits are defined with the solver and covered by tests. Changes to
board dimensions, maximum rectangle count, or result representation require
performance evidence and corresponding test updates. The result view renders
one board rather than one complete board per rectangle.

## Testing and verification

- Canonical and regression tests protect rectangle rules.
- Performance tests protect agreed solver limits.
- Component tests protect safe rendering and interaction state.
- Production builds verify the deployable application.
- Layout, keyboard, touch, accessibility, and game feel require rendered
  browser verification proportionate to the issue.

## Explicitly unsettled

The following need their own agreed issues before implementation:

- the precise player interaction for editing cells;
- the level and objective schema;
- progression, scoring, hints, and persistence;
- visual and audio identity;
- authored versus generated content boundaries;
- hosting and release arrangements beyond the existing static deployment.
