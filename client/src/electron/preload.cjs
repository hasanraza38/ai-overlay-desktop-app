const { contextBridge, ipcRenderer, clipboard } = require("electron");


console.log(
  'preload js file show'
);

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

  // functions for token handling
  saveToken: (token) => {
    try {
      console.log('Sending token to main process:', token);
      ipcRenderer.send("save-token", token);
    } catch (error) {
      console.error('Error sending token in preload:', error);
    }
  },
  
  getToken: async () => {
    try {
      const token = await ipcRenderer.invoke("get-token");
      console.log('Token retrieved in preload:', token ? 'Available' : 'Not found');
      return token;
    } catch (error) {
      console.error('Error retrieving token in preload:', error);
      return null;
    }
  },
});

