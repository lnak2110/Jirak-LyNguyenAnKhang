import { useState, ChangeEvent, useEffect } from 'react';
import { useDebounce } from 'use-debounce';
import { useParams } from 'react-router-dom';
import { Member } from '../types/projectTypes';
import {
  RootState,
  useAppDispatch,
  useAppSelector,
} from '../redux/configStore';
import {
  addUserToProjectAPI,
  deleteUserFromProjectAPI,
  getAllUsersAPI,
} from '../redux/reducers/userReducer';
import { getProjectDetailAPI } from '../redux/reducers/projectReducer';
import { removeAccents } from '../utils/config';
import { theme } from '../App';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import PersonRemoveIcon from '@mui/icons-material/PersonRemove';
import PersonSearchIcon from '@mui/icons-material/PersonSearch';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import DialogContent from '@mui/material/DialogContent';
import Grid from '@mui/material/Grid';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import ListItemText from '@mui/material/ListItemText';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import { useMediaQuery } from '@mui/material';
import { useConfirm } from 'material-ui-confirm';

const UsersDialogContent = () => {
  const { users } = useAppSelector((state: RootState) => state.userReducer);
  const { projectDetailWithTasks } = useAppSelector(
    (state: RootState) => state.projectReducer
  );

  const [keyword, setKeyword] = useState('');

  const [keywordDebounced] = useDebounce(keyword, 300);

  const dispatch = useAppDispatch();

  const { projectId } = useParams();

  useEffect(() => {
    dispatch(getProjectDetailAPI(projectId!));
    dispatch(getAllUsersAPI());
  }, [dispatch, projectId]);

  const confirm = useConfirm();

  const downSm = useMediaQuery(theme.breakpoints.down('sm'));

  const usersInProject = projectDetailWithTasks?.members;

  // Users outside of the project
  const usersOutside = users.filter(
    (user) => !usersInProject?.some((userIn) => userIn.userId === user.userId)
  );

  const usersOutsideSearched = usersOutside.filter((user) =>
    removeAccents(user.name)
      .toLowerCase()
      .includes(removeAccents(keywordDebounced).toLowerCase())
  );

  const handleChangeKeyword = (
    e: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>
  ) => {
    setKeyword(e.target.value);
  };

  const handleAddUserToProject = (userId: number) => {
    const userAndProjectData = { userId, projectId: +projectId! };
    dispatch(addUserToProjectAPI(userAndProjectData));
  };

  const handleDeleteUserFromProject = (user: Member) => {
    confirm({
      title: `Delete user "${user.name}" from this project?`,
    })
      .then(() => {
        const userAndProjectData = {
          userId: user.userId!,
          projectId: +projectId!,
        };
        dispatch(deleteUserFromProjectAPI(userAndProjectData));
      })
      .catch(() => ({}));
  };

  return (
    <DialogContent>
      <Grid container spacing={1}>
        <Grid item md={6} sx={{ width: '100%' }}>
          <TextField
            type="search"
            size="small"
            placeholder="Search..."
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <PersonSearchIcon />
                </InputAdornment>
              ),
            }}
            onChange={handleChangeKeyword}
          />
          <List>
            {usersOutsideSearched?.map((user, index) => (
              <ListItem
                key={user.userId}
                divider={index < usersOutsideSearched?.length - 1}
                secondaryAction={
                  downSm ? (
                    <IconButton
                      color="primary"
                      aria-label="add memeber to project"
                      onClick={() => handleAddUserToProject(user.userId)}
                    >
                      <PersonAddIcon />
                    </IconButton>
                  ) : (
                    <Button
                      variant="outlined"
                      startIcon={<PersonAddIcon />}
                      aria-label="add memeber to project"
                      onClick={() => handleAddUserToProject(user.userId)}
                    >
                      Add
                    </Button>
                  )
                }
              >
                <ListItemAvatar>
                  <Avatar alt={user.name} src={user.avatar} />
                </ListItemAvatar>
                <ListItemText
                  primary={
                    <Typography
                      sx={{ maxWidth: '70%', wordBreak: 'break-word' }}
                    >
                      {user.name}
                    </Typography>
                  }
                  secondary={`User ID: ${user.userId}`}
                />
              </ListItem>
            ))}
          </List>
        </Grid>
        <Grid item md={6} sx={{ width: '100%' }}>
          <Typography variant="h6" component="h3" gutterBottom>
            Already in the project
          </Typography>
          <List>
            {usersInProject?.map((user, index) => (
              <ListItem
                key={user.userId}
                divider={index < usersInProject?.length - 1}
                secondaryAction={
                  downSm ? (
                    <IconButton
                      color="error"
                      aria-label="delete user from project"
                      onClick={() => handleDeleteUserFromProject(user)}
                    >
                      <PersonRemoveIcon />
                    </IconButton>
                  ) : (
                    <Button
                      color="error"
                      variant="outlined"
                      startIcon={<PersonRemoveIcon />}
                      aria-label="delete user from project"
                      onClick={() => handleDeleteUserFromProject(user)}
                    >
                      Delete
                    </Button>
                  )
                }
              >
                <ListItemAvatar>
                  <Avatar alt={user.name} src={user.avatar} />
                </ListItemAvatar>
                <ListItemText
                  primary={
                    <Typography
                      sx={{ maxWidth: '60%', wordBreak: 'break-word' }}
                    >
                      {user.name}
                    </Typography>
                  }
                  secondary={`User ID: ${user.userId}`}
                />
              </ListItem>
            ))}
          </List>
        </Grid>
      </Grid>
    </DialogContent>
  );
};

export default UsersDialogContent;
