import { useQuery } from "react-query";

export interface Project {
  "s.no": number;
  "amt.pledged": number;
  "percentage.funded": number;
  title: string;
  country: string;
}

const API_URL =
  "https://raw.githubusercontent.com/saaslabsco/frontend-assignment/refs/heads/master/frontend-assignment.json";

async function fetchProjects(): Promise<Project[]> {
  const response = await fetch(API_URL);
  if (!response.ok) {
    throw new Error("Network response was not ok");
  }
  return response.json();
}

export function useProjects() {
  return useQuery<Project[], Error>("projects", fetchProjects, {
    staleTime: 5 * 60 * 1000, // 5 minutes
    cacheTime: 60 * 60 * 1000, // 1 hour
  });
}
