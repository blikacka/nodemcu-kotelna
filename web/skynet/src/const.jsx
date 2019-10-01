export const TEMPERATURE_URL = 'http://10.10.10.115/get-temperatures'
export const OBYVAK_TEMP_URL = 'http://localhost/nodetest/web/api/obyvak-temp.php'
export const HOLIDAY_URL = 'https://api.abalin.net/get/today?country=cz'
export const RELAY_URL = 'http://10.10.10.115/get-relays'

export const TEMPERATURES_LIMIT_DATA = 384

export const FIREBASE_CONFIG = {
    apiKey: "xxx",
    authDomain: "chot-skynet.firebaseapp.com",
    databaseURL: "https://chot-skynet.firebaseio.com",
    projectId: "chot-skynet",
    storageBucket: "chot-skynet.appspot.com",
    messagingSenderId: "xxx",
    appId: "xxx",
    measurementId: "xxx"
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
