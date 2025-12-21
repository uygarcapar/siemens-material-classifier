import { useState, useEffect, useMemo, useCallback, useRef } from "react";
import { IxButton, IxTypography, IxIcon } from "@siemens/ix-react";
import { AgGridReact } from "ag-grid-react";
import { useTranslation } from "react-i18next";
import ExcelJS from "exceljs";
import { saveAs } from "file-saver";
import ProjectSelectorSearch from "../components/ProjectSelectorSearch";
import { useUrlProjectParam } from "../hooks/useUrlProjectParam";
import {
  classifiedMaterialsDataOfProject,
  latestProjectsData,
} from "../data/mockData";
import { getProjectClassifications } from "../utils/classificationStorage";

import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";

const ViewClassifications = () => {
  const { t } = useTranslation();
  const { projectNumber, setProjectNumber } = useUrlProjectParam();
  const gridRef = useRef(null);

  const [selectedProject, setSelectedProject] = useState(projectNumber || "");

  const rowData = useMemo(() => {
    if (!selectedProject) return [];

    const project = latestProjectsData.find(
      (p) => p.projectNumber === selectedProject
    );
    if (!project) return [];

    const allMaterials = project.materials || [];

    const localStorageData = getProjectClassifications(selectedProject);
    const classificationData =
      localStorageData.length > 0
        ? localStorageData
        : classifiedMaterialsDataOfProject[selectedProject] || [];

    const classificationMap = {};
    classificationData.forEach((item) => {
      classificationMap[item.materialNumber] = item;
    });

    return allMaterials.map((materialNumber) => {
      if (classificationMap[materialNumber]) {
        return classificationMap[materialNumber];
      } else {
        return {
          materialNumber,
          classification: t("viewClassifications.notClassified"),
          classifiedBy: "-",
          classificationDate: "-",
        };
      }
    });
  }, [selectedProject, t]);

  const projectName = useMemo(() => {
    const project = latestProjectsData.find(
      (p) => p.projectNumber === selectedProject
    );
    return project?.projectName || "";
  }, [selectedProject]);

  useEffect(() => {
    if (projectNumber && projectNumber !== selectedProject) {
      setSelectedProject(projectNumber);
    }
  }, [projectNumber]);

  const handleProjectSelect = (projectNum) => {
    setSelectedProject(projectNum);
    setProjectNumber(projectNum);
  };

  const columnDefs = useMemo(
    () => [
      {
        headerName: t("viewClassifications.materialNumber"),
        field: "materialNumber",
        filter: "agSetColumnFilter",
        sortable: true,
        flex: 1,
        minWidth: 150,
      },
      {
        headerName: t("viewClassifications.classification"),
        field: "classification",
        filter: "agSetColumnFilter",
        sortable: true,
        flex: 1,
        minWidth: 120,
        cellStyle: (params) => {
          const classColors = {
            "Class A": { backgroundColor: "#00aa0030", color: "#00aa00" },
            "Class B": { backgroundColor: "#0066cc30", color: "#0066cc" },
            "Class C": { backgroundColor: "#ff990030", color: "#cc7700" },
            "Class D": { backgroundColor: "#cc000030", color: "#cc0000" },
          };

          if (
            params.value === t("viewClassifications.notClassified") ||
            params.value === "Not Classified" ||
            params.value === "Sınıflandırılmamış"
          ) {
            return {
              backgroundColor: "#88888820",
              color: "#888888",
              fontStyle: "italic",
            };
          }

          return classColors[params.value] || {};
        },
      },
      {
        headerName: t("viewClassifications.classifiedBy"),
        field: "classifiedBy",
        filter: "agSetColumnFilter",
        sortable: true,
        flex: 1,
        minWidth: 130,
      },
      {
        headerName: t("viewClassifications.classificationDate"),
        field: "classificationDate",
        filter: "agSetColumnFilter",
        sortable: true,
        flex: 1,
        minWidth: 160,
      },
    ],
    [t]
  );

  const defaultColDef = useMemo(
    () => ({
      resizable: true,
      filterParams: {
        buttons: ["reset", "apply"],
      },
    }),
    []
  );

  const exportToExcel = useCallback(async () => {
    if (rowData.length === 0) return;

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Classifications");

    worksheet.columns = [
      {
        header: t("viewClassifications.materialNumber"),
        key: "materialNumber",
        width: 20,
      },
      {
        header: t("viewClassifications.classification"),
        key: "classification",
        width: 15,
      },
      {
        header: t("viewClassifications.classifiedBy"),
        key: "classifiedBy",
        width: 20,
      },
      {
        header: t("viewClassifications.classificationDate"),
        key: "classificationDate",
        width: 20,
      },
    ];

    worksheet.getRow(1).font = { bold: true };
    worksheet.getRow(1).fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: { argb: "FF1E3A5F" },
    };
    worksheet.getRow(1).font = { bold: true, color: { argb: "FFFFFFFF" } };

    rowData.forEach((row) => {
      const dataRow = worksheet.addRow(row);

      const classColors = {
        "Class A": "FF00AA00",
        "Class B": "FF0066CC",
        "Class C": "FFFF9900",
        "Class D": "FFCC0000",
      };

      const classCell = dataRow.getCell(2);
      if (classColors[row.classification]) {
        classCell.fill = {
          type: "pattern",
          pattern: "solid",
          fgColor: { argb: classColors[row.classification] + "40" },
        };
      }
    });

    worksheet.eachRow((row) => {
      row.eachCell((cell) => {
        cell.border = {
          top: { style: "thin" },
          left: { style: "thin" },
          bottom: { style: "thin" },
          right: { style: "thin" },
        };
      });
    });

    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });
    saveAs(
      blob,
      `Classifications_${selectedProject}_${
        new Date().toISOString().split("T")[0]
      }.xlsx`
    );
  }, [rowData, selectedProject, t]);

  return (
    <div
      style={{
        padding: "24px",
        height: "100%",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <IxTypography format="h2" style={{ marginBottom: "24px" }}>
        {t("viewClassifications.title")}
      </IxTypography>

      <div style={{ marginBottom: "24px" }}>
        <IxTypography
          format="label"
          style={{ marginBottom: "8px", display: "block" }}
        >
          {t("viewClassifications.selectProject")}
        </IxTypography>
        <div
          style={{
            display: "flex",
            gap: "16px",
            alignItems: "center",
            flexWrap: "wrap",
          }}
        >
          <ProjectSelectorSearch
            selectedProject={selectedProject}
            onProjectSelect={handleProjectSelect}
          />
          {rowData.length > 0 && (
            <IxButton variant="secondary" onClick={exportToExcel}>
              <IxTypography>
                {t("viewClassifications.exportExcel")}
              </IxTypography>
            </IxButton>
          )}
        </div>
      </div>

      {projectName && (
        <div style={{ marginBottom: "16px" }}>
          <IxTypography format="h4">{projectName}</IxTypography>
        </div>
      )}

      {!selectedProject ? (
        <div
          style={{
            textAlign: "center",
            padding: "48px",
            background: "var(--theme-color-2)",
            borderRadius: "30px",
            flex: 1,
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
            {t("viewClassifications.selectProjectFirst")}
          </IxTypography>
        </div>
      ) : rowData.length === 0 ? (
        <div
          style={{
            textAlign: "center",
            padding: "48px",
            background: "var(--theme-color-2)",
            borderRadius: "30px",
            flex: 1,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <IxTypography format="body" color="soft">
            {t("viewClassifications.noData")}
          </IxTypography>
        </div>
      ) : (
        <div
          className="ag-theme-alpine-dark"
          style={{
            flex: 1,
            width: "100%",
            minHeight: "300px",
          }}
        >
          <AgGridReact
            ref={gridRef}
            rowData={rowData}
            columnDefs={columnDefs}
            defaultColDef={defaultColDef}
            animateRows={true}
            domLayout="normal"
            style={{ height: "100%", width: "100%" }}
          />
        </div>
      )}
    </div>
  );
};

export default ViewClassifications;
