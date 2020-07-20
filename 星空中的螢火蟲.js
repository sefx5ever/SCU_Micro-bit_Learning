let temp_x = 0
let temp_y = 0
function SpiritConverter (num: number) {
    if (num >= -300 && num <= 300) {
        return 2
    } else if (num >= -600 && num <= 600) {
        if (num < 0) {
            return 1
        } else {
            return 3
        }
    } else {
        if (num < 0) {
            return 0
        } else {
            return 4
        }
    }
}
basic.forever(function () {
    temp_x = input.acceleration(Dimension.X)
    temp_y = input.acceleration(Dimension.Y)
    led.toggle(SpiritConverter(temp_x), SpiritConverter(temp_y))
})
