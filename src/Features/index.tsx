"use client";

import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  LinearProgress,
  Typography,
  CircularProgress,
} from "@mui/material";
import { useProjects, Project } from "./Services";

export default function ProjectTable() {
  const [currentPage, setCurrentPage] = useState(1);
  const projectsPerPage = 5;

  const { data: projects, isLoading, isError } = useProjects();

  if (isLoading) {
    return (
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
        <CircularProgress />
      </div>
    );
  }

  if (isError) {
    return (
      <Typography color="error" align="center">
        Error loading projects. Please try again later.
      </Typography>
    );
  }

  const totalPages = Math.ceil((projects?.length || 0) / projectsPerPage);
  const indexOfLastProject = currentPage * projectsPerPage;
  const indexOfFirstProject = indexOfLastProject - projectsPerPage;
  const currentProjects = projects?.slice(indexOfFirstProject, indexOfLastProject) || [];
  const nextPage = () => setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  const prevPage = () => setCurrentPage((prev) => Math.max(prev - 1, 1));

  return (
    <div style={{ maxWidth: "100%", margin: "auto", padding: 16 }}>
      <Typography variant="h4" component="h1" align="center" gutterBottom>
        Project Funding Status
      </Typography>
      <TableContainer component={Paper} elevation={4}>
        <Table>
          <TableHead style={{ backgroundColor: "#f5f5f5" }}>
            <TableRow>
              <TableCell style={{ fontWeight: "bold", fontSize: "1.1rem" }}>S.No.</TableCell>
              <TableCell style={{ fontWeight: "bold", fontSize: "1.1rem" }}>Title</TableCell>
              <TableCell style={{ fontWeight: "bold", fontSize: "1.1rem" }}>Percentage Funded</TableCell>
              <TableCell style={{ fontWeight: "bold", fontSize: "1.1rem" }}>Amount Pledged</TableCell>
              <TableCell style={{ fontWeight: "bold", fontSize: "1.1rem" }}>Country</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {currentProjects.map((project: Project, index: number) => (
              <TableRow key={project["s.no"]?.toString() || `project-${index}`}>
                <TableCell>{project["s.no"] + 1 || "-"}</TableCell>
                <TableCell>{project.title || "Untitled"}</TableCell>
                <TableCell>
                  <LinearProgress
                    variant="determinate"
                    value={project["percentage.funded"] || 0}
                    color="primary"
                    style={{ marginBottom: 8 }}
                  />
                  <Typography variant="body2" color="textSecondary">
                    {project["percentage.funded"]?.toFixed(2) || 0}%
                  </Typography>
                </TableCell>
                <TableCell>${(project["amt.pledged"] || 0).toLocaleString()}</TableCell>
                <TableCell>{project.country || "Unknown"}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", marginTop: 24, gap: 16 }}>
        <Button
          onClick={prevPage}
          disabled={currentPage === 1}
          variant="contained"
          sx={{ backgroundColor: "#004CE5", "&:hover": { backgroundColor: "#003BB5" } }}
          size="large"
        >
          Previous
        </Button>
        <Typography variant="body1" color="textPrimary">
          Page {currentPage} of {totalPages}
        </Typography>
        <Button
          onClick={nextPage}
          disabled={currentPage === totalPages}
          variant="contained"
          color="primary"
          sx={{ backgroundColor: "#004CE5", "&:hover": { backgroundColor: "#003BB5" } }}
          size="large"
        >
          Next
        </Button>
      </div>
    </div>
  );
}
