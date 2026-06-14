import type { CanvasEngine, SaveCanvas, ToolEngine } from "../types/types";
import SaveButton from "./SaveButton";
import styles from "./Toolbar.module.css";

type ToolbarProps = {
  engine: CanvasEngine;
  tool: ToolEngine;
  save: SaveCanvas;
};

function Toolbar({ engine, tool, save }: ToolbarProps) {
  return (
    <div className={styles.center}>
      <div className={styles.toolbar}>
        <div className={styles.current_tool}>
          <h2>{tool.currentTool}</h2>
        </div>

        <div className={styles.tools}>
          <div className={`${styles.draw} ${styles.buttonGroup}`}>
            <button onClick={() => tool.selectionTool("Pen")}>Pencil</button>
            <button onClick={() => tool.selectionTool("Eraser")}>Eraser</button>
          </div>

          <div className={`${styles.color} ${styles.buttonGroup}`}>
            <input
              type="color"
              value={engine.stroke.color}
              onChange={(e) => engine.stroke.setColor(e.target.value)}
            />
          </div>

          <div className={`${styles.move} ${styles.buttonGroup}`}>
            <button onClick={() => tool.selectionTool("Pan")}>Pan</button>
            <button onClick={() => tool.selectionTool("Select")}>Select</button>
          </div>

          <div className={`${styles.history} ${styles.buttonGroup}`}>
            <button
              onClick={engine.history.handleUndo}
              disabled={engine.history.state.index === 0}
            >
              Undo
            </button>
            <button
              onClick={engine.history.handleRedo}
              disabled={
                engine.history.state.index ===
                engine.history.state.history.length - 1
              }
            >
              Redo
            </button>
          </div>

          <div className={`${styles.save} ${styles.buttonGroup}`}>
            <SaveButton
              save={save}
              generateThumbnail={engine.canvas2D.generateThumbnail}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Toolbar;
