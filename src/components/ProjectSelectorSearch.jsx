import { useState, useEffect, useMemo } from "react";
import { IxSelect, IxSelectItem } from "@siemens/ix-react";
import { useTranslation } from "react-i18next";
import { latestProjectsData } from "../data/mockData";

const RECENT_PROJECTS_KEY = "recentViews";
const MAX_RECENT_PROJECTS = 5;

const ProjectSelectorSearch = ({ selectedProject, selectedPlant, onProjectSelect }) => {
  const { t } = useTranslation();
  const [recentProjects, setRecentProjects] = useState([]);

  useEffect(() => {
    const stored = localStorage.getItem(RECENT_PROJECTS_KEY);
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        setRecentProjects(parsed);
      } catch (error) {
        console.error("Failed to parse recent projects:", error);
        setRecentProjects([]);
      }
    }
  }, []);

  const filteredProjects = useMemo(() => {
    let projects = latestProjectsData;

    if (selectedPlant) {
      projects = projects.filter((p) => p.plant === selectedPlant);
    }

    if (selectedProject) {
      const isProjectInList = projects.some((p) => p.projectNumber === selectedProject);
      if (!isProjectInList) {
        const selectedProjectData = latestProjectsData.find(
          (p) => p.projectNumber === selectedProject
        );
        if (selectedProjectData) {
          projects = [selectedProjectData, ...projects];
        }
      }
    }

    return projects;
  }, [selectedPlant, selectedProject]);

  const filteredRecents = useMemo(() => {
    if (!selectedPlant) {
      return recentProjects;
    }
    return recentProjects.filter((recent) => {
      const project = latestProjectsData.find(
        (p) => p.projectNumber === recent.projectNumber
      );
      return project && project.plant === selectedPlant;
    });
  }, [recentProjects, selectedPlant]);

  const addToRecent = (projectNumber) => {
    const project = latestProjectsData.find(
      (p) => p.projectNumber === projectNumber
    );
    if (!project) return;

    const projectInfo = {
      projectNumber: project.projectNumber,
      projectName: project.projectName,
      timestamp: new Date().toISOString(),
    };

    const filtered = recentProjects.filter(
      (p) => p.projectNumber !== projectNumber
    );
    const updated = [projectInfo, ...filtered].slice(0, MAX_RECENT_PROJECTS);

    setRecentProjects(updated);
    localStorage.setItem(RECENT_PROJECTS_KEY, JSON.stringify(updated));
  };

  const handleSelectionChange = (event) => {
    const value = Array.isArray(event.detail) ? event.detail[0] : event.detail;

    if (value === "_recents_header" || value === "_all_header") {
      return;
    }

    if (value) {
      addToRecent(value);
      onProjectSelect(value);
    } else {
      onProjectSelect("");
    }
  };

  return (
    <IxSelect
      value={selectedProject ? [selectedProject] : []}
      onValueChange={handleSelectionChange}
      placeholder={t("viewClassifications.searchProject")}
      allowClear
      style={{ width: "100%", maxWidth: "400px" }}
    >
      {filteredRecents.length > 0 && (
        <>
          <IxSelectItem
            label={t("viewClassifications.recentsHeader")}
            value="_recents_header"
            style={{
              fontWeight: "bold",
              fontStyle: "italic",
              pointerEvents: "none",
              opacity: 0.6,
            }}
          />
          {filteredRecents.map((project) => {
            const projectData = latestProjectsData.find(
              (p) => p.projectNumber === project.projectNumber
            );
            const plantName = projectData?.plant || "";
            return (
              <IxSelectItem
                key={`recent-${project.projectNumber}`}
                label={`${project.projectNumber} - ${project.projectName}${plantName ? ` - ${plantName}` : ""}`}
                value={project.projectNumber}
              />
            );
          })}
        </>
      )}

      <IxSelectItem
        label={t("viewClassifications.allProjectsHeader")}
        value="_all_header"
        style={{
          fontWeight: "bold",
          fontStyle: "italic",
          pointerEvents: "none",
          opacity: 0.6,
        }}
      />
      {filteredProjects.map((project) => (
        <IxSelectItem
          key={project.projectNumber}
          label={`${project.projectNumber} - ${project.projectName} - ${project.plant}`}
          value={project.projectNumber}
        />
      ))}
    </IxSelect>
  );
};

export default ProjectSelectorSearch;
