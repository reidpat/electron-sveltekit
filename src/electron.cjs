const {app, ipcMain, BrowserWindow} = require("electron");
const serve = require("electron-serve");
const ws = require("electron-window-state");
try { require("electron-reloader")(module); } catch {}
const fs = require('fs').promises;
const path = require('path');

const loadURL = serve({directory: "."});
const port = process.env.PORT || 3000;
const isdev = !app.isPackaged || (process.env.NODE_ENV == "development");
let mainwindow;

function loadVite(port) {
    mainwindow.loadURL(`http://localhost:${port}`).catch(() => {
        setTimeout(() => { loadVite(port); }, 200);
    });
}

function createMainWindow() {
    let mws = ws({
        defaultWidth: 1000,
        defaultHeight: 800
    });

    mainwindow = new BrowserWindow({
        x: mws.x,
        y: mws.y,
        width: mws.width,
        height: mws.height,
        webPreferences: {
            preload: path.join(__dirname, 'preload.cjs'),
            nodeIntegration: false,
            contextIsolation: true,
            preload: path.join(__dirname, 'preload.cjs'),
            devTools: isdev || true
        }
    });

    mainwindow.webContents.openDevTools();

    mainwindow.once("close", () => { mainwindow = null; });

    if(!isdev) mainwindow.removeMenu();
    else mainwindow.webContents.openDevTools();
    mws.manage(mainwindow);

    if(isdev) loadVite(port);
    else loadURL(mainwindow);

    // For debugging
    mainwindow.webContents.on('did-finish-load', () => {
        console.log('Window loaded');
        mainwindow.webContents.executeJavaScript(`
            console.log('electronAPI available:', !!window.electronAPI);
        `);
    });
}

ipcMain.handle('read-local-file', async (event, filePath) => {
    console.log('Attempting to read file:', filePath);
    try {
      const content = await fs.readFile(filePath, 'utf-8');
      console.log('File read successfully');
      return content;
    } catch (error) {
      console.error('Error reading file:', error);
      throw error;
    }
});

app.once("ready", createMainWindow);
app.on("activate", () => { if(!mainwindow) createMainWindow(); });
app.on("window-all-closed", () => { if(process.platform !== "darwin") app.quit(); });