import { ReactElement } from 'react';
import {
  FieldValues,
  SubmitHandler,
  UseFormHandleSubmit,
  UseFormReset,
} from 'react-hook-form';
import { RootState, useAppSelector } from '../redux/configStore';
import { theme } from '../App';
import Loading from './Loading';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import useMediaQuery from '@mui/material/useMediaQuery';

type ProjectFormProps<T extends FieldValues> = {
  handleSubmit: UseFormHandleSubmit<T>;
  onSubmit: SubmitHandler<T>;
  reset: UseFormReset<T>;
  isSubmitting: boolean;
  formType?: 'create' | 'edit';
  formFieldElements: ReactElement[];
};

const ProjectForm = <T extends FieldValues>({
  handleSubmit,
  onSubmit,
  reset,
  formType = 'create',
  isSubmitting,
  formFieldElements,
}: ProjectFormProps<T>) => {
  const { isLoading } = useAppSelector(
    (state: RootState) => state.projectReducer
  );

  const downSm = useMediaQuery(theme.breakpoints.down('sm'));
  const up320 = useMediaQuery(theme.breakpoints.up(320));

  return (
    <Container maxWidth="md">
      <Paper variant="outlined" sx={{ p: 3 }}>
        <Typography variant="h4" component="h1" sx={{ pb: 4 }}>
          {`${formType === 'edit' ? 'Edit' : 'Create'} Project`}
        </Typography>
        <Box component="form" onSubmit={handleSubmit(onSubmit)}>
          <Grid container spacing={4}>
            {formFieldElements[3] && (
              <Grid item xs={12}>
                {formFieldElements[3]}
              </Grid>
            )}
            <Grid item xs={12}>
              {formFieldElements[0]}
            </Grid>
            <Grid item xs={12}>
              {formFieldElements[1]}
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
              {formFieldElements[2]}
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
                  {`${formType === 'edit' ? 'Update' : 'Create'} Project`}
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

export default ProjectForm;
