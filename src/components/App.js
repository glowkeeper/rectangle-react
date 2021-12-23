import { useEffect } from 'react'
import { Route, Routes } from "react-router"
import { Link } from "react-router-dom"

import { Draw } from './Draw'
import { About } from './About'

import { UIText, LocalRoutes } from '../config'

export const App = () => {

    useEffect(() => {
        const prevTitle = document.title;
        document.title = UIText.appTabTitle;
        return () => {
          document.title = prevTitle;
        };
      });

    return (    
        <>
            <header>
                <div dangerouslySetInnerHTML={{__html: UIText.appTitle}} />
                <nav>
                    <Link to={LocalRoutes.home}>{UIText.linkHome}</Link>
                    <Link to={LocalRoutes.about}>{UIText.linkAbout}</Link>
                </nav>
            </header>
            <main>
                <Routes>
                    <Route
                        path={LocalRoutes.home}
                        element={<Draw />}
                    />
                    <Route
                        path={LocalRoutes.about}
                        element={<About />}
                    />
                </Routes>
            </main>
        </>
    )
}