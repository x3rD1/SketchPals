import { vi } from "vitest";

const mockNavigate = vi.fn();
const mockUseAuth = vi.fn();
const mockFetch = vi.fn();

beforeEach(() => {
  mockFetch.mockReset();
  globalThis.fetch = mockFetch;
});

vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");

  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

vi.mock("../../features/auth/hook/useAuth", () => ({
  default: () => mockUseAuth(),
}));

vi.mock("@react-oauth/google", async () => {
  const actual = await vi.importActual("@react-oauth/google");

  return {
    ...actual,
    GoogleLogin: ({ onSuccess }: any) => (
      <button onClick={() => onSuccess({ credential: "fake-token" })}>
        Login
      </button>
    ),
  };
});

import { screen, fireEvent, waitFor } from "@testing-library/react";
import Login from "../../features/auth/components/Login";
import { renderWithProviders } from "../test-utils";

afterEach(() => {
  vi.clearAllMocks();
});

test("renders Login component when user is logged out", () => {
  mockUseAuth.mockReturnValue({ isAuthenticated: false });

  renderWithProviders(<Login />);

  expect(screen.getByText("SketchPals")).toBeInTheDocument();
});

test("redirects authenticated users", () => {
  mockUseAuth.mockReturnValue({
    isAuthenticated: true,
  });

  renderWithProviders(<Login />);

  expect(mockNavigate).toHaveBeenCalledWith("/", {
    replace: true,
  });
});

test("sends google token to backend", () => {
  mockUseAuth.mockReturnValue({ isAuthenticated: false });

  mockFetch.mockResolvedValue({ ok: true });

  renderWithProviders(<Login />);

  fireEvent.click(screen.getByText("Login"));

  expect(mockFetch).toHaveBeenCalledWith("/api/auth/google", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({ idToken: "fake-token" }),
  });
});

test("navigate after successful google login", async () => {
  mockUseAuth.mockReturnValue({ isAuthenticated: false });

  mockFetch.mockResolvedValue({ ok: true });

  renderWithProviders(<Login />);

  fireEvent.click(screen.getByText("Login"));

  await waitFor(() => {
    expect(mockNavigate).toHaveBeenCalledWith("/", { replace: true });
  });
});

test("throw an error on unsuccessful google login", async () => {
  mockUseAuth.mockReturnValue({ isAuthenticated: false });

  mockFetch.mockResolvedValue({ ok: false });

  renderWithProviders(<Login />);

  fireEvent.click(screen.getByText("Login"));

  await waitFor(() => {
    expect(mockFetch).toHaveBeenCalled();
  });

  expect(mockNavigate).not.toHaveBeenCalled();
});
