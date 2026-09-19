# Rectangles product charter

## Player promise

Rectangles turns the surprising combinatorics of simple drawn lines into a
tactile puzzle game. A small mark should be capable of producing a large
and satisfying change in the board.

The game should make players feel observant and inventive. Its rules must be
easy to inspect, while strong puzzles reveal consequences that are not obvious
at first glance.

## Character

The visual language begins with the project's ASCII origins: corners, lines,
grids, restrained colour, and precise construction. It may become more tactile
and polished, but it should retain the clarity and personality of drawn text
rather than becoming a generic block puzzle.

The intended tone is:

- thoughtful rather than frantic;
- playful rather than childish;
- concise rather than noisy;
- satisfying rather than punitive;
- legible before decorative.

## Product principles

1. **One edit can have many consequences.** Shared edges, nested shapes, and
   overlapping rectangles are the heart of the game.
2. **The board explains itself.** Players should be able to see what counts,
   what changed, and why an objective succeeded or failed.
3. **Reasoning is the main activity.** Time pressure may become an optional
   mode, but it is not the default measure of success.
4. **Creation remains available.** Authored levels should coexist with a
   workshop where players can explore and paste text boards.
5. **Accessibility is part of the interaction.** Pointer, touch, keyboard,
   colour-independent feedback, and readable text are product requirements.
6. **Progress earns complexity.** New constraints should be introduced through
   play, not through dense instructions.

## Initial direction

The first intended playable outcome is a single-player exact-count puzzle:
edit a small grid so that it contains a target number of valid rectangles.
Curated levels should teach corners, complete sides, shared edges, nesting, and
combinatorial effects. The existing freeform rectangle explorer is a useful
foundation for a later workshop mode.

This direction is not automatically a commitment to every possible mode. New
objectives, daily puzzles, sharing, procedural generation, and competitive play
belong in Backlog until separately agreed.

## Current non-goals

- Accounts, profiles, or cloud saves
- Social feeds, global rankings, or competitive multiplayer
- Advertising or engagement mechanics
- A server dependency for ordinary play
- Large user-generated-content infrastructure
- Photorealistic or visually noisy presentation

## Decision rule

When two options are otherwise credible, prefer the one that makes the
rectangle consequence clearer, the player action more direct, and the product
more distinctively itself.
