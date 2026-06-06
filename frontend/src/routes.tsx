import Canvas from "./features/canvas/components/Canvas";

const routes = [
  {
    path: "/",
    element: <Canvas />,
  },
  {
    path: "/canvas/:id",
    element: <Canvas />,
  },
];

export default routes;
