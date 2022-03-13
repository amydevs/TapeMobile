import fs from 'fs'
declare var BrowserFS: any;
declare global {
    interface File {
        path: string
    }
}

export default (() => {
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

    Object.defineProperty(File.prototype, "path", {
        get: function() {
            const file = this as File;
            file.text().then(e => {
                fs.writeFileSync(`/${file.name}`, e)
            })
            return file.name
        }
    })
})
