import { Member } from './projectTypes';
import { Assignee } from './userTypes';

export type StatusType = {
  statusId: string;
  statusName: string;
  alias: string;
  deleted: string;
};

export type PriorityType = {
  priorityId: number;
  priority: string;
  description: string;
  deleted: boolean;
  alias: string;
};

export type TaskTypeType = {
  id: number;
  taskType: string;
};

export type CreateTaskFormInputs = {
  projectId: number;
  taskName: string;
  statusId: string;
  priorityId: string | number;
  typeId: string | number;
  listUserAsign: Member[];
  originalEstimate: number;
  timeTrackingSpent: number;
  timeTrackingRemaining: number;
  description: string;
};

export type UpdateTaskFormInputs = Omit<
  CreateTaskFormInputs,
  'listUserAsign'
> & {
  listUserAsign: Assignee[];
};

export type TaskDetailType = {
  priorityTask: PriorityType;
  taskTypeDetail: TaskTypeType;
  assigness: Assignee[];
  lstComment: any[];
  taskId: number;
  taskName: string;
  alias: string;
  description: string;
  statusId: string;
  priorityId: number;
  typeId: number;
  projectId: number;
  originalEstimate: number;
  timeTrackingSpent: number;
  timeTrackingRemaining: number;
};

export type ListTaskType = {
  statusId: string;
  statusName: string;
  alias: string;
  lstTaskDeTail: TaskDetailType[];
};
