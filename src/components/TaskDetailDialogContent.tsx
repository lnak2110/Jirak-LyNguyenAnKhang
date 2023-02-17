import { useEffect, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { useDebouncedCallback } from 'use-debounce';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import {
  RootState,
  useAppDispatch,
  useAppSelector,
} from '../redux/configStore';
import { UpdateTaskFormInputs } from '../types/taskTypes';
import { getProjectDetailAPI } from '../redux/reducers/projectReducer';
import ControllerAutocomplete from './ControllerAutocomplete';
import ControllerEditor from './ControllerEditor';
import ControllerSelect from './ControllerSelect';
import ControllerSlider from './ControllerSlider';
import ControllerTextField from './ControllerTextField';
import { theme } from '../App';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import Divider from '@mui/material/Divider';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import { useMediaQuery } from '@mui/material';
import {
  getAllPriorityAPI,
  getAllStatusAPI,
  getAllTaskTypeAPI,
  getTaskDetailAPI,
  updateTaskAPI,
} from '../redux/reducers/taskReducer';

type CreateTaskDialogContentProps = {
  taskId: number;
  onCloseModal?: () => void;
};

const CreateTaskDialogContent = ({
  taskId,
  onCloseModal,
}: CreateTaskDialogContentProps) => {
  const { allStatus, allPriority, allTaskType, taskDetail } = useAppSelector(
    (state: RootState) => state.taskReducer
  );
  const { projectDetailWithTasks } = useAppSelector(
    (state: RootState) => state.projectReducer
  );

  const dispatch = useAppDispatch();

  const { projectId } = useParams();

  const downSm = useMediaQuery(theme.breakpoints.down('sm'));
  const up300 = useMediaQuery(theme.breakpoints.up(300));

  useEffect(() => {
    dispatch(getAllStatusAPI());
    dispatch(getAllPriorityAPI());
    dispatch(getAllTaskTypeAPI());
    dispatch(getProjectDetailAPI(projectId!));
  }, [dispatch, projectId]);

  // Prevent MUI select warning invalid option
  useEffect(() => {
    if (allStatus.length && allPriority.length && allTaskType.length) {
      dispatch(getTaskDetailAPI(taskId));
    }
  }, [
    dispatch,
    allStatus.length,
    allPriority.length,
    allTaskType.length,
    taskId,
  ]);

  const schema = yup
    .object()
    .shape({
      taskName: yup.string().trim().required('Task name cannot be blank!'),
      originalEstimate: yup
        .number()
        .typeError('Invalid number!')
        .min(0, 'Cannot be less than 0!'),
      timeTrackingSpent: yup
        .number()
        .typeError('Invalid number!')
        .min(0, 'Cannot be less than 0!')
        .max(
          yup.ref('originalEstimate'),
          'Cannot be greater than total estimated time!'
        ),
    })
    .required();

  const initialValues = useMemo(
    () => ({
      projectId: taskDetail?.projectId || 0,
      taskId: taskDetail?.taskId || 0,
      taskName: taskDetail?.taskName || '',
      statusId: taskDetail?.statusId || '',
      priorityId: taskDetail?.priorityId.toString() || '',
      typeId: taskDetail?.typeId.toString() || '',
      listUserAsign: taskDetail?.assigness || [],
      originalEstimate: taskDetail?.originalEstimate || 0,
      timeTrackingSpent: taskDetail?.timeTrackingSpent || 0,
      timeTrackingRemaining: taskDetail?.timeTrackingRemaining || 0,
      description: taskDetail?.description || '',
    }),
    [taskDetail]
  );

  const {
    control,
    handleSubmit,
    reset,
    watch,
    clearErrors,
    setValue,
    formState: { isSubmitting },
  } = useForm<UpdateTaskFormInputs>({
    defaultValues: initialValues,
    shouldFocusError: true,
    mode: 'onTouched',
    resolver: yupResolver(schema),
  });

  const onSubmit = async (data: UpdateTaskFormInputs) => {
    await dispatch(updateTaskAPI(data));
  };

  const watchOriginalEstimate = +watch('originalEstimate');
  const watchTimeTrackingSpent = +watch('timeTrackingSpent');
  const watchTimeTrackingRemaining = +watch('timeTrackingRemaining');

  const debounced = useDebouncedCallback(
    (field: keyof UpdateTaskFormInputs, value: string | number) => {
      setValue(field, value);
    },
    300
  );

  // Reset defaultvalues after received data from API
  useEffect(() => {
    if (taskDetail) {
      reset({ ...initialValues });
    }
  }, [reset, taskDetail, initialValues]);

  useEffect(() => {
    if (watchOriginalEstimate >= watchTimeTrackingSpent) {
      clearErrors('timeTrackingSpent');
    }
  }, [watchOriginalEstimate, watchTimeTrackingSpent, clearErrors]);

  useEffect(() => {
    if (watchOriginalEstimate < watchTimeTrackingSpent) {
      setValue('timeTrackingSpent', watchOriginalEstimate);
    }
  }, [watchOriginalEstimate, watchTimeTrackingSpent, setValue]);

  useEffect(() => {
    debounced(
      'timeTrackingRemaining',
      watchOriginalEstimate - watchTimeTrackingSpent
    );
  }, [watchOriginalEstimate, watchTimeTrackingSpent, debounced]);

  // Edit fields to be suitable with options for the assignees autocomplete
  const membersInProject = useMemo(() => {
    return projectDetailWithTasks?.members.map((member) => {
      const { userId, ...restData } = member;
      return {
        ...restData,
        id: userId,
      };
    });
  }, [projectDetailWithTasks?.members]);

  return (
    <>
      <DialogContent>
        <Box
          id="create-task-form"
          component="form"
          onSubmit={handleSubmit(onSubmit)}
        >
          <Grid container spacing={4}>
            <Grid item xs={12}>
              <ControllerTextField
                control={control}
                name="taskName"
                label="Task Name"
              />
            </Grid>
            <Grid item xs={12}>
              <ControllerSelect
                control={control}
                name="statusId"
                label="Status"
                labelId="status-label"
                options={allStatus}
                optionValue={'statusId'}
                optionLabel={'statusName'}
              />
            </Grid>
            <Grid container item spacing={4}>
              <Grid item xs={12} md={6}>
                <ControllerSelect
                  control={control}
                  name="priorityId"
                  label="Priority"
                  labelId="priority-label"
                  options={allPriority}
                  optionValue={'priorityId'}
                  optionLabel={'description'}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <ControllerSelect
                  control={control}
                  name="typeId"
                  label="Task Type"
                  labelId="type-label"
                  options={allTaskType}
                  optionValue={'id'}
                  optionLabel={'taskType'}
                />
              </Grid>
            </Grid>
            <Grid item xs={12}>
              <ControllerAutocomplete
                control={control}
                name="listUserAsign"
                label="Assignee(s)"
                placeholder="Choose task assignee(s)..."
                options={membersInProject!}
                optionLabel="name"
                equalField="id"
                isMultiple
              />
            </Grid>
            <Grid container item spacing={4}>
              <Grid item xs={12} md={6}>
                <ControllerTextField
                  control={control}
                  name="originalEstimate"
                  label="Total Estimated Hour(s)"
                  type="number"
                  isRequired={false}
                />
              </Grid>
              <Grid
                item
                xs={12}
                md={6}
                sx={{ display: 'flex', alignItems: 'flex-end' }}
              >
                <ControllerTextField
                  control={control}
                  name="timeTrackingSpent"
                  label="Hour(s) spent"
                  type="number"
                  isRequired={false}
                />
              </Grid>
            </Grid>
            <Grid container item spacing={1}>
              <Grid item xs={12}>
                <ControllerSlider
                  control={control}
                  name="timeTrackingRemaining"
                  min={0}
                  max={watchOriginalEstimate}
                />
              </Grid>
              <Grid
                item
                xs={12}
                sx={{ display: 'flex', justifyContent: 'space-between' }}
              >
                <Typography>{watchTimeTrackingSpent} hour(s) spent</Typography>
                <Typography>
                  {watchTimeTrackingRemaining} hour(s) remaining
                </Typography>
              </Grid>
            </Grid>
            <Grid
              item
              xs={12}
              sx={{
                '.ql-editor': {
                  fontSize: up300 ? theme.typography.body1 : undefined,
                },
              }}
            >
              <Typography
                component="label"
                htmlFor="description"
                sx={{ display: 'block', mb: 1 }}
              >
                Task Description
              </Typography>
              <ControllerEditor
                control={control}
                name="description"
                placeholder="Describe the task..."
              />
            </Grid>
          </Grid>
        </Box>
      </DialogContent>
      <Divider />
      {downSm ? (
        <DialogActions
          disableSpacing
          sx={{ display: 'flex', flexDirection: 'column' }}
        >
          <Button
            type="submit"
            form="create-task-form"
            variant="contained"
            fullWidth
            sx={{ mb: 1 }}
            disabled={isSubmitting}
          >
            Update Task
          </Button>
          <Button variant="outlined" fullWidth onClick={onCloseModal}>
            Cancel
          </Button>
        </DialogActions>
      ) : (
        <DialogActions disableSpacing>
          <Button variant="outlined" onClick={onCloseModal}>
            Cancel
          </Button>
          <Button
            type="submit"
            form="create-task-form"
            variant="contained"
            sx={{ ml: 2, mr: 4 }}
            disabled={isSubmitting}
          >
            Update Task
          </Button>
        </DialogActions>
      )}
    </>
  );
};

export default CreateTaskDialogContent;
