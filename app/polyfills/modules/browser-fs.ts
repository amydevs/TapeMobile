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

    Reflect.defineProperty(File.prototype, "path", {
        get: function() {
            const file = this as File;

            try {
                const existingFile = fs.readFileSync(`/${file.name}`)
                if (file.size > 10485760 && file.size === new File([existingFile.toString()], file.name).size) {
                    // do nothing
                }
                else throw new Error("catch")
            }
            catch {
                console.log("wrote")
                fs.writeFileSync(`/${file.name}`, Buffer.from(blobToUint8Array(file)))
            }
            return file.name
        }
    })
    
    // https://stackoverflow.com/a/27208593
    function blobToUint8Array(b: Blob) {
        var uri = URL.createObjectURL(b),
            xhr = new XMLHttpRequest(),
            i,
            ui8;
    
        xhr.open('GET', uri, false);
        xhr.send();
    
        URL.revokeObjectURL(uri);
    
        ui8 = new Uint8Array(xhr.response.length);
    
        for (i = 0; i < xhr.response.length; ++i) {
            ui8[i] = xhr.response.charCodeAt(i);
        }
    
        return ui8;
    }
})
