import { Member } from './projectTypes';

export type AddCommentToTaskType = {
  taskId: number;
  contentComment: string;
};

export type CommentInTaskType = AddCommentToTaskType & {
  user: Member;
  id: number;
  userId: number;
  deleted?: boolean;
  alias?: string;
};

export type EditCommentType = AddCommentToTaskType & {
  id: number;
};

export type DeleteCommentType = {
  idComment: number;
  taskId: number;
};
