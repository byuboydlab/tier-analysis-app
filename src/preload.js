const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
    getFilePath: () => ipcRenderer.invoke('get-file-path'),
    sendConfig: (config) => ipcRenderer.send('config', config)
});
