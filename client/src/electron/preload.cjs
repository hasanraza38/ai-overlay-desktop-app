const { contextBridge, ipcRenderer, clipboard } = require("electron");

contextBridge.exposeInMainWorld("electronAPI", {
  openExt: (url) => {
    if (!url) {
      console.error(" No URL provided to openExt");
      return;
    }

    try {
      ipcRenderer.send("open-external", url);
      console.log("Sent open-external IPC message");
    } catch (err) {
      console.error("Error sending open-external IPC:", err);
    }
  },

  readClipboard: () => {
    try {
      const text = clipboard.readText();
      console.log("Clipboard read in preload:", text);
      return text;
    } catch (error) {
      console.error("Error reading clipboard in preload:", error);
      return "";
    }
  },

  onClipboardUpdate: (callback) => {
    const handleUpdate = (event, text) => {
      console.log("Clipboard update received in preload:", text);
      callback(text);
    };

    ipcRenderer.on("clipboard-update", handleUpdate);

    return () => {
      ipcRenderer.removeListener("clipboard-update", handleUpdate);
    };
  },

  closeApp: () => ipcRenderer.send("window-close"),
  minimizeApp: () => ipcRenderer.send("window-minimize"),
  maximizeApp: () => ipcRenderer.send("window-maximize"),
  toggleWindowPosition: () => ipcRenderer.invoke("toggleWindowPosition"),

  saveToken: (token) => {
    try {
      console.log("Sending token to main process:", token);
      ipcRenderer.send("save-token", token);
    } catch (error) {
      console.error("Error sending token in preload:", error);
    }
  },

  getToken: async () => {
    try {
      const token = await ipcRenderer.invoke("get-token");
      console.log(
        "Token retrieved in preload:",
        token ? "Available" : "Not found"
      );
      return token;
    } catch (error) {
      console.error("Error retrieving token in preload:", error);
      return null;
    }
  },

  removeToken: async () => {
    try {
      return await ipcRenderer.invoke("remove-token");
    } catch (error) {
      console.error("Error removing token in preload:", error);
      return false;
    }
  },

  googleLogin: () => ipcRenderer.invoke("google-login"),

  resizeWindow: (width, height, resizable = false) =>
    ipcRenderer.send("resize-window", { width, height, resizable }),

  saveModelConfig: ({ model, apiKey }) =>
    ipcRenderer.invoke("save-model-config", { model, apiKey }),

  getModelConfig: (model) => ipcRenderer.invoke("get-model-config", model),

  removeModelConfig: (model) =>
    ipcRenderer.invoke("remove-model-config", model),
});
