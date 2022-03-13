import { Filesystem, Directory, Encoding } from '@capacitor/filesystem';

function getTapeDataFromLS(): TapeData.Collection | undefined {
    try {
        return JSON.parse(window.localStorage.tapedata, (i, e) => {
            switch (e) {
                case 'true':
                    return true
                case 'false':
                    return false
                default:
                    return e
            }
        }) as TapeData.Collection
    }
    catch(e: any) {
        return undefined
    }
}

declare global {
    interface Window {
        localStorage: Storage | {
            tapedata: string | TapeData.Collection | undefined
        }
    }
}
namespace TapeData {
    export declare interface Collection {
        [i: string]: Entry
    }
    export declare interface Entry {
        items: Item[],
        name: string,
        pin: string | boolean,
        vis: string | boolean
    }
    export declare interface Item {
        id: string,
        name: string,
        state: ItemState
    }
    export declare type ItemState = "" | "priority" | "working" | "submitted" | "approved" | "done"
}

(async () => {
    const tapesync_save_options = {
        path: "tape/tapesync_save.txt",
        directory: Directory.Documents,
        encoding: Encoding.UTF8,
    }

    try {
        
        const file = (await Filesystem.readFile(tapesync_save_options)).data;
        if (window.localStorage.tapedata !== file)
        {
            await checkValidandRead(file)
        }
        
    }
    catch {
        try {
            await Filesystem.mkdir({
                path: "tape",
                directory: Directory.Documents
            })
        }
        catch {}
        await Filesystem.writeFile(Object.assign({data: window.localStorage.tapedata || "{}"}, tapesync_save_options))
    }

    watchtapedata(async (newVal, oldVal) => {
        try {
            console.log("ls > fs")
            await Filesystem.writeFile(Object.assign({data: window.localStorage.tapedata || "{}"}, tapesync_save_options))
        }
        catch {}
    })
    
    let _tapedata = "";
    async function watchtapedata(e: (newVal: string, oldVal: string) => void) {
        _tapedata = window.localStorage.tapedata?.slice()
        return setInterval(async () => {
            const fsdata = (await Filesystem.readFile(tapesync_save_options)).data
            if (window.localStorage.tapedata !== _tapedata) {
                await e(window.localStorage.tapedata, _tapedata)
            }
            else if (window.localStorage.tapedata !== fsdata) {
                console.log("fs > ls")
                checkValidandRead(fsdata)
            }
            _tapedata = window.localStorage.tapedata?.slice()
        }, 5000);
    }
    async function checkValidandRead(fsdata: string) {
        try {JSON.parse(fsdata); window.localStorage.tapedata = fsdata; window.location.href = window.location.href;}
        catch {await Filesystem.writeFile(Object.assign({data: window.localStorage.tapedata || "{}"}, tapesync_save_options))}
    }
})();

