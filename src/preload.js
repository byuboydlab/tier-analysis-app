const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
    getFilePath: (isFile) => ipcRenderer.invoke('get-file-path', isFile),
    run: (params) => ipcRenderer.send('run', params)
});
