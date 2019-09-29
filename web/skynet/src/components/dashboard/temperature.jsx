import React, { Component } from 'react'
import Loader from '../shared/loader'
import axios from 'axios'

export default class OnlineTemperature extends Component {
    state = {
        busy: true,
        temperatures: [],
        temperaturesTimestamp: null,
        busyObyvak: true,
        obyvakTemperature: [],
    }

    lookup = name => {
        switch (name) {
            case '402121887108000043':
                return 'teplota 1'
            case '405913772080000234':
                return 'teplota 2'
            case '401911627208000084':
                return 'teplota 3'
            case '4025530130992203173':
                return 'teplota 4'
            default:
                return name
        }
    }

    componentDidMount() {
        this.loadTemperatures()
        this.loadObyvakTemperature()

        setInterval(() => {
            this.loadTemperatures()
            this.loadObyvakTemperature()
        }, 60000)
    }

    loadTemperatures = () => {
        this.setState({ busy: true })

        axios.get('http://10.10.10.115/get-temperatures')
            .then(({ data: response }) => {
                console.log('RESPO', response)

                const temperatures = response.data
                    .filter(_temperature => _temperature.address !== '0000000000000000')
                    .map(_temperature => ({
                        ..._temperature,
                        address: this.lookup(_temperature.address),
                    }))

                this.setState({
                    temperatures,
                    temperaturesTimestamp: response.timestamp,
                })
            })
            .then(() => this.setState({ busy: false }))
    }

    loadObyvakTemperature = () => {
        this.setState({ busyObyvak: true })

        axios.get('http://localhost/nodetest/web/api/obyvak-temp.php')
            .then(({data: response}) => {
                const obyvakTemperature = [{
                    address: 'Obývák',
                    temp: response,
                }];
                this.setState({ obyvakTemperature })
            })
            .then(() => this.setState({ busyObyvak: false }))
    }

    render() {
        const {
            busy,
            busyObyvak,
            temperatures,
            temperaturesTimestamp,
            obyvakTemperature,
        } = this.state

        return (
            <div className="col-xl-3 col-md-6 mb-4">
                <div className="card border-left-primary shadow h-100 py-2">
                    <div className="card-body">
                        <div className="row no-gutters align-items-center">
                            <div className="col mr-2">
                                <div className="text-xs font-weight-bold text-primary text-uppercase mb-3 d-flex justify-content-between align-items-center">
                                    Aktuální teploty <small>{temperaturesTimestamp}</small>
                                </div>
                                <div className="h6 mb-0 text-gray-800 pr-2">
                                    {[...obyvakTemperature, ...temperatures].map((temperature, index) => (
                                        <div key={index} className="d-flex flex-row justify-content-between align-items-center my-2 online-temp-row">
                                            <div>{temperature?.address}:&nbsp; </div>
                                            <div className="font-weight-bold">{temperature?.temp} °C</div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                            <div className="col-auto">
                                {(busy || busyObyvak) && <Loader />}
                                {!busy && !busyObyvak && <i className="fas fa-thermometer-half fa-2x text-gray-300" /> }
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}