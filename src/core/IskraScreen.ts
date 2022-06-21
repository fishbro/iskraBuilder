const lib = require("/libs/ST7735");
//@ts-ignore
require("/libs/Font6x8").add(Graphics);

export type ScreenPins = {
    spi: SPI;
    dc: Pin;
    cs: Pin;
    rst: Pin;
};

export default class IskraScreen {
    palette = new Uint16Array([0, 0xf80f, 0x001f, 0xffff, 0x1111]);
    screen = null;
    pins: ScreenPins | null = null;
    width = 128;
    height = 160;
    background = 0;

    constructor(props: ScreenPins) {
        this.pins = props;
    }

    init() {
        return new Promise(resolve => {
            this.screen = lib.connect(
                {
                    ...this.pins,
                    palette: this.palette,
                    height: this.height
                },
                resolve
            );
            this.screen.setFont6x8();
        });
    }

    drawIntro() {
        return new Promise<void>(resolve => {
            this.screen.clear();
            this.showText("Hello", [0, 0], { color: 3 });
            this.showText("Espruino", [0, 10], { color: 1 });
            this.send(); //<--- Send to the display

            const loader = ["\\", "|", "/", "-"];
            let loaderPos = 0;
            const loaderInterval = setInterval(() => {
                this.showText(loader[loaderPos], [0, 150]);
                this.send();
                loaderPos++;
                if (loaderPos === loader.length) loaderPos = 0;
            }, 10);

            setTimeout(() => {
                clearInterval(loaderInterval);
                this.showText("Initialized", [0, 150]);
                this.send();
                resolve();
            }, 1000);
        });
    }

    showText = (
        text: string,
        coords: [number, number],
        options: {
            bgColor?: number;
            color?: number | string;
        } = { bgColor: 0, color: 1 }
    ) => {
        const { bgColor = 0, color = 1 } = options;
        const [x, y] = coords;
        this.screen.setColor(bgColor);
        this.screen.fillRect(x, y, x + text.toString().length * 6, y + 8);
        this.screen.setColor(color);
        this.screen.drawString(text, x, y);
    };

    get g() {
        return this.screen;
    }

    send() {
        this.screen.flip();
    }

    clear() {
        this.screen.clear();
        this.screen.setColor(this.background);
        this.screen.fillRect(0, 0, this.width, this.height);
        this.send();
    }
}
