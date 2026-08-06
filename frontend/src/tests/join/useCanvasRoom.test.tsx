import { renderHook, act } from "@testing-library/react";
import { vi, describe, it } from "vitest";

import useCanvasRoom from "../../features/canvas/hooks/socket/useCanvasRoom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

vi.mock("../../socket/socket", () => ({
  socket: {
    emit: vi.fn(),
    on: vi.fn(),
    off: vi.fn(),
  },
}));

vi.mock("react-hot-toast", () => ({
  default: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));

vi.mock("../../features/canvas/utils/strokeSerialization", () => ({
  deserializeStrokes: vi.fn((strokes) => strokes),
}));

import { socket } from "../../socket/socket";
import toast from "react-hot-toast";

describe("useCanvasRoom", () => {
  const queryClient = new QueryClient();

  const wrapper = ({ children }: React.PropsWithChildren) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
  const engine = {
    id: "canvas-123",
    setState: vi.fn(),
  } as any;

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("hydrates the canvas after joining successfully", () => {
    renderHook(() => useCanvasRoom(engine), {
      wrapper,
    });

    expect(socket.emit).toHaveBeenCalledWith(
      "join-canvas",
      "canvas-123",
      expect.any(Function),
    );

    const ack = vi.mocked(socket.emit).mock.calls[0][2];

    act(() => {
      ack({
        success: true,
        message: "Joined!",

        persisted: [{ id: "1" }, { id: "2" }],

        drawStrokes: [{ id: "3" }],

        eraseIds: ["2"],

        moveStrokes: [{ id: "3" }],
      });
    });

    expect(engine.setState).toHaveBeenCalledWith({
      history: [[{ id: "1" }, { id: "3" }]],
      index: 0,
    });

    expect(toast.success).toHaveBeenCalledWith("Joined!");
    expect(toast.error).not.toHaveBeenCalled();
  });

  it("shows an error if joining fails", () => {
    renderHook(() => useCanvasRoom(engine), { wrapper });

    const ack = vi.mocked(socket.emit).mock.calls[0][2];

    act(() => {
      ack({ success: false, message: "Failed to load canvas." });
    });

    expect(toast.error).toHaveBeenCalledWith("Failed to load canvas.");
    expect(toast.success).not.toHaveBeenCalled();
  });

  it("leaves the room on unmount", () => {
    const { unmount } = renderHook(() => useCanvasRoom(engine), { wrapper });

    unmount();

    expect(socket.emit).toHaveBeenCalledWith("leave-canvas", "canvas-123");
  });
});
