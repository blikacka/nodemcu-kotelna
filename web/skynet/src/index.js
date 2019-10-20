import React from 'react'
import ReactDOM from 'react-dom'
import './styles/style.css'
import RouterContainer from './router'
import * as firebase from 'firebase'
import { FIREBASE_CONFIG } from './const'
import axios from 'axios'

window.firebaseApp = firebase.initializeApp(FIREBASE_CONFIG)
window.axios = axios

ReactDOM.render(<RouterContainer />, document.getElementById('root'))

