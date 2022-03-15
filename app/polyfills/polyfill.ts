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
})()


