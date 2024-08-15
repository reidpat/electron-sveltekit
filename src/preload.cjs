const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  readLocalFile: (filePath) => ipcRenderer.invoke('read-local-file', filePath),
  getPaths: () => ipcRenderer.invoke('get-paths'),
  compileSvelte: (inputPath, outputPath) => ipcRenderer.invoke('compile-svelte', inputPath, outputPath)
});