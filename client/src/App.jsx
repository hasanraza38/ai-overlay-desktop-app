import { useEffect, useState } from "react";

function App() {
  const [clipboardText, setClipboardText] = useState("");
  const [selectedText, setSelectedText] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!window.electronAPI) {
      console.error('electronAPI is not available');
      setIsLoading(false);
      return;
    }

    try {
      const text = window.electronAPI.readClipboard();
      setClipboardText(text || "No text in clipboard");
    } catch (error) {
      console.error('Error reading initial clipboard:', error);
      setClipboardText("Error reading clipboard");
    }

    setIsLoading(false);

    const cleanup = window.electronAPI.onClipboardUpdate((newText) => {
      setClipboardText(newText || "Empty clipboard");
    });

    // ----------- Selection monitoring -----------
    const handleSelection = () => {
      const selection = window.getSelection();
      if (selection) {
        const text = selection.toString();
        setSelectedText(text);
      }
    };

    // Mouse drag or keyboard selection
    document.addEventListener("mouseup", handleSelection);
    document.addEventListener("keyup", handleSelection);
    document.addEventListener("selectionchange", handleSelection); // this ensures immediate update

    return () => {
      if (typeof cleanup === 'function') cleanup();
      document.removeEventListener("mouseup", handleSelection);
      document.removeEventListener("keyup", handleSelection);
      document.removeEventListener("selectionchange", handleSelection);
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
        Clipboard & Selection Monitor
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

      <h2 style={{ color: '#666', marginTop: '20px', marginBottom: '15px' }}>
        Current Selected Text:
      </h2>
      <div style={{
        padding: '15px',
        backgroundColor: 'white',
        border: '1px solid #ddd',
        borderRadius: '5px',
        minHeight: '100px',
        wordBreak: 'break-word'
      }}>
        {selectedText || "No text selected yet..."}
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
