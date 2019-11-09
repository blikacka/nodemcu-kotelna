import {
    BASE_LOGIN,
    BASE_PASSWORD,
    FIREBASE_API_KEY,
    FIREBASE_APP_ID,
    FIREBASE_MEASUREMENT_ID,
    FIREBASE_SENDER_ID,
} from './const-private'

const ESP_URL = 'http://10.10.10.115'

export const TEMPERATURE_URL = `${ESP_URL}/get-temperatures`
export const OBYVAK_TEMP_URL = 'http://skynet.baku.cz/api/obyvak-temp.php'
export const HOLIDAY_URL = 'https://api.abalin.net/get/today?country=cz'
export const RELAY_URL = `${ESP_URL}/get-relays`
export const CONTROL_IFRAME_URL = `${ESP_URL}`

export const AXIOS_HEADERS = {
    auth: {
        username: BASE_LOGIN,
        password: BASE_PASSWORD,
    },
    withCredentials: true,
}

export const TEMPERATURES_LIMIT_DATA = 384

export const FIREBASE_CONFIG = {
    apiKey: FIREBASE_API_KEY,
    authDomain: "chot-skynet.firebaseapp.com",
    databaseURL: "https://chot-skynet.firebaseio.com",
    projectId: "chot-skynet",
    storageBucket: "chot-skynet.appspot.com",
    messagingSenderId: FIREBASE_SENDER_ID,
    appId: FIREBASE_APP_ID,
    measurementId: FIREBASE_MEASUREMENT_ID,
}

export const FIREBASE_PROGRAM_DATABASE = 'program'

export const relayLookupName = name => {
    switch (name) {
        case 'relay1':
            return 'Oběhové čerpadlo'
        case 'relay2':
            return 'Podlahové čerpadlo'
        case 'relay3':
            return 'Elektrokotel'
        case 'relay4':
            return 'Relé 4'
        case 'relay5':
            return 'Relé 5'
        default: return name
    }
}

export const tempLookupName = name => {
    switch (name) {
        case '402121887108000043':
            return 'teplota 1'
        case '405913772080000234':
            return 'teplota 2'
        case '401911627208000084':
            return 'teplota 3'
        case '4025530130992203173':
            return 'teplota 4'
        case '40217241211511603105':
            return 'Venek'
        case '4004237121151170387':
            return 'Výstup kotel'
        default:
            return name
    }
}

export const tempObjectName = () => ({
    '402121887108000043': 'teplota 1',
    '405913772080000234': 'teplota 2',
    '401911627208000084': 'teplota 3',
    '4025530130992203173': 'teplota 4',
    '40217241211511603105': 'Venek',
    '4004237121151170387': 'Výstup kotel',
})

export const comparsionObjectName = name => {
    const lookup = {
        'bigger': 'větší než',
        'biggerorsame': 'větší nebo rovno',
        'lower': 'menší než',
        'lowerorsame': 'menší nebo rovno',
        'same': 'je přesně',
    }

    if (!name) {
        return lookup
    }

    return lookup[name] || name
}
