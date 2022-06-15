var dht = require("DHT11").connect(A0);
var timeElapsed,
    today,
    time,
    temp,
    rh,
    freeMem;

var readTemp = () => {
    dht.read((a) => {
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
var spi = new SPI();
spi.setup({
    mosi:P8, //sda
    sck:P6 //scl
});
var g = require("ST7735").connect({
    palette:colorPalette,
    spi:spi,
    dc:P9,
    cs:P5,
    rst:P10,
    height : 160 // optional, default=128
    // padx : 2 // optional, default=0
    // pady : 3 // optional, default=0
}, function() {
    drawIntro();
    setInterval(draw, 2000);
});


//save();
//reset();
