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
                The total stays secret until you have found them all, so the drawing
                remains a puzzle rather than a checklist.
            </p>
            <p>
                The game runs entirely in your browser and does not require an
                account. It grew from the rectangle-finding problem on{' '}
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
