const rectangleWordmark = [
    '+----+ +---+ +---+ +---+    +     ++    + +---+ +     +---+',
    '|    | |     |       |     / \\    | \\   | |     |     |',
    '+----+ +--+  |       |    +---+   |  \\  | | +-+ |     +--+',
    '|  \\   |     |       |   /     \\  |   \\ | |   | |     |',
    '+    + +---+ +---+   +  +       + +    ++ +---+ +---+ +---+',
]

const huntWordmark = [
    '+   + +   + ++    + +---+',
    '|   | |   | | \\   |   |',
    '+---+ |   | |  \\  |   |',
    '|   | |   | |   \\ |   |',
    '+   + +---+ +    ++   +',
]

const rectangleWordmarkWidth = Math.max(...rectangleWordmark.map((line) => line.length))

const appWordmark = rectangleWordmark.map((line, index) => {
    return `${line.padEnd(rectangleWordmarkWidth)}     ${huntWordmark[index]}`
}).join('\n')

export class LocalRoutes {
    static home = "/rectangle-react"
    static about = `${LocalRoutes.home}/about`
}

export class UIText {
    static appTabTitle = "rectangles"
    static appTitle = appWordmark
    static appTitleCompact = "Rectangle Hunt"
    static appTitleAbout = "About Rectangle Hunt"
    static appTitleHome = "count"

    static linkHome = "home"
    static linkAbout = "about"

    static inputText = "art"
    static inputCorner = "corner"
    static inputColour = "colour"

    static buttonSubmit = "submit"
    static buttonClear = "clear"
    static buttonInit = "init"

    static outputSolutions = "number of solutions"
}
