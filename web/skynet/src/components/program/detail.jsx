import React, { Component } from 'react'
import moment from 'moment'
import { deleteProgram } from './firebase-helper'
import Modal from '../shared/modal'
import { relayLookupName } from '../../const'

export default class ProgramDetail extends Component {
    deleteEvent = event => {
        const {
            loadProgram,
            toggleDetailModal,
        } = this.props

        if (!window.confirm(`Opravdu smazat program ${event.title}?`)) {
            return
        }

        deleteProgram(event.id)
            .then(() => loadProgram())
            .then(() => toggleDetailModal(null))
    }

    render() {
        const {
            toggleDetailModal,
            eventDetail,
        } = this.props

        return (
            <Modal
                content={() => (
                    <div className="d-flex flex-column p-3">

                        <div className="d-flex flex-row">
                            <div className="col-md-2">Název</div>
                            <div className="col-md-10">{eventDetail.title}</div>
                        </div>

                        {eventDetail.desc && eventDetail.desc !== '' &&
                            <div className="d-flex flex-row">
                                <div className="col-md-2">Popis</div>
                                <div className="col-md-10">{eventDetail.desc}</div>
                            </div>
                        }

                        <div className="d-flex flex-row">
                            <div className="col-md-2">Začátek</div>
                            <div className="col-md-10">{moment(eventDetail.start).format('llll')}</div>
                        </div>

                        <div className="d-flex flex-row">
                            <div className="col-md-2">Konec</div>
                            <div className="col-md-10">{moment(eventDetail.end).format('llll')}</div>
                        </div>

                        <div className="mb-4 mt-3">
                            <h3>Nastavení relátek</h3>

                            {Object.entries(eventDetail.relays).map(([relayKey, relayValue]) => (
                                <div className="form-check">
                                    <input
                                        disabled
                                        readOnly
                                        className="form-check-input"
                                        type="checkbox"
                                        checked={!!relayValue}
                                        id={relayKey}
                                    />
                                    {console.log('val', relayValue, relayKey)}
                                    <label className="form-check-label" htmlFor={relayKey}>
                                        {relayLookupName(relayKey)}
                                    </label>
                                </div>
                            ))}
                        </div>


                        <button
                            className="btn btn-danger btn-block"
                            onClick={() => this.deleteEvent(eventDetail)}
                        >
                            Smazat
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
                handleHideModal={() => toggleDetailModal(null)}
            />

        )
    }
}
