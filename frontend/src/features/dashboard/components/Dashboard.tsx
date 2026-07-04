import useDashboardData from "../hooks/useDashboardData";
import useLogout from "../hooks/useLogout";
import CanvasItem from "./CanvasItem";
import styles from "./Dashboard.module.css";

function Dashboard() {
  const { canvasesQuery, createCanvasMutation } = useDashboardData();

  const handleCreate = () => createCanvasMutation.mutate();

  const handleLogout = useLogout();

  const canvasData = canvasesQuery.data ?? [];

  if (canvasesQuery.isPending) return <p>Loading...</p>; //temporary

  const hasCanvases = canvasData.length > 0;
  const canvases = canvasData.map((canvas) => (
    <li key={canvas.id}>
      <CanvasItem canvas={canvas} />
    </li>
  ));

  const emptyState = (
    <div className={styles.emptyState}>
      <h2>No canvases yet</h2>
      <p>
        Create your first canvas by clicking <strong>Start drawing</strong>{" "}
        button.
      </p>
    </div>
  );

  return (
    <div className={styles.dashboard}>
      <h1 className={styles.title}>Dashboard</h1>
      <button onClick={handleLogout}>Logout</button>
      <div className={styles.main}>
        <div className={styles.createBtn}>
          <button onClick={handleCreate}>Start drawing</button>
        </div>

        {hasCanvases ? (
          <ul className={styles.lists}>{canvases}</ul>
        ) : (
          emptyState
        )}
      </div>
    </div>
  );
}

export default Dashboard;
