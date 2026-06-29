import Login from "./features/auth/components/Login";
import ProtectedRoute from "./features/auth/components/ProtectedRoute";
import CanvasEditor from "./features/canvas/components/CanvasEditor";
import Dashboard from "./features/dashboard/components/Dashboard";

const routes = [
  { path: "/login", element: <Login /> },
  {
    path: "/",
    element: (
      <ProtectedRoute>
        <Dashboard />
      </ProtectedRoute>
    ),
  },
  {
    path: "/canvas/:id",
    element: (
      <ProtectedRoute>
        <CanvasEditor />
      </ProtectedRoute>
    ),
  },
];

export default routes;
