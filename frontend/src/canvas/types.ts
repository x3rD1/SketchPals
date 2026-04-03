export type Point = {
  x: number;
  y: number;
};

export type Stroke = {
  id: string;
  points: Point[];
  color: string;
  width: number;
};

export type CanvasState = Stroke[];

export type State = {
  history: CanvasState[];
  index: number;
};

export type Tool = "pen" | "eraser" | "pan" | "select";

export type SelectDeps = {
  isDragging: React.RefObject<boolean>;
  dragStart: React.RefObject<Point | null>;
  selectedIdsRef: React.RefObject<Set<string>>;
  setSelectedIds: React.Dispatch<React.SetStateAction<Set<string>>>;
  setHoveredId: React.Dispatch<React.SetStateAction<string | null>>;
  findStrokeId: (mouse: Point) => string | null;
  state: State;
  setState: React.Dispatch<React.SetStateAction<State>>;
  initialStateRef: React.RefObject<CanvasState | null>;
  setCursorStyle: React.Dispatch<React.SetStateAction<string>>;
  startPointRef: React.RefObject<Point | null>;
  endPointRef: React.RefObject<Point | null>;
  isSelectingBox: React.RefObject<boolean>;
  redraw: () => void;
};

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
  findStrokeId: (mouse: Point) => string | null;
  setHoveredId: React.Dispatch<React.SetStateAction<string | null>>;
  handleErase: (idToRemove: string) => void;
};

export type Viewport = {
  offsetX: number;
  offsetY: number;
  scale: number;
};
