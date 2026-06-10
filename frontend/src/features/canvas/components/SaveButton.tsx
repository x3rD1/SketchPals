import type { Stroke } from "../types/types";
import useSaveCanvas from "../hooks/save/useSaveCanvas";

type SaveButtonProps = {
  id: string;
  strokes: Stroke[];
  version: number;
  setVersion: React.Dispatch<React.SetStateAction<number>>;
  generateThumbnail: () => string | undefined;
};

function SaveButton({
  id,
  strokes,
  version,
  setVersion,
  generateThumbnail,
}: SaveButtonProps) {
  const saveMutation = useSaveCanvas();

  const handleSave = () => {
    // Creates a thumbnail url on save
    const thumbnail = generateThumbnail();

    saveMutation.mutate(
      { id, strokes, version, thumbnail },
      { onSuccess: (data) => setVersion(data.version) },
    );
  };

  return (
    <div className="styles.saveBtnContainer">
      <button onClick={handleSave}>Save</button>
    </div>
  );
}

export default SaveButton;
