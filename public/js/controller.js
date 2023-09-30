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

function matcher(a, b) {
    if (a.length !== b.length) return b;

    let elementsInB = {};
    let uniqueElements = [];
    for (let i = 0; i < b.length; i++) {
        elementsInB[b[i]] = true;
        if (!a.includes(b[i])) {
            uniqueElements.push(b[i]);
        }
    }

    let result = [];
    for (let i = 0; i < a.length; i++) {
        if (elementsInB[a[i]]) {
            result.push(a[i]);
        } else {
            result.push(uniqueElements.shift());
        }
    }

    return result;
}
