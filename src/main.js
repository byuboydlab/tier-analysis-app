const { app, BrowserWindow, ipcMain, dialog } = require('electron');

const TOML = require('@iarna/toml')

const path = require('node:path');
const fs = require('node:fs')
const { config } = require('node:process');

const createWindow = () => {
    const win = new BrowserWindow({
      width: 800,
      height: 600,
      webPreferences: {
        preload: path.join(__dirname, 'preload.js')
      }
    })
  
    win.loadFile('src/index.html')
}

function verifyConfig(config) {
    for (const key in config) {
        for (const subKey in config[key]) {
            if (config[key][subKey] == null || config[key][subKey] === '') {
                console.log(config[key][subKey]);
                return false;
            }
        }
    }

    return true;
}

function verifyParams(params) {
    if (params.inputFile == '' || params.outputFolder == '' || !verifyConfig(params.config)) {
        return false;
    } else {
        return true;
    }
}

function preprocessConfig(config) {
    for (const key in config) {
        for (const subkey in config[key]) {
            if (config[key][subkey] == 'true') {
                config[key][subkey] = true;
            } else if (config[key][subkey] == 'false') {
                config[key][subkey] = false;
            } else if (!isNaN(parseFloat(config[key][subkey]))) {
                config[key][subkey] = parseFloat(config[key][subkey]);
            }
        }
    }

    return config;
}

app.whenReady().then(() => {
    createWindow()

    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) {
            createWindow()
        }
    })

    ipcMain.handle('get-file-path', (event, isFile) => {
        let filePath;

        if (isFile) {
            filePath = dialog.showOpenDialogSync({properties: ['openFile']});
        } else {
            filePath = dialog.showOpenDialogSync({properties: ['openDirectory']});
        }

        if (filePath) {
            return filePath;
        } else {
            return '';
        }
    })

    ipcMain.on('run', (event, params) => {
        if (verifyParams(params)) {
            params.config = preprocessConfig(params.config);

            let tomlString = TOML.stringify(params.config);
            let configPath = app.getPath("userData") + '\\config.toml';

            fs.writeFileSync(configPath, tomlString);

            // TODO
            // Run bundled pyInstaller file using config and args
        } else {
            dialog.showMessageBox({ message: "All parameters must have a selected value. Make sure none of the options are blank." })
        }
    });
});

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit()
    }
});


