const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  readLocalFile: (filePath) => ipcRenderer.invoke('read-local-file', filePath)
});