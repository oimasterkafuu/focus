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

async function waitUserEnter() {
    await new Promise((resolve) => {
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                document.removeEventListener('keydown', waitUserEnter);
                resolve();
            }
        });
    });
}

function requestFullscreen() {
    let element = document.documentElement;
    if (element.requestFullscreen) {
        element.requestFullscreen();
    } else if (element.mozRequestFullScreen) {
        element.mozRequestFullScreen();
    } else if (element.webkitRequestFullscreen) {
        element.webkitRequestFullscreen();
    }
}
function exitFullscreen() {
    if (document.exitFullscreen) {
        document.exitFullscreen();
    } else if (document.mozCancelFullScreen) {
        document.mozCancelFullScreen();
    } else if (document.webkitExitFullscreen) {
        document.webkitExitFullscreen();
    }
}

async function waitCursor() {
    await $(document.body).css('cursor', 'wait').promise();
}
async function pointCursor() {
    await $(document.body).css('cursor', 'pointer').promise();
}
async function defaultCursor() {
    await $(document.body).css('cursor', 'default').promise();
}
