# Aeriform Tape Mobile Port

## Installation (Android)

1. Install a legitimate copy of Aeriform Tape (I am in no way associated with the product btw, this is simply a mod)
2. Install Node.JS and Android Studio
3. Open this folder in your command line and run `npm i && npm run extract && npm run build && npx cap sync`
4. Open the `android` folder in Android Studio, and build it for your Android device.
5. You can run it directly on your device by enabling USB Debugging in developer options on your Android Device, and connecting up your phone to your computer via a USB cable.

### Note
If you get errors with `app.asar` not being found, manually locate the `app.asar` file and put it into the `input` folder.