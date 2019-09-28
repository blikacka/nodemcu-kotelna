#include <Wire.h>
#include <EEPROM.h>

const int RELAY_1 = 10;
const int RELAY_2 = 9;
const int RELAY_3 = 8;
const int RELAY_4 = 7;
const int RELAY_5 = 6;

int RELAY_1_STATUS = LOW;
int RELAY_2_STATUS = LOW;
int RELAY_3_STATUS = LOW;
int RELAY_4_STATUS = LOW;
int RELAY_5_STATUS = LOW;

const int WIRE_ADDRESS = 8;

char* textToWrite;

void setup() {
    Wire.begin(WIRE_ADDRESS);         /* join i2c bus with address WIRE_ADDRESS */
    Wire.setClock(1000000);
    Wire.onReceive(receiveEvent);     /* register receive event */
    Wire.onRequest(requestEvent);     /* register request event */
    Serial.begin(115200);             /* start serial for debug */

    pinMode(RELAY_1, OUTPUT);         /* Set relays as output*/
    pinMode(RELAY_2, OUTPUT);
    pinMode(RELAY_3, OUTPUT);
    pinMode(RELAY_4, OUTPUT);
    pinMode(RELAY_5, OUTPUT);

    byte relay1Eeprom = EEPROM.read(RELAY_1);   /* Read eeprom params for setting default status */
    byte relay2Eeprom = EEPROM.read(RELAY_2);
    byte relay3Eeprom = EEPROM.read(RELAY_3);
    byte relay4Eeprom = EEPROM.read(RELAY_4);
    byte relay5Eeprom = EEPROM.read(RELAY_5);

    /* If is value stored in eeprom, set it!*/
    
    if (relay1Eeprom != 255) {
        digitalWrite(RELAY_1, relay1Eeprom);
        RELAY_1_STATUS = relay1Eeprom;
    } else {
        digitalWrite(RELAY_1, LOW);  
    }

    if (relay2Eeprom != 255) {
        digitalWrite(RELAY_2, relay2Eeprom);
        RELAY_2_STATUS = relay2Eeprom;
    } else {
        digitalWrite(RELAY_2, LOW);  
    }

    if (relay3Eeprom != 255) {
        digitalWrite(RELAY_3, relay3Eeprom);
        RELAY_3_STATUS = relay3Eeprom;
    } else {
        digitalWrite(RELAY_3, LOW);  
    }

    if (relay4Eeprom != 255) {
        digitalWrite(RELAY_4, relay4Eeprom);
        RELAY_4_STATUS = relay4Eeprom;
    } else {
        digitalWrite(RELAY_4, LOW);  
    }

    if (relay5Eeprom != 255) {
        digitalWrite(RELAY_5, relay5Eeprom);
        RELAY_5_STATUS = relay5Eeprom;
    } else {
        digitalWrite(RELAY_5, LOW);  
    }
}

void loop() {
    /* Prepare response relay for method requestEvent() and save it into variable*/
    String responseA = String("1" + String(RELAY_1_STATUS == LOW ? "0" : "1"));
    String responseB = String("2" + String(RELAY_2_STATUS == LOW ? "0" : "1"));
    String responseC = String("3" + String(RELAY_3_STATUS == LOW ? "0" : "1"));
    String responseD = String("4" + String(RELAY_4_STATUS == LOW ? "0" : "1"));
    String responseE = String("5" + String(RELAY_5_STATUS == LOW ? "0" : "1"));

    String response = responseA + responseB + responseC + responseD + responseE;
    textToWrite = response.c_str();
    delay(100);
}

/* Make relay OFF */
void offRelay(int relayNumber) {
    EEPROM.write(relayNumber, LOW);
    digitalWrite(relayNumber, LOW);
}

/* Make relay ON */
void onRelay(int relayNumber) {
    EEPROM.write(relayNumber, HIGH);
    digitalWrite(relayNumber, HIGH);
}

/* function that executes whenever data is received from master */
void receiveEvent(int howMany) {
    String receiveWord = "";

    while (0 < Wire.available()) {
        char c = Wire.read();      /* receive byte as a character */
        receiveWord += c;
    }

    /* Set relay based on incomming message */
    switch(receiveWord.toInt()) {
        case 10:
            offRelay(RELAY_1);
            RELAY_1_STATUS = LOW;
            break;
        case 11:
            onRelay(RELAY_1);
            RELAY_1_STATUS = HIGH;
            break;
        case 20:
            offRelay(RELAY_2);
            RELAY_2_STATUS = LOW;
            break;
        case 21:
            onRelay(RELAY_2);
            RELAY_2_STATUS = HIGH;
            break;
        case 30:
            offRelay(RELAY_3);
            RELAY_3_STATUS = LOW;
            break;
        case 31:
            onRelay(RELAY_3);
            RELAY_3_STATUS = HIGH;
            break;
        case 40:
            offRelay(RELAY_4);
            RELAY_4_STATUS = LOW;
            break;
        case 41:
            onRelay(RELAY_4);
            RELAY_4_STATUS = HIGH;
            break;
        case 50:
            offRelay(RELAY_5);
            RELAY_5_STATUS = LOW;
            break;
        case 51:
            onRelay(RELAY_5);
            RELAY_5_STATUS = HIGH;
            break;
    }

    Serial.println(receiveWord);             /* to newline */
}

/* function that executes whenever data is requested from master */
void requestEvent() {
    Wire.write(textToWrite); 
}
