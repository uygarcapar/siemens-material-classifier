import { IxSelect, IxSelectItem } from "@siemens/ix-react";
import { useTranslation } from "react-i18next";
import { plants } from "../data/mockData";

const PlantSelector = ({ selectedPlant, onPlantSelect }) => {
  const { t } = useTranslation();

  const handleSelectionChange = (event) => {
    const value = Array.isArray(event.detail) ? event.detail[0] : event.detail;

    if (value) {
      onPlantSelect(value);
    } else {
      onPlantSelect("");
    }
  };

  return (
    <IxSelect
      value={selectedPlant ? [selectedPlant] : []}
      onValueChange={handleSelectionChange}
      placeholder={t("common.selectPlant")}
      allowClear
      style={{ width: "100%", maxWidth: "200px" }}
    >
      {plants.map((plant) => (
        <IxSelectItem key={plant} label={plant} value={plant} />
      ))}
    </IxSelect>
  );
};

export default PlantSelector;
