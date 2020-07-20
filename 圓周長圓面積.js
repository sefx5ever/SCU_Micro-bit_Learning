let read_str = ""
let read_num = 0
basic.forever(function () {
    read_str = serial.readLine()
    read_num = parseInt(read_str)
    serial.writeLine("radius of the circle is: " + read_num)
    serial.writeLine("Length of circumference is: " + read_num * 3.1415926 * 2)
    serial.writeLine("Area of a circle is: " + read_num * 3.1415926 * 3.1415926)
})
