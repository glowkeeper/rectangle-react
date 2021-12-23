import { UIText } from '../config'

export const About = () => {

    return (
        <>
            <h2>{UIText.appTitleAbout}</h2>
            <div id="seperator">&nbsp;</div>
            <p>{UIText.appTextAbout}</p>
        </>
    )
}