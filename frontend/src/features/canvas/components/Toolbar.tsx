import type {
  AutosaveCanvas,
  CanvasEngine,
  SaveCanvas,
  ToolEngine,
} from "../types/types";
import SaveButton from "./SaveButton";
import ShareButton from "./ShareButton";
import styles from "./Toolbar.module.css";
import {
  Pencil,
  Eraser,
  Hand,
  MousePointer2,
  Undo2,
  Redo2,
} from "lucide-react";

type ToolbarProps = {
  engine: CanvasEngine;
  tool: ToolEngine;
  save: SaveCanvas;
  autosave: AutosaveCanvas;
};

function Toolbar({ engine, tool, save, autosave }: ToolbarProps) {
  const canManage = engine.canvasData.data?.canManage;

  return (
    <div className={styles.center}>
      <div className={styles.toolbar}>
        <div className={styles.tools}>
          <div className={`${styles.draw} ${styles.buttonGroup}`}>
            <button
              className={tool.currentTool === "Pen" ? styles.active : ""}
              onClick={() => tool.selectionTool("Pen")}
              title="Pencil"
            >
              <Pencil size={20} />
            </button>
            <button
              className={tool.currentTool === "Eraser" ? styles.active : ""}
              onClick={() => tool.selectionTool("Eraser")}
              title="Eraser"
            >
              <Eraser size={20} />
            </button>
          </div>

          <div className={`${styles.color} ${styles.buttonGroup}`}>
            <input
              type="color"
              title="color"
              value={engine.stroke.color}
              onChange={(e) => engine.stroke.setColor(e.target.value)}
            />
          </div>

          <div className={`${styles.move} ${styles.buttonGroup}`}>
            <button
              className={tool.currentTool === "Pan" ? styles.active : ""}
              onClick={() => tool.selectionTool("Pan")}
              title="Pan"
            >
              <Hand size={20} />
            </button>
            <button
              className={tool.currentTool === "Select" ? styles.active : ""}
              onClick={() => tool.selectionTool("Select")}
              title="Select"
            >
              <MousePointer2 size={20} />
            </button>
          </div>

          <div className={`${styles.history} ${styles.buttonGroup}`}>
            <button
              onClick={engine.handleUndo}
              disabled={engine.state.index === 0}
              title="Undo"
            >
              <Undo2 size={20} />
            </button>
            <button
              onClick={engine.handleRedo}
              disabled={engine.state.index === engine.state.history.length - 1}
              title="Redo"
            >
              <Redo2 size={20} />
            </button>
          </div>

          <div className={`${styles.save} ${styles.buttonGroup}`}>
            <SaveButton save={save} autosave={autosave} />
          </div>
        </div>
        <div>{canManage && <ShareButton canvasId={engine.id} />}</div>
      </div>
    </div>
  );
}

export default Toolbar;
