# Aeriform Tape Mobile/Web App Port

## Installation (Progressive Web App on Any Platform (iOS, Android, PC, ChromeOS, etc.))
Note that this installation method may yield less features due to the limitations of the PWA (Progressive Web App) framework (for example, themes, importing/exporting backups)
1. Install a legitimate copy of Aeriform Tape (I am in no way associated with the product btw, this is simply a mod)
2. Download and extract the `.zip` file from releases below corresponding to your operating system to a safe folder.
3. Run the `tapemobileinstaller` executable inside the folder (this may take a few minutes due to the application needing to extract resources, hence please make sure you have at least 300MBs free on your drive before running the application).
4. Scroll up on the window of the application, the first few lines of text in the window may look something like this: 
```bash
Tape served at: https://192.168.0.28:8080/
Before installation, please install the HTTPS certificate on your device at: https://192.168.0.28:8080/cert.crt
```
5. Download and install the `cert.crt` HTTPS certificate on your device and install it (note that you may have to tell your browser to `Accept the Risk` of accepting the self-signed certificate). Steps for iOS [here](https://apple.stackexchange.com/a/321537). Steps for Android [here](https://httptoolkit.tech/blog/android-11-trust-ca-certificates/#whats-changed).
6. Navigate to the URL to the right of `Tape served at: ` as seen above on your mobile device using a browser that supports PWAs (Chrome on Android, Safari on iOS, etc.).
7. Let the webpage load, and install the website as a PWA by tapping on the dots (menu button) on the top left of the browser, and then tapping `Add to Home Screen` (process may be different depending on browser, see [here](https://mobilesyrup.com/2020/05/24/how-install-progressive-web-app-pwa-android-ios-pc-mac/))
8. Open the Tape PWA icon on your homescreen and let it load, then close it, and reopen it with Wi-Fi and Data turned off to check if the Application is properly cached.
9. Delete the Certificate installed earlier. Steps for iOS [here](https://kb.iu.edu/d/basz). Steps for Android [here](https://support.google.com/pixelphone/answer/2844832?hl=en#remove).


## Installation (Natively on Android)

1. Install a legitimate copy of Aeriform Tape (I am in no way associated with the product btw, this is simply a mod)
7. Install Node.JS and Android Studio
8. Open this folder in your command line and run `npm i && npm run extract && npm run build && npx cap sync`
9. Open the `android` folder in Android Studio, and build it for your Android device.
10. You can run it directly on your device by enabling USB Debugging in developer options on your Android Device, and connecting up your phone to your computer via a USB cable.

### Note
If you get errors with `app.asar` not being found, manually locate the `app.asar` file and put it into the `input` folder.

## Compatibility
Confirmed working with
- 1.3.8
- 1.4.0 (Beta)