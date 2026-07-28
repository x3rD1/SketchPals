import { Link } from "react-router-dom";
import type { Canvas } from "../types/types";
import styles from "./CanvasItem.module.css";
import { formatDate } from "../utils/formatDate";
import { useEffect, useRef, useState } from "react";
import useSaveCanvasTitle from "../hooks/useSaveCanvasTitle";

type CanvasItemProps = {
  canvas: Canvas;
  canManage: boolean;
};

function CanvasItem({ canvas, canManage }: CanvasItemProps) {
  const { id, title: initialTitle, thumbnail, createdAt } = canvas;
  const save = useSaveCanvasTitle();
  const [title, setTitle] = useState(initialTitle);
  const [isEditing, setIsEditing] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
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
        {!imageLoaded && <div className={styles.placeholder} />}

        <img
          src={thumbnail}
          alt={title}
          onLoad={() => setImageLoaded(true)}
          className={imageLoaded ? styles.loaded : styles.hidden}
        />
      </Link>

      <div className={styles.metaData}>
        <div className={styles.title}>
          {canvasTitle}

          {canManage && (
            <button
              style={{ display: isEditing ? "none" : "block" }}
              className={styles.editButton}
              onClick={() => setIsEditing(true)}
            >
              ✏️
            </button>
          )}
        </div>
        <small>Created: {formatDate(createdAt)}</small>
      </div>
    </div>
  );
}

export default CanvasItem;
