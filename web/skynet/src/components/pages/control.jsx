import React, { Component } from 'react'
import LoaderLogo from '../../images/loader.svg'
import { CONTROL_IFRAME_URL } from '../../const'

export default class Control extends Component {
    render() {
        return (
            <div className="w-100">
                <iframe
                    src={CONTROL_IFRAME_URL}
                    width="100%"
                    height="500px"
                    frameBorder="0"
                    title="Ovládání"
                    style={{
                        width: '100%',
                        height: '500px',
                        background: 'url(' + LoaderLogo + ') center center no-repeat',
                    }}
                />
            </div>
        )
    }

}