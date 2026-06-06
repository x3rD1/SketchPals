import SaveButton from "./SaveButton";
// import { useCanvasInteractions } from "../hooks/useCanvasInteractions";
import useCanvasEngine from "../hooks/useCanvasEngine";
import useCanvasTools from "../hooks/useCanvasTools";

function Canvas() {
  const engine = useCanvasEngine();

  const tool = useCanvasTools(engine);

  return (
    <>
      {engine.id && (
        <SaveButton
          id={engine.id}
          strokes={engine.history.strokes}
          version={engine.data.version}
          setVersion={engine.data.setVersion}
        />
      )}

      <canvas
        onContextMenu={(e) => e.preventDefault()}
        style={{ border: "1px solid red", cursor: tool.cursorStyle }}
        width={500}
        height={500}
        ref={engine.canvasRef}
        onMouseDown={tool.handleMouseDown}
        onMouseMove={tool.handleMouseMove}
        onMouseUp={tool.handleMouseUp}
        onMouseLeave={tool.handleMouseLeave}
      />
      <button
        onClick={engine.history.handleUndo}
        disabled={engine.history.state.index === 0}
      >
        Undo
      </button>
      <button
        onClick={engine.history.handleRedo}
        disabled={
          engine.history.state.history.length === engine.history.state.index + 1
        }
      >
        Redo
      </button>
      <button onClick={() => tool.selectionTool("pen")}>Pencil</button>
      <button onClick={() => tool.selectionTool("eraser")}>Eraser</button>
      <input
        type="color"
        value={engine.stroke.color}
        onChange={(e) => engine.stroke.setColor(e.target.value)}
      />
      <input
        type="range"
        value={engine.stroke.width}
        min={1}
        max={20}
        onChange={(e) => engine.stroke.setWidth(Number(e.target.value))}
      />
      <button onClick={() => tool.selectionTool("pan")}>Pan</button>
      <button onClick={() => tool.selectionTool("select")}>Select</button>
    </>
  );
}

export default Canvas;
