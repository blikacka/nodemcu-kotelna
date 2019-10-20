import React, { Component } from 'react'
import { Tooltip, Container } from '@quid/react-tooltip'
import Loader from '../shared/loader'
import classnames from 'classnames'
import {
    AXIOS_HEADERS,
    OBYVAK_TEMP_URL,
    TEMPERATURE_URL,
    tempLookupName,
} from '../../const'

export default class OnlineTemperature extends Component {
    state = {
        busy: true,
        temperatures: [],
        lastTemperatures: [],
        temperaturesTimestamp: null,
        busyObyvak: true,
        obyvakTemperature: [],
        lastObyvakTemperature: [],
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

        window.axios.get(TEMPERATURE_URL)
            .then(({ data: response }) => {
                console.log('RESPO', response)

                const temperatures = response.data
                    .filter(_temperature => _temperature.address !== '0000000000000000')
                    .map(_temperature => ({
                        ..._temperature,
                        address: tempLookupName(_temperature.address),
                        type: _temperature.address,
                    }))

                this.setState({
                    temperatures,
                    temperaturesTimestamp: response.timestamp,
                })

                this.loadLastTemp('nodemcu', 'lastTemperatures')
            })
            .then(() => this.setState({ busy: false }))
    }

    loadObyvakTemperature = () => {
        this.setState({ busyObyvak: true })

        window.axios.get(OBYVAK_TEMP_URL, AXIOS_HEADERS)
            .then(({data: response}) => {
                const obyvakTemperature = [{
                    address: 'Obývák',
                    type: 'Obyvak',
                    temp: response,
                }];
                this.setState({ obyvakTemperature })

                this.loadLastTemp('obyvak', 'lastObyvakTemperature')
            })
            .then(() => this.setState({ busyObyvak: false }))
    }

    loadLastTemp = (path, state) => {
        const database = window.firebaseApp.database()

        const nodemcuRef = database.ref(path).limitToLast(1)

        nodemcuRef.on("value", snapshot => {
            const snaphostValue = snapshot.val()

            this.setState({ [state]: Object.values(snaphostValue)[0].data })
        }, errorObject => {
            console.log("The read failed: " + errorObject.code);
        })
    }

    renderArrow = (temperature, lastTemperatures) => {
        const tempFind = lastTemperatures?.find?.(lastTemp => lastTemp.address === temperature.type)?.temp

        if (!tempFind) {
            return null
        }

        const findTemp = parseFloat(tempFind)
        const actualTemp = parseFloat(temperature.temp)

        const isHighPlus = (actualTemp) > (findTemp + 3)
        const isMediumPlus = (actualTemp) > findTemp && !isHighPlus
        const isSame = (actualTemp) === findTemp
        const isHighMinus = (actualTemp) < (findTemp - 3)
        const isMediumMinus = (actualTemp) < findTemp && !isHighMinus

        let title = ''

        if (isHighPlus) {
            title = `Velké zvětšení - z ${tempFind} °C`
        }

        if (isMediumPlus) {
            title = `Lehké zvětšení - z ${tempFind} °C`
        }

        if (isSame) {
            title = 'Teplota je stejná'
        }

        if (isMediumMinus) {
            title = `Mírné zmenšení - z ${tempFind} °C`
        }

        if (isHighMinus) {
            title = `Velké zmenšení - z ${tempFind} °C`
        }

        return (
            <Tooltip
                renderTooltip={props => <Container {...props}>{title}</Container>}
            >
                {({ ref, toggle, open }) => (
                    <i
                        onClick={toggle}
                        onMouseEnter={open}
                        ref={ref}
                        className={classnames({
                            'fas fa-long-arrow-alt-up tooltip-init': true,
                            'rotate-arrow--high-plus text-danger': isHighPlus,
                            'rotate-arrow--medium-plus text-warning': isMediumPlus,
                            'rotate-arrow--same text-dark': isSame,
                            'rotate-arrow--medium-minus text-info': isMediumMinus,
                            'rotate-arrow--high-minus text-primary': isHighMinus,
                        })}
                    />
                )}
            </Tooltip>

        )
    }

    render() {
        const {
            busy,
            busyObyvak,
            temperatures,
            temperaturesTimestamp,
            obyvakTemperature,
            lastTemperatures,
            lastObyvakTemperature,
        } = this.state

        const lastTemps = [ ...lastTemperatures, ...lastObyvakTemperature ]

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
                                            <div className="font-weight-bold d-flex flex-row">
                                                <div>{temperature?.temp} °C</div>
                                                <div className="ml-2">{this.renderArrow(temperature, lastTemps)}</div>
                                            </div>
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
