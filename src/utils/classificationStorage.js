const STORAGE_KEY = 'material_classifications';

export const getAllClassifications = () => {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : {};
  } catch (error) {
    console.error('Error reading classifications from localStorage:', error);
    return {};
  }
};

export const getProjectClassifications = (projectNumber) => {
  const allClassifications = getAllClassifications();
  return allClassifications[projectNumber] || [];
};

export const saveProjectClassifications = (projectNumber, classifications, classifiedBy = 'User') => {
  try {
    const allClassifications = getAllClassifications();

    const timestamp = new Date().toLocaleString('de-DE', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });

    const classificationsArray = Object.entries(classifications).map(([materialNumber, classification]) => ({
      materialNumber,
      classification,
      classifiedBy,
      classificationDate: timestamp,
    }));

    allClassifications[projectNumber] = classificationsArray;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(allClassifications));

    return true;
  } catch (error) {
    console.error('Error saving classifications to localStorage:', error);
    return false;
  }
};

export const deleteProjectClassifications = (projectNumber) => {
  try {
    const allClassifications = getAllClassifications();
    delete allClassifications[projectNumber];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(allClassifications));
    return true;
  } catch (error) {
    console.error('Error deleting classifications from localStorage:', error);
    return false;
  }
};

export const clearAllClassifications = () => {
  try {
    localStorage.removeItem(STORAGE_KEY);
    return true;
  } catch (error) {
    console.error('Error clearing classifications from localStorage:', error);
    return false;
  }
};
