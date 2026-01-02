import { useState, useEffect } from "react";
import { IxSelect, IxSelectItem } from "@siemens/ix-react";
import { useTranslation } from "react-i18next";
import { foundProjectsOptionsAfterSearch } from "../data/mockData";

const RECENT_PROJECTS_KEY = "recentViews";
const MAX_RECENT_PROJECTS = 5;

const ProjectSelectorSearch = ({ selectedProject, onProjectSelect }) => {
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

  const addToRecent = (projectNumber) => {
    const project = foundProjectsOptionsAfterSearch.find(
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
      {recentProjects.length > 0 && (
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
          {recentProjects.map((project) => (
            <IxSelectItem
              key={`recent-${project.projectNumber}`}
              label={`${project.projectNumber} - ${project.projectName}`}
              value={project.projectNumber}
            />
          ))}
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
      {foundProjectsOptionsAfterSearch.map((project) => (
        <IxSelectItem
          key={project.projectNumber}
          label={`${project.projectNumber} - ${project.projectName}`}
          value={project.projectNumber}
        />
      ))}
    </IxSelect>
  );
};

export default ProjectSelectorSearch;
