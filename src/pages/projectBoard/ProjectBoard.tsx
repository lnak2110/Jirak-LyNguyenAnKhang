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
import BoardCard, { BoardCardChip } from '../../components/BoardCard';
import CreateTaskDialogContent from '../../components/CreateTaskDialogContent';
import DialogModal from '../../components/DialogModal';
import Loading from '../../components/Loading';
import UsersDialogContent from '../../components/UsersDialogContent';
import AddIcon from '@mui/icons-material/Add';
import AvatarGroup from '@mui/material/AvatarGroup';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import { useMediaQuery } from '@mui/material';

const ProjectBoard = () => {
  const { users, isLoading } = useAppSelector(
    (state: RootState) => state.userReducer
  );
  const { projectDetailWithTasks } = useAppSelector(
    (state: RootState) => state.projectReducer
  );

  const dispatch = useAppDispatch();

  const { projectId } = useParams();

  useEffect(() => {
    dispatch(getProjectDetailAPI(projectId!));
    dispatch(getAllUsersAPI());
  }, [dispatch, projectId]);

  const downSm = useMediaQuery(theme.breakpoints.down('sm'));

  const usersInProject = projectDetailWithTasks?.members;

  // Users outside of the project
  const usersOutside = users.filter(
    (user) => !usersInProject?.some((userIn) => userIn.userId === user.userId)
  );

  return (
    <Grid container spacing={2}>
      <Grid container item xs={12} sx={{ pb: 2 }}>
        <Grid item xs={3}>
          <Typography variant="h4" component="h1">
            Board
          </Typography>
        </Grid>
        <Grid item xs={9} sx={{ display: 'flex' }}>
          <DialogModal
            buttonOpen={<Button startIcon={<AddIcon />}>Add User</Button>}
            children={
              <UsersDialogContent
                usersOutside={usersOutside}
                usersInProject={usersInProject!}
              />
            }
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
        </Grid>
      </Grid>
      <Grid container item xs={12}>
        <Grid item xs={3}>
          <BoardCard>
            {
              <>
                <BoardCardChip label="BACKLOG" />
                <DialogModal
                  buttonOpen={
                    <Button fullWidth startIcon={<AddIcon />}>
                      Create
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
              </>
            }
          </BoardCard>
        </Grid>
        <Grid item xs={3}></Grid>
        <Grid item xs={3}></Grid>
        <Grid item xs={3}></Grid>
      </Grid>
      {isLoading && <Loading />}
    </Grid>
  );
};

export default ProjectBoard;
