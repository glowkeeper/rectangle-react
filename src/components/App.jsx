import { useEffect } from 'react'
import { Link, Route, Routes } from "react-router-dom"

import { Artwork } from './Artwork'
import { About } from './About'

import { UIText, LocalRoutes } from '../config'

export const App = () => {

    useEffect(() => {
        const prevTitle = document.title;
        document.title = UIText.appTabTitle;
        return () => {
          document.title = prevTitle;
        };
      }, []);

    return (    
        <>
            <header>
                <h1 className="wordmark" aria-label={UIText.appTitleCompact}>
                    <span className="wordmark-full" aria-hidden="true">
                        {UIText.appTitle}
                    </span>
                    <span className="wordmark-compact" aria-hidden="true">
                        {UIText.appTitleCompact}
                    </span>
                </h1>
                <nav>
                    <Link to={LocalRoutes.home}>{UIText.linkHome}</Link>
                    <Link to={LocalRoutes.about}>{UIText.linkAbout}</Link>
                </nav>
            </header>
            <main>
                <Routes>
                    <Route
                        path={LocalRoutes.home}
                        element={<Artwork />}
                    />
                    <Route
                        path={LocalRoutes.about}
                        element={<About />}
                    />
                </Routes>
            </main>
            <footer>
                <p>
                    &copy; 2026{' '}
                    <a href="https://huckle.studio/">Steve Huckle</a>
                </p>
                <p className="privacy-note">
                    Privacy: unfinished hunts are stored in this browser. No cookies,
                    accounts, analytics, or remote storage are used.
                </p>
            </footer>
        </>
    )
}
