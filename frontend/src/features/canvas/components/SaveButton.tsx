import type { AutosaveCanvas, SaveCanvas } from "../types/types";

type SaveButtonProps = {
  save: SaveCanvas;
  autosave: AutosaveCanvas;
};

function SaveButton({ save, autosave }: SaveButtonProps) {
  const handleSave = () => {
    autosave.commitSave();
  };

  return (
    <button onClick={handleSave} disabled={save.isPending}>
      Save
    </button>
  );
}

export default SaveButton;
