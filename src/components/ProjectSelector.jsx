import { useState, useEffect, useMemo } from "react";
import { IxSelect, IxSelectItem } from "@siemens/ix-react";
import { useTranslation } from "react-i18next";
import {
  latestProjectsData,
  foundProjectsOptionsAfterSearch,
} from "../data/mockData";

const ProjectSelector = ({
  selectedProject,
  onProjectSelect,
  showLatestProjects = false,
}) => {
  const { t } = useTranslation();
  const [searchValue, setSearchValue] = useState("");
  const [internalValue, setInternalValue] = useState(selectedProject || "");

  useEffect(() => {
    setInternalValue(selectedProject || "");
  }, [selectedProject]);

  const filteredProjects = useMemo(() => {
    if (!searchValue) {
      return showLatestProjects
        ? latestProjectsData
        : foundProjectsOptionsAfterSearch;
    }

    const searchLower = searchValue.toLowerCase();
    const sourceData = showLatestProjects
      ? latestProjectsData
      : foundProjectsOptionsAfterSearch;

    return sourceData.filter(
      (project) =>
        project.projectNumber.toLowerCase().includes(searchLower) ||
        project.projectName.toLowerCase().includes(searchLower)
    );
  }, [searchValue, showLatestProjects]);

  const handleSelectionChange = (event) => {
    console.log("🔵 handleSelectionChange triggered");
    console.log("  event.detail:", event.detail);
    const value = event.detail;
    if (value) {
      console.log("  Setting internalValue to:", value);
      setInternalValue(value);
      setSearchValue("");
      onProjectSelect(value);
    }
  };

  const handleInputChange = (event) => {
    const inputValue = event.detail;

    console.log("⌨️ handleInputChange triggered");
    console.log("  event.detail:", event.detail);
    console.log("  Current internalValue:", internalValue);
    console.log("  Current searchValue:", searchValue);
    console.log("  New searchValue will be:", inputValue);

    setSearchValue(inputValue);

    if (inputValue && internalValue) {
      console.log("  Clearing internalValue because user is typing");
      setInternalValue("");
    }
  };

  console.log("🔄 ProjectSelector render:");
  console.log("  selectedProject (prop):", selectedProject);
  console.log("  internalValue (state):", internalValue);
  console.log("  searchValue (state):", searchValue);

  return (
    <IxSelect
      onValueChange={handleSelectionChange}
      onInputChange={handleInputChange}
      placeholder={t("classifyMaterials.searchProject")}
      editable
      allowClear
      i18nSelectListHeader="Projects"
      style={{ width: "100%", maxWidth: "400px" }}
    >
      {filteredProjects.map((project) => (
        <IxSelectItem
          key={project.projectNumber}
          label={`${project.projectNumber} - ${project.projectName}`}
          value={project.projectNumber}
        />
      ))}
    </IxSelect>
  );
};

export default ProjectSelector;
