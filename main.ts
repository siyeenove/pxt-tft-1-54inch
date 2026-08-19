/*
* This extension library was developed by the SIYEENOVE team.
* Date: 2026-08-19
* Version: 2.0 - Performance optimized
*/

//% weight=10 color=#00b0ff block="TFT_ST7789" blockId="TFT_ST7789" icon="\uf108"
namespace TFT_ST7789 {
    export enum Color {
        //% block="Black"
        Black = 0x0000,
        //% block="Navy"
        Navy = 0x000F,
        //% block="DarkGreen"
        DarkGreen = 0x03E0,
        //% block="DarkCyan"
        DarkCyan = 0x03EF,
        //% block="Maroon"
        Maroon = 0x7800,
        //% block="Purple"
        Purple = 0x780F,
        //% block="Olive"
        Olive = 0x7BE0,
        //% block="LightGrey"
        LightGrey = 0xC618,
        //% block="DarkGrey"
        DarkGrey = 0x7BEF,
        //% block="Blue"
        Blue = 0x001F,
        //% block="Green"
        Green = 0x07E0,
        //% block="Cyan"
        Cyan = 0x07FF,
        //% block="Red"
        Red = 0xF800,
        //% block="Magenta"
        Magenta = 0xF81F,
        //% block="Yellow"
        Yellow = 0xFFE0,
        //% block="White"
        White = 0xFFFF,
        //% block="Orange"
        Orange = 0xFD20,
        //% block="GreenYellow"
        GreenYellow = 0xAFE5,
        //% block="Pink"
        Pink = 0xF81F
    }

    // ============================================================
    // fixed physical dimensions
    // ============================================================
    let TFTWIDTH = 240
    let TFTHEIGHT = 240
    let currentRotation = 0

    // display memory offset (ST7789 display memory 240x320, display area at the top)
    let _colOffset = 0
    let _rowOffset = 0

    // pin configuration
    let PIN_SCL = DigitalPin.P13
    let PIN_SDA = DigitalPin.P15
    let PIN_RST = DigitalPin.P10
    let PIN_DC = DigitalPin.P4
    let PIN_CS = DigitalPin.P6
    let PIN_BL = DigitalPin.P7

    enum TFTCommands {
        NOP = 0x00,
        SWRESET = 0x01,
        SLPOUT = 0x11,
        NORON = 0x13,
        INVOFF = 0x20,
        INVON = 0x21,
        DISPOFF = 0x28,
        DISPON = 0x29,
        CASET = 0x2A,
        RASET = 0x2B,
        RAMWR = 0x2C,
        MADCTL = 0x36,
        COLMOD = 0x3A,
        PORCTRL = 0xB2,
        GCTRL = 0xB7,
        VCOMS = 0xBB,
        LCMCTRL = 0xC0,
        VDVVRHEN = 0xC2,
        VRHS = 0xC3,
        VDVS = 0xC4,
        FRCTRL2 = 0xC6,
        PWCTRL1 = 0xD0,
        PVGAMCTRL = 0xE0,
        NVGAMCTRL = 0xE1
    }

    // ===== font arrays =====
    let fontOne: number[] = [0x0022d422, 0x0022d422, 0x0022d422, 0x0022d422, 0x0022d422, 0x0022d422,
        0x0022d422, 0x0022d422, 0x0022d422, 0x0022d422, 0x0022d422, 0x0022d422, 0x0022d422, 0x0022d422,
        0x0022d422, 0x0022d422, 0x0022d422, 0x0022d422, 0x0022d422, 0x0022d422]
    let fontTwo: number[] = [0x0022d422, 0x0022d422, 0x0022d422, 0x0022d422, 0x0022d422, 0x0022d422,
        0x0022d422, 0x0022d422, 0x0022d422, 0x0022d422, 0x0022d422, 0x0022d422, 0x00000000, 0x00002a00,
        0x00018060, 0x00afabea, 0x00aed6ea, 0x01991133, 0x010556aa, 0x00000060]
    let fontThree: number[] = [0x000045c0, 0x00003a20, 0x00051140, 0x00023880, 0x00002200, 0x00021080,
        0x00000100, 0x00111110, 0x0007462e, 0x00087e40, 0x000956b9, 0x0005d629, 0x008fa54c, 0x009ad6b7,
        0x008ada88, 0x00119531, 0x00aad6aa, 0x0022b6a2, 0x00000140, 0x00002a00]
    let fontFour: number[] = [0x0008a880, 0x00052940, 0x00022a20, 0x0022d422, 0x00e4d62e, 0x000f14be,
        0x000556bf, 0x0008c62e, 0x0007463f, 0x0008d6bf, 0x000094bf, 0x00cac62e, 0x000f909f, 0x000047f1,
        0x0017c629, 0x0008a89f, 0x0008421f, 0x01f1105f, 0x01f4105f, 0x0007462e]
    let fontFive: number[] = [0x000114bf, 0x000b6526, 0x010514bf, 0x0004d6b2, 0x0010fc21, 0x0007c20f,
        0x00744107, 0x01f4111f, 0x000d909b, 0x00117041, 0x0008ceb9, 0x0008c7e0, 0x01041041, 0x000fc620,
        0x00010440, 0x01084210, 0x00000820, 0x010f4a4c, 0x0004529f, 0x00094a4c]
    let fontSix: number[] = [0x000fd288, 0x000956ae, 0x000097c4, 0x0007d6a2, 0x000c109f, 0x000003a0,
        0x0006c200, 0x0008289f, 0x000841e0, 0x01e1105e, 0x000e085e, 0x00064a4c, 0x0002295e, 0x000f2944,
        0x0001085c, 0x00012a90, 0x010a51e0, 0x010f420e, 0x00644106, 0x01e8221e]
    let fontSeven: number[] = [0x00093192, 0x00222292, 0x00095b52, 0x0008fc80, 0x000003e0, 0x000013f1,
        0x00841080, 0x0022d422]

    // Send data in bulk using an array buffer
    function send(command: TFTCommands, parameter: Array<number>): void {
        pins.digitalWritePin(PIN_DC, 0)
        pins.digitalWritePin(PIN_CS, 0)
        pins.spiWrite(command)
        pins.digitalWritePin(PIN_DC, 1)
        for (let item of parameter) {
            pins.spiWrite(item)
        }
        pins.digitalWritePin(PIN_CS, 1)
    }

    // Send data in bulk - using arrays
    function sendDataArray(data: number[]): void {
        pins.digitalWritePin(PIN_DC, 1)
        pins.digitalWritePin(PIN_CS, 0)
        for (let i = 0; i < data.length; i++) {
            pins.spiWrite(data[i])
        }
        pins.digitalWritePin(PIN_CS, 1)
    }

    // Send duplicate data in bulk
    function sendRepeatedData(hi: number, lo: number, count: number): void {
        pins.digitalWritePin(PIN_DC, 1)
        pins.digitalWritePin(PIN_CS, 0)
        for (let i = 0; i < count; i++) {
            pins.spiWrite(hi)
            pins.spiWrite(lo)
        }
        pins.digitalWritePin(PIN_CS, 1)
    }

    // ============================================================
    // setWindow - apply rotational offset
    // ============================================================
    function setWindow(x0: number, y0: number, x1: number, y1: number): void {
        let cx0 = x0 + _colOffset
        let cx1 = x1 + _colOffset
        let cy0 = y0 + _rowOffset
        let cy1 = y1 + _rowOffset

        send(TFTCommands.CASET, [(cx0 >> 8) & 0xFF, cx0 & 0xFF, (cx1 >> 8) & 0xFF, cx1 & 0xFF])
        send(TFTCommands.RASET, [(cy0 >> 8) & 0xFF, cy0 & 0xFF, (cy1 >> 8) & 0xFF, cy1 & 0xFF])
    }

    function enterDataMode(): void {
        pins.digitalWritePin(PIN_DC, 0)
        pins.digitalWritePin(PIN_CS, 0)
        pins.spiWrite(TFTCommands.RAMWR)
        pins.digitalWritePin(PIN_DC, 1)
    }

    function exitDataMode(): void {
        pins.digitalWritePin(PIN_CS, 1)
        pins.digitalWritePin(PIN_DC, 0)
    }

    //% block="Set pins SCL:%scl|SDA:%sda|RST:%rst|DC:%dc|CS:%cs|BL:%bl"
    //% scl.defl=DigitalPin.P13
    //% sda.defl=DigitalPin.P15
    //% rst.defl=DigitalPin.P10
    //% dc.defl=DigitalPin.P4
    //% cs.defl=DigitalPin.P6
    //% bl.defl=DigitalPin.P7
    //% weight=150
    export function setPins(scl: DigitalPin, sda: DigitalPin, rst: DigitalPin, dc: DigitalPin, cs: DigitalPin, bl: DigitalPin): void {
        PIN_SCL = scl
        PIN_SDA = sda
        PIN_RST = rst
        PIN_DC = dc
        PIN_CS = cs
        PIN_BL = bl
    }

    //% block="Initialize TFT Display"
    //% weight=100
    export function init(): void {
        led.enable(false)

        pins.spiPins(PIN_SDA, null, PIN_SCL)
        pins.spiFormat(8, 0)
        // Increase the SPI frequency to 8MHz
        pins.spiFrequency(8000000)

        // hardware reset
        pins.digitalWritePin(PIN_RST, 1)
        control.waitMicros(10000)
        pins.digitalWritePin(PIN_RST, 0)
        control.waitMicros(10000)
        pins.digitalWritePin(PIN_RST, 1)
        control.waitMicros(150000)

        pins.digitalWritePin(PIN_BL, 1)

        // software reset
        send(TFTCommands.SWRESET, [])
        control.waitMicros(150000)

        // exit sleep
        send(TFTCommands.SLPOUT, [])
        control.waitMicros(120000)

        // 16-bit color
        send(TFTCommands.COLMOD, [0x05])

        // ST7789 specific settings
        send(TFTCommands.PORCTRL, [0x0C, 0x0C, 0x00, 0x33, 0x33])
        send(TFTCommands.GCTRL, [0x35])
        send(TFTCommands.VCOMS, [0x19])
        send(TFTCommands.LCMCTRL, [0x2C])
        send(TFTCommands.VDVVRHEN, [0x01])
        send(TFTCommands.VRHS, [0x12])
        send(TFTCommands.VDVS, [0x20])
        send(TFTCommands.FRCTRL2, [0x0F])
        send(TFTCommands.PWCTRL1, [0xA4, 0xA1])
        send(TFTCommands.PVGAMCTRL, [0xD0, 0x04, 0x0D, 0x11, 0x13, 0x2B, 0x3F, 0x54, 0x4C, 0x18, 0x0D, 0x0B, 0x1F, 0x23])
        send(TFTCommands.NVGAMCTRL, [0xD0, 0x04, 0x0C, 0x11, 0x13, 0x2C, 0x3F, 0x44, 0x51, 0x2F, 0x1F, 0x1F, 0x20, 0x23])

        // most ST7789 IPS screens require color reversal
        send(TFTCommands.INVON, [])

        send(TFTCommands.NORON, [])
        control.waitMicros(10000)

        send(TFTCommands.DISPON, [])
        control.waitMicros(10000)

        // set the rotation to 0 degrees
        setRotation(0)
        clearScreen()
    }

    // ============================================================
    // setRotation - Correct MADCTL configuration
    // ============================================================
    //% block="Set rotation %rotation"
    //% rotation.min=0 rotation.max=3
    //% weight=95
    export function setRotation(rotation: number): void {
        currentRotation = rotation

        let madctl = 0x00
        _colOffset = 0
        _rowOffset = 0

        if (rotation == 0) {
            madctl = 0x00
            _colOffset = 0
            _rowOffset = 0
        } else if (rotation == 1) {
            madctl = 0x60
            _colOffset = 0
            _rowOffset = 0
        } else if (rotation == 2) {
            madctl = 0xC0
            _colOffset = 0
            _rowOffset = 80
        } else if (rotation == 3) {
            madctl = 0xA0
            _colOffset = 80
            _rowOffset = 0
        }

        send(TFTCommands.MADCTL, [madctl])

        let cx0 = _colOffset
        let cx1 = 239 + _colOffset
        let cy0 = _rowOffset
        let cy1 = 239 + _rowOffset
        send(TFTCommands.CASET, [(cx0 >> 8) & 0xFF, cx0 & 0xFF, (cx1 >> 8) & 0xFF, cx1 & 0xFF])
        send(TFTCommands.RASET, [(cy0 >> 8) & 0xFF, cy0 & 0xFF, (cy1 >> 8) & 0xFF, cy1 & 0xFF])
    }

    //% block="Get rotation"
    //% weight=94
    export function getRotation(): number {
        return currentRotation
    }


    // The drawing function uses batch sending
    //% block="Draw single pixel at x:%x|y:%y with color:%color"
    //% x.min=0 x.max=239
    //% y.min=0 y.max=239
    //% weight=90
    export function drawPixel(x: number, y: number, color: Color): void {
        if (x < 0 || x >= TFTWIDTH || y < 0 || y >= TFTHEIGHT) return
        setWindow(x, y, x, y)
        let hiColor = (color >> 8) & 0xFF
        let loColor = color & 0xFF
        send(TFTCommands.RAMWR, [hiColor, loColor])
    }

    //% block="Draw line from x0:%x0|y0:%y0 to x1:%x1|y1:%y1 with color:%color"
    //% x0.min=0 x0.max=239
    //% y0.min=0 y0.max=239
    //% x1.min=0 x1.max=239
    //% y1.min=0 y1.max=239
    //% weight=85
    export function drawLine(x0: number, y0: number, x1: number, y1: number, color: Color): void {
        let dx = Math.abs(x1 - x0)
        let dy = -Math.abs(y1 - y0)
        let sx = x0 < x1 ? 1 : -1
        let sy = y0 < y1 ? 1 : -1
        let err = dx + dy

        while (true) {
            drawPixel(x0, y0, color)
            if (x0 == x1 && y0 == y1) break
            let e2 = 2 * err
            if (e2 >= dy) {
                err += dy
                x0 += sx
            }
            if (e2 <= dx) {
                err += dx
                y0 += sy
            }
        }
    }

    // drawRectangle - Use batch sending
    //% block="Draw rectangle at x:%x|y:%y with width:%width|height:%height|color:%color"
    //% x.min=0 x.max=239
    //% y.min=0 y.max=239
    //% weight=80
    export function drawRectangle(x: number, y: number, width: number, height: number, color: Color): void {
        if (x < 0) { width += x; x = 0 }
        if (y < 0) { height += y; y = 0 }
        if (x + width > TFTWIDTH) width = TFTWIDTH - x
        if (y + height > TFTHEIGHT) height = TFTHEIGHT - y
        if (width <= 0 || height <= 0) return

        let hiColor = (color >> 8) & 0xFF
        let loColor = color & 0xFF

        // Precalculate row data
        let rowData: number[] = []
        for (let i = 0; i < width; i++) {
            rowData.push(hiColor)
            rowData.push(loColor)
        }

        setWindow(x, y, x + width - 1, y + height - 1)
        enterDataMode()

        // Each row is sent in bulk using an array
        for (let row = 0; row < height; row++) {
            sendDataArray(rowData)
        }

        exitDataMode()
    }

    //% block="Draw rectangle outline at x:%x|y:%y with width:%width|height:%height|color:%color"
    //% x.min=0 x.max=239
    //% y.min=0 y.max=239
    //% weight=78
    export function drawRectangleOutline(x: number, y: number, width: number, height: number, color: Color): void {
        drawLine(x, y, x + width - 1, y, color)
        drawLine(x + width - 1, y, x + width - 1, y + height - 1, color)
        drawLine(x + width - 1, y + height - 1, x, y + height - 1, color)
        drawLine(x, y + height - 1, x, y, color)
    }

    // drawCircle - Use batch sending
    //% block="Draw circle at: x:%x|y:%y with radius:%r and color:%color"
    //% x.min=0 x.max=239
    //% y.min=0 y.max=239
    //% weight=75
    export function drawCircle(x: number, y: number, radius: number, color: Color): void {
        let r2 = radius * radius
        let hiColor = (color >> 8) & 0xFF
        let loColor = color & 0xFF

        for (let y1 = -radius; y1 <= radius; y1++) {
            let dx = Math.sqrt(r2 - y1 * y1)
            let x1 = Math.round(dx)
            let xStart = x - x1
            let xEnd = x + x1
            let width = xEnd - xStart + 1

            if (xStart < 0) { width += xStart; xStart = 0 }
            if (xEnd >= TFTWIDTH) width = TFTWIDTH - xStart
            if (width <= 0) continue

            let rowY = y + y1
            if (rowY < 0 || rowY >= TFTHEIGHT) continue

            // Precalculate row data
            let rowData: number[] = []
            for (let i = 0; i < width; i++) {
                rowData.push(hiColor)
                rowData.push(loColor)
            }

            setWindow(xStart, rowY, xStart + width - 1, rowY)
            enterDataMode()
            sendDataArray(rowData)
            exitDataMode()
        }
    }

    //% block="Draw circle outline at: x:%x|y:%y with radius:%r and color:%color"
    //% x.min=0 x.max=239
    //% y.min=0 y.max=239
    //% weight=73
    export function drawCircleOutline(x: number, y: number, radius: number, color: Color): void {
        let f = 1 - radius
        let ddF_x = 1
        let ddF_y = -2 * radius
        let x1 = 0
        let y1 = radius
        drawPixel(x, y + radius, color)
        drawPixel(x, y - radius, color)
        drawPixel(x + radius, y, color)
        drawPixel(x - radius, y, color)
        while (x1 < y1) {
            if (f >= 0) {
                y1--
                ddF_y += 2
                f += ddF_y
            }
            x1++
            ddF_x += 2
            f += ddF_x
            drawPixel(x + x1, y + y1, color)
            drawPixel(x - x1, y + y1, color)
            drawPixel(x + x1, y - y1, color)
            drawPixel(x - x1, y - y1, color)
            drawPixel(x + y1, y + x1, color)
            drawPixel(x - y1, y + x1, color)
            drawPixel(x + y1, y - x1, color)
            drawPixel(x - y1, y - x1, color)
        }
    }

    // showString - Use batch sending
    //% block="Show string:%string at x:%x and y:%y with zoom-level:%zoom color:%color and background color:%bgcolor"
    //% weight=70
    //% x.min=0 x.max=239
    //% y.min=0 y.max=239
    //% zoom.min=1 zoom.max=5
    export function showString(text: string, x: number, y: number, zoom: number, color: Color, bgColor: Color): void {
        let hiColor2 = (color >> 8) & 0xFF
        let loColor2 = color & 0xFF
        let bgHiColor = (bgColor >> 8) & 0xFF
        let bgLoColor = bgColor & 0xFF
        let zoomFactor = zoom
        let index = 0
        let colsel = 0
        let unicode = 0
        let charIndex = 0

        let charHeight = 5 * zoomFactor
        if (y < 0 || y + charHeight > TFTHEIGHT) return

        for (let stringPos = 0; stringPos < text.length; stringPos++) {
            charIndex = text.charCodeAt(stringPos)

            if (charIndex < 20) unicode = fontOne[charIndex]
            else if (charIndex < 40) unicode = fontTwo[charIndex - 20]
            else if (charIndex < 60) unicode = fontThree[charIndex - 40]
            else if (charIndex < 80) unicode = fontFour[charIndex - 60]
            else if (charIndex < 100) unicode = fontFive[charIndex - 80]
            else if (charIndex < 120) unicode = fontSix[charIndex - 100]
            else if (charIndex < 140) unicode = fontSeven[charIndex - 120]
            else unicode = 0

            let charStartX = x + stringPos * 5 * zoomFactor
            if (charStartX + 5 * zoomFactor > TFTWIDTH) break

            let charWidth = 5 * zoomFactor
            let totalPixels = charWidth * charHeight

            // Precomputed character pixel data
            let pixelData: number[] = []

            for (let row = 0; row < 5; row++) {
                for (let zoomY = 0; zoomY < zoomFactor; zoomY++) {
                    for (let col = 0; col < 5; col++) {
                        index = row + col * 5
                        colsel = (unicode & (1 << index))
                        let hi = colsel ? hiColor2 : bgHiColor
                        let lo = colsel ? loColor2 : bgLoColor
                        for (let zoomX = 0; zoomX < zoomFactor; zoomX++) {
                            pixelData.push(hi)
                            pixelData.push(lo)
                        }
                    }
                }
            }

            setWindow(charStartX, y, charStartX + charWidth - 1, y + charHeight - 1)
            enterDataMode()
            sendDataArray(pixelData)
            exitDataMode()
        }
    }

    //% block="Show centered string:%string at y:%y with zoom-level:%zoom color:%color and background color:%bgcolor"
    //% weight=65
    //% y.min=0 y.max=239
    //% zoom.min=1 zoom.max=5
    export function showStringCentered(text: string, y: number, zoom: number, color: Color, bgColor: Color): void {
        let charWidth = 5 * zoom
        let totalWidth = text.length * charWidth
        let x = Math.floor((TFTWIDTH - totalWidth) / 2)
        if (x < 0) x = 0
        showString(text, x, y, zoom, color, bgColor)
    }

    // clearScreen - Use batch sending
    //% block="Clear screen"
    //% weight=60
    export function clearScreen(): void {
        // Precompute an entire row of black data
        let rowData: number[] = []
        for (let i = 0; i < 240; i++) {
            rowData.push(0x00)
            rowData.push(0x00)
        }

        setWindow(0, 0, 239, 239)
        enterDataMode()

        // Send all row data
        for (let row = 0; row < 240; row++) {
            sendDataArray(rowData)
        }

        exitDataMode()
    }

    //% block="Turn display off"
    //% weight=55
    export function turnOff(): void {
        send(TFTCommands.DISPOFF, [])
        pins.digitalWritePin(PIN_BL, 0)
    }

    //% block="Turn display on"
    //% weight=50
    export function turnOn(): void {
        send(TFTCommands.DISPON, [])
        pins.digitalWritePin(PIN_BL, 1)
    }

    //% block="Set backlight brightness %brightness"
    //% brightness.min=0 brightness.max=1023
    //% weight=45
    export function setBrightness(brightness: number): void {
        if (brightness == 0) {
            pins.digitalWritePin(PIN_BL, 0)
        } else if (brightness >= 1023) {
            pins.digitalWritePin(PIN_BL, 1)
        } else {
            pins.analogWritePin(PIN_BL, brightness)
        }
    }
}