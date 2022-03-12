import "../stylesheets/main.css";
import {polyfill} from "mobile-drag-drop";

// optional import of scroll behaviour
import {scrollBehaviourDragImageTranslateOverride} from "mobile-drag-drop/scroll-behaviour";

// options are optional ;)
polyfill({
    // use this to make use of the scroll behaviour
    dragImageTranslateOverride: scrollBehaviourDragImageTranslateOverride
});

document.addEventListener("dragenter", (event)=> {
    event.preventDefault();
})
window.addEventListener( 'touchmove', function() {}, {passive: false});

window.addEventListener('load', function () {
    const styles = window.document.styleSheets;
    for (const style of Object.values(styles)) {
        for (const rule of Object.values(style.cssRules)) {
            if (rule instanceof CSSStyleRule) {
                if (rule.selectorText.includes(":hover")) {
                    rule.selectorText = `${rule.selectorText}, ${rule.selectorText.replace(":hover", ".hover")}`;
                    // rule.selectorText = rule.selectorText.replace(':hover', '')
                    // console.log(rule.selectorText);
                }
            }
        }
    }
    styles[0].insertRule(".item > #label { border-right: none !important }")
    document.querySelector("#newCollection").classList.add("hover");

    const nonhoversel = ".newItemControl:not(.hover)";
    for (const hoverable of Object.values(document.querySelectorAll(nonhoversel))) {
        hoverable.classList.add("hover");
    }
    const mutobs = new MutationObserver(e => {
        for (const hoverable of Object.values(document.querySelectorAll(nonhoversel))) {
            hoverable.classList.add("hover");
        }
    })
    mutobs.observe(document.querySelector("#main"), {childList:true})
    const errFunc = window.onerror.bind({});
    window.onerror = function myErrorHandler(error, url, lineNumber) {
        if (error.toString().includes("'length'")) {}
        else {errFunc(error, url, lineNumber)}
        
    };

    styles[0].insertRule(".group > .graph { min-height: 12px !important; position: relative; }")
    styles[0].insertRule('.group > .graph::after { content:""; display: block; position: absolute; left: 40%; right: 40%; bottom: 5px; height: 1px; background: rgb(246, 245, 240); transition-property: opacity, visibility; transition-duration: 0.4s, 0.3s; transition-timing-function: ease, ease; transition-delay: 0.2s; }')
    styles[0].insertRule('.group > .graph:hover::after { opacity: 0 }')
})  

declare var BrowserFS: any;

BrowserFS.install(window);
  // Configures BrowserFS to use the LocalStorage file system.
BrowserFS.configure({
    fs: "LocalStorage"
}, function(e: any) {
    if (e) {
        // An error happened!
        throw e;
    }
    // Otherwise, BrowserFS is ready-to-use!
});

