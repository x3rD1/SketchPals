import { useCanvasInteractions } from "./useCanvasInteractions";

function Canvas() {
  const {
    state,
    canvasRef,
    handleMouseDown,
    handleMouseMove,
    handleMouseUp,
    handleMouseLeave,
    handleUndo,
    handleRedo,
    setColor,
    setWidth,
    setTool,
    color,
    width,
    cursorStyle,
  } = useCanvasInteractions();

  return (
    <>
      <canvas
        onContextMenu={(e) => e.preventDefault()}
        style={{ border: "1px solid red", cursor: cursorStyle }}
        width={500}
        height={500}
        ref={canvasRef}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseLeave}
      />
      <button onClick={handleUndo} disabled={state.index === 0}>
        Undo
      </button>
      <button
        onClick={handleRedo}
        disabled={state.history.length === state.index + 1}
      >
        Redo
      </button>
      <button onClick={() => setTool("pen")}>Pencil</button>
      <button onClick={() => setTool("eraser")}>Eraser</button>
      <input
        type="color"
        value={color}
        onChange={(e) => setColor(e.target.value)}
      />
      <input
        type="range"
        value={width}
        min={1}
        max={20}
        onChange={(e) => setWidth(Number(e.target.value))}
      />
      <button onClick={() => setTool("pan")}>Pan</button>
      <button onClick={() => setTool("select")}>Select</button>
    </>
  );
}

export default Canvas;
