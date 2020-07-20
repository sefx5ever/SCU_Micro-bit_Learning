let red = 0
let green = 0
let blue = 0
function trafficLight (num: number) {
    if (num == 0) {
        red = 255
        green = 0
        blue = 0
    } else if (num == 1) {
        red = 255
        green = 255
        blue = 0
    } else if (num == 2) {
        red = 0
        green = 255
        blue = 0
    }
    pins.analogWritePin(AnalogPin.P0, red)
    pins.analogWritePin(AnalogPin.P1, green)
    pins.analogWritePin(AnalogPin.P2, blue)
    basic.pause(1000)
}
basic.forever(function () {
    for (let index = 0; index <= 2; index++) {
        trafficLight(index)
    }
})
