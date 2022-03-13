import {polyfill} from "mobile-drag-drop";
// optional import of scroll behaviour
import {scrollBehaviourDragImageTranslateOverride} from "mobile-drag-drop/scroll-behaviour";

export default (() =>{
    // options are optional ;)
    polyfill({
        // use this to make use of the scroll behaviour
        dragImageTranslateOverride: scrollBehaviourDragImageTranslateOverride,
        iterationInterval: 20,
    });

    document.addEventListener("dragenter", (event)=> {
        event.preventDefault();
    })
    window.addEventListener( 'touchmove', function() {}, {passive: false});
})