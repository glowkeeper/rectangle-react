# Rectangles product charter

## The game

**Rectangle Hunt** is a single-player visual-search game. Each puzzle presents
a fixed line drawing containing an unknown number of complete rectangles. The
player finds them by selecting two diagonally opposite corners.

A valid, previously undiscovered rectangle is recorded and highlighted. An
invalid corner pair is not recorded or punished. Selecting an already-found
rectangle does not count it twice. The player decides when to finish the hunt
and reveal the answer.

The total number of rectangles and whether the full set has been found remain
hidden during play. The player sees how many they have found, not how many
remain. Submitting the hunt reveals the final total. Players can review their
discoveries one at a time so that overlapping rectangles do not obscure the
drawing.

## Interaction principles

- The drawing remains fixed during play.
- Selecting corners is the primary player action.
- Every valid rectangle is determined by the same rules as the rectangle
  engine.
- Candidate, newly found, previously found, and focused rectangles must be
  distinguishable without relying on colour alone.
- Pointer, touch, and keyboard interaction must provide equivalent ways to
  select corners and review discoveries.
- Feedback should make a selection understandable without revealing rectangles
  the player has not found.

## Character

The game should preserve the clarity and personality of its drawn-line origins.
Shared edges, junctions, nesting, and overlap create the visual surprise and
the challenge. Presentation should keep the drawing legible while making each
discovery feel direct and satisfying.

## Decision rule

Prefer the option that makes searching the drawing, selecting a rectangle, or
understanding a discovery clearer. Features that do not support that loop need
separate product agreement.
