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
import ProjectSelectorWithLatest from "../components/ProjectSelectorWithLatest";
import { useUrlProjectParam } from "../hooks/useUrlProjectParam";
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
  const { projectNumber, setProjectNumber } = useUrlProjectParam();

  const [selectedProject, setSelectedProject] = useState(projectNumber || "");
  const [classifications, setClassifications] = useState({});

  const currentProject = useMemo(() => {
    return latestProjectsData.find((p) => p.projectNumber === selectedProject);
  }, [selectedProject]);

  const materials = currentProject?.materials || [];

  useEffect(() => {
    if (projectNumber && projectNumber !== selectedProject) {
      setSelectedProject(projectNumber);
    }
  }, [projectNumber]);

  useEffect(() => {
    if (!selectedProject) {
      setClassifications({});
      return;
    }

    const savedClassifications = getProjectClassifications(selectedProject);

    if (savedClassifications.length > 0) {
      const classificationsObj = {};
      savedClassifications.forEach((item) => {
        classificationsObj[item.materialNumber] = item.classification;
      });
      setClassifications(classificationsObj);
    } else {
      const mockClassifications =
        classifiedMaterialsDataOfProject[selectedProject];
      if (mockClassifications && mockClassifications.length > 0) {
        const classificationsObj = {};
        mockClassifications.forEach((item) => {
          classificationsObj[item.materialNumber] = item.classification;
        });
        setClassifications(classificationsObj);
      } else {
        setClassifications({});
      }
    }
  }, [selectedProject]);

  const handleProjectSelect = (projectNum) => {
    setSelectedProject(projectNum);
    setProjectNumber(projectNum);
  };

  const handleClassificationChange = (materialId, classification) => {
    setClassifications((prev) => ({
      ...prev,
      [materialId]: classification,
    }));
  };

  const allClassified = useMemo(() => {
    if (materials.length === 0) return false;
    return materials.every((material) => classifications[material]);
  }, [materials, classifications]);

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
              <IxTypography>{t("modal.confirmMessage")}</IxTypography>
              <div style={{ marginTop: "16px" }}>
                <IxTypography format="label">
                  {t("classifyMaterials.materials")}: {materials.length}
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

      // Listen for modal close event
      instance.onClose.once((detail) => {
        console.log("Modal closed with:", detail);
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
      "Current User"
    );

    if (success) {
      const SuccessModalContent = () => {
        const modalRef = useRef(null);

        return (
          <Modal ref={modalRef}>
            <IxModalHeader onCloseClick={() => modalRef.current?.close()}>
              {t("modal.successTitle")}
            </IxModalHeader>
            <IxModalContent>
              <div style={{ textAlign: "center", padding: "16px" }}>
                <IxIcon
                  name="check-circle"
                  size="64"
                  style={{ color: "var(--theme-success)" }}
                />
                <IxTypography style={{ marginTop: "16px" }}>
                  {t("modal.successMessage")}
                </IxTypography>
              </div>
            </IxModalContent>
            <IxModalFooter>
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

      setClassifications({});
      setSelectedProject("");
      setProjectNumber("");
    } else {
      console.error("❌ Failed to save classifications");
    }
  };

  return (
    <div style={{ padding: "24px", height: "100%", overflow: "auto" }}>
      <IxTypography format="h2" style={{ marginBottom: "24px" }}>
        {t("classifyMaterials.title")}
      </IxTypography>

      <div style={{ marginBottom: "24px" }}>
        <IxTypography
          format="label"
          style={{ marginBottom: "8px", display: "block" }}
        >
          {t("classifyMaterials.selectProject")}
        </IxTypography>
        <ProjectSelectorWithLatest
          selectedProject={selectedProject}
          onProjectSelect={handleProjectSelect}
        />
      </div>

      {currentProject && (
        <div style={{ marginBottom: "16px" }}>
          <IxTypography format="h4">{currentProject.projectName}</IxTypography>
        </div>
      )}

      {selectedProject && materials.length > 0 && (
        <div
          style={{
            marginBottom: "24px",
            padding: "12px 16px",
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
              marginBottom: "24px",
            }}
          >
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "60px 1fr 2fr",
                background: "var(--theme-color-2)",
                padding: "12px 16px",
                borderBottom: "1px solid var(--theme-color-soft-bdr)",
                fontWeight: "bold",
              }}
            >
              <div>#</div>
              <div>{t("classifyMaterials.material")}</div>
              <div>{t("classifyMaterials.classification")}</div>
            </div>

            <div style={{ maxHeight: "calc(100vh - 450px)", overflow: "auto" }}>
              {materials.map((material, index) => {
                const currentClass = classifications[material];
                const isClassified = !!currentClass;

                return (
                  <div
                    key={material}
                    style={{
                      display: "grid",
                      gridTemplateColumns: "60px 1fr 2fr",
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
                              background: isSelected ? color.bg : "transparent",
                              borderColor: color.bg,
                              color: isSelected ? color.text : color.bg,
                              fontWeight: isSelected ? "bold" : "normal",
                              transform: isSelected
                                ? "scale(1.05)"
                                : "scale(1)",
                              transition: "all 0.15s ease",
                              boxShadow: isSelected
                                ? `0 0 8px ${color.bg}50`
                                : "none",
                              borderRadius: "8px",
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
            style={{ display: "flex", justifyContent: "flex-end", gap: "16px" }}
          >
            {!allClassified && (
              <IxTypography color="alarm" style={{ alignSelf: "center" }}>
                {t("classifyMaterials.classifyAll")}
              </IxTypography>
            )}
            <IxButton
              variant="primary"
              disabled={!allClassified}
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
