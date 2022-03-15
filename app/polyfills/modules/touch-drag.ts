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

    if (!("path" in Event.prototype)) {
        Reflect.defineProperty(Event.prototype, "path", {
            get: function() {
                return (this as DragEvent).composedPath()
            }
        })
    }

    window.addEventListener("load", function() {
        // fix for drag over
        const errFunc = window.onerror.bind({});
        window.onerror = function myErrorHandler(error, url, lineNumber) {
            if (error.toString().includes("length")) {}
            else {errFunc(error, url, lineNumber)}
        };
    })
})