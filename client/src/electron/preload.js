const { contextBridge, ipcRenderer, clipboard } = require("electron");

contextBridge.exposeInMainWorld("electronAPI", {
  readClipboard: () => {
    try {
      const text = clipboard.readText();
      console.log('Clipboard read in preload:', text);
      return text;
    } catch (error) {
      console.error('Error reading clipboard in preload:', error);
      return '';
    }
  },
  
  onClipboardUpdate: (callback) => {
    const handleUpdate = (event, text) => {
      console.log('Clipboard update received in preload:', text);
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
});

