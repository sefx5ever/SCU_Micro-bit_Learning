let turn = false
let temp = 0
function checkCondition (num: number) {
    if (num == 0) {
        turn = true
    } else if (num == 1022) {
        turn = false
    }
}
basic.forever(function () {
    turn = true
    temp = 0
    while (true) {
        if (turn) {
            temp = temp + 1
            checkCondition(temp)
        } else {
            temp = temp - 1
            checkCondition(temp)
        }
        pins.analogWritePin(AnalogPin.P0, temp)
        serial.writeLine("" + (temp))
    }
})
