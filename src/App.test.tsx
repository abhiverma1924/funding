import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import ProjectTable from "../src/Features";
import { useProjects } from "../src/Features/Services";

// Mock the `useProjects` hook
jest.mock("../src/Features/Services", () => ({
  useProjects: jest.fn(),
}));

describe("ProjectTable Component", () => {
  // Mock Data
  const mockProjects = [
    { "s.no": 0, title: "Project A", "percentage.funded": 70, "amt.pledged": 1000, country: "USA" },
    { "s.no": 1, title: "Project B", "percentage.funded": 50, "amt.pledged": 500, country: "UK" },
    { "s.no": 2, title: "Project C", "percentage.funded": 90, "amt.pledged": 1500, country: "Canada" },
  ];

  // Reset mocks before each test
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("renders loading state", () => {
    // Mock `isLoading` state
    (useProjects as jest.Mock).mockReturnValue({ isLoading: true, isError: false, data: null });

    render(<ProjectTable />);

    expect(screen.getByRole("progressbar")).toBeInTheDocument();
  });

  test("renders error state", () => {
    // Mock `isError` state
    (useProjects as jest.Mock).mockReturnValue({ isLoading: false, isError: true, data: null });

    render(<ProjectTable />);

    expect(screen.getByText("Error loading projects. Please try again later.")).toBeInTheDocument();
  });

  test("renders projects correctly", () => {
    // Mock successful data retrieval
    (useProjects as jest.Mock).mockReturnValue({ isLoading: false, isError: false, data: mockProjects });

    render(<ProjectTable />);

    expect(screen.getByText("Project Funding Status")).toBeInTheDocument();
    expect(screen.getByText("Project A")).toBeInTheDocument();
    expect(screen.getByText("Project B")).toBeInTheDocument();
    expect(screen.getByText("Project C")).toBeInTheDocument();
    expect(screen.getByText("USA")).toBeInTheDocument();
    expect(screen.getByText("UK")).toBeInTheDocument();
    expect(screen.getByText("Canada")).toBeInTheDocument();
  });

  test("disables 'Previous' button on the first page", () => {
    (useProjects as jest.Mock).mockReturnValue({ isLoading: false, isError: false, data: mockProjects });

    render(<ProjectTable />);

    expect(screen.getByRole("button", { name: /Previous/i })).toBeDisabled();
  });

  test("navigates to the next page", () => {
    (useProjects as jest.Mock).mockReturnValue({ isLoading: false, isError: false, data: mockProjects });

    render(<ProjectTable />);

    const nextButton = screen.getByRole("button", { name: /Next/i });
    fireEvent.click(nextButton);

    expect(nextButton).toBeDisabled(); // Because there's only one page of data
  });

  test("displays pagination information", () => {
    (useProjects as jest.Mock).mockReturnValue({ isLoading: false, isError: false, data: mockProjects });

    render(<ProjectTable />);

    expect(screen.getByText("Page 1 of 1")).toBeInTheDocument();
  });
});
