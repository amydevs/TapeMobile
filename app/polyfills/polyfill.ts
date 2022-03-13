import "../stylesheets/main.css";
import {polyfill} from "mobile-drag-drop";
import $ from "jquery";

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

    // polyfill all hovers to also work with a ".hover" utility class
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
    
    // polyfill hovers to always trigger
    const nonhoversel = ".newItemControl:not(.hover)";
    $(nonhoversel).toggleClass("hover");
    document.querySelector("#newCollection").classList.add("hover");
    const mutobs = new MutationObserver(e => {
        $(nonhoversel).toggleClass("hover");
        // for (const hoverable of Object.values(document.querySelectorAll(nonhoversel))) {
        //     hoverable.classList.add("hover");
        // }
    })
    mutobs.observe(document.querySelector("#main"), {childList:true})
    
    // fix for drag over
    const errFunc = window.onerror.bind({});
    window.onerror = function myErrorHandler(error, url, lineNumber) {
        if (error.toString().includes("'length'")) {}
        else {errFunc(error, url, lineNumber)}
    };

    // remove border on label for items
    styles[0].insertRule(".item > #label { border-right: none !important }");

    // make graph bigger for touch devices
    styles[0].insertRule(".group > .graph { min-height: 12px !important; position: relative; }")
    styles[0].insertRule('.group > .graph::after { content:""; display: block; position: absolute; left: 40%; right: 40%; bottom: 5px; height: 1px; background: rgb(246, 245, 240); transition-property: opacity, visibility; transition-duration: 0.4s, 0.3s; transition-timing-function: ease, ease; transition-delay: 0.2s; }')
    styles[0].insertRule('.group > .graph:hover::after { opacity: 0 }')
    
    function createButton(text: string, onclick: (ev: MouseEvent)=>any) {
        const button = document.createElement("div");
        button.innerText = text;
        button.onclick = onclick;
        return button;
    }
    const toolbar = document.createElement("div")
    toolbar.style.marginTop = "10px"
    toolbar.style.justifyContent = "space-around"
    toolbar.style.textAlign = "center"
    toolbar.classList.add("status")
    toolbar.appendChild(createButton("Search", (e) => {
        document.dispatchEvent(new KeyboardEvent('keydown', {
            keyCode: 70,
            ctrlKey: true,
        }));
    }))
    toolbar.appendChild(createButton("Go To", (e) => {
        document.dispatchEvent(new KeyboardEvent('keydown', {
            keyCode: 71,
            ctrlKey: true,
        }));
    }))
    toolbar.appendChild(createButton("Toggle Secret", (e) => {
        document.dispatchEvent(new KeyboardEvent('keydown', {
            keyCode: 80,
            ctrlKey: true,
            shiftKey: true
        }));
    }))
    
    document.querySelector("header > .group").appendChild(toolbar)
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

