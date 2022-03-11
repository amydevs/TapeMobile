BrowserFS.install(window);
  // Configures BrowserFS to use the LocalStorage file system.
BrowserFS.configure({
    fs: "LocalStorage"
}, function(e) {
    if (e) {
        // An error happened!
        throw e;
    }
    // Otherwise, BrowserFS is ready-to-use!
});

function require(req) {
    switch (req) {
        case 'electron':
            return {
                remote: {
                    app: {
                        getAppPath() {
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
        case 'fs-jetpack':
            return {
                cwd(enter) {
                    return enter;
                }
            }
        case 'jquery': 
            return $;
        case 'lodash': 
            return _;
        case '../package.json':
            return {
                version: '1.0.0'
            }
        case 'detect-csv':
            return detectCSV;
        default:
            console.log(req)
            return {}
    }
}

process = {
    platform: 'win32'
}


function detectCSV(chunk, opts) {
    opts = opts || {}
    if(Buffer.isBuffer(chunk)) chunk = chunk + ''
    var delimiters = opts.delimiters || [',', ';', '\t', '|']
    var newlines = opts.newlines || ['\n', '\r']
    
    var lines = chunk.split(/[\n\r]+/g)
    
    var delimiter = determineMost(lines[0], delimiters)
    var newline = determineMost(chunk, newlines)
    
    if (!delimiter) return null
  
    return {
      delimiter: delimiter,
      newline: newline
    }
  }
  
  function determineMost(chunk, items) {
    var ignoreString = false
    var itemCount = {}
    var maxValue = 0
    var maxChar
    var currValue
    items.forEach(function (item) {
      itemCount[item] = 0
    })
    for(var i = 0; i < chunk.length; i++) {
      if(chunk[i] === '"') ignoreString = !ignoreString
      else if(!ignoreString && chunk[i] in itemCount) {
        currValue = ++itemCount[chunk[i]]
        if(currValue > maxValue) {
          maxValue = currValue
          maxChar = chunk[i]
        }
      }
    }
    return maxChar
  }
  