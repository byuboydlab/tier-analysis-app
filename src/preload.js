const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('mainAPI', {
  sendConfig: (config) => ipcRenderer.send('config', config)
});
