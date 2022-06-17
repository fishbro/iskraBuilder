'use strict';

const lib = require("/libs/ST7735");
class IskraScreen {
    constructor(props) {
        this.palette = new Uint16Array([0, 0xF80F, 0x001F, 0xFFFF, 0xFF00]);
        this.screen = null;
        this.pins = null;
        this.height = 160;
        this.screen = lib.connect(Object.assign(Object.assign({}, props), { palette: this.palette, height: this.height }), () => {
            this.drawIntro();
        });
    }
    drawIntro() {
        this.screen.clear();
        this.screen.setColor(3);
        this.screen.drawString("Hello", 0, 0);
        this.screen.setFontVector(20);
        this.screen.setColor(4);
        this.screen.drawString("Espruino", 0, 10);
        this.screen.flip(); //<--- Send to the display
    }
    get s() {
        return this.screen;
    }
}

const pins = {
    //@ts-ignore
    tempPin: A0,
    //@ts-ignore
    mosi: P8,
    //@ts-ignore
    sck: P6,
    //@ts-ignore
    dc: P9,
    //@ts-ignore
    cs: P5,
    //@ts-ignore
    rst: P10
};
require("DHT11")
    //@ts-ignore
    .connect(pins.tempPin);
//@ts-ignore
var spi = new SPI();
spi.setup({
    mosi: pins.mosi,
    sck: pins.sck //scl
});
new IskraScreen({
    spi: spi,
    dc: pins.dc,
    cs: pins.cs,
    rst: pins.rst,
});
