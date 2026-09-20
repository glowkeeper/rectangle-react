# First-playable verification

## Scope

This record verifies the single-drawing Rectangle Hunt delivered by issues
[#4](https://github.com/glowkeeper/rectangle-react/issues/4),
[#6](https://github.com/glowkeeper/rectangle-react/issues/6), and
[#7](https://github.com/glowkeeper/rectangle-react/issues/7). It is the release
gate for issue [#5](https://github.com/glowkeeper/rectangle-react/issues/5).

Verification was performed on 20 September 2026 against `main` at merge commit
`10ec433` in the Codex in-app Chromium browser.

## Automated verification

The following commands passed:

```text
npm test
npm run build
```

The test run covered 61 tests across six files, including solver correctness,
board limits and performance, session transitions, accessible corner selection,
discovery highlighting, review navigation, completion, and restart.

The production build completed with 31 transformed modules. The browser console
reported no warnings or errors during the rendered verification.

## Rendered-browser verification

### Pointer input

The complete six-rectangle game was finished using pointer activation. Each new
rectangle changed the found count, became the focused discovery, and left prior
discoveries visible. Invalid and duplicate selections left the found count
unchanged and produced the expected textual feedback. Completion appeared only
after the sixth solver-produced rectangle and revealed the total.

### Keyboard input

The complete game was also finished using native button activation with Enter.
Forward Tab order reached the navigation, Restart control, every board corner,
and discovery review controls in a coherent sequence. Escape cancelled an
incomplete selection. Previous and Next moved through discoveries without
dropping focus, and visible focus remained clear at the board edges.

### Phone-sized touch viewport

The interaction was checked at an explicit 390 × 844 CSS-pixel viewport. The
fixed drawing, corner controls, feedback, review controls, and completion panel
fit without horizontal clipping. The game was completed at this viewport using
pointer activation as the browser equivalent of touch activation. Corner and
review controls remained comfortably targetable and the complete set of
overlapping highlights remained legible.

## Accessibility and legibility

- The selected first corner uses a solid enclosure.
- The candidate second corner uses a dashed enclosure alongside visible focus.
- Earlier discoveries use dotted outlines.
- The focused discovery uses a double outline and a striped pattern.
- Found count, selection results, invalid and duplicate feedback, review
  position, completion, and final total are communicated in text.
- Game feedback and discovery position use separately named live regions.
- The total is absent from the rendered interface before completion.
- Board characters remain readable through a full six-discovery session.

These distinctions remain understandable without relying on colour alone.

## Human play-through

The instructions were sufficient to begin without outside explanation: choose
two opposite corners, use Tab to move, and use Escape to cancel. Discoveries felt
immediate because the count, focused outline, and status message changed
together. Reviewing one rectangle at a time kept the most heavily overlapping
state understandable, and the hidden total preserved uncertainty until the
completion reveal.

No release-blocking defects or non-blocking follow-up observations remained at
the end of this pass.
