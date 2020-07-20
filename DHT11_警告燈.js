let red = 0
let green = 0
let blue = 0
basic.forever(function () {
    dht11_dht22.queryData(
    DHTtype.DHT11,
    DigitalPin.P11,
    true,
    false,
    true
    )
    serial.writeLine("DHT11_temp" + dht11_dht22.readData(dataType.temperature))
    serial.writeLine("DHT11_humid" + dht11_dht22.readData(dataType.humidity))
    if (dht11_dht22.readData(dataType.temperature) > 32) {
        red = 1023
        green = 0
        blue = 0
    } else {
        red = 0
        green = 1023
        blue = 0
    }
    pins.analogWritePin(AnalogPin.P0, red)
    pins.analogWritePin(AnalogPin.P1, green)
    pins.analogWritePin(AnalogPin.P2, blue)
})
