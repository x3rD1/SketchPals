import Canvas from "./canvas/Canvas";

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
