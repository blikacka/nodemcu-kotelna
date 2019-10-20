import React, { Component, Fragment } from 'react'
import { Chart } from 'react-google-charts'
import {
    TEMPERATURES_LIMIT_DATA,
    tempLookupName,
} from '../../const'
import Loader from '../shared/loader'

export default class Temperatures extends Component {
    state = {
        temperatures: {},
    }

    componentDidMount() {
        this.loadTemperatures(TEMPERATURES_LIMIT_DATA)
    }

    componentWillUnmount() {
        this.setState({ temperatures: {} })
    }

    parseTemperatures = snapshotVal => (
        Object.values(snapshotVal)
            .map(value => ({
                ...value,
                data: value.data.map(tempData => ({
                    ...tempData,
                    address: tempLookupName(tempData.address),
                }))
            }))
    )

    databaseCallback = snapshot => new Promise(resolve => {
        const values = this.parseTemperatures(snapshot.val())

        let data = {}

        values.forEach((value, index) => {
            const timestamp = value.timestamp

            value.data.forEach((dataElement) => {
                const label = dataElement.address

                if (!data[label]) {
                    data[label] = []
                }

                data[label][index] = {
                    timestamp: timestamp,
                    temp: dataElement.temp,
                }
            })
        })

        this.setState({
            temperatures: { ...this.state.temperatures, ...data }
        }, resolve)
    })

    loadTemperatures = limit => {
        this.setState({ temperatures: {} })

        const database = window.firebaseApp.database()

        const nodemcuRef = database.ref('nodemcu').limitToLast(limit)
        const obyvakRef = database.ref('obyvak').limitToLast(limit)

        nodemcuRef.on("value", snapshot => {
            this.databaseCallback(snapshot)
                .then(() => {
                    obyvakRef.on("value", snapshot =>
                            this.databaseCallback(snapshot),
                        errorObject => {
                            console.log("The read failed: " + errorObject.code);
                        })
                })
        }, errorObject => {
            console.log("The read failed: " + errorObject.code);
        })
    }

    changeLimit = value => this.loadTemperatures(parseInt(value, 10))

    isResponsive = () => window.innerWidth < 600

    renderChart = (label, data, index) => {
        const chartData = data.map(_data => ([ _data.timestamp, parseFloat(_data.temp) ]))

        return (
            <div className="w-100" key={index}>
                {this.isResponsive() && (
                    <div className="badge badge-info">{label}</div>
                )}
                <Chart
                    height={'400px'}
                    chartType={this.isResponsive() ? 'LineChart' : 'Line'}
                    loader={<Loader />}
                    data={[
                        ['Čas', this.isResponsive() ? '' : 'Teplota'],
                        ...chartData,
                    ]}
                    options={{
                        chart: {
                            title: label,
                        },
                        hAxis: {
                            title: 'Čas',
                        },
                        vAxis: {
                            title: 'Teplota',
                        },
                        legend: {
                            position: 'none',
                        }
                    }}
                    columns={[
                        {
                            type: "date",
                        },
                        {
                            type: "number",
                        }
                    ]}
                />

                <hr />
            </div>
        )
    }

    render() {
        const {
            temperatures,
        } = this.state

        return (
            <Fragment>
                <select
                    onChange={e => this.changeLimit(e.target.value)}
                    className="custom-select custom-select-lg mb-3"
                    defaultValue="384"
                >
                    <option value="48">1/2 dne zpět</option>
                    <option value="96">1 den zpět</option>
                    <option value="192">2 dny zpět</option>
                    <option value="288">3 dny zpět</option>
                    <option value="384">4 dny zpět</option>
                    <option value="480">5 dnů zpět</option>
                    <option value="576">6 dnů zpět</option>
                    <option value="672">7 dnů zpět</option>
                    <option value="768">8 dnů zpět</option>
                    <option value="864">9 dnů zpět</option>
                    <option value="960">10 dnů zpět</option>
                </select>
                {(!temperatures || Object.values(temperatures).length === 0) && <Loader />}
                {Object.entries(temperatures).map(([ label, data ], index) => this.renderChart(label, data, index))}
            </Fragment>
        )
    }
}
