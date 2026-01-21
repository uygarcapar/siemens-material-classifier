import { useSearchParams } from 'react-router-dom';
import { useCallback } from 'react';

export const useUrlParams = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const project = searchParams.get('project');
  const plant = searchParams.get('plant');

  const setProject = useCallback((newProject) => {
    const current = Object.fromEntries(searchParams);
    if (newProject) {
      setSearchParams({ ...current, project: newProject });
    } else {
      const { project, ...rest } = current;
      setSearchParams(rest);
    }
  }, [searchParams, setSearchParams]);

  const setPlant = useCallback((newPlant) => {
    const current = Object.fromEntries(searchParams);
    if (newPlant) {
      setSearchParams({ ...current, plant: newPlant });
    } else {
      const { plant, ...rest } = current;
      setSearchParams(rest);
    }
  }, [searchParams, setSearchParams]);

  const setParams = useCallback((params) => {
    setSearchParams(params);
  }, [setSearchParams]);

  return { project, plant, setProject, setPlant, setParams };
};
