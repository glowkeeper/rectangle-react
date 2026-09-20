# Rectangles

Rectangles is evolving from a React exploration of the
[Exercism rectangles problem](https://exercism.org/tracks/javascript/exercises/rectangles)
into **Rectangle Hunt**, an untimed visual-search game about finding rectangles
hidden in fixed line drawings.

The current application offers a small curated puzzle library without revealing
rectangle totals. Players select opposite corners, build a set of discoveries,
and decide when to submit. Submission reveals the answer and allows found and
missed rectangles to be reviewed one at a time. Unfinished hunts can be resumed
from local browser storage. The rectangle engine and game-session rules remain
pure and independent of the React presentation.

## Development

```sh
npm ci
npm run dev
```

Run the automated checks and production build with:

```sh
npm test
npm run build
```

## Project documents

- [Product charter](PRODUCT_CHARTER.md)
- [Architecture](docs/architecture.md)
- [Project workflow](docs/project-workflow.md)
- [First-playable verification](docs/first-playable-verification.md)
- [Untimed journey verification](docs/untimed-journey-verification.md)
- [AI collaboration guide](AGENTS.md)
- [GitHub project board](https://github.com/users/glowkeeper/projects/28)

The board is the live delivery plan. Backlog records possibilities; Ready is
the explicit commitment gate; focused work proceeds through In progress and In
review before it can be Done.
