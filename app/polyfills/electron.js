module.exports = {
    remote: {
        app: {
            getAppPath() {
                return '/';
            },
            getPath() {
                return '/';
            }
        },
        Menu: class {
            append() {
                return {};
            }
        },
        MenuItem: class {

        }
    },
    webFrame: {
        setZoomFactor() {

        },
        setVisualZoomLevelLimits() {

        },
        setLayoutZoomLevelLimits() {

        }
    }
}