import React, { Component, Fragment } from 'react'
import OnlineTemperature from '../dashboard/temperature'
import OnlineRelays from '../dashboard/relay'

export default class Dashboard extends Component {
    render() {
        return (
            <Fragment>
                <OnlineTemperature />
                <OnlineRelays />
            </Fragment>
        )
    }
}