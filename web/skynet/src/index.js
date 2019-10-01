import React from 'react'
import ReactDOM from 'react-dom'
import './styles/style.css'
import RouterContainer from './router'
import * as firebase from 'firebase'
import { FIREBASE_CONFIG } from './const'

window.firebaseApp = firebase.initializeApp(FIREBASE_CONFIG)

ReactDOM.render(<RouterContainer />, document.getElementById('root'))

