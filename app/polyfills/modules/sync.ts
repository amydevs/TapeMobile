import { Filesystem, Directory, Encoding } from '@capacitor/filesystem';

export default (async () => {
    const tapesync_save_options = {
        path: "tape/tapesync_save.txt",
        directory: Directory.Documents,
        encoding: Encoding.UTF8,
    }
 
    try {
        
        const file = await checkValid((await Filesystem.readFile(tapesync_save_options)).data);
        if (window.localStorage.tapedata !== file)
        {
            await loadToLS(file)
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
        await Filesystem.writeFile(Object.assign({data: JSON.stringify(JSON.parse(window.localStorage.tapedata), null, "\t") || "{}"}, tapesync_save_options))
    }

    watchtapedata(async (newVal, oldVal) => {
        try {
            console.log("ls > fs")
            await Filesystem.writeFile(Object.assign({data: JSON.stringify(JSON.parse(window.localStorage.tapedata), null, "\t") || "{}"}, tapesync_save_options))
        }
        catch {}
    })
    
    let _tapedata = "";
    async function watchtapedata(e: (newVal: string, oldVal: string) => void) {
        _tapedata = window.localStorage.tapedata?.slice()
        return setInterval(async () => {
            const fsdata = await checkValid((await Filesystem.readFile(tapesync_save_options)).data)
            if (window.localStorage.tapedata !== _tapedata) {
                await e(window.localStorage.tapedata, _tapedata)
            }
            else if (window.localStorage.tapedata !== fsdata) {
                console.log("fs > ls")
                loadToLS(fsdata)
            }
            _tapedata = window.localStorage.tapedata?.slice()
        }, 5000);
    }
    async function checkValid(fsdata: string) {
        try {
            return JSON.stringify(JSON.parse(fsdata))
        }
        catch {
            await Filesystem.writeFile(Object.assign({data: JSON.stringify(JSON.parse(window.localStorage.tapedata), null, "\t") || "{}"}, tapesync_save_options));
            return window.localStorage.tapedata;
        }
    }
    function loadToLS(fsdata: string) {
        window.localStorage.tapedata = fsdata; window.location.href = window.location.href;
    }
});
