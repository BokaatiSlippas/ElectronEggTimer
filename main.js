const { app, BrowserWindow } = require("electron");

function createWindow() {
    const win = new BrowserWindow({
        width: 384, // pretty sure i did 256x256 pixels but might need to change
        height: 512,
        resizable: false,
        maximizable: false,
        fullscreenable: false,
        frame: false,
        transparent: true, // want it to be a bit translucent (maybe)
        webPreferences: {
            contextIsolation: true
        }
    });

    win.loadFile("index.html");
}

app.whenReady().then(createWindow);

app.on("window-all-closed", () => {
    if (process.platform !== "darwin") app.quit();
});