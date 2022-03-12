BrowserFS.install(window);
  // Configures BrowserFS to use the LocalStorage file system.
BrowserFS.configure({
    fs: "LocalStorage"
}, function(e) {
    if (e) {
        // An error happened!
        throw e;
    }
    // Otherwise, BrowserFS is ready-to-use!
});