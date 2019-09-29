import React, { Component } from 'react'
import Loader from '../shared/loader'
import axios from 'axios'
import classnames from 'classnames'

export default class OnlineRelays extends Component {
    state = {
        busy: true,
        relays: [],
    }

    lookup = name => {
        switch (name) {
            case '1':
                return 'Oběhové čerpadlo'
            case '2':
                return 'Podlahovka'
            case '3':
                return 'Elektrokotel'
            case '4':
                return 'Relé 4'
            case '5':
                return 'Relé 5'
            default:
                return name
        }
    }

    componentDidMount() {
        this.loadRelays()

        setInterval(() => {
            this.loadRelays()
        }, 60000)
    }

    loadRelays = () => {
        this.setState({ busy: true })

        axios.get('http://10.10.10.115/get-relays')
            .then(({ data: response }) => {
                const relays = response
                    .map(_relay => ({
                        ..._relay,
                        address: this.lookup(_relay.address),
                        status: _relay.status === '0' ? 'vypnuto' : 'zapnuto',
                        class: _relay.status === '0' ? 'text-danger' : 'text-success',
                    }))

                this.setState({ relays })
            })
            .then(() => this.setState({ busy: false }))
    }

    render() {
        const {
            busy,
            relays,
        } = this.state

        return (
            <div className="col-xl-3 col-md-6 mb-4">
                <div className="card border-left-warning shadow h-100 py-2">
                    <div className="card-body">
                        <div className="row no-gutters align-items-center">
                            <div className="col mr-2">
                                <div className="text-xs font-weight-bold text-warning text-uppercase mb-3">
                                    Stav relé
                                </div>
                                <div className="h6 mb-0 text-gray-800 pr-2">
                                    {relays.map((relay, index) => (
                                        <div key={index} className="d-flex flex-row justify-content-between align-items-center my-2 online-temp-row">
                                            <div>{relay?.address}:&nbsp; </div>
                                            <div
                                                className={classnames({
                                                    'font-weight-bold': true,
                                                    [relay.class]: true,
                                                })}
                                            >
                                                {relay?.status}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                            <div className="col-auto">
                                {busy && <Loader />}
                                {!busy && <i className="fas fa-cogs fa-2x text-gray-300" /> }
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}
