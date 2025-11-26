"use strict";
var scripts = document.getElementsByTagName("script"),
    scriptUrl = scripts[scripts.length - 1].src,
    root = scriptUrl.split("master-loader.js")[0];

// CHARGE DIRECTEMENT LE LOADER UNITY SANS POKI
var script = document.createElement("script");
script.src = root + "unity.js";
document.body.appendChild(script);

console.log("%c[MYNVO] Loader Unity chargé (Poki désactivé)", "color: #00ff00; font-weight: bold;");
