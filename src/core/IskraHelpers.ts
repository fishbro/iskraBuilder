export default class IskraHelpers {
    static readTime = () => {
        let timeElapsed = Date.now();
        timeElapsed += 3 * 3600 * 1000;
        return new Date(timeElapsed).toISOString().split("T");
    };

    static readMem = () => {
        //@ts-ignore
        return process.memory().free;
    };
}
