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

  if (engine.data.canvasQuery.isPending) return <div>Loading...</div>;

  if (engine.data.canvasQuery.isError)
    return <div>{engine.data.canvasQuery.error.message}</div>;

  return (
    <div className={styles.editor}>
      <Toolbar engine={engine} tool={tool} save={save} autosave={autosave} />
      <Canvas engine={engine} tool={tool} />
    </div>
  );
}

export default CanvasEditor;
