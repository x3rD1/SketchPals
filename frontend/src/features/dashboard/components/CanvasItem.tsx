import { Link } from "react-router-dom";
import type { Canvas } from "../types/types";
import styles from "./CanvasItem.module.css";
import { formatDate } from "../utils/formatDate";

type CanvasItemProps = {
  canvas: Canvas;
};

function CanvasItem({ canvas }: CanvasItemProps) {
  const { id, title, thumbnail, createdAt } = canvas;

  return (
    <Link to={`/canvas/${id}`} className={styles.canvasItem}>
      <img src={thumbnail} alt={title} />
      <div className={styles.metaData}>
        <h2>{title}</h2>
        <small>Created: {formatDate(createdAt)}</small>
      </div>
    </Link>
  );
}

export default CanvasItem;
