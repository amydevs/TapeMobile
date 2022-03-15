import './modules/tape/tapedata'

import enableTouchDrag from './modules/touch-drag'
import enableBrowserFS from './modules/browser-fs'
import enableStyles from './modules/styles'
import enableSync from './modules/sync'
import enableAppListeners from './modules/app'
// import "./modules/drag-drop-touch"

import { Capacitor } from '@capacitor/core';

(async () => {
    enableBrowserFS();
    enableTouchDrag();
    enableAppListeners();
    enableStyles();
    if (Capacitor.getPlatform() !== "web") {
        await enableSync();
    }
    else {
        window.addEventListener("load", async () => {
            if ("serviceWorker" in navigator) {
                try {
                    const sw = await navigator.serviceWorker.register("/sw.js");
                    console.log("registered service worker");
                }
                catch(e) {
                    console.warn("failed to register service worker", e);
                }
            }
        });
    }
})()


