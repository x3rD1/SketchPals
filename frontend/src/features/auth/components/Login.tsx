import { GoogleLogin } from "@react-oauth/google";
import { useNavigate } from "react-router-dom";
import useAuth from "../hook/useAuth";
import styles from "./Login.module.css";

function Login() {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  if (isAuthenticated) navigate("/", { replace: true });

  return (
    <div className={styles.container}>
      <div className={styles.hero}>
        <span className={styles.badge}>Realtime collaboration</span>

        <h1>SketchPals</h1>

        <p>Brainstorm, sketch, and build together in real-time.</p>

        <div className={styles.googleButton}>
          <GoogleLogin
            onSuccess={async (res) => {
              try {
                const idToken = res.credential;

                const response = await fetch("/api/auth/google", {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  credentials: "include",
                  body: JSON.stringify({ idToken }),
                });

                if (!response.ok) {
                  throw new Error("Login failed");
                }

                navigate("/", { replace: true });
              } catch (error) {
                console.log(error);
              }
            }}
          />
        </div>

        <small>Secure authentication powered by Google</small>
      </div>

      <div className={styles.grid}></div>
    </div>
  );
}

export default Login;
