const { contextBridge, ipcRenderer, clipboard } = require("electron");

contextBridge.exposeInMainWorld("electronAPI", {
  // Fix: Error handling ke saath clipboard read karein
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
  
  // Fix: Cleanup function return karein
  onClipboardUpdate: (callback) => {
    const handleUpdate = (event, text) => {
      console.log('Clipboard update received in preload:', text);
      callback(text);
    };
    
    ipcRenderer.on("clipboard-update", handleUpdate);
    
    // Return cleanup function
    return () => {
      ipcRenderer.removeListener("clipboard-update", handleUpdate);
    };
  }
});

