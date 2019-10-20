import React, { Component } from 'react'
import ReactDOM from 'react-dom'

const modalRoot = document.getElementById('modal-root')

export default class Modal extends Component {
    constructor(props) {
        super(props)

        this.el = document.createElement('div')
    }

    hasOwn = (obj, key) => Object.prototype.hasOwnProperty.call(obj, key)

    componentDidMount() {
        const modalOptions = {
            show: true,
            keyboard: this.hasOwn(this.props, 'keyboard') ? this.props.keyboard : true,
            backdrop: this.hasOwn(this.props, 'backdrop') ? this.props.backdrop : true,
        }

        const node = ReactDOM.findDOMNode(this)

        window.jQuery(node).modal(modalOptions)
        window.jQuery(node).on('hidden.bs.modal', this.props.handleHideModal)

        modalRoot.appendChild(this.el)
    }

    componentWillUnmount() {
        document.getElementsByTagName('body')[0].classList.remove('modal-open')
        const backdrop = document.getElementsByClassName('modal-backdrop')

        if (backdrop.length) {
            backdrop[0].parentNode.removeChild(backdrop[0])
        }
    }

    render() {
        const { withoutHeader } = this.props

        return ReactDOM.createPortal(
            <div className="modal fade" tabIndex="-1" role="dialog" data-backdrop="true" style={{ zIndex: 1045 }}>
                <div className={`modal-dialog${this.props.dialogClass ? ` ${this.props.dialogClass}` : ''}`} role="document">
                    <div className="modal-content">
                        {!withoutHeader &&
                            <div className="modal-header">
                                {this.props.description instanceof Object ? (
                                    this.props.description
                                ) : (
                                    <h5 className="modal-title d-flex flex-column">
                                        <span dangerouslySetInnerHTML={{ __html: this.props.description }} />
                                    </h5>
                                )}
                                <button
                                    className="close"
                                    data-dismiss={this.hasOwn(this.props, 'closeModal') ? '' : 'modal'}
                                    aria-label="Close"
                                    onClick={this.hasOwn(this.props, 'closeModal') ? this.props.closeModal : () => {}}
                                >
                                    <span aria-hidden="true">&times;</span>
                                </button>
                            </div>
                        }
                        {/*
                            include <div className="modal-body></div>
                            and     <div className="modal-footer></div>
                        */}
                        {this.props.content()}
                    </div>
                </div>
            </div>,
            this.el
        )
    }
}
