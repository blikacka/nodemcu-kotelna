import { FIREBASE_PROGRAM_DATABASE } from '../../const'
import moment from 'moment'

export const storeProgram = programData => (
    window.firebaseApp.database()
        .ref(`${FIREBASE_PROGRAM_DATABASE}/${moment().valueOf()}`)
        .set(programData)
)

export const loadProgram = () => new Promise(resolve => {
    const database = window.firebaseApp.database()

    const databaseRef = database.ref(FIREBASE_PROGRAM_DATABASE)

    databaseRef.on("value", snapshot => {
        const values = snapshot.val()

        if (!values) {
            return resolve()
        }

        const mapped = Object.entries(values).map(([key, programValue]) => {
            programValue.start = moment(programValue.start).toDate()
            programValue.end = moment(programValue.end).toDate()
            programValue.id = key

            return programValue
        })

        resolve(mapped)
    }, errorObject => {
        console.log("The read failed: " + errorObject.code);
    })
})

export const deleteProgram = programId => new Promise(resolve => {
    const database = window.firebaseApp.database()

    const databaseRef = database.ref(`${FIREBASE_PROGRAM_DATABASE}/${programId}`)

    databaseRef.remove()
        .then(() => resolve())
        .catch(() => resolve())
})
