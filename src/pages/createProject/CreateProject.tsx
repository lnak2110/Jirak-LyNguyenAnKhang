import { useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import {
  RootState,
  useAppDispatch,
  useAppSelector,
} from '../../redux/configStore';
import {
  createProjectAPI,
  CreateProjectFormInputs,
  getProjectCategoriesAPI,
  setFalseProjectFulfilledAction,
} from '../../redux/reducers/projectReducer';
import { theme } from '../../App';
import Editor from '../../components/Editor';
import Loading from '../../components/Loading';
import Autocomplete from '@mui/material/Autocomplete';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import useMediaQuery from '@mui/material/useMediaQuery';

const CreateProject = () => {
  const { projectCategories, isLoading, projectFulfilled } = useAppSelector(
    (state: RootState) => state.projectReducer
  );
  const dispatch = useAppDispatch();

  const downSm = useMediaQuery(theme.breakpoints.down('sm'));
  const up320 = useMediaQuery(theme.breakpoints.up(320));

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
      categoryId: yup
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
  } = useForm<CreateProjectFormInputs>({
    defaultValues: {
      projectName: '',
      categoryId: null,
      description: '',
    },
    mode: 'onTouched',
    resolver: yupResolver(schema),
  });

  const onSubmit = async (data: CreateProjectFormInputs) => {
    await dispatch(createProjectAPI(data));
  };

  useEffect(() => {
    if (projectFulfilled) {
      reset();
      dispatch(setFalseProjectFulfilledAction());
    }
  }, [projectFulfilled, reset, dispatch]);

  return (
    <Container maxWidth="md">
      <Paper variant="outlined" sx={{ p: 3 }}>
        <Typography variant="h4" component="h1" sx={{ pb: 4 }}>
          New Project
        </Typography>
        <Box component="form" onSubmit={handleSubmit(onSubmit)}>
          <Grid container spacing={4}>
            <Grid item xs={12}>
              <Controller
                name="projectName"
                control={control}
                render={({ field, fieldState: { error } }) => (
                  <TextField
                    {...field}
                    required
                    fullWidth
                    id="projectName"
                    label="Project Name"
                    autoComplete="projectName"
                    error={!!error}
                    helperText={error?.message}
                  />
                )}
              />
            </Grid>
            <Grid item xs={12}>
              <Controller
                name="categoryId"
                control={control}
                render={({
                  field: { onChange, value },
                  fieldState: { error },
                }) => (
                  <Autocomplete
                    disablePortal
                    id="categoryId"
                    value={value}
                    options={projectCategories}
                    getOptionLabel={(option) => option?.projectCategoryName}
                    isOptionEqualToValue={(option, value) =>
                      option.id === value.id
                    }
                    onChange={(_event, newValue) => onChange(newValue)}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        required
                        label="Project Category"
                        placeholder="Choose a category for your project..."
                        error={!!error}
                        helperText={error?.message}
                      />
                    )}
                  />
                )}
              />
            </Grid>
            <Grid
              item
              xs={12}
              sx={{
                '.ql-editor': {
                  fontSize: up320 ? theme.typography.body1 : undefined,
                },
              }}
            >
              <Typography
                component="label"
                htmlFor="description"
                sx={{ display: 'block', mb: 1 }}
              >
                Project Description
              </Typography>
              <Controller
                name="description"
                control={control}
                render={({ field: { ref, ...field } }) => (
                  <Editor
                    {...field}
                    id="description"
                    placeholder="Describe the project..."
                  />
                )}
              />
            </Grid>
            {downSm ? (
              <Grid container item xs={12}>
                <Button
                  type="submit"
                  variant="contained"
                  fullWidth
                  sx={{ mb: 2 }}
                >
                  Create project
                </Button>
                <Button variant="outlined" fullWidth>
                  Cancel
                </Button>
              </Grid>
            ) : (
              <Grid container item xs={12}>
                <Button
                  type="submit"
                  variant="contained"
                  sx={{ mr: 2 }}
                  disabled={isSubmitting}
                >
                  Create project
                </Button>
                <Button
                  onClick={() => {
                    reset();
                  }}
                  variant="outlined"
                >
                  Reset
                </Button>
              </Grid>
            )}
          </Grid>
        </Box>
      </Paper>
      {isLoading && <Loading />}
    </Container>
  );
};

export default CreateProject;
