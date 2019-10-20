import React, { Component, Fragment } from 'react'
import {
    Calendar,
    momentLocalizer,
} from 'react-big-calendar'
import moment from 'moment'
import ProgramForm from './form'
import {
    loadProgram as loadProgramFunc,
} from './firebase-helper'
import Loader from '../shared/loader'
import ProgramDetail from './detail'

const localizer = momentLocalizer(moment)

export default class ProgramContainer extends Component {

    state = {
        showFormModal: false,
        showDetailModal: false,
        eventDetail: null,
        events: null,
        busyLoadEvents: true,
    }

    componentDidMount() {
        this.loadProgram()
    }

    toggleFormModal = () => this.setState({ showFormModal: !this.state.showFormModal })

    toggleDetailModal = event => this.setState({
        showDetailModal: !this.state.showDetailModal,
        eventDetail: event,
    })

    loadProgram = () => {
        loadProgramFunc()
            .then(programData => this.setState({ events: programData }))
            .then(() => this.setState({ busyLoadEvents: false }))
    }

    render() {
        const {
            busyLoadEvents,
            events,
            showFormModal,
            showDetailModal,
            eventDetail,
        } = this.state

        return (
            <Fragment>
                <div>
                    <button
                        onClick={this.toggleFormModal}
                        className="btn btn-outline-success btn-block btn-sm"
                    >
                        Přidat program
                    </button>
                </div>
                <div className="vh-100 d-flex w-100">
                    {busyLoadEvents && <Loader />}

                    {!busyLoadEvents && !events && <div>Není v současnosti žádný program...</div>}
                    {!busyLoadEvents && events && (
                        <Calendar
                            className="w-100"
                            localizer={localizer}
                            events={events}
                            startAccessor="start"
                            endAccessor="end"
                            showMultiDayTimes
                            selectable
                            onSelectEvent={this.toggleDetailModal}

                        />
                    )}

                    {showFormModal && (
                        <ProgramForm
                            toggleFormModal={this.toggleFormModal}
                            loadProgram={this.loadProgram}
                        />
                    )}
                    {showDetailModal && (
                        <ProgramDetail
                            toggleDetailModal={this.toggleDetailModal}
                            loadProgram={this.loadProgram}
                            eventDetail={eventDetail}
                        />
                    )}
                </div>
            </Fragment>
        )
    }
}