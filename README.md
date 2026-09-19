# Rectangles

Rectangles is evolving from a React exploration of the
[Exercism rectangles problem](https://exercism.org/tracks/javascript/exercises/rectangles)
into a tactile puzzle game about the surprising consequences of simple
drawn lines.

The current application accepts an ASCII board, identifies every complete
rectangle, and lets the player inspect them individually. Its rectangle engine
is pure, tested against the canonical Exercism cases, and independent of the
React presentation.

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
- [AI collaboration guide](AGENTS.md)
- [GitHub project board](https://github.com/users/glowkeeper/projects/28)

The board is the live delivery plan. Backlog records possibilities; Ready is
the explicit commitment gate; focused work proceeds through In progress and In
review before it can be Done.
