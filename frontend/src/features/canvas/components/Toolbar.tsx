import type {
  AutosaveCanvas,
  CanvasEngine,
  SaveCanvas,
  ToolEngine,
} from "../types/types";
import SaveButton from "./SaveButton";
import ShareButton from "./ShareButton";
import styles from "./Toolbar.module.css";

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
              onClick={engine.handleUndo}
              disabled={engine.state.index === 0}
            >
              Undo
            </button>
            <button
              onClick={engine.handleRedo}
              disabled={engine.state.index === engine.state.history.length - 1}
            >
              Redo
            </button>
          </div>

          <div className={`${styles.save} ${styles.buttonGroup}`}>
            <SaveButton save={save} autosave={autosave} />
          </div>
        </div>
      </div>
      <div>{canManage && <ShareButton canvasId={engine.id} />}</div>
    </div>
  );
}

export default Toolbar;
