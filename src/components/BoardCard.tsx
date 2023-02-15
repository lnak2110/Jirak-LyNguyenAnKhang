import { theme } from '../App';
import { ListTaskType } from '../types/taskTypes';
import TaskCard from './TaskCard';
import EngineeringIcon from '@mui/icons-material/Engineering';
import NextPlanIcon from '@mui/icons-material/NextPlan';
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';
import TaskIcon from '@mui/icons-material/Task';
import Card from '@mui/material/Card';
import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';

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

type BoardCardContainerProps = {
  listTask: ListTaskType;
  index: number;
};

const BoardCardContainer = ({ listTask, index }: BoardCardContainerProps) => {
  return (
    <Card sx={{ bgcolor: theme.palette.grey[100] }}>
      <Stack spacing={1} sx={{ p: 1, alignItems: 'flex-start' }}>
        <Chip
          variant="outlined"
          label={listTask.statusName}
          color={statusChips[index].color}
          icon={statusChips[index].icon}
        />
        <Stack spacing={1} sx={{ width: '100%' }}>
          {listTask?.lstTaskDeTail?.map((task) => (
            <TaskCard key={task.taskId} task={task} />
          ))}
        </Stack>
      </Stack>
    </Card>
  );
};

export default BoardCardContainer;
