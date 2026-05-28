import { useMutation } from "@tanstack/react-query";
import type { Stroke } from "../canvas/types";
import { saveCanvas } from "../api/canvas";

type SaveButtonProps = {
  id: string;
  strokes: Stroke[];
  version: number;
  setVersion: React.Dispatch<React.SetStateAction<number>>;
};

function SaveButton({ id, strokes, version, setVersion }: SaveButtonProps) {
  const { mutate } = useMutation({
    mutationFn: () => saveCanvas(id, strokes, version),

    onSuccess: (data) => {
      setVersion(data.version);

      console.log(data);
    },

    onError: (error) => alert(error),
  });

  const handleSave = () => {
    mutate();
  };

  return (
    <div className="styles.saveBtnContainer">
      <button onClick={handleSave}>Save</button>
    </div>
  );
}

export default SaveButton;
