import React, { Component } from 'react'
import { storeProgram } from './firebase-helper'
import Modal from '../shared/modal'
import { DatetimePickerTrigger } from 'rc-datetime-picker'
import moment from 'moment'
import { relayLookupName } from '../../const'

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
            name: 'Relé 4',
            relay: 'relay4',
        },
        {
            name: 'Relé 5',
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
            start,
            end,
            allDay,
            relays,
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

    renderDateTimePicker = (formField, value, inputId) => (
        <DatetimePickerTrigger
            moment={this.state.stateMoment}
            onChange={moment => this.updateForm(formField, moment.format('YYYY-MM-DD HH:mm'))}
            weeks={['ne', 'po', 'út', 'st', 'čt', 'pá', 'so']}
            months={['led', 'úno', 'bře', 'dub', 'kvě', 'čer', 'čvc', 'srp', 'zář', 'říj', 'lis', 'pro ']}
        >
            <input
                type="text"
                value={value ? moment(value).format('DD.MM.YYYY HH:mm') : ''}
                readOnly
                className="form-control"
                id={inputId}
            />
        </DatetimePickerTrigger>
    )

    render() {
        const {
            title,
            desc,
            start,
            end,
            allDay,
            relays: relaysState,
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

                            {this.relays.map(relay => (
                                <div className="form-check">
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
