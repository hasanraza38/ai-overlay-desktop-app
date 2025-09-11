import {
  app,
  BrowserWindow,
  globalShortcut,
  Tray,
  Menu,
  clipboard,
} from "electron";
import { screen } from "electron/main";
import path from "path";
import { fileURLToPath } from "url";

let mainWindow;
let lastText = "";

function createWindow() {
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename);

  const { width: screenWidth } = screen.getPrimaryDisplay().workAreaSize;
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
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      contextIsolation: true,
      nodeIntegration: false,
    },
  });

  // Fix: HTML file path check karein
  mainWindow.loadFile(path.join(__dirname, "../../dist-react/index.html"));

  // Fix: Development ke liye DevTools open karein
  if (process.env.NODE_ENV === "development") {
    mainWindow.webContents.openDevTools();
  }

  mainWindow.on("close", (event) => {
    event.preventDefault();
    mainWindow.hide();
  });

  // Fix: Window ready hone ka wait karein
  mainWindow.once("ready-to-show", () => {
    console.log("Window is ready to show");
  });

  // Fix: Load complete hone ka check karein
  mainWindow.webContents.once("did-finish-load", () => {
    console.log("Content loaded successfully");
    // Initial clipboard text send karein
    const initialText = clipboard.readText();
    if (initialText) {
      mainWindow.webContents.send("clipboard-update", initialText);
    }
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

  // Fix: Clipboard monitoring ko improve karein
  setInterval(() => {
    const text = clipboard.readText();

    if (!text || text.trim() === "" || text === lastText) return;

    lastText = text;
    console.log("Copied text:", text);

    // Fix: Window ready hai ya nahi check karein
    if (mainWindow && mainWindow.webContents) {
      mainWindow.webContents.send("clipboard-update", text);
    }
  }, 1000);
});

app.on("will-quit", () => {
  clipboard.clear();
  globalShortcut.unregisterAll();
});
