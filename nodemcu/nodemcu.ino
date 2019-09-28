#include <Wire.h>
#include <OneWire.h> 
#include <DallasTemperature.h>
#include <ESP8266WiFi.h>
#include <WiFiClient.h>
#include <ESP8266WebServer.h>
#include <time.h>
#include <ArduinoOTA.h>

// connect arduino with nodeMCU
const int SDA_ARDUINO = D1;
const int SCL_ARDUINO = D2;
const int ARDUINO_NUMBER = 8;

// for temperature
const int ONE_WIRE_BUS = D3;
const int TEMPERATURE_PRECISION = 11;

// RELAYS INPUT
const int RELAY_1 = D4;
const int RELAY_2 = D5;
const int RELAY_3 = D6;
const int RELAY_4 = D7;
const int RELAY_5 = D8;

int RELAY_1_STATUS = LOW;
int RELAY_2_STATUS = LOW;
int RELAY_3_STATUS = LOW;
int RELAY_4_STATUS = LOW;
int RELAY_5_STATUS = LOW;

boolean BUSY_SEND = false;

const char* ssidMain = "xxx";
const char* passwordMain = "xxx";

const char* OTAhostname = "ESP-kotelna";
const String OTAPassword = "xxx";

long timer = millis();
String LOCAL_IP = "";

WiFiClient espClient;
ESP8266WebServer server(80);
WiFiClient client;

OneWire oneWire(ONE_WIRE_BUS);
DallasTemperature sensors(&oneWire);
DeviceAddress temp1;
DeviceAddress temp2;
DeviceAddress temp3;
DeviceAddress temp4;
DeviceAddress temp5;

String tempResult1 = "";
String tempResult2 = "";
String tempResult3 = "";
String tempResult4 = "";
String tempResult5 = "";

String getHeads() {
    String content ="<!DOCTYPE html>";
    content += "<html lang=\"cs\">";
    content += "<head>";
    content += "<meta name=\"viewport\" content=\"width=device-width, initial-scale=1\"><meta charset=\"UTF-8\">";
    content += "<link rel=\"stylesheet\" href=\"https://stackpath.bootstrapcdn.com/bootstrap/4.3.1/css/bootstrap.min.css\" integrity=\"sha384-ggOyR0iXCbMQv3Xipma34MD+dH/1fQ784/j6cY/iJTQUOhcWr7x9JvoRxT2MZw1T\" crossorigin=\"anonymous\">";
    content += "<script src=\"https://code.jquery.com/jquery-3.4.1.min.js\" integrity=\"sha256-CSXorXvZcTkaix6Yvo6HppcZGetbYMGWSFlBw8HfCJo=\" crossorigin=\"anonymous\"></script>";
    content += "<script src=\"https://cdnjs.cloudflare.com/ajax/libs/popper.js/1.14.7/umd/popper.min.js\" integrity=\"sha384-UO2eT0CpHqdSJQ6hJty5KVphtPhzWj9WO1clHTMGa3JDZwrnQq4sF86dIHNDz0W1\" crossorigin=\"anonymous\"></script>";
    content += "<script src=\"https://stackpath.bootstrapcdn.com/bootstrap/4.3.1/js/bootstrap.min.js\" integrity=\"sha384-JjSmVgyd0p3pXB1rRibZUAYoIIy6OrQ6VrjIEaFf/nJGzIxFDsf4x0xIM+B07jRM\" crossorigin=\"anonymous\"></script>";
    content += "<script type=\"text/javascript\" src=\"https://www.gstatic.com/charts/loader.js\"></script>";
    content += "</head><body>";
    content += "<div class=\"container\">";

    return content;
}

String getEnds() {
    return "</div></body></html>";
}

String getUptimeString() {
    unsigned long runningMilis = millis() - timer;

    int runningSeconds = runningMilis / 1000;
    runningMilis %= 1000;

    int runningMinutes = runningSeconds / 60;
    runningSeconds %= 60;
    
    int runningHours = runningMinutes / 60;
    runningMinutes %= 60;   
     
    int runningDays = runningHours / 24;
    runningHours %= 24;

    return String(runningDays) + "d " + String(runningHours) + "h " + String(runningMinutes) + "m " + String(runningSeconds) + "s";
}

//root page can be accessed MAIN PAGE
void handleRoot() {
    String relay1 = RELAY_1_STATUS == LOW ? "<span class=\"text-danger font-weight-bold\">vypnuto</span>" : "<span class=\"text-success font-weight-bold\">zapnuto</span>";
    String relay2 = RELAY_2_STATUS == LOW ? "<span class=\"text-danger font-weight-bold\">vypnuto</span>" : "<span class=\"text-success font-weight-bold\">zapnuto</span>";
    String relay3 = RELAY_3_STATUS == LOW ? "<span class=\"text-danger font-weight-bold\">vypnuto</span>" : "<span class=\"text-success font-weight-bold\">zapnuto</span>";
    String relay4 = RELAY_4_STATUS == LOW ? "<span class=\"text-danger font-weight-bold\">vypnuto</span>" : "<span class=\"text-success font-weight-bold\">zapnuto</span>";
    String relay5 = RELAY_5_STATUS == LOW ? "<span class=\"text-danger font-weight-bold\">vypnuto</span>" : "<span class=\"text-success font-weight-bold\">zapnuto</span>";

    String relay1Status = RELAY_1_STATUS == LOW ? "1" : "0";
    String relay2Status = RELAY_2_STATUS == LOW ? "1" : "0";
    String relay3Status = RELAY_3_STATUS == LOW ? "1" : "0";
    String relay4Status = RELAY_4_STATUS == LOW ? "1" : "0";
    String relay5Status = RELAY_5_STATUS == LOW ? "1" : "0";

    String content = getHeads();
    content += "<script> var dataChart = [];</script>";
    content += "<script>var localIp = '" + LOCAL_IP + "';</script>";
    content += "<script>var hashIp = window.location.hash.substr(1); var ajaxIp = hashIp && hashIp !== '' ? hashIp : localIp;</script>";
    //content += "<meta http-equiv=refresh content= 2;/>";
    content += "<h1>OVLÁDÁNÍ</h1>";
    content += "<hr />";
    content += "<div class=\"row d-flex align-items-center\">";
    content += "  <div class=\"col-12 col-md-3\">";
    content += "    <p class=\"d-flex justify-content-between\">Oběhové čerpadlo - " + relay1 + "</p>";
    content += "    <p class=\"d-flex justify-content-between\">Podlahovka čerp. - " + relay2 + "</p>";
    content += "    <p class=\"d-flex justify-content-between\">Elektrokotel - " + relay3 + "</p>";
    content += "    <p class=\"d-flex justify-content-between\">Relé 4 - " + relay4 + "</p>";
    content += "    <p class=\"d-flex justify-content-between\">Relé 5 - " + relay5 + "</p>";
    content += "  </div>";
    content += "  <div class=\"col-12 col-md-9\">";
    content += "    <a href='/relay?relay=1&status=" + relay1Status + "' class=\"btn btn-info btn-block\">ZAPNOUT / VYPNOUT OBĚHOVKU</a>";
    content += "    <a href='/relay?relay=2&status=" + relay2Status + "' class=\"btn btn-info btn-block\">ZAPNOUT / VYPNOUT PODLHOVKU</a>";
    content += "    <a href='/relay?relay=3&status=" + relay3Status + "' class=\"btn btn-info btn-block\">ZAPNOUT / VYPNOUT ELKOTEL</a>";
    content += "    <a href='/relay?relay=4&status=" + relay4Status + "' class=\"btn btn-info btn-block\">ZAPNOUT / VYPNOUT RELÉ 4</a>";
    content += "    <a href='/relay?relay=5&status=" + relay5Status + "' class=\"btn btn-info btn-block\">ZAPNOUT / VYPNOUT RELÉ 5</a>";
    content += "  </div>";
    content += "</div>";
    content += "<hr />";
    content += "<div class=\"mt-3\"><small>Uptime: <b id=\"uptime-string\">" + getUptimeString() + "</b></small></div>";
    content += "<div class=\"mt-1\"><small>Volná paměť: <b>" + String(system_get_free_heap_size()) + "</b></small></div>";
    content += "<script>";
    content += "var callUptime = function() { $.ajax({ url: '/get-uptime', type: 'GET', complete: function(res) { $('#uptime-string').html(res.responseText); } }) };";
    content += "</script>";
    content += "<script>$(document).ready(function(){ ";
    content += "setInterval(function() { callUptime(); }, 10000);";
    content += "})</script>";

    content += getEnds();

    server.send(200, "text/html", content);
}

void handleNotFound() {
    String message = "File Not Found\n\n";
    message += "URI: ";
    message += server.uri();
    message += "\nMethod: ";
    message += (server.method() == HTTP_GET) ? "GET" : "POST";
    message += "\nArguments: ";
    message += server.args();
    message += "\n";

    for (uint8_t i = 0; i < server.args(); i++) {
        message += " " + server.argName(i) + ": " + server.arg(i) + "\n";
    }

    server.send(404, "text/plain", message);
}

void redirectToBase() {
    server.sendHeader("Location", "/");
    server.sendHeader("Cache-Control", "no-cache");
    server.send(301);  
}

void handleRelay() {
    BUSY_SEND = true;
    const char* relayNumberIn = server.arg("relay").c_str();
    const char* statusCodeIn = server.arg("status").c_str();

    char textToWrite[2];

    strcpy(textToWrite, relayNumberIn);
    strcat(textToWrite, statusCodeIn);

    Serial.print("handling relays ... ");
    Serial.println(textToWrite);

    Wire.beginTransmission(ARDUINO_NUMBER); /* begin with device address */
    Wire.write(textToWrite);
    Wire.endTransmission();    /* stop transmitting */

    BUSY_SEND = false;
    redirectToBase();
    return;
}

void handleGetTemperatures() {
    String addressTemp1 = printAddress(temp1);
    String addressTemp2 = printAddress(temp2);
    String addressTemp3 = printAddress(temp3);
    String addressTemp4 = printAddress(temp4);
    String addressTemp5 = printAddress(temp5);

    String response = "[";
    response += "{'address':'" + addressTemp1 + "','temp': '" + tempResult1 +"'},";
    response += "{'address':'" + addressTemp2 + "','temp': '" + tempResult2 +"'},";
    response += "{'address':'" + addressTemp3 + "','temp': '" + tempResult3 +"'},";
    response += "{'address':'" + addressTemp4 + "','temp': '" + tempResult4 +"'},";
    response += "{'address':'" + addressTemp5 + "','temp': '" + tempResult5 +"'}";

    response += "]";

    server.send(200, "application/json", response);
}

void setRelays() {
    if (!BUSY_SEND) {
        Wire.requestFrom(ARDUINO_NUMBER, 10); /* request & read data of size 13 from slave */
        String receiveWord = "";
    
        while(Wire.available()){
            char c = Wire.read();
            receiveWord += c;
        }
    
        const char* receiveWordChars = receiveWord.c_str();
    
        if (strstr(receiveWordChars, "10") != NULL) {
            RELAY_1_STATUS = LOW;
        }
    
        if (strstr(receiveWordChars, "11") != NULL) {
            RELAY_1_STATUS = HIGH;
        }
    
        if (strstr(receiveWordChars, "20") != NULL) {
            RELAY_2_STATUS = LOW;
        }
    
        if (strstr(receiveWordChars, "21") != NULL) {
            RELAY_2_STATUS = HIGH;
        }
    
        if (strstr(receiveWordChars, "30") != NULL) {
            RELAY_3_STATUS = LOW;
        }
    
        if (strstr(receiveWordChars, "31") != NULL) {
            RELAY_3_STATUS = HIGH;
        }
    
        if (strstr(receiveWordChars, "40") != NULL) {
            RELAY_4_STATUS = LOW;
        }
    
        if (strstr(receiveWordChars, "41") != NULL) {
            RELAY_4_STATUS = HIGH;
        }
    
        if (strstr(receiveWordChars, "50") != NULL) {
            RELAY_5_STATUS = LOW;
        }
    
        if (strstr(receiveWordChars, "51") != NULL) {
            RELAY_5_STATUS = HIGH;
        }
    }
}

void handleGetUptime() {
    String content = getUptimeString();
    server.send(200, "text/html", content);
}

void setup() {
    Serial.begin(115200); /* begin serial for debug */
    Wire.begin(SDA_ARDUINO, SCL_ARDUINO); /* join i2c bus with SDA=D1 and SCL=D2 of NodeMCU */
    Wire.setClock(1000000);

    WiFi.mode(WIFI_STA);
    WiFi.setSleepMode(WIFI_NONE_SLEEP);
    Serial.println("");

    WiFi.begin(ssidMain, passwordMain);

    // Wait for connection
    while (WiFi.status() != WL_CONNECTED) {
        delay(500);
        Serial.print(".");
    }

    wifi_set_sleep_type(NONE_SLEEP_T);

    Serial.println("");

    Serial.print("IP address: ");
    LOCAL_IP = WiFi.localIP().toString();
    Serial.println(LOCAL_IP);

    //EACH TRIGGER NEEDS THIS TO BE ADDED
    server.on("/", handleRoot);
    server.on("/relay", handleRelay);
    server.on("/get-uptime", handleGetUptime);
    server.on("/get-temperatures", handleGetTemperatures);

    server.onNotFound(handleNotFound);

    //here the list of headers to be recorded
    const char * headerKeys[] = {"User-Agent", "Cookie"};
    size_t headerKeysSize = sizeof(headerKeys) / sizeof(char*);
    //ask server to track these headers
    server.collectHeaders(headerKeys, headerKeysSize );
    server.begin();
    Serial.println("HTTP server started");


    // temperatures
    sensors.begin();
    Serial.println("***************************************************");
    Serial.print("Pocet teplomeru: ");
    Serial.println(sensors.getDeviceCount(), DEC);
    //zjisti adresy
    oneWire.reset_search();
    if (!oneWire.search(temp1)) {
        Serial.println("Temp1 not found!");
    } else {
        Serial.print("Temp 1: ");
        printAddress(temp1);
        sensors.setResolution(temp1, TEMPERATURE_PRECISION);
    }

    if (!oneWire.search(temp2)) {
        Serial.println("Temp2 not found!");
    } else {
        Serial.print("Temp 2: ");
        printAddress(temp2);
        sensors.setResolution(temp2, TEMPERATURE_PRECISION);
    }

    if (!oneWire.search(temp3)) {
        Serial.println("Temp3 not found!");
    } else {
        Serial.print("Temp 3: ");
        printAddress(temp3);
        sensors.setResolution(temp3, TEMPERATURE_PRECISION);
    }

    if (!oneWire.search(temp4)) {
        Serial.println("Temp4 not found!");
    } else {
        Serial.print("Temp 4: ");
        printAddress(temp4);
        sensors.setResolution(temp4, TEMPERATURE_PRECISION);
    }

    if (!oneWire.search(temp5)) {
        Serial.println("Temp5 not found!");
    } else {
        Serial.print("Temp 5: ");
        printAddress(temp5);
        sensors.setResolution(temp5, TEMPERATURE_PRECISION);
    }
    
    Serial.println();
    
    sensors.requestTemperatures();
    //vytiskni data na seriák
    printData(temp1);
    printData(temp2);
    printData(temp3);
    printData(temp4);
    printData(temp5);


    configTime(2 * 3600, 0, "pool.ntp.org", "time.nist.gov", "ntp.nic.cz");
    Serial.println("\nWaiting for time");
    while (!time(nullptr)) {
        Serial.print(".");
        delay(500);
    }
    Serial.println("\nTime done");

    ArduinoOTA.setHostname(OTAhostname);
    ArduinoOTA.onStart([]() {
        Serial.println("Start");
    });
    ArduinoOTA.onEnd([]() {
        Serial.println("\nEnd");
    });
    ArduinoOTA.onProgress([](unsigned int progress, unsigned int total) {
        Serial.printf("Progress: %u%%\r", (progress / (total / 100)));
    });
    ArduinoOTA.onError([](ota_error_t error) {
        Serial.printf("Error[%u]: ", error);
        if (error == OTA_AUTH_ERROR) Serial.println("Auth Failed");
        else if (error == OTA_BEGIN_ERROR) Serial.println("Begin Failed");
        else if (error == OTA_CONNECT_ERROR) Serial.println("Connect Failed");
        else if (error == OTA_RECEIVE_ERROR) Serial.println("Receive Failed");
        else if (error == OTA_END_ERROR) Serial.println("End Failed");
    });
    ArduinoOTA.begin();

    /*
    pinMode(RELAY_1, INPUT);
    pinMode(RELAY_2, INPUT);
    pinMode(RELAY_3, INPUT);
    pinMode(RELAY_4, INPUT);
    pinMode(RELAY_5, INPUT);
    */
}

void loop() {

    ArduinoOTA.handle();
    server.handleClient();

    setRelays();

    sensors.requestTemperatures();
    tempResult1 = String(sensors.getTempC(temp1));
    tempResult2 = String(sensors.getTempC(temp2));
    tempResult3 = String(sensors.getTempC(temp3));
    tempResult4 = String(sensors.getTempC(temp4));
    tempResult5 = String(sensors.getTempC(temp5));

    delay(1000);
}



//pro teploměry
String printAddress(DeviceAddress deviceAddress) {
    String address = "";
    for (uint8_t i = 0; i < 8; i++) {
        // zero pad the address if necessary
        if (deviceAddress[i] < 16) {
            address += "0";
            Serial.print("0");
        }
        address += String(deviceAddress[i]);
        Serial.print(deviceAddress[i], HEX);
    }

    return address;
}

void printData(DeviceAddress deviceAddress) {
    Serial.print("Adresa teplomeru ");
    printAddress(deviceAddress);
    Serial.print(":");
    printTemperature(deviceAddress);
}

void printTemperature(DeviceAddress deviceAddress) {
    float tempC = sensors.getTempC(deviceAddress);
    Serial.print("Teplota: ");
    Serial.print(tempC);
    Serial.write(176);
    Serial.println("C");
}
