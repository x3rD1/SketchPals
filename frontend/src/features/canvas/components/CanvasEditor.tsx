import useCanvasEngine from "../hooks/useCanvasEngine";
import Canvas from "./Canvas";
import Toolbar from "./Toolbar";
import styles from "./CanvasEditor.module.css";
import useCanvasTools from "../hooks/useCanvasTools";
import useSaveCanvas from "../hooks/save/useSaveCanvas";
import useAutosaveCanvas from "../hooks/save/useAutosaveCanvas";

function CanvasEditor() {
  const engine = useCanvasEngine();

  const save = useSaveCanvas(engine);

  const autosave = useAutosaveCanvas({ save, engine });

  const tool = useCanvasTools({ engine, autosave });

  return (
    <div className={styles.editor}>
      <Toolbar engine={engine} tool={tool} save={save} autosave={autosave} />
      <Canvas engine={engine} tool={tool} />
    </div>
  );
}

export default CanvasEditor;
