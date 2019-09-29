import React from "react"
import {
    BrowserRouter as Router,
    Switch,
    Route,
} from "react-router-dom"
import App from './components/app'
import Control from './components/pages/control'
import Dashboard from './components/pages/dashboard'

// https://www.npmjs.com/package/react-chartjs-2 -- GRAFY

export default function RouterContainer() {
    return (
        <Router>
            <Switch>
                <Route path="/ovladani">
                    <App>
                        <Control />
                    </App>
                </Route>
                <Route path="/teploty">
                    <App>
                        <b>Tato stránka tu zatím není...</b>
                    </App>
                </Route>
                <Route path="/">
                    <App title="Nástěnka">
                        <Dashboard />
                    </App>
                </Route>
            </Switch>
        </Router>
    )
}
