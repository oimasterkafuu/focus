async function sleep(duration) {
    return new Promise((resolve) => {
        setTimeout(resolve, duration);
    });
}

async function runAll(...functions) {
    let promises = functions.map((func) => func());
    let results = await Promise.all(promises);
    return results;
}
