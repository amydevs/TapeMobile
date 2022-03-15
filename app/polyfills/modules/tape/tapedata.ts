declare global {
    interface Window {
        localStorage: Storage | {
            tapedata: string | TapeData.Collection | undefined
        }
    }
}
export namespace TapeData {
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

export function getTapeDataFromLS(): TapeData.Collection | undefined {
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