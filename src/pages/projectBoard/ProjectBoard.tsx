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
import BoardCard from '../../components/BoardCard';
import CreateTaskDialogContent from '../../components/CreateTaskDialogContent';
import DialogModal from '../../components/DialogModal';
import UsersDialogContent from '../../components/UsersDialogContent';
import AddIcon from '@mui/icons-material/Add';
import EngineeringIcon from '@mui/icons-material/Engineering';
import NextPlanIcon from '@mui/icons-material/NextPlan';
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';
import TaskIcon from '@mui/icons-material/Task';
import AvatarGroup from '@mui/material/AvatarGroup';
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { useMediaQuery } from '@mui/material';

const statusChips = [
  {
    color: 'info',
    icon: <ReceiptLongIcon />,
  },
  {
    color: 'warning',
    icon: <NextPlanIcon />,
  },
  {
    color: 'error',
    icon: <EngineeringIcon />,
  },
  {
    color: 'success',
    icon: <TaskIcon />,
  },
] as const;

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
        {projectDetailWithTasks?.lstTask?.map((list, index) => (
          <Grid key={list.statusId} item xs={3}>
            <BoardCard>
              {
                <>
                  <Chip
                    variant="outlined"
                    label={list.statusName}
                    color={statusChips[index].color}
                    icon={statusChips[index].icon}
                  />
                  <Stack>
                    {list?.lstTaskDeTail?.map((task) => (
                      <div key={task.taskId}>{task.taskName}</div>
                    ))}
                  </Stack>
                </>
              }
            </BoardCard>
          </Grid>
        ))}
      </Grid>
    </Grid>
  );
};

export default ProjectBoard;
