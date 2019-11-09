import React, { Component } from 'react'
import { storeProgram } from './firebase-helper'
import Modal from '../shared/modal'
import moment from 'moment'
import {
    comparsionObjectName,
    relayLookupName,
    tempObjectName,
} from '../../const'
import DatePicker, { registerLocale } from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'

import cs from 'date-fns/locale/cs'
registerLocale('cs', cs)

export default class ProgramForm extends Component {

    state = {
        title: null,
        desc: null,
        start: null,
        end: null,
        allDay: false,
        stateMoment: moment(),
        relays: {
            relay1: false,
            relay2: false,
            relay3: false,
            relay4: false,
            relay5: false,
        },
        useTempSetting: false,
        temp: {
            set: null,
            comparsion: null,
            tempId: null,
        }
    }

    relays = [
        {
            name: relayLookupName('relay1'),
            relay: 'relay1',
        },
        {
            name: relayLookupName('relay2'),
            relay: 'relay2',
        },
        {
            name: relayLookupName('relay3'),
            relay: 'relay3',
        },
        {
            name: relayLookupName('relay4'),
            relay: 'relay4',
        },
        {
            name: relayLookupName('relay5'),
            relay: 'relay5',
        },
    ]

    executeProgram = () => {
        const {
            title,
            desc,
            start,
            end,
            allDay,
            relays,
            useTempSetting,
            temp,
        } = this.state

        if (!title) {
            return alert('Není zadaný název programu!')
        }

        if (!start) {
            return alert('Není zadán začátek trvání programu!')
        }

        if (!end) {
            return alert('Není zadán konec trvání programu!')
        }

        const programData = {
            title,
            desc,
            start: moment(start).format('YYYY-MM-DD HH:mm'),
            end: moment(end).format('YYYY-MM-DD HH:mm'),
            allDay,
            relays,
            useTempSetting,
            temp,
        }

        storeProgram(programData)
            .then(() => this.props.loadProgram())
            .then(() => this.props.toggleFormModal())
    }

    updateForm = (field, value) => {
        const { allDay } = this.state

        if (allDay && field === 'start') {
            const startAllDayValue = moment(value).format('YYYY-MM-DD 00:00:00')
            const endAllDayValue = moment(value).format('YYYY-MM-DD 23:59:59')
            return this.setState({
                start: startAllDayValue,
                end: endAllDayValue,
            })
        }

        this.setState({ [field]: value })
    }

    updateRelay = (relay, status) => {
        let relays = {
            ...this.state.relays,
            [relay]: status,
        }

        this.setState({ relays })
    }

    updateTemp = (field, value) => {
        const temp = {
            ...this.state.temp,
            [field]: value,
        }

        this.setState({ temp })
    }

    renderDateTimePicker = (formField, value, inputId) => (
        <DatePicker
            selected={value}
            onChange={date => this.updateForm(formField, date)}
            showTimeSelect
            timeFormat="p"
            timeIntervals={5}
            timeCaption="čas"
            dateFormat="Pp"
            id={inputId}
            locale="cs"
            autoComplete="off"
            inline
        />
    )

    render() {
        const {
            title,
            desc,
            start,
            end,
            allDay,
            relays: relaysState,
            useTempSetting,
            temp,
        } = this.state

        return (
            <Modal
                content={() => (
                    <div className="d-flex flex-column p-3">
                        <div className="form-group">
                            <label htmlFor="programTitle">Název programu</label>
                            <input
                                type="text"
                                value={title || ''}
                                onChange={e => this.updateForm('title', e.target.value)}
                                className="form-control"
                                id="programTitle"
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="programDesc">Popis programu <small>(nepovinné)</small></label>
                            <input
                                type="text"
                                value={desc || ''}
                                onChange={e => this.updateForm('desc', e.target.value)}
                                className="form-control"
                                id="programDesc"
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="programStart">Začátek</label>
                            {this.renderDateTimePicker('start', start, 'programStart')}
                        </div>

                        {!allDay && (
                            <div className="form-group">
                                <label htmlFor="programEnd">Konec</label>
                                {this.renderDateTimePicker('end', end, 'programEnd')}
                            </div>
                        )}

                        <div className="mb-4">
                            <h3>Nastavení relátek</h3>

                            {this.relays.map((relay, index) => (
                                <div className="form-check" key={index}>
                                    <input
                                        className="form-check-input"
                                        type="checkbox"
                                        value={relaysState[relay.relay] || ''}
                                        onChange={e => this.updateRelay(relay.relay, !!e.target.checked)}
                                        id={relay.relay}
                                    />
                                    <label className="form-check-label" htmlFor={relay.relay}>
                                        {relay.name}
                                    </label>
                                </div>
                            ))}
                        </div>

                        <div className="mb-4">
                            <h3>Nastavení teploty</h3>

                            <div className="form-check">
                                <input
                                    className="form-check-input"
                                    type="checkbox"
                                    value={useTempSetting || ''}
                                    onChange={e => this.updateForm('useTempSetting', !!e.target.checked)}
                                    id="useTempSetting"
                                />
                                <label className="form-check-label" htmlFor="useTempSetting">
                                    Použít nastavení teploty?
                                </label>
                            </div>

                            {useTempSetting && (
                                <div className="form-row">
                                    <div className="col-md-6 mb-3">
                                        <select className="custom-select" onChange={e => this.updateTemp('tempId', e.target.value)}>
                                        {Object.entries(tempObjectName()).map(([tempKey, tempName], index) => (
                                            <option value={tempKey} key={index}>{tempName}</option>
                                        ))}
                                        </select>
                                    </div>
                                    <div className="col-md-3 mb-3">
                                        <select className="custom-select" onChange={e => this.updateTemp('comparsion', e.target.value)}>
                                            {Object.entries(comparsionObjectName()).map(([comparsionKey, comparsionName], index) => (
                                                <option value={comparsionKey} key={index}>{comparsionName}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div className="col-md-3 mb-3">
                                        <input
                                            type="number"
                                            className="form-control"
                                            id="temperatureSet"
                                            placeholder="xy v °C"
                                            value={temp.set || ''}
                                            onChange={e => this.updateTemp('set', e.target.value)}
                                        />
                                    </div>
                                </div>
                            )}
                        </div>

                        <button
                            className="btn btn-success btn-block"
                            onClick={() => this.executeProgram()}
                        >
                            Přidat
                        </button>
                    </div>
                )}
                description={
                    <div className="d-flex align-items-center">
                        <h6 className="m-0">
                            Přidat program
                        </h6>
                    </div>
                }
                handleHideModal={() => this.props.toggleFormModal()}
            />

        )
    }
}
