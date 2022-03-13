import { Filesystem, Directory, Encoding } from '@capacitor/filesystem';
import { App } from '@capacitor/app';

App.addListener('appUrlOpen', async data => {
  if (data.url) {
    const file = (await Filesystem.readFile({
        path: data.url
    })).data
    console.log(`\n\nGOT FILE ${file}\n\n`)
  }
});

