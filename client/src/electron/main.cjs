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
const keytar = require("keytar");

let mainWindow;
let tray;
let lastText = "";

const KEYTAR_SERVICE = "my-electron-app";
const KEYTAR_ACCOUNT = "auth-token";

function createWindow() {
  const { width: screenWidth } = screen.getPrimaryDisplay().workAreaSize;
  const windowWidth = 400;
  const windowHeight = 700;

  mainWindow = new BrowserWindow({
    width: windowWidth,
    height: windowHeight,
    transparent: false,
    roundedCorners: true,
    frame: false,
    titleBarStyle: "hidden",
    alwaysOnTop: true,
    show: false,
    fullscreenable: false,
    resizable: true,
    maximizable: true,
    x: screenWidth - windowWidth - 10,
    y: 12,
    webPreferences: {
      preload: path.join(__dirname, "preload.cjs"),
      contextIsolation: true,
      nodeIntegration: false,
    },
  });

  mainWindow.setMenuBarVisibility(false);

  if (app.isPackaged) {
    const indexPath = path.join(app.getAppPath(), "dist-react", "index.html");
    console.log("Loading production file:", indexPath);
    mainWindow
      .loadFile(indexPath)
      .catch((err) => console.error("Load error:", err));
    mainWindow.webContents.openDevTools();
  } else {
    const indexPath = path.join(__dirname, "../../dist-react/index.html");
    console.log("Loading dev build:", indexPath);
    mainWindow.loadFile(indexPath).catch((err) => {
      console.error("Error loading dev build:", err);
    });
  }

  mainWindow.once("ready-to-show", () => {
    console.log("Window is ready to show ✅");
    mainWindow.show();
  });

  mainWindow.on("close", (event) => {
    mainWindow = null;
    app.quit();
  });

  mainWindow.webContents.once("did-finish-load", () => {
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

  // ✅ Tray icon path
  const iconPath = app.isPackaged
    ? path.join(process.resourcesPath, "icon.ico")
    : path.join(__dirname, "../../build/icon.ico");

  tray = new Tray(iconPath);
  const contextMenu = Menu.buildFromTemplate([
    { label: "Show App", click: () => mainWindow?.show() },
    { label: "Quit", click: () => app.quit() },
  ]);
  tray.setContextMenu(contextMenu);
  tray.setToolTip("AI Overlay");

  // ✅ Global shortcut
  const { globalShortcut } = require("electron");

  globalShortcut.register("Alt+J", () => {
    if (!mainWindow) return;

    if (mainWindow.isVisible()) {
      if (mainWindow.isMinimized()) {
        mainWindow.restore(); // agar already minimized hai to restore karo
        mainWindow.focus();
        mainWindow.setAlwaysOnTop(true);
      } else {
        mainWindow.minimize(); // visible hai to minimize kar do
      }
    } else {
      mainWindow.show();
      mainWindow.focus();
      mainWindow.setAlwaysOnTop(true);
    }
  });

  // ✅ IPC handlers
  ipcMain.on("save-token", async (event, token) => {
    try {
      await keytar.setPassword(KEYTAR_SERVICE, KEYTAR_ACCOUNT, token);
      const cookie = {
        url: "http://localhost:3000",
        name: "auth_token",
        value: token,
        httpOnly: true,
        secure: app.isPackaged,
        sameSite: "strict",
        expirationDate: Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 7,
      };
      await session.defaultSession.cookies.set(cookie);
    } catch (error) {
      console.error("Error saving token or setting cookie:", error);
    }
  });

  ipcMain.handle("get-token", async () => {
    try {
      return (await keytar.getPassword(KEYTAR_SERVICE, KEYTAR_ACCOUNT)) || null;
    } catch (error) {
      console.error("Error retrieving token:", error);
      return null;
    }
  });

  ipcMain.handle("google-login", async () => {
    return new Promise((resolve, reject) => {
      const loginWindow = new BrowserWindow({
        width: 500,
        height: 600,
        webPreferences: { nodeIntegration: false },
      });

      loginWindow.loadURL("https://ai-overlay.vercel.app/api/v1/auth/google");

      loginWindow.webContents.on("will-redirect", async (event, url) => {
        if (
          url.startsWith(
            "https://ai-overlay.vercel.app/api/v1/auth/google/callback"
          )
        ) {
          try {
            const fetch = (await import("node-fetch")).default;
            const response = await fetch(url, { credentials: "include" });
            const data = await response.json();
            resolve(data);
            loginWindow.close();
          } catch (err) {
            reject(err);
            loginWindow.close();
          }
        }
      });
    });
  });

  ipcMain.on("window-close", () => {
    if (mainWindow) {
      mainWindow = null;
      app.quit(); 
    }
  });
  ipcMain.on("window-minimize", () => mainWindow?.minimize());
  ipcMain.on("resize-window", (event, { width, height, resizable }) => {
    if (mainWindow) {
      mainWindow.setSize(width, height);
      mainWindow.setResizable(resizable);
      if (resizable) mainWindow.center();
    }
  });

  // ✅ Clipboard monitor
  setInterval(() => {
    const text = clipboard.readText();
    if (!text || text.trim() === "" || text === lastText) return;
    lastText = text;
    if (mainWindow && mainWindow.webContents) {
      mainWindow.webContents.send("clipboard-update", text);
    }
  }, 1000);
});

// ✅ Cleanup
app.on("will-quit", () => {
  clipboard.clear();
  globalShortcut.unregisterAll();
});

app.on("window-all-closed", (event) => {
  event.preventDefault(); // keep tray running
});

app.on("activate", () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  } else {
    mainWindow?.show();
  }
});
