import useCanvasEngine from "../hooks/useCanvasEngine";
import Canvas from "./Canvas";
import Toolbar from "./Toolbar";
import styles from "./CanvasEditor.module.css";
import useCanvasTools from "../hooks/useCanvasTools";
import useSaveCanvas from "../hooks/save/useSaveCanvas";

function CanvasEditor() {
  const engine = useCanvasEngine();

  const tool = useCanvasTools(engine);

  const save = useSaveCanvas(engine);

  return (
    <div className={styles.editor}>
      <Toolbar engine={engine} tool={tool} save={save} />
      <Canvas engine={engine} tool={tool} />
    </div>
  );
}

export default CanvasEditor;
