import React from "react"
import {
    BrowserRouter as Router,
    Switch,
    Route,
} from "react-router-dom"
import App from './components/app'
import Control from './components/pages/control'
import Dashboard from './components/pages/dashboard'
import Temperatures from './components/pages/temperatures'
import Program from './components/pages/program'

// https://www.npmjs.com/package/react-chartjs-2 -- GRAFY

export default function RouterContainer() {
    return (
        <Router>
            <Switch>
                <Route path="/program">
                    <App title="Program">
                        <Program />
                    </App>
                </Route>
                <Route path="/ovladani">
                    <App>
                        <Control />
                    </App>
                </Route>
                <Route path="/teploty">
                    <App title="Teploty">
                        <Temperatures />
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
