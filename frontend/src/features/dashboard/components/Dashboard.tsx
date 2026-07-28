import useCreateCanvas from "../hooks/useCreateCanvas";
import useDashboardData from "../hooks/useDashboardData";
import useLogout from "../hooks/useLogout";
import CanvasItem from "./CanvasItem";
import CanvasSkeleton from "./CanvasSkeleton";
import styles from "./Dashboard.module.css";

function Dashboard() {
  const { canvasesQuery, sharedCanvasQuery } = useDashboardData();
  const createCanvasMutation = useCreateCanvas();

  const handleCreate = () => createCanvasMutation.mutate();

  const handleLogout = useLogout();

  const canvasData = canvasesQuery.data ?? [];

  const hasCanvases = canvasData.length > 0;
  const canvases = canvasData.map((canvas) => (
    <li key={canvas.id}>
      <CanvasItem canvas={canvas} canManage={canvas.canManage} />
    </li>
  ));

  const sharedCanvasData = sharedCanvasQuery.data ?? [];
  const hasSharedCanvases = sharedCanvasData.length > 0;
  const shared = sharedCanvasData.map((canvas) => (
    <li key={canvas.id}>
      <CanvasItem canvas={canvas} canManage={canvas.canManage} />
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
      <div className={styles.main}>
        <div className={styles.topBar}>
          <div>
            <h1 className={styles.title}>Workspace</h1>
            <p className={styles.subtitle}>Continue where you left off.</p>
          </div>

          <button className={styles.logout} onClick={handleLogout}>
            Logout
          </button>
        </div>

        <div className={styles.createBtn}>
          <button onClick={handleCreate}>
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M12 5v14M5 12h14" />
            </svg>{" "}
            <span>New Canvas</span>
          </button>
        </div>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>
            My Canvases ({canvases.length})
          </h2>

          <ul className={styles.lists}>
            {canvasesQuery.isPending ? <CanvasSkeleton /> : canvases}
          </ul>

          {!canvasesQuery.isPending && !hasCanvases && emptyState}
        </section>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>
            Shared with Me ({shared.length})
          </h2>

          <ul className={styles.lists}>
            {sharedCanvasQuery.isPending ? <CanvasSkeleton /> : shared}
          </ul>

          {!sharedCanvasQuery.isPending && !hasSharedCanvases && (
            <p className={styles.emptyShared}>No shared canvases yet.</p>
          )}
        </section>
      </div>
    </div>
  );
}

export default Dashboard;
