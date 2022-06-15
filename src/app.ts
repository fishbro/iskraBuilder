//@ts-ignore
import tween from "micro-tween";


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

var drawIntro = () => {
    g.clear();
    g.setColor(3);
    g.drawString("Hello",0,0);
    g.setFontVector(20);
    g.setColor(4);
    g.drawString("Espruino",0,10);
    g.flip(); //<--- Send to the display
};

var draw = () => {
    g.clear();

    readTime();
    g.setFontVector(20);
    g.setColor(3);
    g.drawString(time[0],0,0);
    g.setFontVector(25);
    g.setColor(1);
    g.drawString(time[1].substr(0,8),0,22);

    readTemp();
    if(temp && rh){
        g.setColor(1);
        g.setFontVector(15);
        g.drawString("Temp: "+temp,0,160-49);
        g.drawString("Humidity: "+rh+"%",0,160-32);
    }

    readMem();
    g.setColor(2);
    g.setFontVector(13);
    g.drawString("free mem: "+freeMem,0,160-13);

    g.flip();
};

var colorPalette = new Uint16Array([0, 0xF80F, 0x001F, 0xFFFF, 0xFF00]);
//@ts-ignore
var spi: SPI = new SPI();
spi.setup({
    mosi:pins.mosi, //sda
    sck:pins.sck //scl
});
var g = require("ST7735").connect({
    palette:colorPalette,
    spi:spi,
    dc:pins.dc,
    cs:pins.cs,
    rst:pins.rst,
    height : 160 // optional, default=128
    // padx : 2 // optional, default=0
    // pady : 3 // optional, default=0
}, function() {
    drawIntro();
    setInterval(draw, 2000);
});

//save();
//reset();
