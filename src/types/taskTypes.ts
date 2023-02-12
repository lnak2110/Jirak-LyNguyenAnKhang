import { Member } from './productTypes';

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
