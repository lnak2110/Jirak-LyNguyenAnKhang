import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import {
  RootState,
  useAppDispatch,
  useAppSelector,
} from '../../redux/configStore';
import { getAllUsersAPI } from '../../redux/reducers/userReducer';
import { getProjectDetailAPI } from '../../redux/reducers/projectReducer';
import { theme } from '../../App';
import { UserAvatar } from '../../components/UsersAvatarGroup';
import BoardCardContainer from '../../components/BoardCardContainer';
import CreateTaskDialogContent from '../../components/CreateTaskDialogContent';
import DialogModal from '../../components/DialogModal';
import UsersDialogContent from '../../components/UsersDialogContent';
import AddIcon from '@mui/icons-material/Add';
import AvatarGroup from '@mui/material/AvatarGroup';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { useMediaQuery } from '@mui/material';

const ProjectBoard = () => {
  const { users } = useAppSelector((state: RootState) => state.userReducer);
  const { projectDetailWithTasks } = useAppSelector(
    (state: RootState) => state.projectReducer
  );

  const dispatch = useAppDispatch();

  const { projectId } = useParams();

  useEffect(() => {
    dispatch(getProjectDetailAPI(projectId!));
    dispatch(getAllUsersAPI());
  }, [dispatch, projectId]);

  // useEffect(() => {
  //   dispatch(getProjectDetailAPI(projectId!));
  // }, [dispatch, projectDetailWithTasks?.lstTask, projectId]);

  const downSm = useMediaQuery(theme.breakpoints.down('sm'));

  const usersInProject = projectDetailWithTasks?.members;

  return (
    <Grid container spacing={4}>
      <Grid container item xs={12} spacing={2} sx={{ pb: 2 }}>
        <Grid item xs={12} md={3}>
          <Typography
            variant="h4"
            component="h1"
            {...(downSm && { sx: { textAlign: 'center' } })}
          >
            Board
          </Typography>
        </Grid>
        <Grid container item xs={12} md={9}>
          <Stack
            {...(downSm && { spacing: 2 })}
            direction={downSm ? 'column' : 'row'}
            sx={{
              width: '100%',
              display: 'flex',
              justifyContent: 'space-between',
            }}
          >
            <Stack direction={'row'} spacing={1}>
              <DialogModal
                buttonOpen={
                  <Button
                    {...(downSm && { sx: { width: '50%' } })}
                    startIcon={<AddIcon />}
                  >
                    Add User
                  </Button>
                }
                children={<UsersDialogContent />}
                popupId="usersDialog"
                title="All users"
                ariaLabel="users-dialog-title"
                preventCloseBackdrop={false}
              />
              <AvatarGroup max={downSm ? 3 : 6}>
                {usersInProject?.map((user) => (
                  <UserAvatar
                    key={user.userId}
                    name={user.name}
                    avatar={user.avatar}
                  />
                ))}
              </AvatarGroup>
            </Stack>
            <DialogModal
              buttonOpen={
                <Button variant="contained" startIcon={<AddIcon />}>
                  Create Task
                </Button>
              }
              children={
                <CreateTaskDialogContent
                  projectDetailWithTasks={projectDetailWithTasks!}
                />
              }
              popupId="createTaskDialog"
              title="Create Task"
              ariaLabel="create-task-dialog-title"
              preventCloseBackdrop
            />
          </Stack>
        </Grid>
      </Grid>
      <Grid container item xs={12} spacing={2}>
        {projectDetailWithTasks?.lstTask?.map((listTask, index) => (
          <Grid key={listTask.statusId} item xs={12} sm={6} md={3}>
            <BoardCardContainer listTask={listTask} index={index} />
          </Grid>
        ))}
      </Grid>
    </Grid>
  );
};

export default ProjectBoard;
