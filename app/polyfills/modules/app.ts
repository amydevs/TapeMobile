import { Filesystem, Directory, Encoding } from '@capacitor/filesystem';
import { App } from '@capacitor/app';

export default (() => {
    App.addListener('appUrlOpen', async data => {
        if (data.url) {
            const file = atob((await Filesystem.readFile({
                path: data.url
            })).data)
            const dataTransfer = new DataTransfer();
            let filename = "file"
            try {
                if (new DOMParser().parseFromString(file, 'text/xml').documentElement.nodeName.toLowerCase() === "svg") {
                    filename += ".svg"
                }
                else {
                    throw new Error("txt")
                }
                
            }
            catch {
                filename += ".txt"
            }
            dataTransfer.items.add(new File([file], filename))
            const ev = new DragEvent("drop", { dataTransfer });
            window.dispatchEvent(ev)
        }
    });
})