//@ts-ignore
import * as tween from "micro-tween";
import IskraScreen from "./core/IskraScreen";
import IskraTemp from "./core/IskraTemp";
import IskraHelpers from "./core/IskraHelpers";

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

setTimeout(() => {
    screen.showText("Initialized", [0, 150]);
    screen.g.flip();

    console.log(IskraHelpers.readMem(), IskraHelpers.readTime());
    temp.readTemp().then(data => console.log(data));
}, 2000);
