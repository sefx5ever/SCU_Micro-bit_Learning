input.onButtonPressed(Button.A, function () {
    serial.writeLine("Name:" + name)
    serial.writeLine("Phone number:" + phone_num)
})
input.onButtonPressed(Button.B, function () {
    serial.writeLine("Height:" + height + "cm")
    serial.writeLine("weight:" + weight + "kg")
})
let height = 0
let weight = 0
let name = ""
let phone_num = ""
phone_num = "0905916241"
name = "Wyne"
weight = 78
height = 170
basic.forever(function () {
    basic.showString("Name:" + name)
    basic.showString("Phone number:" + phone_num)
    basic.showString("Height:" + height + "cm")
    basic.showString("weight:" + weight + "kg")
})
