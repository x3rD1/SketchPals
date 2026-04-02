# Canvas Whiteboard App

## What this project demonstrates

- Custom canvas rendering engine
- Tool system (pen, eraser, pan, select)
- Viewport transformations (zoom + pan)
- Hit detection for stroke selection
- Undo/redo with history stack

## Development Timeline

1. Implemented basic freehand drawing with canvas
2. Designed undo/redo system using a history stack
3. Built eraser tool with segment-based hit detection
4. Refactored into a modular tool system (pen, eraser, pan, select)
5. Added viewport system (pan + zoom with scale + offsets)
6. Implemented zoom-to-cursor for intuitive navigation
7. Developed selection tool with real-time drag interactions
8. Optimized history system to separate preview vs committed state during drag
9. Extracted reusable utility functions (movement detection, deleteSelectedStroke)
10. Implemented keyboard shortcuts for faster interactions (Delete / Backspace support)
11. Implemented selection box + multi-select
12. Enabled dragging multiple strokes + keyboard delete support on multi-select

## Key Concepts

- World vs screen coordinate systems
- Transform matrices (setTransform)
- Event system (React + native DOM hybrid)
