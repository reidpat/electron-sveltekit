const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
    readSvelteFile: (fileName) => ipcRenderer.invoke('read-svelte-file', fileName)
});