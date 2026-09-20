import { UIText } from '../config'

export const About = () => {
    return (
        <article className="about-page">
            <h2>{UIText.appTitleAbout}</h2>
            <p>
                Rectangle Hunt is a visual-search game hidden inside a line drawing.
                Find every rectangle by choosing two diagonally opposite corners.
            </p>
            <p>
                Each new discovery is highlighted and added to the review controls.
                You decide when to finish, and the total stays secret until you
                submit, so the drawing remains a puzzle rather than a checklist.
            </p>
            <p>
                The library ranges from gentle separated shapes to dense shared
                edges. Puzzle progress stays in this browser, and the game does not
                require an account. It grew from the rectangle-finding problem on{' '}
                <a href="https://exercism.org/tracks/javascript/exercises/rectangles/">
                    Exercism
                </a>
                .
            </p>
            <p>
                Rectangle Hunt is{' '}
                <a href="https://github.com/glowkeeper/rectangle-react">
                    open source on GitHub
                </a>.
            </p>
        </article>
    )
}
