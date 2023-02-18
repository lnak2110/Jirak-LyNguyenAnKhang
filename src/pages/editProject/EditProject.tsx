import { useEffect, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import {
  EditProjectCategoryType,
  EditProjectFormInputs,
} from '../../types/projectTypes';
import {
  RootState,
  useAppDispatch,
  useAppSelector,
} from '../../redux/configStore';
import {
  getProjectCategoriesAPI,
  getProjectDetailAPI,
  updateProjectAPI,
} from '../../redux/reducers/projectReducer';
import ProjectForm from '../../components/ProjectForm';
import ControllerAutocomplete from '../../components/ControllerAutocomplete';
import ControllerEditor from '../../components/ControllerEditor';
import ControllerTextField from '../../components/ControllerTextField';

const EditProject = () => {
  const { projectCategories, projectDetailWithTasks } = useAppSelector(
    (state: RootState) => state.projectReducer
  );
  const dispatch = useAppDispatch();

  const { projectId } = useParams();

  useEffect(() => {
    dispatch(getProjectCategoriesAPI());
  }, [dispatch]);

  const schema = yup
    .object()
    .shape({
      id: yup
        .number()
        .required('Project ID cannot be blank!')
        .typeError('Project ID must be a number'),
      projectName: yup
        .string()
        .trim()
        .required('Project name cannot be blank!'),
      category: yup
        .object()
        .shape({
          id: yup
            .number()
            .oneOf(
              projectCategories?.map((category) => category.id),
              'Project category must be one of the provided!'
            )
            .required('Project category cannot be blank!'),
          projectCategoryName: yup.string(),
        })
        .required('Project category cannot be blank!')
        .nullable(),
    })
    .required();

  const initialValues = useMemo(
    () => ({
      id: projectDetailWithTasks?.id || 0,
      projectName: projectDetailWithTasks?.projectName || '',
      category: projectDetailWithTasks?.projectCategory || null,
      description: projectDetailWithTasks?.description || '',
    }),
    [projectDetailWithTasks]
  );

  const {
    control,
    handleSubmit,
    reset,
    resetField,
    watch,
    formState: { isSubmitting },
  } = useForm<EditProjectFormInputs, EditProjectCategoryType>({
    defaultValues: initialValues,
    mode: 'onTouched',
    resolver: yupResolver(schema),
  });

  const onSubmit = (data: EditProjectFormInputs) => {
    dispatch(updateProjectAPI(data));
  };

  const watchId = watch('id', initialValues.id);

  useEffect(() => {
    dispatch(getProjectDetailAPI(projectId!));
  }, [dispatch, projectId]);

  // Reset defaultvalues after received data from API
  useEffect(() => {
    if (projectDetailWithTasks) {
      reset({ ...initialValues });
    }
  }, [reset, projectDetailWithTasks, initialValues]);

  // Prevent user edit id
  useEffect(() => {
    if (watchId) {
      resetField('id');
    }
  }, [watchId, initialValues.id, resetField]);

  // Edit fields name to be suitable with data sent by EditProject form
  const optionsCategory = projectCategories.map((category) => ({
    id: category.id,
    name: category.projectCategoryName,
  }));

  return (
    <ProjectForm
      handleSubmit={handleSubmit}
      onSubmit={onSubmit}
      formType="edit"
      isSubmitting={isSubmitting}
      reset={reset}
      formFieldElements={[
        <ControllerTextField
          control={control}
          name="projectName"
          label="Project Name"
        />,
        <ControllerAutocomplete
          control={control}
          name="category"
          label="Project Category"
          placeholder="Choose a category for your project..."
          options={optionsCategory}
          optionLabel="name"
          equalField="id"
        />,
        <ControllerEditor
          control={control}
          name="description"
          placeholder="Describe the project..."
        />,
        <ControllerTextField
          control={control}
          name="id"
          label="Project ID (read only)"
          type="number"
          readonly
        />,
      ]}
    />
  );
};

export default EditProject;
