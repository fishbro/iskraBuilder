'use strict';

/******************************************************************************
Copyright (c) Microsoft Corporation.

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
PERFORMANCE OF THIS SOFTWARE.
***************************************************************************** */

var __assign = function() {
    __assign = Object.assign || function __assign(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};

var lib$1 = require("/libs/ST7735");
//@ts-ignore
require("/libs/Font6x8").add(Graphics);
var IskraScreen = /** @class */ (function () {
    function IskraScreen(props) {
        var _this = this;
        this.palette = new Uint16Array([0, 0xf80f, 0x001f, 0xffff, 0xff00]);
        this.screen = null;
        this.pins = null;
        this.width = 128;
        this.height = 160;
        this.background = 0;
        this.showText = function (text, coords, options) {
            if (options === void 0) { options = { size: 10, color: 1 }; }
            options.size; var _b = options.color, color = _b === void 0 ? 1 : _b;
            var x = coords[0], y = coords[1];
            _this.screen.setColor(_this.background);
            _this.screen.fillRect(x, y, x + text.toString().length * 6, y + 8);
            _this.screen.setColor(color);
            // this.screen.setFontVector(size);
            _this.screen.drawString(text, x, y);
        };
        this.pins = props;
    }
    IskraScreen.prototype.init = function () {
        var _this = this;
        return new Promise(function (resolve) {
            _this.screen = lib$1.connect(__assign(__assign({}, _this.pins), { palette: _this.palette, height: _this.height }), resolve);
            _this.screen.setFont6x8();
        });
    };
    IskraScreen.prototype.drawIntro = function () {
        var _this = this;
        return new Promise(function (resolve) {
            _this.screen.clear();
            _this.showText("Hello", [0, 0], { color: 3 });
            _this.showText("Espruino", [0, 10], { color: 4 });
            _this.send(); //<--- Send to the display
            var loader = ["\\", "|", "/", "-"];
            var loaderPos = 0;
            var loaderInterval = setInterval(function () {
                _this.showText(loader[loaderPos], [0, 150]);
                _this.send();
                loaderPos++;
                if (loaderPos === loader.length)
                    loaderPos = 0;
            }, 10);
            setTimeout(function () {
                clearInterval(loaderInterval);
                _this.showText("Initialized", [0, 150]);
                _this.send();
                resolve();
            }, 1000);
        });
    };
    Object.defineProperty(IskraScreen.prototype, "g", {
        get: function () {
            return this.screen;
        },
        enumerable: false,
        configurable: true
    });
    IskraScreen.prototype.send = function () {
        this.screen.flip();
    };
    IskraScreen.prototype.clear = function () {
        this.screen.clear();
        this.screen.setColor(this.background);
        this.screen.fillRect(0, 0, this.width, this.height);
        this.send();
    };
    return IskraScreen;
}());

var lib = require("/libs/DHT11");
var IskraTemp = /** @class */ (function () {
    function IskraTemp(pin) {
        this.dht = null;
        this.dht = lib.connect(pin);
    }
    IskraTemp.prototype.readTemp = function () {
        var _this = this;
        return new Promise(function (resolve) {
            _this.dht.read(function (data) {
                resolve({ temp: data.temp.toString(), rh: data.rh.toString() });
            });
        });
    };
    return IskraTemp;
}());

var readTime = function () {
    var timeElapsed = Date.now();
    timeElapsed += 3 * 3600 * 1000;
    return new Date(timeElapsed).toISOString().split("T");
};
var readMem = function () {
    //@ts-ignore
    return process.memory().free;
};
var wait = function (ms) {
    return new Promise(function (resolve) {
        setTimeout(resolve, ms);
    });
};

var pins = {
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
//@ts-ignore
var spi = new SPI();
spi.setup({
    mosi: pins.mosi,
    sck: pins.sck //scl
});
var screen = new IskraScreen({
    spi: spi,
    dc: pins.dc,
    cs: pins.cs,
    rst: pins.rst
});
var temp = new IskraTemp(pins.tempPin);
screen.init().then(function () {
    screen.drawIntro().then(function () {
        screen.clear();
        setInterval(function () {
            var _a = readTime(), date = _a[0], time = _a[1];
            screen.showText(date, [0, 0]);
            screen.showText(time.slice(0, 8), [date.length * 6 + 10, 0]);
            screen.showText(readMem(), [0, 160 - 8]);
            screen.send();
        }, 100);
        var setTemp = function () {
            temp.readTemp()
                .then(function (data) {
                console.log("set temp");
                screen.showText("Cur temp: " + data.temp, [0, 160 - 28]);
                screen.showText("Cur rh: " + data.rh, [0, 160 - 18]);
                screen.send();
            })
                .then(function () { return wait(5000).then(setTemp); });
        };
        setTemp();
    });
});
