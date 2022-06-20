const lib = require("/libs/ST7735");

export type ScreenPins = {
    spi: SPI;
    dc: Pin;
    cs: Pin;
    rst: Pin;
};

export default class IskraScreen {
    palette = new Uint16Array([0, 0xf80f, 0x001f, 0xffff, 0xff00]);
    screen = null;
    pins: ScreenPins | null = null;
    height = 160;

    constructor(props: ScreenPins) {
        this.screen = lib.connect(
            {
                ...props,
                palette: this.palette,
                height: this.height
            },
            () => {
                this.drawIntro();
            }
        );
    }

    drawIntro() {
        this.screen.clear();
        this.showText("Hello", [0, 0], { color: 3 });
        this.showText("Espruino", [0, 10], { size: 20, color: 4 });
        this.screen.flip(); //<--- Send to the display
    }

    showText = (
        text: string,
        coords: [number, number],
        options: {
            size?: number;
            color?: number | string;
        } = { size: 10, color: 1 }
    ) => {
        const { size = 10, color = 1 } = options;
        const [x, y] = coords;
        this.screen.setColor(color);
        this.screen.setFontVector(size);
        this.screen.drawString(text, x, y);
    };

    get g() {
        return this.screen;
    }
}
