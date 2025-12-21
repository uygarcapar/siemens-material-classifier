import { useSearchParams } from 'react-router-dom';
import { useCallback } from 'react';

export const useUrlProjectParam = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  
  const projectNumber = searchParams.get('project');
  
  const setProjectNumber = useCallback((newProjectNumber) => {
    if (newProjectNumber) {
      setSearchParams({ project: newProjectNumber });
    } else {
      setSearchParams({});
    }
  }, [setSearchParams]);
  
  return { projectNumber, setProjectNumber };
};
