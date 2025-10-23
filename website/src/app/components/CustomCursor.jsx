"use client"

import { useEffect, useRef, useState } from 'react';

export default function CustomCursor() {
  const cursorDotRef = useRef(null);
  const cursorOutlineRef = useRef(null);
  const trailRef = useRef([]);
  const [trails, setTrails] = useState([]);

  useEffect(() => {
    const cursorDot = cursorDotRef.current;
    const cursorOutline = cursorOutlineRef.current;

    let mouseX = 0;
    let mouseY = 0;
    let outlineX = 0;
    let outlineY = 0;
    let isClicking = false;

    const handleMouseMove = (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;

      if (cursorDot) {
        cursorDot.style.left = `${mouseX}px`;
        cursorDot.style.top = `${mouseY}px`;
      }

      // Create trail effect (limited)
      if (Math.random() > 0.7) {
        const newTrail = { x: mouseX, y: mouseY, id: Date.now() + Math.random() };
        trailRef.current = [...trailRef.current.slice(-5), newTrail];
        setTrails([...trailRef.current]);
      }
    };

    const animateOutline = () => {
      // Smooth following effect with easing
      const ease = isClicking ? 0.25 : 0.15;
      outlineX += (mouseX - outlineX) * ease;
      outlineY += (mouseY - outlineY) * ease;

      if (cursorOutline) {
        cursorOutline.style.left = `${outlineX}px`;
        cursorOutline.style.top = `${outlineY}px`;
      }

      requestAnimationFrame(animateOutline);
    };

    const handleMouseEnter = (e) => {
      const element = e.target;
      if (cursorDot) {
        cursorDot.style.transform = 'translate(-50%, -50%) scale(0.5)';
        cursorDot.style.backgroundColor = '#c084fc';
      }
      if (cursorOutline) {
        cursorOutline.style.transform = 'translate(-50%, -50%) scale(1)';
        cursorOutline.style.borderColor = 'rgba(192, 132, 252, 0.8)';
        cursorOutline.style.borderWidth = '3px';
      }
    };

    const handleMouseLeave = () => {
      if (cursorDot) {
        cursorDot.style.transform = 'translate(-50%, -50%) scale(1)';
        cursorDot.style.backgroundColor = '#a78bfa';
      }
      if (cursorOutline) {
        cursorOutline.style.transform = 'translate(-50%, -50%) scale(1)';
        cursorOutline.style.borderColor = 'rgba(139, 92, 246, 0.5)';
        cursorOutline.style.borderWidth = '2px';
      }
    };

    const handleMouseDown = () => {
      isClicking = true;
      if (cursorDot) {
        cursorDot.style.transform = 'translate(-50%, -50%) scale(0.8)';
      }
      if (cursorOutline) {
        cursorOutline.style.transform = cursorOutline.style.transform.replace(/scale\([^)]+\)/, '') + ' scale(0.9)';
      }
    };

    const handleMouseUp = () => {
      isClicking = false;
      if (cursorDot) {
        cursorDot.style.transform = 'translate(-50%, -50%) scale(1)';
      }
      if (cursorOutline) {
        cursorOutline.style.transform = cursorOutline.style.transform.replace(/scale\([^)]+\)/, '') + ' scale(1)';
      }
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mousedown', handleMouseDown);
    document.addEventListener('mouseup', handleMouseUp);
    animateOutline();

    // Add hover effects for interactive elements with MutationObserver for dynamic elements
    const setupInteractiveElements = () => {
      const interactiveElements = document.querySelectorAll('a, button, [role="button"], input[type="button"], input[type="submit"]');
      interactiveElements.forEach(el => {
        el.addEventListener('mouseenter', handleMouseEnter);
        el.addEventListener('mouseleave', handleMouseLeave);
      });
    };

    setupInteractiveElements();

    // Observer for dynamically added elements
    const observer = new MutationObserver(setupInteractiveElements);
    observer.observe(document.body, { childList: true, subtree: true });

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mousedown', handleMouseDown);
      document.removeEventListener('mouseup', handleMouseUp);
      observer.disconnect();
    };
  }, []);

  // Remove trails after animation
  useEffect(() => {
    const timer = setTimeout(() => {
      setTrails([]);
      trailRef.current = [];
    }, 500);
    return () => clearTimeout(timer);
  }, [trails]);

  return (
    <>
      {/* Trail particles */}
      {trails.map((trail) => (
        <div
          key={trail.id}
          style={{
            position: 'fixed',
            left: `${trail.x}px`,
            top: `${trail.y}px`,
            width: '4px',
            height: '4px',
            backgroundColor: '#8b5cf6',
            borderRadius: '50%',
            pointerEvents: 'none',
            zIndex: 9997,
            transform: 'translate(-50%, -50%)',
            animation: 'trailFade 0.5s ease-out forwards',
            opacity: 0.6,
          }}
        />
      ))}
      
      {/* Main cursor dot */}
      <div
        ref={cursorDotRef}
        className="custom-cursor-dot"
        style={{
          position: 'fixed',
          width: '10px',
          height: '10px',
          backgroundColor: '#a78bfa',
          borderRadius: '50%',
          pointerEvents: 'none',
          zIndex: 9999,
          transform: 'translate(-50%, -50%)',
          transition: 'transform 0.15s ease, background-color 0.2s ease',
          boxShadow: '0 0 10px rgba(167, 139, 250, 0.8), 0 0 20px rgba(167, 139, 250, 0.4)',
        }}
      />
      
      {/* Cursor outline */}
      <div
        ref={cursorOutlineRef}
        className="custom-cursor-outline"
        style={{
          position: 'fixed',
          width: '35px',
          height: '35px',
          border: '2px solid rgba(139, 92, 246, 0.5)',
          borderRadius: '50%',
          pointerEvents: 'none',
          zIndex: 9998,
          transform: 'translate(-50%, -50%)',
          transition: 'all 0.2s ease',
          boxShadow: '0 0 15px rgba(139, 92, 246, 0.3)',
        }}
      />
    </>
  );
}
