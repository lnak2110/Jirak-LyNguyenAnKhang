import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import useTitle from '../../hooks/useTitle';
import {
  RootState,
  useAppDispatch,
  useAppSelector,
} from '../../redux/configStore';
import {
  CreateProjectFormInputs,
  ProjectCategoryType,
} from '../../types/projectTypes';
import {
  createProjectAPI,
  getProjectCategoriesAPI,
  setFalseProjectFulfilledAction,
} from '../../redux/reducers/projectReducer';
import ControllerAutocomplete from '../../components/ControllerAutocomplete';
import ControllerEditor from '../../components/ControllerEditor';
import ControllerTextField from '../../components/ControllerTextField';
import ProjectForm from '../../components/ProjectForm';

const CreateProject = () => {
  const { projectCategories, projectFulfilled } = useAppSelector(
    (state: RootState) => state.projectReducer
  );
  const dispatch = useAppDispatch();

  useTitle('Create Project');

  useEffect(() => {
    dispatch(getProjectCategoriesAPI());
  }, [dispatch]);

  const schema = yup
    .object()
    .shape({
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

  const {
    control,
    handleSubmit,
    reset,
    formState: { isSubmitting },
  } = useForm<CreateProjectFormInputs, ProjectCategoryType>({
    defaultValues: {
      projectName: '',
      category: null,
      description: '',
    },
    mode: 'onTouched',
    resolver: yupResolver(schema),
  });

  const onSubmit = (data: CreateProjectFormInputs) => {
    dispatch(createProjectAPI(data));
  };

  useEffect(() => {
    if (projectFulfilled) {
      reset();
      dispatch(setFalseProjectFulfilledAction());
    }
  }, [projectFulfilled, reset, dispatch]);

  return (
    <ProjectForm
      handleSubmit={handleSubmit}
      onSubmit={onSubmit}
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
          options={projectCategories}
          optionLabel="projectCategoryName"
          equalField="id"
        />,
        <ControllerEditor
          control={control}
          name="description"
          placeholder="Describe the project..."
        />,
      ]}
    />
  );
};

export default CreateProject;
