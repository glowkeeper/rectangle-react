# Rectangles

Rectangles is evolving from a React exploration of the
[Exercism rectangles problem](https://exercism.org/tracks/javascript/exercises/rectangles)
into **Rectangle Hunt**, a visual-search game about finding every rectangle
hidden in a fixed line drawing.

The current application presents one fixed drawing without revealing its
rectangle total. Players select opposite corners, build a set of discoveries,
review overlapping rectangles one at a time, and complete the hunt when every
solver-produced rectangle has been found. Its rectangle engine and game-session
rules remain pure and independent of the React presentation.

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
- [AI collaboration guide](AGENTS.md)
- [GitHub project board](https://github.com/users/glowkeeper/projects/28)

The board is the live delivery plan. Backlog records possibilities; Ready is
the explicit commitment gate; focused work proceeds through In progress and In
review before it can be Done.
