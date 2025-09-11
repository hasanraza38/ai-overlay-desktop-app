import './App.css'
import { useEffect, useState, useRef } from "react";
import { clipboard } from "electron";

function App() {
  const [copied, setCopied] = useState("");
  const copiedRef = useRef("");

  useEffect(() => {

    const initialText = clipboard.readText();
    setCopied(initialText);
    copiedRef.current = initialText;

    const interval = setInterval(() => {
      const currentText = clipboard.readText();

      if (!currentText || currentText.trim() === "" || currentText === copiedRef.current) return;

      setCopied(currentText);
      copiedRef.current = currentText;
    }, 500);

    return () => clearInterval(interval);
  }, []);

  return (
    <>
      <h1>{copied}</h1>
      <h2>Salman</h2>
    </>
  )
}

export default App
