class CustomPlugin {
    static defaultOptions = {
      outputFile: 'index.html',
    };
  
    // Any options should be passed in the constructor of your plugin,
    // (this is a public API of your plugin).
    constructor(options = {}) {
      // Applying user-specified options over the default options
      // and making merged options further available to the plugin methods.
      // You should probably validate all the options here as well.
      this.options = { ...CustomPlugin.defaultOptions, ...options };
    }
  
    apply(compiler) {
        const pluginName = CustomPlugin.name;

        // webpack module instance can be accessed from the compiler object,
        // this ensures that correct version of the module is used
        // (do not require/import the webpack or any symbols from it directly).
        const { webpack } = compiler;

        // RawSource is one of the "sources" classes that should be used
        // to represent asset sources in compilation.
        const { RawSource } = webpack.sources;

        // Tapping to the "thisCompilation" hook in order to further tap
        // to the compilation process on an earlier stage.
        compiler.hooks.initialize.tap(pluginName, () => {
            compiler.hooks.thisCompilation.tap(pluginName, (compilation) => {
                    // Tapping to the assets processing pipeline on a specific stage.
                compilation.hooks.processAssets.tapAsync(
                    {
                        name: pluginName,
            
                        // Using one of the later asset processing stages to ensure
                        // that all assets were already added to the compilation by other plugins.
                        stage: webpack.Compilation.PROCESS_ASSETS_STAGE_OPTIMIZE_INLINE,
                    },
                    (assets, cb) => {
                        const scriptSrcs = ["app.js"];
                        const jsdom = require("jsdom");
                        const { JSDOM } = jsdom;

                        const fs = require('fs')
                        const html = new JSDOM(fs.readFileSync('./app/app.html'), 'utf8');
                        const document = html.window.document

                        document.querySelector('link[rel="stylesheet"]').remove()

                        for (const [i, script] of document.querySelectorAll("head > script").entries()) {
                            script.remove();
                        }

                        const _headelm = document.querySelector('head')
                        for (const src of scriptSrcs.reverse()) {
                            const scrp = document.createElement("script")
                            scrp.src = src
                            _headelm.prepend(scrp)
                        }
                        const pwamanifest = document.createElement("link");
                        pwamanifest.rel = "manifest";
                        pwamanifest.href = "manifest.json"
                        _headelm.append(pwamanifest);
                        
                        compilation.emitAsset(this.options.outputFile, new webpack.sources.RawSource(html.serialize()));
                        cb();
                    }
                );
            });
        });
        compiler.hooks.afterEmit.tap('AfterEmitPlugin', async (stats) => {
            if (process.env.NODE_PWA !== "true") {
                const originalarg = `${process.argv[2]}`;
                process.argv[2] = "sync";
                await require("@capacitor/cli").run();
                process.argv[2] = originalarg;
                // console.log(require("child_process").execSync("npm run sync").toString("utf-8"));
            }
        });
    }
}
  
module.exports = { CustomPlugin };