import { theme } from '../App';
import { ListTaskType } from '../types/taskTypes';
import TaskCard from './TaskCard';
import EngineeringIcon from '@mui/icons-material/Engineering';
import NextPlanIcon from '@mui/icons-material/NextPlan';
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';
import TaskIcon from '@mui/icons-material/Task';
import Chip from '@mui/material/Chip';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import { Droppable } from '@hello-pangea/dnd';

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
    <Paper sx={{ bgcolor: theme.palette.grey[100], width: '100%' }}>
      <Stack
        spacing={2}
        sx={{ p: 1, alignItems: 'flex-start', height: '100%' }}
      >
        <Chip
          variant="outlined"
          label={listTask.statusName}
          color={statusChips[index].color}
          icon={statusChips[index].icon}
        />
        <Droppable droppableId={listTask.statusId}>
          {(provided) => (
            <Stack
              sx={{ width: '100%', height: '100%' }}
              ref={provided.innerRef}
              {...provided.droppableProps}
            >
              {listTask?.lstTaskDeTail?.map((task, index) => (
                <TaskCard key={task.taskId} task={task} index={index} />
              ))}
              {provided.placeholder}
            </Stack>
          )}
        </Droppable>
      </Stack>
    </Paper>
  );
};

export default BoardCardContainer;
