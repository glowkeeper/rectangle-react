# AI collaboration guide

These instructions apply to every AI coding assistant working in this repository.

## Read before acting

Before changing product behaviour, architecture, or project process, read:

- `PRODUCT_CHARTER.md` for the player promise and creative constraints;
- `docs/architecture.md` for technical direction and explicit boundaries;
- `docs/project-workflow.md` for issue, board, branch, and review practice;
- the issue being implemented, including its acceptance criteria and comments.

If these authorities disagree, stop and surface the conflict rather than choosing
one silently.

## Collaboration style

- Treat the maintainer as the product authority and a collaborator.
- Explain purpose and important trade-offs in plain language.
- Prefer small, inspectable steps over speculative expansion.
- Ask before making a material product, architecture, privacy, licensing, or
  operational decision not already settled in the project record.
- Record decisions that constrain later work in an issue or project document.

## Board-driven work

The [Rectangles project board](https://github.com/users/glowkeeper/projects/28)
drives delivery.

- **Backlog** means captured, not committed.
- **Ready** means agreed and executable.
- **In progress** means focused implementation has begun.
- **In review** means a pull request is being verified and reviewed.
- **Done** means merged, verified, documented, closed, and delivered.

When asked to select or continue project work:

1. inspect the board and repository state;
2. select autonomously only from Ready;
3. respect priority, dependencies, and existing work in progress;
4. state which issue is being selected and why;
5. keep the issue and board status accurate;
6. work against the issue's acceptance criteria;
7. report what completion unblocks.

Keep work in progress to one issue by default. Do not move consequential work
from Backlog to Ready without an explicit maintainer decision.

Follow the issue taxonomy in `docs/project-workflow.md`: parent outcomes define
meaningful results, child issues are independently deliverable contributions,
and standalone issues are genuine one-offs. Children do not have children.

## Implementation boundaries

- Keep rectangle detection pure and independent of React, browser APIs, and
  presentation.
- Keep ordinary play local-first, static-hostable, and account-free. Do not
  introduce a required backend or remote service without an agreed
  architectural change.
- Build the agreed Rectangle Hunt loop: a fixed board, opposite-corner
  selection, recorded discoveries, a hidden total, and completion when every
  rectangle has been found.
- Keep player-session rules separate from React components.
- Use one coordinate identity for solver results, found rectangles, duplicate
  detection, review, and completion.
- Do not reveal unfound rectangles or the final total during play.
- Provide equivalent pointer, touch, and keyboard selection.
- Do not rely on colour alone to communicate rectangle state.
- Prefer clear data and explicit state transitions over clever abstractions.

## Branches and pull requests

- Do not push implementation work directly to `main`.
- Use a focused branch and pull request for agreed work.
- After implementing and verifying a change, stop and present it to the
  maintainer. Do not commit, push, or open a pull request until explicitly asked.
- Follow the branch convention in `docs/project-workflow.md`, including the
  issue number and a short kebab-case description.
- Link the pull request to its issue and keep unrelated work out of the change.

## Verification

Use evidence proportionate to the change:

- pure rules require focused automated tests;
- build and configuration changes require the relevant validation and build;
- interaction changes require browser checks with keyboard and pointer or touch;
- accessibility claims require inspection of the rendered interface;
- game feel and clarity require human review.

Report what was actually verified. Do not present source inspection as browser
evidence or automated interaction as human acceptance.

## Definition of done

Work is Done only when it is merged into `main`, relevant checks pass,
acceptance criteria are satisfied, affected documentation is accurate, and the
issue is closed. Cancelled work may be closed but must not be represented as
delivered.
