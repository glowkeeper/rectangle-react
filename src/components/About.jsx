import { UIText } from '../config'

const exercismExample = `   +--+
  ++  |
+-++--+
|  |  |
+--+--+`

const ambitiousExample = `+---+--+----+
|   +--+----+
+---+--+    |
|   +--+----+
+---+--+--+-+
+---+--+--+-+
+------+  | |
          +-+`

export const About = () => {
    return (
        <>
            <h2>{UIText.appTitleAbout}</h2>
            <div id="seperator">&nbsp;</div>
            <p>
                This is an app that offers solutions to Exercism&apos;s{' '}
                <a href="https://exercism.org/tracks/javascript/exercises/rectangles/">
                    rectangles problem
                </a>.
            </p>
            <p>You can input the example offered there:</p>
            <pre>{exercismExample}</pre>
            <p>But much more besides, for example:</p>
            <pre>{ambitiousExample}</pre>
            <p>
                You can even copy and paste the app&apos;s title from the top of
                this page and set the corner to &apos;+&apos; or &apos;-&apos;. 😉
            </p>
            <p>
                &copy; 2021,{' '}
                <a href="https://glowkeeper.github.io/">Dr Steve Huckle</a>, all
                rights reserved
            </p>
            <p>
                <a href="https://github.com/glowkeeper/rectangle-react">
                    View the source on GitHub
                </a>
            </p>
        </>
    )
}
