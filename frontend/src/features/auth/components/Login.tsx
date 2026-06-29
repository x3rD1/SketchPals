import { GoogleLogin } from "@react-oauth/google";
import { useNavigate } from "react-router-dom";
import useAuth from "../hook/useAuth";

function Login() {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  if (isAuthenticated) navigate("/", { replace: true });

  return (
    <GoogleLogin
      onSuccess={async (res) => {
        try {
          const idToken = res.credential;

          const response = await fetch("http://localhost:3000/auth/google", {
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
  );
}

export default Login;
