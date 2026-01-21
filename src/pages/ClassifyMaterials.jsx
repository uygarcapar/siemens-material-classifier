import { useState, useEffect, useMemo, useRef } from "react";
import {
  IxButton,
  IxTypography,
  IxModalHeader,
  IxModalContent,
  IxModalFooter,
  IxIcon,
  IxPill,
  Modal,
  showModal,
} from "@siemens/ix-react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import ProjectSelectorWithLatest from "../components/ProjectSelectorWithLatest";
import PlantSelector from "../components/PlantSelector";
import { useUrlParams } from "../hooks/useUrlParams";
import {
  latestProjectsData,
  classes,
  classifiedMaterialsDataOfProject,
} from "../data/mockData";
import {
  saveProjectClassifications,
  getProjectClassifications,
} from "../utils/classificationStorage";

const classColors = {
  "Class A": { bg: "#00aa00", text: "#ffffff", variant: "success" },
  "Class B": { bg: "#0066cc", text: "#ffffff", variant: "info" },
  "Class C": { bg: "#ff9900", text: "#000000", variant: "warning" },
  "Class D": { bg: "#cc0000", text: "#ffffff", variant: "alarm" },
};

const ClassifyMaterials = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { project, plant, setProject, setPlant, setParams } = useUrlParams();

  const [selectedProject, setSelectedProject] = useState(project || "");
  const [selectedPlant, setSelectedPlant] = useState(plant || "");
  const [classifications, setClassifications] = useState({});
  const [submittedClassifications, setSubmittedClassifications] = useState({});
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  const currentProject = useMemo(() => {
    return latestProjectsData.find((p) => p.projectNumber === selectedProject);
  }, [selectedProject]);

  const materials = currentProject?.materials || [];

  const filteredProjectsCount = useMemo(() => {
    if (!selectedPlant) return latestProjectsData.length;
    return latestProjectsData.filter((p) => p.plant === selectedPlant).length;
  }, [selectedPlant]);

  const isPlantMismatch = useMemo(() => {
    if (!selectedProject || !selectedPlant || !currentProject) return false;
    return currentProject.plant !== selectedPlant;
  }, [selectedProject, selectedPlant, currentProject]);

  useEffect(() => {
    if (project && project !== selectedProject) {
      setSelectedProject(project);
      const projectData = latestProjectsData.find(
        (p) => p.projectNumber === project,
      );
      if (projectData && projectData.plant && !plant) {
        setSelectedPlant(projectData.plant);
      }
    }
  }, [project]);

  useEffect(() => {
    if (plant && plant !== selectedPlant) {
      setSelectedPlant(plant);
    }
  }, [plant]);

  useEffect(() => {
    if (!selectedProject) {
      setClassifications({});
      setSubmittedClassifications({});
      setHasUnsavedChanges(false);
      return;
    }

    const savedClassifications = getProjectClassifications(selectedProject);

    const draftKey = `draftClassifications_${selectedProject}`;
    const draftData = localStorage.getItem(draftKey);
    let draftClassifications = {};
    if (draftData) {
      try {
        draftClassifications = JSON.parse(draftData);
      } catch (e) {
        console.error("Failed to parse draft classifications", e);
      }
    }

    if (savedClassifications.length > 0) {
      const classificationsObj = {};
      savedClassifications.forEach((item) => {
        classificationsObj[item.materialNumber] = item.classification;
      });
      const mergedClassifications = {
        ...classificationsObj,
        ...draftClassifications,
      };
      setClassifications(mergedClassifications);
      setSubmittedClassifications(classificationsObj);
      setHasUnsavedChanges(Object.keys(draftClassifications).length > 0);
    } else {
      const mockClassifications =
        classifiedMaterialsDataOfProject[selectedProject];
      if (mockClassifications && mockClassifications.length > 0) {
        const classificationsObj = {};
        mockClassifications.forEach((item) => {
          classificationsObj[item.materialNumber] = item.classification;
        });
        const mergedClassifications = {
          ...classificationsObj,
          ...draftClassifications,
        };
        setClassifications(mergedClassifications);
        setSubmittedClassifications(classificationsObj);
        setHasUnsavedChanges(Object.keys(draftClassifications).length > 0);
      } else {
        setClassifications(draftClassifications);
        setSubmittedClassifications({});
        setHasUnsavedChanges(Object.keys(draftClassifications).length > 0);
      }
    }
  }, [selectedProject]);

  const handleProjectSelect = (projectNum) => {
    setSelectedProject(projectNum);

    if (projectNum) {
      const project = latestProjectsData.find(
        (p) => p.projectNumber === projectNum,
      );
      if (project && project.plant) {
        setSelectedPlant(project.plant);
        setParams({ project: projectNum, plant: project.plant });
      } else {
        setProject(projectNum);
      }
    } else {
      setProject("");
    }
  };

  const handlePlantSelect = (plantCode) => {
    if (plantCode === selectedPlant) {
      return;
    }

    setSelectedPlant(plantCode);
    setSelectedProject("");
    setHasUnsavedChanges(false);

    if (plantCode) {
      setParams({ plant: plantCode });
    } else {
      setPlant("");
    }
  };

  const handleClassificationChange = (materialId, classification) => {
    setClassifications((prev) => {
      const newClassifications = {
        ...prev,
        [materialId]: classification,
      };

      const draftKey = `draftClassifications_${selectedProject}`;
      const draftData = localStorage.getItem(draftKey);
      let drafts = {};
      if (draftData) {
        try {
          drafts = JSON.parse(draftData);
        } catch (e) {
          console.error("Failed to parse draft classifications", e);
        }
      }

      const submittedValue = submittedClassifications[materialId];
      if (classification !== submittedValue) {
        drafts[materialId] = classification;
        setHasUnsavedChanges(true);
      } else {
        delete drafts[materialId];
        setHasUnsavedChanges(Object.keys(drafts).length > 0);
      }

      localStorage.setItem(draftKey, JSON.stringify(drafts));

      return newClassifications;
    });
  };

  const allClassified = useMemo(() => {
    if (materials.length === 0) return false;
    return materials.every((material) => classifications[material]);
  }, [materials, classifications]);

  const hasAnyChanges = useMemo(() => {
    return materials.some((material) => {
      const current = classifications[material];
      const submitted = submittedClassifications[material];
      return current && current !== submitted;
    });
  }, [materials, classifications, submittedClassifications]);

  const classifiedCount = Object.keys(classifications).length;
  const pendingCount = materials.length - classifiedCount;

  const handleConfirm = async () => {
    if (allClassified) {
      const ConfirmModalContent = () => {
        const modalRef = useRef(null);

        return (
          <Modal ref={modalRef}>
            <IxModalHeader onCloseClick={() => modalRef.current?.dismiss()}>
              {t("modal.confirmTitle")}
            </IxModalHeader>
            <IxModalContent>
              <IxTypography>
                {t("modal.confirmMessage")} <strong>{selectedProject}</strong>?
              </IxTypography>
              <div
                style={{
                  marginTop: "16px",
                  display: "flex",
                  flexDirection: "column",
                  gap: "8px",
                }}
              >
                <IxTypography format="label">
                  {t("modal.project")}: <strong>{selectedProject}</strong>
                </IxTypography>
                <IxTypography format="label">
                  {t("modal.plant")}:{" "}
                  <strong>{currentProject?.plant || "-"}</strong>
                </IxTypography>
                <IxTypography format="label">
                  {t("modal.materials")}: <strong>{materials.length}</strong>
                </IxTypography>
              </div>
            </IxModalContent>
            <IxModalFooter>
              <IxButton
                variant="secondary"
                onClick={() => modalRef.current?.dismiss()}
              >
                {t("modal.cancel")}
              </IxButton>
              <IxButton
                variant="primary"
                onClick={() => modalRef.current?.close("confirmed")}
              >
                {t("modal.confirm")}
              </IxButton>
            </IxModalFooter>
          </Modal>
        );
      };

      const instance = await showModal({
        content: <ConfirmModalContent />,
      });

      instance.onClose.once((detail) => {
        if (detail === "confirmed") {
          handleConfirmSubmit();
        }
      });
    }
  };

  const handleConfirmSubmit = async () => {
    const success = saveProjectClassifications(
      selectedProject,
      classifications,
      "Current User",
    );

    if (success) {
      const submittedProject = selectedProject;
      const submittedPlant = currentProject?.plant;

      const SuccessModalContent = () => {
        const modalRef = useRef(null);

        const handleViewClassifications = () => {
          modalRef.current?.close();
          navigate({
            pathname: "/viewclassifications",
            search: `?project=${submittedProject}&plant=${submittedPlant}`,
          });
        };

        return (
          <Modal ref={modalRef}>
            <IxModalHeader onCloseClick={() => modalRef.current?.close()}>
              {t("modal.successTitle")}
            </IxModalHeader>
            <IxModalContent>
              <div style={{ textAlign: "start", padding: "16px" }}>
                <IxTypography style={{ marginTop: "8px" }}>
                  {t("modal.successMessage")}
                </IxTypography>
                <div
                  style={{
                    marginTop: "16px",
                    display: "flex",
                    flexDirection: "column",
                    gap: "8px",
                    textAlign: "left",
                  }}
                >
                  <IxTypography format="label">
                    {t("modal.project")}: <strong>{submittedProject}</strong>
                  </IxTypography>
                  <IxTypography format="label">
                    {t("modal.plant")}: <strong>{submittedPlant || "-"}</strong>
                  </IxTypography>
                  <IxTypography format="label">
                    {t("modal.materials")}: <strong>{materials.length}</strong>
                  </IxTypography>
                </div>
              </div>
            </IxModalContent>
            <IxModalFooter>
              <IxButton variant="secondary" onClick={handleViewClassifications}>
                {t("modal.view")}
              </IxButton>
              <IxButton
                variant="primary"
                onClick={() => modalRef.current?.close()}
              >
                {t("modal.ok")}
              </IxButton>
            </IxModalFooter>
          </Modal>
        );
      };

      await showModal({
        content: <SuccessModalContent />,
      });

      const draftKey = `draftClassifications_${selectedProject}`;
      localStorage.removeItem(draftKey);

      setClassifications({});
      setSubmittedClassifications({});
      setHasUnsavedChanges(false);
      setSelectedProject("");
      setSelectedPlant("");
      setParams({});
    } else {
      console.error("❌ Failed to save classifications");
    }
  };

  return (
    <div style={{
      padding: "24px",
      height: "100%",
      display: "flex",
      flexDirection: "column",
      overflow: "hidden"
    }}>
      <IxTypography format="h2" style={{ marginBottom: "24px" }}>
        {t("classifyMaterials.title")}
      </IxTypography>

      <div style={{ marginBottom: "24px" }}>
        <div style={{ display: "flex", gap: "16px", alignItems: "flex-start" }}>
          <div>
            <IxTypography
              format="label"
              style={{ marginBottom: "8px", display: "block" }}
            >
              {t("classifyMaterials.selectProject")}
            </IxTypography>
            <ProjectSelectorWithLatest
              selectedProject={selectedProject}
              selectedPlant={selectedPlant}
              onProjectSelect={handleProjectSelect}
            />
          </div>
          <div>
            <IxTypography
              format="label"
              style={{ marginBottom: "8px", display: "block" }}
            >
              {t("classifyMaterials.selectPlant")}
            </IxTypography>
            <PlantSelector
              selectedPlant={selectedPlant}
              onPlantSelect={handlePlantSelect}
            />
          </div>
        </div>
        <div
          style={{
            marginTop: "4px",
            display: "flex",
            flexDirection: "column",
            gap: "4px",
          }}
        >
          {isPlantMismatch && (
            <IxTypography
              format="caption"
              style={{
                color: "var(--theme-alarm)",
                fontSize: "12px",
                fontWeight: "bold",
                marginTop: "8px",
              }}
            >
              ⚠️ {t("common.warning")}: {t("common.plantMismatchPart1")} {currentProject.plant} {t("common.plantMismatchPart2")} {selectedPlant} {t("common.plantMismatchPart3")}
            </IxTypography>
          )}
          {selectedPlant && (
            <IxTypography
              format="caption"
              style={{
                color: "var(--theme-color-soft-text)",
                fontSize: "12px",
              }}
            >
              {selectedPlant} {t("common.showingProjectsPart2")} {filteredProjectsCount} {t("common.showingProjectsPart3")}
            </IxTypography>
          )}
        </div>
      </div>

      {currentProject && (
        <div
          style={{
            marginBottom: "16px",
            display: "flex",
            alignItems: "center",
            gap: "12px",
          }}
        >
          <IxTypography format="h2">{currentProject.projectName}</IxTypography>
          {hasUnsavedChanges && (
            <IxPill variant="warning" outline>
              {t("classifyMaterials.unsavedChanges")}
            </IxPill>
          )}
        </div>
      )}

      {selectedProject && materials.length > 0 && (
        <div
          style={{
            marginBottom: "24px",
            padding: "8px 0px",
            background: "var(--theme-color-2)",
            borderRadius: "4px",
            display: "flex",
            alignItems: "center",
            gap: "16px",
          }}
        >
          <IxTypography>
            {t("classifyMaterials.materials")}:{" "}
            <strong>{materials.length}</strong>
          </IxTypography>
          <span style={{ color: "var(--theme-color-std-text)" }}>|</span>
          {allClassified ? (
            <IxPill variant="success" outline>
              {t("classifyMaterials.allClassified")}
            </IxPill>
          ) : (
            <IxPill variant="warning" outline>
              {pendingCount} {t("classifyMaterials.pendingClassification")}
            </IxPill>
          )}
        </div>
      )}

      {!selectedProject ? (
        <div
          style={{
            textAlign: "center",
            padding: "48px",
            background: "var(--theme-color-2)",
            borderRadius: "30px",
            height: "calc(100vh - 300px)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexDirection: "column",
            gap: "16px",
          }}
        >
          <IxIcon
            name="info"
            size="48"
            style={{ color: "var(--theme-color-soft-text)" }}
          />
          <IxTypography
            style={{
              fontSize: "16px",
              fontWeight: 500,
              color: "var(--theme-color-std-text)",
            }}
          >
            {t("classifyMaterials.selectProjectFirst")}
          </IxTypography>
        </div>
      ) : materials.length === 0 ? (
        <div
          style={{
            textAlign: "center",
            padding: "48px",
            background: "var(--theme-color-2)",
            borderRadius: "8px",
          }}
        >
          <IxTypography format="body" color="soft">
            {t("classifyMaterials.noMaterials")}
          </IxTypography>
        </div>
      ) : (
        <>
          <div
            style={{
              border: "1px solid var(--theme-color-soft-bdr)",
              borderRadius: "4px",
              overflow: "hidden",
              marginBottom: "16px",
              display: "flex",
              flexDirection: "column",
              flex: "1 1 auto",
              minHeight: 0
            }}
          >
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "60px 1fr 2fr",
                gap: "16px",
                background: "var(--theme-color-2)",
                padding: "12px 16px",
                borderBottom: "1px solid var(--theme-color-soft-bdr)",
                fontWeight: "bold",
                flexShrink: 0
              }}
            >
              <div>#</div>
              <div>{t("classifyMaterials.material")}</div>
              <div>{t("classifyMaterials.classification")}</div>
            </div>

            <div style={{ overflow: "auto", flex: "1 1 auto" }}>
              {materials.map((material, index) => {
                const currentClass = classifications[material];
                const isClassified = !!currentClass;

                return (
                  <div
                    key={material}
                    style={{
                      display: "grid",
                      gridTemplateColumns: "60px 1fr 2fr",
                      gap: "16px",
                      padding: "12px 16px",
                      borderBottom: "1px solid var(--theme-color-soft-bdr)",
                      background: isClassified
                        ? "var(--theme-color-1)"
                        : "var(--theme-color-ghost--hover)",
                      alignItems: "center",
                      transition: "background 0.2s",
                    }}
                  >
                    <div style={{ color: "var(--theme-color-soft-text)" }}>
                      {index + 1}
                    </div>
                    <div
                      style={{
                        fontFamily: "monospace",
                        fontSize: "14px",
                        fontWeight: isClassified ? "bold" : "normal",
                      }}
                    >
                      {material}
                    </div>
                    <div
                      style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}
                    >
                      {classes.map((cls) => {
                        const isSelected = currentClass === cls;
                        const isSubmitted =
                          submittedClassifications[material] === cls;
                        const hasChanged = isSubmitted && currentClass !== cls;
                        const color = classColors[cls];

                        return (
                          <IxButton
                            key={cls}
                            variant={isSelected ? "primary" : "secondary"}
                            outline={!isSelected}
                            onClick={() =>
                              handleClassificationChange(material, cls)
                            }
                            style={{
                              minWidth: "90px",
                              background: isSelected
                                ? color.bg
                                : hasChanged
                                  ? `${color.bg}40`
                                  : "transparent",
                              borderColor: hasChanged
                                ? `${color.bg}80`
                                : color.bg,
                              color: isSelected
                                ? color.text
                                : hasChanged
                                  ? `${color.bg}80`
                                  : color.bg,
                              fontWeight: isSelected ? "bold" : "normal",
                              transform: isSelected
                                ? "scale(1.05)"
                                : "scale(1)",
                              transition: "all 0.15s ease",
                              boxShadow: isSelected
                                ? `0 0 8px ${color.bg}50`
                                : "none",
                              borderRadius: "8px",
                              opacity: hasChanged ? 0.6 : 1,
                            }}
                          >
                            {cls}
                          </IxButton>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div
            style={{
              display: "flex",
              justifyContent: "flex-end",
              gap: "16px",
              alignItems: "center",
              flexShrink: 0,
              paddingTop: "8px"
            }}
          >
            {!allClassified && (
              <IxTypography color="alarm" style={{ alignSelf: "center" }}>
                {t("classifyMaterials.classifyAll")}
              </IxTypography>
            )}
            {hasUnsavedChanges && (
              <IxButton
                variant="secondary"
                outline
                onClick={() => {
                  // Clear draft from localStorage
                  const draftKey = `draftClassifications_${selectedProject}`;
                  localStorage.removeItem(draftKey);

                  // Reload classifications from submitted data only
                  const savedClassifications =
                    getProjectClassifications(selectedProject);
                  if (savedClassifications.length > 0) {
                    const classificationsObj = {};
                    savedClassifications.forEach((item) => {
                      classificationsObj[item.materialNumber] =
                        item.classification;
                    });
                    setClassifications(classificationsObj);
                  } else {
                    const mockClassifications =
                      classifiedMaterialsDataOfProject[selectedProject];
                    if (mockClassifications && mockClassifications.length > 0) {
                      const classificationsObj = {};
                      mockClassifications.forEach((item) => {
                        classificationsObj[item.materialNumber] =
                          item.classification;
                      });
                      setClassifications(classificationsObj);
                    } else {
                      setClassifications({});
                    }
                  }

                  setHasUnsavedChanges(false);
                }}
                style={{
                  borderRadius: "80px",
                }}
              >
                <span style={{ marginLeft: "4px" }}>
                  {t("classifyMaterials.discardChanges")}
                </span>
              </IxButton>
            )}
            <IxButton
              variant="primary"
              disabled={!allClassified || !hasAnyChanges}
              onClick={handleConfirm}
              style={{
                borderRadius: "80px",
              }}
            >
              {t("classifyMaterials.confirm")}
            </IxButton>
          </div>
        </>
      )}
    </div>
  );
};

export default ClassifyMaterials;
