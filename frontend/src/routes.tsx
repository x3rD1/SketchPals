import CanvasEditor from "./features/canvas/components/CanvasEditor";
import Dashboard from "./features/dashboard/components/Dashboard";

const routes = [
  {
    path: "/",
    element: <Dashboard />,
  },
  {
    path: "/canvas/:id",
    element: <CanvasEditor />,
  },
];

export default routes;
