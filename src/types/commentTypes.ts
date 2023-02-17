import { Member } from './projectTypes';

export type CommentInTask = {
  user: Member;
  id: number;
  userId: number;
  taskId: number;
  contentComment: string;
  deleted?: boolean;
  alias?: string;
};
