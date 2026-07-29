import styles from "./Canvas.module.css";
import type { CanvasEngine, ToolEngine } from "../types/types";

type CanvasProps = {
  engine: CanvasEngine;
  tool: ToolEngine;
};

function Canvas({ engine, tool }: CanvasProps) {
  return (
    <div className={styles.canvasWrapper}>
      <canvas
        className={styles.canvas}
        onContextMenu={(e) => e.preventDefault()}
        style={{ cursor: tool.cursorStyle }}
        width={1280}
        height={720}
        ref={engine.canvas2D.canvasRef}
        onMouseDown={tool.handleMouseDown}
        onMouseMove={tool.handleMouseMove}
        onMouseUp={tool.handleMouseUp}
        onMouseLeave={tool.handleMouseLeave}
      />
    </div>
  );
}

export default Canvas;
