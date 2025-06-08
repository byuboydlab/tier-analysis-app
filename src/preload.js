const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
    getFilePath: (isFile) => ipcRenderer.invoke('get-file-path', isFile),
    sendConfig: (config) => ipcRenderer.send('config', config)
});
