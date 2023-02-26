import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import {
  RootState,
  useAppDispatch,
  useAppSelector,
} from '../redux/configStore';
import {
  addUserToProjectAPI,
  deleteUserFromProjectAPI,
  deleteUserFromTaskAPI,
  getAllUsersAPI,
} from '../redux/reducers/userReducer';
import { getAllProjectsAPI } from '../redux/reducers/projectReducer';
import { Member } from '../types/projectTypes';
import { theme } from '../App';
import ControllerAutocomplete from './ControllerAutocomplete';
import Loading from './Loading';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import { useMediaQuery } from '@mui/material';
import differenceBy from 'lodash/differenceBy';

type ProjectsUsersDialogContentProps = {
  projectId: number;
  membersInProject: Member[];
  handleCloseModal?: () => void;
};

type AddDeleteProjectMembersType = {
  members: Member[];
};

const ProjectsUsersDialogContent = ({
  membersInProject,
  projectId,
  handleCloseModal,
}: ProjectsUsersDialogContentProps) => {
  const { users, isLoading } = useAppSelector(
    (state: RootState) => state.userReducer
  );
  const { projectDetailWithTasks } = useAppSelector(
    (state: RootState) => state.projectReducer
  );

  const dispatch = useAppDispatch();

  const downSm = useMediaQuery(theme.breakpoints.down('sm'));

  useEffect(() => {
    dispatch(getAllUsersAPI());
  }, [dispatch]);

  const {
    control,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm<AddDeleteProjectMembersType>({
    defaultValues: { members: membersInProject || null },
  });

  const onSubmit = (data: AddDeleteProjectMembersType) => {
    const addedMembers = differenceBy(data.members, membersInProject, 'userId');
    const deletedMembers = differenceBy(
      membersInProject,
      data.members,
      'userId'
    );

    if (addedMembers.length || deletedMembers.length) {
      addedMembers?.forEach(
        async (member) =>
          await dispatch(
            addUserToProjectAPI({ userId: member.userId!, projectId })
          )
      );
      deletedMembers?.forEach(async (member) => {
        await dispatch(
          deleteUserFromProjectAPI({ userId: member.userId!, projectId })
        );

        // Delete user from every task that has that user in
        projectDetailWithTasks?.lstTask.forEach((list) =>
          list.lstTaskDeTail?.forEach(async (task) => {
            if (
              task.assigness.find((assignee) => assignee.id === member.userId)
            ) {
              await dispatch(
                deleteUserFromTaskAPI({
                  taskId: task.taskId,
                  userId: member.userId!,
                })
              );
            }
          })
        );
      });

      dispatch(getAllProjectsAPI());
    }
  };

  return (
    <>
      <DialogContent>
        <Box
          id="add-delete-project-users-form"
          component="form"
          onSubmit={handleSubmit(onSubmit)}
        >
          <ControllerAutocomplete
            control={control}
            isMultiple
            isDisablePortal={false}
            name="members"
            label="Members In Project"
            placeholder="Add/Remove member"
            options={users}
            optionLabel="name"
            equalField="userId"
          />
        </Box>
      </DialogContent>
      <Divider />
      <DialogActions
        disableSpacing
        sx={{
          display: 'flex',
          flexDirection: { xs: 'column-reverse', sm: 'row' },
          px: 3,
        }}
      >
        <Button
          variant="outlined"
          fullWidth={downSm}
          onClick={handleCloseModal}
        >
          Cancel
        </Button>
        <Button
          type="submit"
          form="add-delete-project-users-form"
          variant="contained"
          fullWidth={downSm}
          sx={{
            mb: { xs: 1, sm: 0 },
            ml: { sm: 2 },
          }}
          disabled={isSubmitting}
        >
          Update
        </Button>
      </DialogActions>
      {isLoading && <Loading />}
    </>
  );
};

export default ProjectsUsersDialogContent;
