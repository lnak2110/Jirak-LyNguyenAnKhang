import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import {
  RootState,
  useAppDispatch,
  useAppSelector,
} from '../../redux/configStore';
import { ListTaskType } from '../../types/taskTypes';
import { getAllUsersAPI } from '../../redux/reducers/userReducer';
import { getProjectDetailAPI } from '../../redux/reducers/projectReducer';
import { updateStatusTaskAPI } from '../../redux/reducers/taskReducer';
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
import { DragDropContext, DropResult } from '@hello-pangea/dnd';

const ProjectBoard = () => {
  const { projectDetailWithTasks } = useAppSelector(
    (state: RootState) => state.projectReducer
  );

  const [listsTemp, setListTemp] = useState<ListTaskType[] | null>(null);

  const dispatch = useAppDispatch();

  const { projectId } = useParams();

  useEffect(() => {
    dispatch(getProjectDetailAPI(projectId!));
    dispatch(getAllUsersAPI());
  }, [dispatch, projectId]);

  useEffect(() => {
    if (projectDetailWithTasks?.lstTask) {
      setListTemp(projectDetailWithTasks?.lstTask!);
    }
  }, [dispatch, projectDetailWithTasks]);

  const downSm = useMediaQuery(theme.breakpoints.down('sm'));

  const handleDragEnd = (result: DropResult) => {
    const { draggableId, destination, source } = result;

    if (!destination) {
      return;
    }

    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return;
    }

    const startColumnIndex = +source.droppableId - 1;
    const finishColumnIndex = +destination.droppableId - 1;
    const startColumn = listsTemp![startColumnIndex];
    const finishColumn = listsTemp![finishColumnIndex];

    if (startColumn?.statusId === finishColumn?.statusId) {
      return;
    }

    const startListCopy = [...startColumn?.lstTaskDeTail!];
    startListCopy.splice(source.index, 1);
    const newStartList = {
      ...startColumn,
      lstTaskDeTail: startListCopy,
    };

    const taskToUpdate = startColumn?.lstTaskDeTail.find(
      (task) => task.taskId === +draggableId
    );
    const finishListCopy = [...finishColumn?.lstTaskDeTail!];
    finishListCopy.splice(
      destination.index,
      0,
      { ...taskToUpdate!, statusId: destination.droppableId }!
    );
    const newFinishList = {
      ...finishColumn,
      lstTaskDeTail: finishListCopy,
    };

    const newListsTemp = [...listsTemp!];
    newListsTemp[startColumnIndex] = newStartList as ListTaskType;
    newListsTemp[finishColumnIndex] = newFinishList as ListTaskType;
    setListTemp(newListsTemp);

    const updateStatusData = {
      taskId: +draggableId,
      statusId: destination.droppableId,
      projectId: projectId!,
    };

    dispatch(updateStatusTaskAPI(updateStatusData));
  };

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
      <DragDropContext onDragEnd={handleDragEnd}>
        <Grid container item xs={12} spacing={2}>
          {listsTemp?.map((listTask, index) => (
            <Grid
              key={listTask.statusId}
              item
              xs={12}
              sm={6}
              md={3}
              sx={{ display: 'flex' }}
            >
              <BoardCardContainer listTask={listTask} index={index} />
            </Grid>
          ))}
        </Grid>
      </DragDropContext>
    </Grid>
  );
};

export default ProjectBoard;
