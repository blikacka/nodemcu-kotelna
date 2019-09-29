import React, {
    Component,
    Fragment,
} from 'react'

import { Link } from 'react-router-dom'

export default class Menu extends Component {
    render() {
        return (
            <Fragment>
                <li className="nav-item active">
                    <Link className="nav-link" to="/">
                        <i className="fas fa-fw fa-tachometer-alt"/>
                        <span>Nástěnka</span>
                    </Link>
                </li>

                <hr className="sidebar-divider"/>

                <div className="sidebar-heading">
                    Rozhraní
                </div>

                <li className="nav-item">
                    <Link className="nav-link" to="/teploty">
                        <i className="fas fa-fw fa-temperature-high"/>
                        <span>Teploty</span>
                    </Link>
                </li>

                <li className="nav-item">
                    <Link className="nav-link" to="/ovladani">
                        <i className="fas fa-fw fa-cog"/>
                        <span>Ovládání</span>
                    </Link>
                </li>
            </Fragment>
        )
    }
}
