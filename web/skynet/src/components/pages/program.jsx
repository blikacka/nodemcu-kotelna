import React, { Component, Fragment } from 'react'
import { AXIOS_HEADERS } from '../../const'
// import ProgramContainer from '../program'

export default class Program extends Component {
    state = {
        joke: null,
    }

    componentDidMount() {
        this.loadJoke()
    }

    loadJoke = () => window.axios.get('http://skynet.baku.cz/api/vtip.php', AXIOS_HEADERS)
        .then(response => this.setState({ joke: response.data }))

    render() {
        return (
            <Fragment>
                <div className="d-flex">JIŽ BRZY bude programování dostupné...</div>
                <div className="d-flex flex-column mt-5">
                    <div className="text-primary" dangerouslySetInnerHTML={{ __html: this.state.joke }} />
                    <div className="btn btn-outline-info mt-4" onClick={this.loadJoke}>Další vtip...</div>
                </div>
                {/*<ProgramContainer />*/}
            </Fragment>
        )
    }
}
