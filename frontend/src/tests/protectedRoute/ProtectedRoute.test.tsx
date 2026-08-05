import { vi } from "vitest";

const mockUseAuth = vi.fn();
const mockDashboard = vi.fn();
const mockNavigate = vi.fn();

vi.mock("../../features/auth/hook/useAuth", () => ({
  default: () => mockUseAuth(),
}));

vi.mock("../../features/dashboard/components/Dashboard", () => ({
  default: () => mockDashboard(),
}));

vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");

  return {
    ...actual,
    Navigate: () => mockNavigate(),
  };
});

import { screen } from "@testing-library/react";
import ProtectedRoute from "../../features/auth/components/ProtectedRoute";
import Dashboard from "../../features/dashboard/components/Dashboard";
import { renderWithProviders } from "../test-utils";

test("renders Dashboard when user is authenticated", () => {
  mockUseAuth.mockReturnValue({ isAuthenticated: true, isPending: false });

  mockDashboard.mockReturnValue("Workspace");

  renderWithProviders(
    <ProtectedRoute>
      <Dashboard />
    </ProtectedRoute>,
  );

  expect(screen.getByText("Workspace")).toBeInTheDocument();
});

test("redirect to Login page when the user is not authenticated", () => {
  mockUseAuth.mockReturnValue({ isAuthenticated: false, isPending: false });

  renderWithProviders(
    <ProtectedRoute>
      <Dashboard />
    </ProtectedRoute>,
  );

  expect(mockNavigate).toHaveBeenCalled();
});

test("return null if ProtectedRoute useAuth is still in pending", () => {
  mockUseAuth.mockReturnValue({ isAuthenticated: true, isPending: true });

  mockDashboard.mockReturnValue("Workspace");

  renderWithProviders(
    <ProtectedRoute>
      <Dashboard />
    </ProtectedRoute>,
  );

  expect(screen.queryByText("Workspace")).not.toBeInTheDocument();
});
