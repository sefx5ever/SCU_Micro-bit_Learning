let degree = 0
function direction (num: number) {
    if (num >= 315 || num <= 45) {
        basic.showString("N")
    } else if (num >= 46 && num <= 135) {
        basic.showString("E")
    } else if (num >= 136 && num <= 225) {
        basic.showString("S")
    } else if (num >= 226 && num <= 314) {
        basic.showString("W")
    }
}
basic.forever(function () {
    degree = input.compassHeading()
    direction(degree)
})
