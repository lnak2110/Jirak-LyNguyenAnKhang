import { TaskDetailType } from '../types/taskTypes';
import { UserAvatar } from './UsersAvatarGroup';
import AssignmentIcon from '@mui/icons-material/Assignment';
import BugReportIcon from '@mui/icons-material/BugReport';
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
import Stack from '@mui/material/Stack';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';

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
    color: 'info',
    icon: <AssignmentIcon />,
  },
] as const;

type TaskCardProps = {
  task: TaskDetailType;
};

const TaskCard = ({ task }: TaskCardProps) => {
  return (
    <Card sx={{ '& .MuiCardContent-root': { p: 2 } }}>
      <CardHeader
        title={
          <Tooltip title={task.taskName}>
            <Typography
              sx={{
                display: 'inline-block',
                maxWidth: '100%',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
              }}
            >
              {task.taskName}
            </Typography>
          </Tooltip>
        }
        sx={{ '& .MuiCardHeader-content': { overflow: 'hidden' }, pb: 0 }}
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
  );
};

export default TaskCard;