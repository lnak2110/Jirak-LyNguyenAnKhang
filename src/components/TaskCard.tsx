import { TaskDetailType } from '../types/taskTypes';
import { useAppDispatch } from '../redux/configStore';
import { UserAvatar } from './UsersAvatarGroup';
import CommentsDialogContent from './CommentsDialogContent';
import DialogModal from './DialogModal';
import TaskDetailDialogContent from './TaskDetailDialogContent';
import TaskDetailDialogTabs from './TaskDetailDialogTabs';
import AssignmentIcon from '@mui/icons-material/Assignment';
import BugReportIcon from '@mui/icons-material/BugReport';
import DeleteIcon from '@mui/icons-material/Delete';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardDoubleArrowDownIcon from '@mui/icons-material/KeyboardDoubleArrowDown';
import PersonOffIcon from '@mui/icons-material/PersonOff';
import Avatar from '@mui/material/Avatar';
import AvatarGroup from '@mui/material/AvatarGroup';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardHeader from '@mui/material/CardHeader';
import Chip from '@mui/material/Chip';
import IconButton from '@mui/material/IconButton';
import Stack from '@mui/material/Stack';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import { Draggable } from '@hello-pangea/dnd';
import { useConfirm } from 'material-ui-confirm';
import { deleteTaskAPI } from '../redux/reducers/taskReducer';

const priorityChips = [
  {
    icon: <KeyboardArrowUpIcon />,
  },
  {
    icon: <KeyboardArrowRightIcon />,
  },
  {
    icon: <KeyboardArrowDownIcon />,
  },
  {
    icon: <KeyboardDoubleArrowDownIcon />,
  },
] as const;

const taskTypeChips = [
  {
    color: 'error',
    icon: <BugReportIcon />,
  },
  {
    color: 'indigo',
    icon: <AssignmentIcon />,
  },
] as const;

type TaskCardProps = {
  task: TaskDetailType;
  index: number;
};

const TaskCard = ({ task, index }: TaskCardProps) => {
  const dispatch = useAppDispatch();

  const confirm = useConfirm();

  const handleDeleteTask = () => {
    confirm({
      title: `Delete task "${task.taskName}"?`,
    })
      .then(() => {
        dispatch(
          deleteTaskAPI({
            taskId: task.taskId,
            projectId: task.projectId,
          })
        );
      })
      .catch(() => ({}));
  };

  return (
    <Draggable draggableId={task.taskId.toString()} index={index}>
      {(provided) => (
        <DialogModal
          key={task.taskId}
          popupId="taskDetailDialog"
          title={task.taskName}
          ariaLabel="task-detail-dialog-title"
          preventCloseBackdrop
          buttonOpen={
            <Card
              sx={{
                '& .MuiCardContent-root': { p: 2 },
                mt: 1,
                cursor: 'grab',
              }}
              {...provided.draggableProps}
              {...provided.dragHandleProps}
              ref={provided.innerRef}
            >
              <CardHeader
                disableTypography
                sx={{
                  '& .MuiCardHeader-content': { overflow: 'hidden' },
                  pb: 0,
                }}
                title={
                  <Tooltip title={task.taskName}>
                    <Typography
                      sx={{
                        display: 'inline-block',
                        maxWidth: '100%',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                      }}
                    >
                      {task.taskName}
                    </Typography>
                  </Tooltip>
                }
                action={
                  <Tooltip title="Delete">
                    <IconButton
                      aria-label="delete"
                      size="small"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteTask();
                      }}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </Tooltip>
                }
              />
              <CardContent
                sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  '&.MuiCardContent-root': { pb: 2 },
                }}
              >
                <Stack spacing={1}>
                  <Chip
                    size="small"
                    variant="outlined"
                    label={task.priorityTask.priority}
                    icon={priorityChips[task.priorityTask.priorityId - 1].icon}
                  />
                  <Chip
                    size="small"
                    variant="outlined"
                    label={task.taskTypeDetail.taskType}
                    icon={taskTypeChips[task.taskTypeDetail.id - 1].icon}
                    color={taskTypeChips[task.taskTypeDetail.id - 1].color}
                  />
                </Stack>
                {task.assigness.length ? (
                  <AvatarGroup
                    max={3}
                    slotProps={{
                      additionalAvatar: { sx: { width: 32, height: 32 } },
                    }}
                  >
                    {task?.assigness?.map((user) => (
                      <UserAvatar
                        key={user.id}
                        name={user.name}
                        avatar={user.avatar}
                        sx={{ width: 32, height: 32 }}
                      />
                    ))}
                  </AvatarGroup>
                ) : (
                  <Tooltip title={'No assignee'}>
                    <Avatar
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        width: 32,
                        height: 32,
                      }}
                    >
                      <PersonOffIcon />
                    </Avatar>
                  </Tooltip>
                )}
              </CardContent>
            </Card>
          }
        >
          <TaskDetailDialogTabs
            taskDetailTabContent={
              <TaskDetailDialogContent taskId={task.taskId} />
            }
            commentsTabContent={<CommentsDialogContent taskId={task.taskId} />}
          />
        </DialogModal>
      )}
    </Draggable>
  );
};

export default TaskCard;
