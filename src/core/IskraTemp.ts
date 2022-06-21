const lib = require("/libs/DHT11");

export default class IskraTemp {
    dht = null;

    constructor(pin) {
        this.dht = lib.connect(pin);
    }

    readTemp() {
        return new Promise<{ temp: string; rh: string }>(resolve => {
            this.dht.read((data: { temp: number; rh: number }) => {
                resolve({ temp: data.temp.toString(), rh: data.rh.toString() });
            });
        });
    }
}
