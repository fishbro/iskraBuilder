export const readTime = () => {
    let timeElapsed = Date.now();
    timeElapsed += 3 * 3600 * 1000;
    return new Date(timeElapsed).toISOString().split("T");
};

export const readMem = () => {
    //@ts-ignore
    return process.memory().free;
};

export const wait = (ms: number): Promise<any> =>
    new Promise(resolve => {
        setTimeout(resolve, ms);
    });
