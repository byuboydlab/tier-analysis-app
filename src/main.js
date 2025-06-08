const { app, BrowserWindow, ipcMain, dialog } = require('electron');

const path = require('node:path');
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

    app.on('run', (event, config) => {
        console.log(config);
    });
});

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit()
    }
});


