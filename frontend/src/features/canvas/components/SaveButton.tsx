import { useMutation } from "@tanstack/react-query";
import type { Stroke } from "../types/types";
import { saveCanvas } from "../api/canvas";

type SaveButtonProps = {
  id: string;
  strokes: Stroke[];
  version: number;
  setVersion: React.Dispatch<React.SetStateAction<number>>;
  generateThumbnail: () => string | undefined;
};

type SaveCanvasMutationVariables = {
  id: string;
  strokes: Stroke[];
  version: number;
  thumbnail: string | undefined;
};

function SaveButton({
  id,
  strokes,
  version,
  setVersion,
  generateThumbnail,
}: SaveButtonProps) {
  const saveCanvasMutation = ({
    id,
    strokes,
    version,
    thumbnail,
  }: SaveCanvasMutationVariables) =>
    saveCanvas(id, strokes, version, thumbnail);

  const { mutate } = useMutation({
    mutationFn: saveCanvasMutation,

    onSuccess: (data) => {
      setVersion(data.version);
    },

    onError: (error) => alert(error),
  });

  const handleSave = () => {
    // Creates a thumbnail url on save
    const thumbnail = generateThumbnail();

    mutate({ id, strokes, version, thumbnail });
  };

  return (
    <div className="styles.saveBtnContainer">
      <button onClick={handleSave}>Save</button>
    </div>
  );
}

export default SaveButton;
