import "../stylesheets/main.css";
import enableTouchDrag from './modules/touch-drag'
import enableBrowserFS from './modules/browser-fs'
import enableStyles from './modules/styles'
import enableSync from './modules/sync'

(async () => {
    enableBrowserFS();
    enableTouchDrag();
    await enableSync();
    enableStyles();
})


