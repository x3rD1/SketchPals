import styles from "./CanvasSkeleton.module.css";

function CanvasSkeleton() {
  return (
    <>
      {Array.from({ length: 2 }).map((_, index) => (
        <li key={index}>
          <div className={styles.canvasItem}>
            <div className={styles.thumbnail} />

            <div className={styles.metaData}>
              <div className={styles.titleRow}>
                <div className={styles.title} />
                <div className={styles.editButton} />
              </div>

              <div className={styles.date} />
            </div>
          </div>
        </li>
      ))}
    </>
  );
}

export default CanvasSkeleton;
