import React, {
    Component,
    Fragment,
} from 'react'
import Menu from './menu'
import moment from 'moment'
import 'moment/locale/cs'
import axios from 'axios'
import { Link } from 'react-router-dom'

export default class App extends Component {
    state = {
        time: moment().format('llll:ss'),
        holiday: null,
    }

    componentDidMount() {
        moment.locale('cs')

        setInterval(() => this.setState({ time: moment().format('llll:ss') }), 1000)
        this.loadHoliday()
    }

    loadHoliday = () => {
        axios.get('https://api.abalin.net/get/today?country=cz')
            .then(({ data: response }) => this.setState({ holiday: response?.data?.name_cz }))
    }

    render() {
        const {
            time,
            holiday,
        } = this.state

        const {
            children,
            title,
        } = this.props

        return (
            <Fragment>

                <div id="wrapper">

                    <ul className="navbar-nav bg-gradient-primary sidebar sidebar-dark accordion" id="accordionSidebar">
                        <Link className="sidebar-brand d-flex align-items-center justify-content-center" to="/">
                            <div className="sidebar-brand-icon rotate-n-15">
                                <i className="fas fa-robot"/>
                            </div>
                            <div className="sidebar-brand-text mx-3">Skynet <sup>2</sup></div>
                        </Link>

                        <hr className="sidebar-divider my-0"/>

                        <Menu />
                    </ul>

                    <div id="content-wrapper" className="d-flex flex-column">

                        <div id="content">

                            <nav className="navbar navbar-expand navbar-light bg-white topbar mb-4 static-top shadow">
                                <ul className="navbar-nav ml-auto">

                                    <div className="topbar-divider d-none d-sm-block"/>
                                    <div>
                                        <div>{time}</div>
                                        <small>Svátek má: <b>{holiday}</b></small>
                                    </div>
                                </ul>

                            </nav>

                            <div className="container-fluid">

                                <div className="d-sm-flex align-items-center justify-content-between mb-4">
                                    <h1 className="h3 mb-0 text-gray-800">{title}</h1>
                                </div>

                                <div className="row">
                                    {children}
                                </div>
                            </div>
                        </div>

                        <footer className="sticky-footer bg-white">
                            <div className="container my-auto">
                                <div className="copyright text-center my-auto">
                                    <span>Copyright &copy; Skynet 2019</span>
                                </div>
                            </div>
                        </footer>
                    </div>

                </div>

                <a className="scroll-to-top rounded" href="#page-top">
                    <i className="fas fa-angle-up" />
                </a>

                <div className="modal fade" id="logoutModal" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel"
                     aria-hidden="true">
                    <div className="modal-dialog" role="document">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title" id="exampleModalLabel">Ready to Leave?</h5>
                                <button className="close" type="button" data-dismiss="modal" aria-label="Close">
                                    <span aria-hidden="true">×</span>
                                </button>
                            </div>
                            <div className="modal-body">Select "Logout" below if you are ready to end your current
                                session.
                            </div>
                            <div className="modal-footer">
                                <button className="btn btn-secondary" type="button" data-dismiss="modal">Cancel</button>
                                <a className="btn btn-primary" href="login.html">Logout</a>
                            </div>
                        </div>
                    </div>
                </div>
            </Fragment>
        )
    }
}
