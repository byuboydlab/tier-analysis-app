const { app, BrowserWindow, ipcMain, dialog, Menu } = require('electron');

const TOML = require('@iarna/toml')

const path = require('node:path');
const fs = require('node:fs');
const childProc = require('node:child_process');

let childProcCount = 0;
let window;

const createWindow = () => {
    const win = new BrowserWindow({
      width: 800,
      height: 600,
      webPreferences: {
        preload: path.join(__dirname, 'preload.js')
      }
    })
  
    win.loadFile('src/index.html')
    return win;
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

function analyze(event, params) {
    if (verifyParams(params)) {
        params.config = preprocessConfig(params.config);

        let tomlString = TOML.stringify(params.config);
        let configPath = app.getPath("userData") + '\\config.toml';

        fs.writeFileSync(configPath, tomlString);

        let exePath = path.join(app.getAppPath(), 'executables', 'tier_analysis.exe');

        let tierProc = childProc.spawn(exePath, [path.basename(params.inputFile), configPath, params.outputFolder], { cwd: path.dirname(params.inputFile) });
        childProcCount++;

        tierProc.on('close', (code) => {
            childProcCount--;
            console.log(`tierProc closed with code ${code}`);
        })

        dialog.showMessageBox(window, {message: 'Analysis process launched!'});
    } else {
         dialog.showMessageBox({ message: "All parameters must have a selected value. Make sure none of the options are blank." })
    }
}

app.whenReady().then(() => {
    Menu.setApplicationMenu(null);
    window = createWindow();

    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) {
            window = createWindow();
        }
    })

    ipcMain.handle('get-file-path', (event, isFile) => {
        let filePath;

        if (isFile) {
            filePath = dialog.showOpenDialogSync({properties: ['openFile'], filters: [{name: 'Excel Spreadsheet', extensions: ['xlsx']}]});
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
        if (childProcCount > 0){
            let choice = dialog.showMessageBoxSync(window, {message: `You already have ${childProcCount} process(es) running from this app! Running more without waiting for the others to finish may cause system instability. Are you sure you want to proceed?`, buttons: ['Yes', 'No']});
            if (choice == 0) {
                analyze(event, params);    
            }
        } else {
            analyze(event, params);
        }
    });
});

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit()
    }
});

app.on('will-quit', (event) => {
    let messageChunk;
    if (process.platform == 'win32') {
        messageChunk = 'Task Manager';
    } else if (process.platform == 'darwin') {
        messageChunk = 'Activity Monitor';
    } else if (process.platform == 'linux') {
        messageChunk = 'the command line';
    }

    if (childProcCount > 0){
        let choice = dialog.showMessageBoxSync(window, {message: `You still have ${childProcCount} process(es) running! Would you like them to run in the background? (If your answer is yes, you will only be able to manually kill the processes by using ${messageChunk} or a similar tool.)`, buttons: ['Yes', 'No']});
        if (choice == 0) {
            event.preventDefault();
        }
    }
});
