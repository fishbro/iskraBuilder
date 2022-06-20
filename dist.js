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
var IskraScreen = /** @class */ (function () {
    function IskraScreen(props) {
        var _this = this;
        this.palette = new Uint16Array([0, 0xf80f, 0x001f, 0xffff, 0xff00]);
        this.screen = null;
        this.pins = null;
        this.height = 160;
        this.showText = function (text, coords, options) {
            if (options === void 0) { options = { size: 10, color: 1 }; }
            var _a = options.size, size = _a === void 0 ? 10 : _a, _b = options.color, color = _b === void 0 ? 1 : _b;
            var x = coords[0], y = coords[1];
            _this.screen.setColor(color);
            _this.screen.setFontVector(size);
            _this.screen.drawString(text, x, y);
        };
        this.screen = lib$1.connect(__assign(__assign({}, props), { palette: this.palette, height: this.height }), function () {
            _this.drawIntro();
        });
    }
    IskraScreen.prototype.drawIntro = function () {
        this.screen.clear();
        this.showText("Hello", [0, 0], { color: 3 });
        this.showText("Espruino", [0, 10], { size: 20, color: 4 });
        this.screen.flip(); //<--- Send to the display
    };
    Object.defineProperty(IskraScreen.prototype, "g", {
        get: function () {
            return this.screen;
        },
        enumerable: false,
        configurable: true
    });
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

var IskraHelpers = /** @class */ (function () {
    function IskraHelpers() {
    }
    IskraHelpers.readTime = function () {
        var timeElapsed = Date.now();
        timeElapsed += 3 * 3600 * 1000;
        return new Date(timeElapsed).toISOString().split("T");
    };
    IskraHelpers.readMem = function () {
        //@ts-ignore
        return process.memory().free;
    };
    return IskraHelpers;
}());

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
setTimeout(function () {
    screen.showText("Initialized", [0, 150]);
    screen.g.flip();
    console.log(IskraHelpers.readMem(), IskraHelpers.readTime());
    temp.readTemp().then(function (data) { return console.log(data); });
}, 2000);
