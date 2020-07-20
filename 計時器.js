function LightType (num: number) {
    if (num == 0) {
        basic.showLeds(`
            # # # # #
            . . . . .
            . . . . .
            . . . . .
            . . . . .
            `)
    } else if (num == 1) {
        basic.showLeds(`
            # # # # #
            # # # # #
            . . . . .
            . . . . .
            . . . . .
            `)
    } else if (num == 2) {
        basic.showLeds(`
            # # # # #
            # # # # #
            # # # # #
            . . . . .
            . . . . .
            `)
    } else if (num == 3) {
        basic.showLeds(`
            # # # # #
            # # # # #
            # # # # #
            # # # # #
            . . . . .
            `)
    } else {
        basic.showLeds(`
            # # # # #
            # # # # #
            # # # # #
            # # # # #
            # # # # #
            `)
    }
}
let time = input.runningTime()
let reverse = false
let show_num = 0
while (true) {
    LightType(show_num)
    control.waitMicros(1000000)
    if (show_num == 0) {
        reverse = false
    } else if (show_num == 4) {
        reverse = true
    }
    if (reverse) {
        show_num = show_num - 1
    } else {
        show_num = show_num + 1
    }
}
