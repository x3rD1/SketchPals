import { Link } from "react-router-dom";
import type { Canvas } from "../types/types";
import styles from "./CanvasItem.module.css";
import { formatDate } from "../utils/formatDate";
import { useEffect, useRef, useState } from "react";
import useSaveCanvasTitle from "../hooks/useSaveCanvasTitle";

type CanvasItemProps = {
  canvas: Canvas;
};

function CanvasItem({ canvas }: CanvasItemProps) {
  const { id, title: initialTitle, thumbnail, createdAt } = canvas;
  const save = useSaveCanvasTitle();
  const [title, setTitle] = useState(initialTitle);
  const [isEditing, setIsEditing] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const commitSave = (id: string, title: string) => {
    if (title === initialTitle) return;
    save.mutate({ id, title });
  };

  const inputTitle = (
    <input
      className={styles.inputTitle}
      type="text"
      ref={inputRef}
      value={title}
      onChange={(e) => setTitle(e.target.value)}
      onBlur={() => {
        commitSave(id, title);
        setIsEditing(false);
      }}
      onKeyDown={(e) => {
        if (e.key === "Enter") {
          inputRef.current?.blur();
        }
      }}
    />
  );

  const canvasTitle = isEditing ? inputTitle : <h2>{title}</h2>;

  useEffect(() => {
    if (isEditing) {
      inputRef.current?.focus();
      inputRef.current?.select();
    }
  }, [isEditing]);

  return (
    <div className={styles.canvasItem}>
      <Link to={`/canvas/${id}`} className={styles.linkArea}>
        <img src={thumbnail} alt={title} />
      </Link>

      <div className={styles.metaData}>
        <div className={styles.title}>
          {canvasTitle}
          <button
            style={{ display: isEditing ? "none" : "block" }}
            className={styles.editButton}
            onClick={() => setIsEditing(true)}
          >
            edit
          </button>
        </div>
        <small>Created: {formatDate(createdAt)}</small>
      </div>
    </div>
  );
}

export default CanvasItem;
