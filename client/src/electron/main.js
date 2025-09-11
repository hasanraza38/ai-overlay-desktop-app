import { app, BrowserWindow, globalShortcut, Tray, Menu } from "electron";
import { screen } from "electron/main";
import { clipboard } from "electron";
import path from "path";

let mainWindow;
let lastText = "";

function createWindow() {
  const { width: screenWidth } = screen.getPrimaryDisplay().workAreaSize; // screen width
  const windowWidth = 400;
  const windowHeight = 500;

  mainWindow = new BrowserWindow({
    width: windowWidth,
    height: windowHeight,
    alwaysOnTop: true,
    show: false,
    resizable: false,
    maximizable: false,
    fullscreenable: false,
    x: screenWidth - windowWidth - 10,
    y: 10,
  });

  mainWindow.loadFile(path.join(app.getAppPath(), "/dist-react/index.html"));

  mainWindow.on("close", (event) => {
    event.preventDefault();
    mainWindow.hide();
  });
}

app.whenReady().then(() => {
  clipboard.clear();
  createWindow();

  let tray;
  const iconPath = path.join(app.getAppPath(), "src", "assets", "icons.png");

  tray = new Tray(iconPath);

  const contextMenu = Menu.buildFromTemplate([
    { label: "Show App", click: () => mainWindow.show() },
    { label: "Quit", click: () => app.quit() },
  ]);

  tray.setContextMenu(contextMenu);
  tray.setToolTip("AI Overlay");

  // Global hotkey
  globalShortcut.register("Alt+X", () => {
    if (!mainWindow) return;

    if (mainWindow.isVisible()) {
      mainWindow.hide();
    } else {
      mainWindow.show();
      mainWindow.focus();
      mainWindow.setAlwaysOnTop(true);
    }
  });

  setInterval(() => {
    const text = clipboard.readText();

    if (!text || text.trim() === "" || text === lastText) return;

    lastText = text;
    console.log("Copied text:", text);

    mainWindow.webContents.send("clipboard-update", text);
  }, 1000);
});

app.on("will-quit", () => {
  clipboard.clear();
  globalShortcut.unregisterAll();
});
