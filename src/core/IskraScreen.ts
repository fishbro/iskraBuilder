const lib = require("/libs/ST7735");

export type ScreenPins = {
    spi: SPI,
    dc: Pin,
    cs: Pin,
    rst: Pin
}

export default class IskraScreen{
    palette = new Uint16Array([0, 0xF80F, 0x001F, 0xFFFF, 0xFF00]);
    screen = null;
    pins: ScreenPins | null = null;
    height = 160;

    constructor(props: ScreenPins) {
        this.screen = lib.connect({
            ...props,
            palette: this.palette,
            height: this.height
        }, () => {
            this.drawIntro();
        })
    }

    drawIntro(){
        this.screen.clear();
        this.screen.setColor(3);
        this.screen.drawString("Hello",0,0);
        this.screen.setFontVector(20);
        this.screen.setColor(4);
        this.screen.drawString("Espruino",0,10);
        this.screen.flip(); //<--- Send to the display
    }

    get s(){
        return this.screen;
    }
}