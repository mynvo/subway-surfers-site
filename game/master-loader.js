"use strict";
var scripts = document.getElementsByTagName("script"),
    scriptUrl = scripts[scripts.length - 1].src,
    root = scriptUrl.split("master-loader.js")[0],
    loaders = {
        unity: "unity.js",
        "unity-beta": "unity-beta.js",
        "unity-2020": "unity-2020.js"
    };
if (0 <= window.location.href.indexOf("pokiForceLocalLoader") && (loaders.unity = "/unity/dist/unity.js", loaders["unity-beta"] = "/unity-beta/dist/unity-beta.js", loaders["unity-2020"] = "/unity-2020/dist/unity-2020.js", root = "/loaders"), !window.config) throw Error("window.config not found");
var loader = loaders[window.config.loader];
if (!loader) throw Error('Loader "' + window.config.loader + '" not found');
if (!window.config.unityWebglLoaderUrl) {
    var versionSplit = window.config.unityVersion ? window.config.unityVersion.split(".") : [],
        year = versionSplit[0],
        minor = versionSplit[1];
    switch (year) {
        case "2019":
            window.config.unityWebglLoaderUrl = 1 === minor ? "UnityLoader.2019.1.js" : "UnityLoader.2019.2.js";
            break;
        default:
            window.config.unityWebglLoaderUrl = "UnityLoader.js"
    }
}

// === DÉSACTIVATION POKI SDK (OPTIONNEL MAIS RECOMMANDÉ) ===
// var sdkScript = document.createElement("script");
// sdkScript.src = "poki-sdk.js";
// sdkScript.onload = function() {
//     var i = document.createElement("script");
//     i.src = root + loader;
//     document.body.appendChild(i);
// };
// document.body.appendChild(sdkScript);

// === CHARGEMENT DIRECT DU LOADER (SANS POKI) ===
var i = document.createElement("script");
i.src = root + loader;
document.body.appendChild(i);

// =============== MYNVO PATCH - Gestion des touches personnalisées ===============
console.log("%c[MYNVO GAME] Touch remapping system loaded", "color: #00ff00; font-weight: bold;");

const keysPressed = {};

window.addEventListener("message", (e) => {
    const data = e.data;
    if (!data || !data.type) return;

    if (data.type === "refocus") {
        const canvas = document.querySelector("canvas");
        if (canvas) {
            canvas.setAttribute("tabindex", "1");
            canvas.focus();
            console.log("%c[MYNVO GAME] Canvas refocused via message!", "color: #22c55e; font-weight: bold;");
        }
        return;
    }

    if (data.type === "keydown") {
        const key = data.key;
        const keyCode = data.keyCode;
        if (keysPressed[keyCode]) return;
        keysPressed[keyCode] = true;

        console.log("%c[MYNVO GAME] Keydown:", "color: #00ff00;", key, "keyCode:", keyCode);

        const event1 = new KeyboardEvent("keydown", { keyCode, which: keyCode, bubbles: true, cancelable: true });
        const event2 = new KeyboardEvent("keydown", { key, code: getCodeFromKeyCode(keyCode), keyCode, which: keyCode, bubbles: true, cancelable: true, composed: true });

        [event1, event2].forEach(ev => {
            document.dispatchEvent(ev);
            window.dispatchEvent(ev);
            const canvas = document.querySelector("canvas");
            if (canvas) canvas.dispatchEvent(ev);
            document.querySelectorAll("#canvas, #unity-canvas, [id*='canvas']").forEach(el => el.dispatchEvent(ev));
        });
    }

    if (data.type === "keyup") {
        const key = data.key;
        const keyCode = data.keyCode;
        keysPressed[keyCode] = false;

        console.log("%c[MYNVO GAME] Keyup:", "color: #ff6b6b;", key, "keyCode:", keyCode);

        const event1 = new KeyboardEvent("keyup", { keyCode, which: keyCode, bubbles: true, cancelable: true });
        const event2 = new KeyboardEvent("keyup", { key, code: getCodeFromKeyCode(keyCode), keyCode, which: keyCode, bubbles: true, cancelable: true, composed: true });

        [event1, event2].forEach(ev => {
            document.dispatchEvent(ev);
            window.dispatchEvent(ev);
            const canvas = document.querySelector("canvas");
            if (canvas) canvas.dispatchEvent(ev);
            document.querySelectorAll("#canvas, #unity-canvas, [id*='canvas']").forEach(el => el.dispatchEvent(ev));
        });
    }
});

function getCodeFromKeyCode(keyCode) {
    const codeMap = { 38: 'ArrowUp', 40: 'ArrowDown', 37: 'ArrowLeft', 39: 'ArrowRight', 32: 'Space', 87: 'KeyW', 65: 'KeyA', 83: 'KeyS', 68: 'KeyD', 90: 'KeyZ', 81: 'KeyQ' };
    return codeMap[keyCode] || '';
}

window.addEventListener("load", () => {
    console.log("%c[MYNVO GAME] Game loaded!", "color: #ffd700; font-weight: bold;");
   
    if (window.parent && window.parent !== window) {
        window.parent.postMessage({ type: "mynvo_game_loaded" }, "*");
    }

    let canvasFound = false;
    const checkCanvas = setInterval(() => {
        const canvas = document.querySelector("canvas");
        if (canvas && !canvasFound) {
            canvasFound = true;
            console.log("%c[MYNVO GAME] Unity canvas detected!", "color: #00ff00; font-weight: bold;");
            clearInterval(checkCanvas);

            function focusCanvas() {
                canvas.setAttribute("tabindex", "1");
                canvas.focus();
                console.log("%c[MYNVO GAME] Canvas focused!", "color: #22c55e; font-weight: bold;");
            }

            focusCanvas();
            canvas.addEventListener("click", focusCanvas);
            canvas.addEventListener("mousedown", focusCanvas);
            setInterval(focusCanvas, 2000);

            canvas.addEventListener("keydown", (e) => {
                console.log("%c[MYNVO GAME] Canvas received keydown:", "color: #58a6ff;", e.keyCode);
            });
        }
    }, 100);

    setTimeout(() => clearInterval(checkCanvas), 15000);
});

console.log("%c[MYNVO GAME] Master loader initialized - Waiting for postMessage...", "color: #58a6ff; font-weight: bold;");
