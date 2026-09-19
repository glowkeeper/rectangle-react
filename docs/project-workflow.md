# Project workflow

## Purpose

Rectangles is developed through the
[GitHub project board](https://github.com/users/glowkeeper/projects/28). The
board is the working plan, not a retrospective status display.

> The board drives the work, the documents constrain it, and pull requests
> prove what was delivered.

## Sources of truth

1. Product documents define the player promise and technical boundaries.
2. GitHub issues define agreed units of work and their acceptance criteria.
3. The project board records live status, priority, size, relationships, and
   linked pull requests.

Conversation may settle a decision, but a decision that constrains later work
must be recorded in an issue or project document.

## Statuses and commitment

### Backlog

Captured but not committed. Backlog work may be speculative, incomplete, or
dependent on a decision. It is appropriate to refine its goal, acceptance
criteria, relationships, priority, and size.

### Ready

Agreed and executable. Ready is the queue from which work may be selected. A
Ready issue has a clear outcome, testable acceptance criteria, known
dependencies, appropriate priority and size, and no unresolved decision that
could materially reshape it.

Moving consequential work from Backlog to Ready is the project's main product
approval gate. The maintainer makes that commitment.

### In progress

Focused implementation has begun on a branch. Keep work in progress to one
issue by default. If the issue proves materially larger or different than
agreed, stop and update it before expanding the implementation.

### In review

A pull request is available and the work is being checked against its criteria.
Automated checks, browser verification, review findings, and documentation
reconciliation belong here.

### Done

The work is merged to `main`, relevant checks and acceptance criteria pass,
documentation is accurate, and the issue is closed.

## Priority and size

Priority communicates impact, not automatic sequence:

| Priority | Meaning |
| --- | --- |
| P0 | Broken, unsafe, or unable to ship; use rarely. |
| P1 | Required for the current agreed playable or release outcome. |
| P2 | Worthwhile but not required for the current outcome. |

Size communicates scope and uncertainty:

| Size | Meaning |
| --- | --- |
| XS | Tiny isolated change. |
| S | Small focused change. |
| M | Normal issue-sized work. |
| L | Large enough that decomposition should be considered. |
| XL | Parent outcome, normally not implemented by one pull request. |

Leave estimates and dates empty unless they answer a real planning question.

## Issue taxonomy

### Parent outcomes

A parent issue defines a meaningful player or project outcome and why it
matters. It has at least two independent child deliverables, parent-level
acceptance criteria, size XL, and no GitHub parent of its own. It normally stays
open until the whole outcome is accepted.

### Child deliverables

A child issue makes one coherent, independently reviewable contribution to a
parent. It has exactly one GitHub parent, distinct acceptance criteria and
verification, size XS to L, and normally one focused pull request.

Before creating a child, ask whether it can be completed and reviewed without
every sibling, leaves the repository coherent, and has distinct acceptance
criteria. Children do not have children; promote one to a parent if it truly
needs independent decomposition.

### Acceptance criteria

An acceptance criterion is inseparable evidence of an issue's completion. It
does not become another issue merely to create an additional board card.

### Standalone changes

A standalone issue is a genuine one-off that does not naturally contribute to
an existing parent outcome. It must be independently deliverable and sized XS
to L. It is an exception, not a shortcut around product structure.

## Issue content

An implementation issue should include:

- **Goal:** the outcome in one or two sentences;
- **Background:** why it matters and relevant constraints;
- **Acceptance criteria:** observable completion conditions;
- **Verification:** evidence proportionate to the change;
- **Dependencies:** blocking issues or decisions, or `None`.

Use comments for discoveries and decisions that affect agreed work, not as a
transcript of routine implementation.

## Branches and pull requests

Work reaches `main` through a focused branch and pull request. Branches begin
from `main`; there is no permanent `develop` branch.

| Prefix | Use |
| --- | --- |
| `feature/` | New player-facing or project capability. |
| `fix/` | Correction to existing behaviour. |
| `hotfix/` | Urgent production correction. |
| `release/` | Release preparation with no new product scope. |
| `docs/` | Documentation-only work. |
| `chore/` | Tooling, maintenance, or project administration. |

Include the issue number and a short description, for example
`feature/12-interactive-board` or `chore/1-project-delivery-framework`.

A pull request should link its issue, explain purpose and trade-offs, map to the
acceptance criteria, report verification, record material decisions, update
affected documents, and avoid unrelated changes.

## Verification

Verification should match the risk:

- pure game rules: focused automated tests;
- configuration: validation and production build;
- interaction: rendered keyboard and pointer or touch checks;
- accessibility: evidence from the rendered interface;
- game feel and clarity: human review.

Report what was checked and what was not. Do not turn one kind of evidence into
a stronger claim than it supports.

## Working rhythm

When managing or continuing the project:

1. inspect the board and repository state;
2. choose only valid Ready work;
3. respect dependencies, priority, and current WIP;
4. state which issue is being selected and why;
5. move it to In progress when branch work begins;
6. implement against its acceptance criteria;
7. surface scope changes early;
8. move it to In review when a PR is ready;
9. reconcile code, documentation, and board state;
10. mark Done only after merge and closure.

Process exists to make product decisions and delivery legible. Add automation
only when a recurring failure demonstrates what it needs to prevent.
