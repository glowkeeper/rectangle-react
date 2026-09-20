# Untimed journey verification

## Scope

This record verifies the complete interruptible, submit-and-reveal Rectangle
Hunt journey delivered by issues
[#18](https://github.com/glowkeeper/rectangle-react/issues/18),
[#19](https://github.com/glowkeeper/rectangle-react/issues/19),
[#16](https://github.com/glowkeeper/rectangle-react/issues/16),
[#21](https://github.com/glowkeeper/rectangle-react/issues/21), and
[#20](https://github.com/glowkeeper/rectangle-react/issues/20). It is the
release gate for issue
[#17](https://github.com/glowkeeper/rectangle-react/issues/17).

Verification was performed on 20 September 2026 in the Codex in-app Chromium
browser against the issue branch based on merge commit `28792e9`.

## Automated verification

The following commands passed:

```text
npm test -- --run
npm run build
git diff --check
```

The suite exercises every curated puzzle as both an all-found and incomplete
submission. After every discovery—including the final one—the feedback and
available controls remain identical and no result review appears. Only explicit
submission exposes the total. The suite also covers found/missed review,
per-puzzle status, interruption and restoration, restart, corrupt storage,
pointer activation, native keyboard-operable controls, Escape cancellation,
accessible names, live feedback, solver regression, safety, and performance.

## Rendered-browser matrix

| Journey | Viewport | Input | Result |
| --- | --- | --- | --- |
| Library selection and Easy submission | Desktop | Pointer | Pass |
| Medium complete hunt and result review | Desktop | Keyboard | Pass |
| Hard incomplete hunt and missed review | 390 × 844 CSS pixels | Pointer/touch-equivalent | Pass |
| Interrupted hunt, refresh, library return, and resume | Desktop and phone | Pointer | Pass |

The phone-width library stacks its cards in one column. Puzzle headings,
drawing, feedback, review, and actions stay within the page width; wide drawing
content has its own deliberate horizontal scroll boundary rather than causing
page overflow.

## Accessibility and legibility

- Puzzle choices, corner cells, review controls, submission, restart, and
  library return are native buttons with visible keyboard focus.
- Difficulty and status are expressed as text; no total is present in library
  cards or pre-submission feedback.
- Selected and candidate corners use solid and dashed structures.
- Earlier, focused-found, and focused-missed rectangles use dotted, double, and
  dashed outlines plus text labels, so colour is not the sole distinction.
- Selection feedback, found count, result summary, and review position have
  named status semantics.
- Only one result is prominently focused at a time on the nested and dense
  puzzles, keeping overlaps readable.

## Human play-through observations

The three-puzzle sequence produces a clear difficulty progression. First Steps
teaches the corner gesture with separated shapes. Shared Paths introduces
nesting and shared edges without visual overload. Woven Grid makes the stopping
decision genuinely uncertain through repeated shared rows, columns, and scales.

The lack of automatic completion, timing, lives, streaks, and score pressure
makes interruption feel harmless. Returning to an in-progress label and the
restored drawing is understandable without explanation. The explicit Finish
hunt confirmation makes the stopping decision feel deliberate, while the
one-at-a-time found/missed review explains the answer without turning the board
into visual clutter.
