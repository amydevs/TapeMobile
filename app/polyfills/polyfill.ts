import enableTouchDrag from './modules/touch-drag'
import enableBrowserFS from './modules/browser-fs'
import enableStyles from './modules/styles'
import enableSync from './modules/sync'
import enableAppListeners from './modules/app'

(async () => {
    enableBrowserFS();
    enableAppListeners();
    enableStyles();
    enableTouchDrag();
    await enableSync();
})()


