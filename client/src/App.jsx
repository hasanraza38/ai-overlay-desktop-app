import { useEffect, useState } from "react";

function App() {
  const [clipboardText, setClipboardText] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Fix: Check if electronAPI is available
    if (!window.electronAPI) {
      console.error('electronAPI is not available');
      setIsLoading(false);
      return;
    }

    // Initial clipboard read with error handling
    try {
      const text = window.electronAPI.readClipboard();
      console.log('Initial clipboard text:', text);
      setClipboardText(text || "No text in clipboard");
    } catch (error) {
      console.error('Error reading initial clipboard:', error);
      setClipboardText("Error reading clipboard");
    }
    
    setIsLoading(false);

    // Listen for updates from main process
    const cleanup = window.electronAPI.onClipboardUpdate((newText) => {
      console.log('Received clipboard update:', newText);
      setClipboardText(newText || "Empty clipboard");
    });

    // Cleanup function (if provided by your API)
    return () => {
      if (typeof cleanup === 'function') {
        cleanup();
      }
    };
  }, []);

  if (isLoading) {
    return (
      <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
        <h1>Loading...</h1>
      </div>
    );
  }

  return (
    <div style={{ 
      padding: '20px', 
      fontFamily: 'Arial, sans-serif',
      minHeight: '100vh',
      backgroundColor: '#f5f5f5' 
    }}>
      <h1 style={{ color: '#333', marginBottom: '20px' }}>
        Clipboard Monitor
      </h1>
      <h2 style={{ color: '#666', marginBottom: '15px' }}>
        Current Clipboard Text:
      </h2>
      <div style={{
        padding: '15px',
        backgroundColor: 'white',
        border: '1px solid #ddd',
        borderRadius: '5px',
        minHeight: '100px',
        wordBreak: 'break-word'
      }}>
        {clipboardText || "No text copied yet..."}
      </div>
      <p style={{ 
        marginTop: '20px', 
        fontSize: '12px', 
        color: '#888' 
      }}>
        Press Alt+X to toggle window visibility
      </p>
    </div>
  );
}

export default App;