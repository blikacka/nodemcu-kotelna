import React, { Component } from 'react'

export default class Loader extends Component {
    render = () => (
        <div className="spinner-border" role="status" style={this.props.style}>
            <span className="sr-only">Loading...</span>
        </div>
    )
}
