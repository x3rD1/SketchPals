import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import routes from "./routes";
import SocketManager from "./socket/SocketManager";

const router = createBrowserRouter(routes);

function App() {
  return (
    <>
      <Toaster />
      <SocketManager />
      <RouterProvider router={router} />
    </>
  );
}

export default App;
