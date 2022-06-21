//@ts-ignore
import * as tween from "micro-tween";
import IskraScreen from "./core/IskraScreen";
import IskraTemp from "./core/IskraTemp";
import { readTime, readMem, wait } from "./core/IskraHelpers";

const pins: {
    tempPin: Pin;
    mosi: Pin;
    sck: Pin;
    dc: Pin;
    cs: Pin;
    rst: Pin;
} = {
    //@ts-ignore
    tempPin: A0,
    //@ts-ignore
    mosi: P8, //sda
    //@ts-ignore
    sck: P6, //scl
    //@ts-ignore
    dc: P9,
    //@ts-ignore
    cs: P5,
    //@ts-ignore
    rst: P10
};
//@ts-ignore
const spi: SPI = new SPI();
spi.setup({
    mosi: pins.mosi, //sda
    sck: pins.sck //scl
});

const screen = new IskraScreen({
    spi: spi,
    dc: pins.dc,
    cs: pins.cs,
    rst: pins.rst
});

const temp = new IskraTemp(pins.tempPin);

screen.init().then(() => {
    screen.drawIntro().then(() => {
        screen.clear();

        setInterval(() => {
            const [date, time] = readTime();
            screen.g.setColor(4);
            screen.g.fillRect(0, 0, 128, 8);
            screen.showText(date, [0, 0], {
                bgColor: 4
            });
            screen.showText(time.slice(0, 8), [date.length * 6 + 10, 0], {
                bgColor: 4
            });
            screen.showText("Free mem: " + readMem(), [0, 160 - 8]);

            screen.send();
        }, 1000);

        const setTemp = () => {
            temp.readTemp()
                .then(data => {
                    screen.showText("Cur temp: " + data.temp, [0, 160 - 28]);
                    screen.showText("Cur rh: " + data.rh, [0, 160 - 18]);
                    screen.send();
                })
                .then(() => wait(5000).then(setTemp));
        };

        setTemp();
    });
});
