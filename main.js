const path = require("node:path");
const { app, BrowserWindow, ipcMain, screen } = require("electron");

function createWindow() {
  const { x, y, width, height } = screen.getPrimaryDisplay().bounds;

  const window = new BrowserWindow({
    x,
    y,
    width,
    height,
    frame: false,
    transparent: true,
    backgroundColor: "#00000000",
    hasShadow: false,
    icon: path.join(__dirname, "build", "icon.icns"),
    resizable: false,
    movable: false,
    fullscreenable: false,
    alwaysOnTop: true,
    show: false,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: false,
    },
  });

  window.setMenuBarVisibility(false);
  window.setIgnoreMouseEvents(true, { forward: true });
  window.loadFile(path.join(__dirname, "index.html"));

  window.once("ready-to-show", () => {
    window.show();
  });

  ipcMain.on("chillmemo:set-interactive", (event, interactive) => {
    if (event.sender !== window.webContents) return;
    window.setIgnoreMouseEvents(!interactive, { forward: true });
  });
}

app.whenReady().then(() => {
  if (process.platform === "darwin") {
    app.dock?.show();
  }

  createWindow();

  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});
