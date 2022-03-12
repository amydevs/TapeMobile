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
        path: "tape/tapesync_save.json",
        directory: Directory.Documents,
        encoding: Encoding.UTF8,
    }

    let oldLStapedata = window.localStorage.tapedata.slice()

    try {
        window.localStorage.tapedata = (await Filesystem.readFile(tapesync_save_options)).data;
        window.location.href = window.location.href;
    }
    catch {
        await Filesystem.mkdir({
            path: "tape",
            directory: Directory.Documents
        })
        await Filesystem.writeFile(Object.assign({data: window.localStorage.tapedata}, tapesync_save_options))
    }

    watchtapedata(async (newVal, oldVal) => {
        try {
            if (oldVal === window.localStorage.tapedata) {}
            else {
                window.localStorage.tapedata = (await Filesystem.readFile(tapesync_save_options)).data;
                window.location.href = window.location.href;
            }
        }
        catch {}
    })
    
    let _tapedata = "";
    async function watchtapedata(e: (newVal: string, oldVal: string) => void) {
        _tapedata = window.localStorage.tapedata
        return setInterval(async () => {
            if (window.localStorage.tapedata !== _tapedata) {
                await e(window.localStorage.tapedata, _tapedata)
            }
            else if (window.localStorage.tapedata !== (await Filesystem.readFile(tapesync_save_options)).data) {
                window.localStorage.tapedata == (await Filesystem.readFile(tapesync_save_options)).data;
            }
            _tapedata = window.localStorage.tapedata
        }, 2000);
    }
})();

