import { useNavigate } from "react-router-dom";
import styles from "./MobileNotice.module.css";

function MobileNotice() {
  const navigate = useNavigate();
  return (
    <div className={styles.mobileNotice}>
      <div className={styles.mobileCard}>
        <h2>Desktop Required</h2>

        <p>
          This collaborative canvas is designed for desktop and laptop
          experiences.
        </p>

        <p>
          Please open it on a larger screen to explore the drawing tools and
          real-time collaboration features.
        </p>

        <button onClick={() => navigate("/")}>Go back</button>
      </div>
    </div>
  );
}

export default MobileNotice;
