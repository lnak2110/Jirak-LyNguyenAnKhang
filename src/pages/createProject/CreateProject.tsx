import {
  Autocomplete,
  Button,
  Grid,
  TextField,
  useMediaQuery,
} from '@mui/material';
import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../redux/configStore';
import {
  CreateProjectFormInputs,
  getProjectCategoriesAPI,
} from '../../redux/reducers/projectReducer';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import { useForm, Controller } from 'react-hook-form';
import { theme } from '../../App';

const CreateProject = () => {
  const { projectCategories } = useAppSelector((state) => state.projectReducer);
  const dispatch = useAppDispatch();

  const downSm = useMediaQuery(theme.breakpoints.down('sm'));

  useEffect(() => {
    dispatch(getProjectCategoriesAPI());
  }, [dispatch]);

  const { control, handleSubmit } = useForm({
    defaultValues: {
      projectName: '',
      categoryId: 0,
      description: '',
    } as CreateProjectFormInputs,
  });

  const onSubmit = (data: CreateProjectFormInputs) => {
    console.log(data);
  };

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
                render={({ field }) => (
                  <TextField
                    {...field}
                    required
                    fullWidth
                    id="projectName"
                    label="Project Name"
                    autoComplete="projectName"
                  />
                )}
              />
            </Grid>
            <Grid item xs={12}>
              <Controller
                name="categoryId"
                control={control}
                render={({ field: { onChange } }) => (
                  <Autocomplete
                    id="categoryId"
                    onChange={(_event, newValue) => onChange(newValue?.id)}
                    options={projectCategories}
                    getOptionLabel={(option) => option?.projectCategoryName}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="Project Category"
                        required
                      />
                    )}
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
                <Button type="submit" variant="contained" sx={{ mr: 2 }}>
                  Create project
                </Button>
                <Button variant="outlined">Cancel</Button>
              </Grid>
            )}
          </Grid>
        </Box>
      </Paper>
    </Container>
  );
};

export default CreateProject;
