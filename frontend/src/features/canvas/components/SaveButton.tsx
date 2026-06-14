import type { SaveCanvas } from "../types/types";

type SaveButtonProps = {
  save: SaveCanvas;
  generateThumbnail: () => string | undefined;
};

function SaveButton({ save, generateThumbnail }: SaveButtonProps) {
  const handleSave = () => {
    // Creates a thumbnail url on save
    const thumbnail = generateThumbnail();

    save.mutate(thumbnail);
  };

  return (
    <button onClick={handleSave} disabled={save.isPending}>
      Save
    </button>
  );
}

export default SaveButton;
