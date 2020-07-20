let no = 0
let angle = 0
ESP8266ThingSpeak.connectWifi(
SerialPin.P15,
SerialPin.P14,
BaudRate.BaudRate115200,
"Jie",
"123456789"
)
basic.forever(function () {
    dht11_dht22.queryData(
    DHTtype.DHT11,
    DigitalPin.P11,
    true,
    false,
    true
    )
    angle = 0
    for (let index = 0; index < 4; index++) {
        angle += 90
        no += 1
        ESP8266ThingSpeak.connectThingSpeak(
        "api.thingspeak.com",
        "CSW3DRBQ9R9Y0SI4",
        control.eventTimestamp(),
        no,
        input.temperature(),
        dht11_dht22.readData(dataType.humidity),
        0,
        0,
        0,
        0
        )
        ESP8266ThingSpeak.wait(5000)
    }
})
