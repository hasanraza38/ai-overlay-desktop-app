
const {
  app,
  BrowserWindow,
  globalShortcut,
  Tray,
  Menu,
  clipboard,
  session,
  ipcMain,
  screen,
} = require("electron");
const path = require("path");
const keytar = require("keytar"); // Keytar top pe require

let mainWindow;
let lastText = "";

const KEYTAR_SERVICE = "my-electron-app";
const KEYTAR_ACCOUNT = "auth-token";

function createWindow() {
  const __dirname = path.dirname(__filename); // Directly use __filename and __dirname

  const { width: screenWidth } = screen.getPrimaryDisplay().workAreaSize;
  const windowWidth = 400;
  const windowHeight = 700;

  mainWindow = new BrowserWindow({
    width: windowWidth,
    height: windowHeight,
    frame: false,
    titleBarStyle: "hidden",
    alwaysOnTop: true,
    show: false,
    resizable: false,
    maximizable: false,
    fullscreenable: false,
    x: screenWidth - windowWidth - 10,
    y: 12,
    webPreferences: {
      preload: path.join(__dirname, "preload.cjs"),
      contextIsolation: true,
      nodeIntegration: false,
    },
  });

  mainWindow.setMenuBarVisibility(false);

  mainWindow.loadFile(path.join(__dirname, "../../dist-react/index.html"));

  if (process.env.NODE_ENV === "development") {
    mainWindow.webContents.openDevTools();
  }

  mainWindow.on("close", (event) => {
    event.preventDefault();
    mainWindow.hide();
  });

  mainWindow.once("ready-to-show", () => {
    console.log("Window is ready to show");
  });

  mainWindow.webContents.once("did-finish-load", () => {
    console.log("Content loaded successfully");

    mainWindow.webContents.setZoomFactor(1);
    mainWindow.webContents.setVisualZoomLevelLimits(1, 1);

    const initialText = clipboard.readText();
    if (initialText) {
      mainWindow.webContents.send("clipboard-update", initialText);
    }
  });
}

app.whenReady().then(() => {
  clipboard.clear();
  createWindow();

  // IPC handler to save token in keytar and set as cookie
  ipcMain.on("save-token", async (event, token) => {
    try {
      await keytar.setPassword(KEYTAR_SERVICE, KEYTAR_ACCOUNT, token);
      console.log("Token saved in keytar");

      const cookie = {
        url: "http://localhost:3000",
        name: "auth_token",
        value: token,
        httpOnly: true,
        secure: false, // Localhost ke liye false; production mein true
        sameSite: "strict",
        expirationDate: Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 7,
      };
      await session.defaultSession.cookies.set(cookie);
      console.log("Cookie set successfully");
    } catch (error) {
      console.error("Error saving token or setting cookie:", error);
    }
  });

  // IPC handler to retrieve token from keytar
  ipcMain.handle("get-token", async () => {
    try {
      const token = await keytar.getPassword(KEYTAR_SERVICE, KEYTAR_ACCOUNT);
      console.log("Token retrieved from keytar");
      return token || null;
    } catch (error) {
      console.error("Error retrieving token:", error);
      return null;
    }
  });

  app.on("browser-window-created", (event, window) => {
    window.webContents.on("before-input-event", (event, input) => {
      const zoomCodes = [
        "Equal",
        "Minus",
        "Digit0",
        "NumpadAdd",
        "NumpadSubtract",
        "Numpad0",
      ];
      if ((input.control || input.meta) && zoomCodes.includes(input.code)) {
        event.preventDefault();
        console.log("Zoom shortcut blocked:", input.code);
      }
    });
  });

  ipcMain.on("window-close", () => mainWindow.close());
  ipcMain.on("window-minimize", () => mainWindow.minimize());
  ipcMain.on("window-maximize", () => {
    if (mainWindow.isMaximized()) mainWindow.unmaximize();
    else mainWindow.maximize();
  });

  let tray;
  const iconPath = path.join(app.getAppPath(), "src", "assets", "icons.png");

  tray = new Tray(iconPath);

  const contextMenu = Menu.buildFromTemplate([
    { label: "Show App", click: () => mainWindow.show() },
    { label: "Quit", click: () => app.quit() },
  ]);

  tray.setContextMenu(contextMenu);
  tray.setToolTip("AI Overlay");

  globalShortcut.register("Alt+J", () => {
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
    // console.log("Copied text:", text);

    if (mainWindow && mainWindow.webContents) {
      mainWindow.webContents.send("clipboard-update", text);
    }
  }, 1000);
});

app.on("will-quit", () => {
  clipboard.clear();
  globalShortcut.unregisterAll();
});