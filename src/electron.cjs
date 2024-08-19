const { app, ipcMain, BrowserWindow, Menu, MenuItem } = require("electron");
const serve = require("electron-serve");
const ws = require("electron-window-state");
const fs = require('fs/promises');
const path = require('path');
const { rollup } = require('rollup');
const svelte = require('rollup-plugin-svelte');
const resolve = require('@rollup/plugin-node-resolve');
const commonjs = require('@rollup/plugin-commonjs');
const json = require('@rollup/plugin-json');

try { require("electron-reloader")(module); } catch { }

const loadURL = serve({ directory: "." });
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
            devTools: isdev || true
        }
    });

    mainwindow.webContents.openDevTools();

    mainwindow.once("close", () => { mainwindow = null; });

    if (!isdev) mainwindow.removeMenu();
    mws.manage(mainwindow);

    if (isdev) loadVite(port);
    else loadURL(mainwindow);

    const menu = new Menu();
    menu.append(new MenuItem({
        label: 'Inspect Element',
        click: () => {
            mainwindow.webContents.inspectElement(rightClickPosition.x, rightClickPosition.y);
        }
    }));

    let rightClickPosition = null;

    mainwindow.webContents.on('context-menu', (event, params) => {
        rightClickPosition = { x: params.x, y: params.y };
        menu.popup(mainwindow, params.x, params.y);
    });

    mainwindow.webContents.on('did-finish-load', () => {
        console.log('Window loaded');
        mainwindow.webContents.executeJavaScript(`
            console.log('electronAPI available:', !!window.electronAPI);
        `);
    });
}




async function compileSvelteComponent(inputPath, outputPath) {
    console.log('Starting Svelte component compilation');
    console.log('Input path:', inputPath);
    console.log('Output path:', outputPath);

    try {
        await fs.access(inputPath);
        console.log('Input file exists');
    } catch (error) {
        console.error('Input file does not exist:', error);
        throw error;
    }

    const inputOptions = {
        input: inputPath,
        plugins: [
            json(),
            svelte({
                compilerOptions: {
                    dev: isdev,
                    css: 'injected',
                    customElement: true,
                },
                emitCss: false
            }),
            resolve({
                browser: true,
                dedupe: ['svelte']
            }),
            commonjs()
        ]
    };

    const outputOptions = {
        format: 'es',
        file: outputPath,
        // name: 'CompiledComponent'
    };

    let bundle;
    try {
        bundle = await rollup(inputOptions);
        console.log('Bundle created successfully');

        const { output } = await bundle.generate(outputOptions);
        console.log('Output generated successfully');

        await fs.writeFile(outputPath, output[0].code);
        console.log('Successfully wrote compiled JS to', outputPath);

        console.log('Svelte component compiled successfully');
        return output[0].code;
    } catch (error) {
        console.error('Error during compilation process:', error);
        throw error;
    } finally {
        if (bundle) {
            await bundle.close();
            console.log('Bundle closed');
        }
    }
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

ipcMain.handle('get-paths', async (event) => {
    const inputPath = path.join(app.getAppPath(), "test.svelte");
    const outputPath = path.join(app.getAppPath(), "test.js");
    return { inputPath, outputPath };
});

ipcMain.handle('compile-svelte', async (event, inputPath, outputPath) => {
    try {
        const compiledCode = await compileSvelteComponent(inputPath, outputPath);
        return { success: true, code: compiledCode };
    } catch (error) {
        console.error('Compilation failed:', error);
        return { success: false, error: error.message };
    }
});

app.whenReady().then(createMainWindow);
app.on("activate", () => { if (!mainwindow) createMainWindow(); });
app.on("window-all-closed", () => { if (process.platform !== "darwin") app.quit(); });