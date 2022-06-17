//@ts-ignore
import * as tween from "micro-tween";
import IskraScreen from "./core/IskraScreen";

const pins: {
    tempPin: Pin,
    mosi: Pin,
    sck: Pin,
    dc: Pin,
    cs: Pin,
    rst: Pin,
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
}

var dht = require("DHT11")
    //@ts-ignore
    .connect(pins.tempPin);
var timeElapsed,
    today,
    time: any,
    temp: any,
    rh: any,
    freeMem: any;

var readTemp = () => {
    dht.read((a:{temp: number, rh:number}) => {
        temp = a.temp.toString();
        rh = a.rh.toString();
    });
};

var readTime = () => {
    timeElapsed = Date.now();
    timeElapsed += 3 * 3600 * 1000;
    today = new Date(timeElapsed);
    time = today.toISOString().split("T");
};

var readMem = () => {
    //@ts-ignore
    freeMem = process.memory().free;
};
//@ts-ignore
var spi: SPI = new SPI();

spi.setup({
    mosi:pins.mosi, //sda
    sck:pins.sck //scl
});

const screen = new IskraScreen({
    spi:spi,
    dc:pins.dc,
    cs:pins.cs,
    rst:pins.rst,
});
