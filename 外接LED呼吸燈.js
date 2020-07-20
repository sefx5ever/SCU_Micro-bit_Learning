let Red = 0
let Green = 0
let Blue = 0
function zeroMachine (num: number) {
    if (num != 0) {
        return num - 1
    } else {
        return 0
    }
}
basic.forever(function () {
    Red = randint(0, 1023)
    Green = randint(0, 1023)
    Blue = randint(0, 1023)
    for (let index = 0; index <= 5; index++) {
        Red = randint(0, 1023)
        Green = randint(0, 1023)
        Blue = randint(0, 1023)
        pins.analogWritePin(AnalogPin.P0, Red)
        pins.analogWritePin(AnalogPin.P1, Green)
        pins.analogWritePin(AnalogPin.P2, Blue)
        basic.pause(500)
    }
    while (true) {
        if (Red != 0 && (Green != 0 && Blue != 0)) {
            Red = zeroMachine(Red)
            Green = zeroMachine(Green)
            Blue = zeroMachine(Blue)
            pins.analogWritePin(AnalogPin.P0, Red)
            pins.analogWritePin(AnalogPin.P1, Green)
            pins.analogWritePin(AnalogPin.P2, Blue)
        } else {
            break;
        }
        basic.pause(1000)
    }
})
