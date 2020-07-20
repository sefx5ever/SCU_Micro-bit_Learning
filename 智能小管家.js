let startCount: boolean = false
let result: boolean = false
let last_upload_successful: boolean = false
let thingspeak_connected: boolean = false
let wifi_connected: boolean = false
let status: string = "wait"
let sec: number = 0
let random_face: number
// To check status in timer mode
// To initialize and connect WiFi

basic.showIcon(IconNames.SmallHeart)

connectWifi(
    SerialPin.P15,
    SerialPin.P14,
    BaudRate.BaudRate115200,
    "Jie",
    "123456789"
)

// Show status of WiFi connection
if (isWifiConnected()) {
    basic.showIcon(IconNames.Yes)
} else {
    basic.showIcon(IconNames.No)
}

// Press A Button for clearing screen, but it can also minus one sec. when it is in timer mode
input.onButtonPressed(Button.A, function () {
    if (status == "ready") {
        sec += -1
    } else {
        basic.clearScreen()
    }
})

// On gesture to alert that microbit is faint
input.onGesture(Gesture.Shake, function () {
    basic.showLeds(`
        . . . . .
        . # . # .
        . . . . .
        . # # # .
        # . . . #
        `)
})

// Press A + B Button for change timer mode and start timer
input.onButtonPressed(Button.AB, function () {
    if (status == "wait") {
        sec = 0
        basic.showNumber(sec)
        status = "ready"
    } else if (status == "ready") {
        if (sec > 0) {
            startCount = true
            status = "start"
            while (startCount) {
                if (sec >= 0) {
                    basic.showNumber(sec)
                    sec += -1
                } else {
                    break;
                }
            }
            basic.showString("THE END")
        } else {
            basic.showString("Invalid Number!")
        }
        status = "wait"
    } else {
        serial.writeLine(status)
        basic.showString("ERROR")
    }
})
// Press B Button for random emoji, but it also can add one sec. when it is in timer mode
input.onButtonPressed(Button.B, function () {
    if (status == "ready") {
        sec += 1
    } else if (status == "start") {
        startCount = false
    } else {
        random_face = randint(0, 5)
        faceExpression(random_face)
    }
})

// Run forever
basic.forever(function () {
    if (status == "ready") {
        basic.showNumber(sec)
    } else if (status == "start") {
        serial.writeString("Counting")
    } else {
        dht11_dht22.queryData(DHTtype.DHT11, DigitalPin.P11, true, false, true)
        let temperature = input.temperature()
        let hudmidity = dht11_dht22.readData(dataType.humidity)
        let timestamp = control.eventTimestamp()
        if ( temperature >= 31 ) {
            connect_IFTTT(
                "maker.ifttt.com",                            //Host
                "Line_Chatbot",                               //Event Name
                "c3XtVyxdRS2hIZjh_RYsMg",                     //Key
                timestamp,                                    //value1                 
                temperature,                                  //value2
                hudmidity                                     //value3
            )
        }
        connect_IFTTT(
            "maker.ifttt.com",                            //Host
            "Google_Sheet",                               //Event Name
            "c3XtVyxdRS2hIZjh_RYsMg",                     //Key
            timestamp,                                    //value1                 
            temperature,                                  //value2
            hudmidity                                     //value3
        )
        basic.showNumber(temperature)
        basic.pause(1000)
    }
})

// write AT command with CR+LF ending
function sendAT (command: string, wait: number) {
    serial.writeString(command + "\u000D\u000A")
    basic.pause(wait)
}

// wait for certain response from ESP8266
function waitResponse () {
    let serial_str: string = ""
    let result: boolean = false
    let time: number = input.runningTime()
    while (true) {
        serial_str += serial.readString()
        if (serial_str.length > 200) serial_str = serial_str.substr(serial_str.length - 200)
        if (serial_str.includes("OK") || serial_str.includes("ALREADY CONNECTED")) {
            result = true
            break
        } else if (serial_str.includes("ERROR") || serial_str.includes("SEND FAIL")) {
            break
        }
        if (input.runningTime() - time > 30000) break
    }
    return result
}

/**
* Initialize ESP8266 module and connect it to Wifi router
*/
//% block="Initialize ESP8266|RX (Tx of micro:bit) %tx|TX (Rx of micro:bit) %rx|Baud rate %baudrate|Wifi SSID = %ssid|Wifi PW = %pw"
//% tx.defl=SerialPin.P0
//% rx.defl=SerialPin.P1
//% ssid.defl=your_ssid
//% pw.defl=your_pw
function connectWifi (tx: SerialPin, rx: SerialPin, baudrate: BaudRate, ssid: string, pw: string) {
    wifi_connected = false
    thingspeak_connected = false
    serial.redirect(
        tx,
        rx,
        baudrate
    )
    sendAT("AT+RESTORE", 1000)
    sendAT("AT+CWMODE=1", 100)
    sendAT("AT+RST", 1000)
    sendAT("AT+CWJAP=\"" + ssid + "\",\"" + pw + "\"", 0) // connect to Wifi router
    wifi_connected = waitResponse()
    basic.pause(100)
}

/**
* Connect to ThingSpeak and upload data. It would not upload anything if it failed to connect to Wifi or ThingSpeak.
*/
//% block="Upload data to ThingSpeak|URL/IP = %ip|Write API key = %write_api_key|Field 1 = %n1|Field 2 = %n2|Field 3 = %n3|Field 4 = %n4|Field 5 = %n5|Field 6 = %n6|Field 7 = %n7|Field 8 = %n8"
//% ip.defl=api.thingspeak.com
//% write_api_key.defl=your_write_api_key
function connectThingSpeak(ip: string, write_api_key: string, n1: number, n2: number, n3: number, n4: number, n5: number, n6: number, n7: number, n8: number) {
    if (wifi_connected && write_api_key != "") {
        thingspeak_connected = false
        sendAT("AT+CIPSTART=\"TCP\",\"" + ip + "\",80", 0) // connect to website server
        thingspeak_connected = waitResponse()
        basic.pause(100)
        if (thingspeak_connected) {
            last_upload_successful = false
            let str: string = "GET /update?api_key=" + write_api_key + "&field1=" + n1 + "&field2=" + n2 + "&field3=" + n3 + "&field4=" + n4 + "&field5=" + n5 + "&field6=" + n6 + "&field7=" + n7 + "&field8=" + n8
            sendAT("AT+CIPSEND=" + (str.length + 2), 100)
            sendAT(str, 0) // upload data
            last_upload_successful = waitResponse()
            basic.pause(100)
        }
    }
}

// The time(second) to start with
function connect_IFTTT (host: string, eventName: string, key: string, n1: number, n2: number, n3: number) {
    if (wifi_connected && key != "") {
        sendAT("AT+CIPSTART=\"TCP\",\"" + host + "\",80", 0) // connect to website server
        basic.pause(100)
        last_upload_successful = false
        // + "," + n2 + "," + n3 
        let str: string = "GET /trigger/" + eventName + "/with/key/" + key + "?value1=" + n1 + "&value2=" + n2 + "&value3=" + n3 + " HTTP/1.1" + "\u000D\u000A" + "Host: maker.ifttt.com" + "\u000D\u000A" + "Connection: close" + "\u000D\u000A" + "\u000D\u000A";
        sendAT("AT+CIPSEND=" + (str.length + 2), 100)
        sendAT(str, 0) // upload data
        basic.pause(100)
    }
}

/**
* Wait between uploads  
*/
//% block="Wait %delay ms"
//% delay.min=0 delay.defl=5000
function wait(delay: number) {
    if (delay > 0) basic.pause(delay)
}

/**
* Check if ESP8266 successfully connected to Wifi
*/
//% block="Wifi connected ?"
function isWifiConnected() {
    return wifi_connected
}

/**
* Check if ESP8266 successfully connected to ThingSpeak
*/
//% block="ThingSpeak connected ?"
function isThingSpeakConnected() {
    return thingspeak_connected
}

/**
* Check if ESP8266 successfully uploaded data to ThingSpeak
*/
//% block="Last data upload successful ?"
function isLastUploadSuccessful() {
    return last_upload_successful
}

// Function for randomly show emoji
function faceExpression (emoji: number) {
    if (emoji == 0) {
        basic.showIcon(IconNames.Happy)
    } else if (emoji == 1) {
        basic.showIcon(IconNames.Heart)
    } else if (emoji == 2) {
        basic.showIcon(IconNames.Meh)
    } else if (emoji == 3) {
        basic.showIcon(IconNames.Fabulous)
    } else if (emoji == 4) {
        basic.showIcon(IconNames.EigthNote)
    } else if (emoji == 5) {
        basic.showIcon(IconNames.Chessboard)
    }
}