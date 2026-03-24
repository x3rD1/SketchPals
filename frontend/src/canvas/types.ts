export type Point = {
  x: number;
  y: number;
};

export type Stroke = {
  points: Point[];
  color: string;
  width: number;
};

export type CanvasState = Stroke[];

export type State = {
  history: CanvasState[];
  index: number;
};

export type Tool = "pen" | "eraser" | "pan";

export type PanDeps = {
  isPanning: React.RefObject<boolean>;
  viewport: Viewport;
  setViewport: React.Dispatch<React.SetStateAction<Viewport>>;
  initialMousePosition: React.RefObject<Point | null>;
};

export type PenDeps = {
  redraw: () => void;
  setState: React.Dispatch<React.SetStateAction<State>>;
  isDrawing: React.RefObject<boolean>;
  currentStroke: React.RefObject<Stroke | null>;
  color: string;
  width: number;
};

export type EraserDeps = {
  findStrokeIndex: (mouse: Point) => number;
  setHoveredIndex: React.Dispatch<React.SetStateAction<number | null>>;
  handleErase: (point: Point) => void;
};

export type Viewport = {
  offsetX: number;
  offsetY: number;
  scale: number;
};
