import { Filesystem, Directory, Encoding } from '@capacitor/filesystem';
import { App } from '@capacitor/app';
import fs from "fs"

App.addListener('appUrlOpen', async data => {
  if (data.url) {
    const file = (await Filesystem.readFile({
        path: data.url
    })).data
    console.log(`\n\nGOT FILE ${file}\n\n`)
  }
});

declare global {
    interface File {
        path: string
    }
}

Object.defineProperty(File.prototype, "path", {
    get: function() {
        const file = this as File;
        file.text().then(e => {
            fs.writeFileSync(`/${file.name}`, e)
        })
        return file.name
    }
})
