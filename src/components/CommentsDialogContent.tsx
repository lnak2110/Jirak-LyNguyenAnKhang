import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import parse from 'html-react-parser';
import { theme } from '../App';
import {
  RootState,
  useAppDispatch,
  useAppSelector,
} from '../redux/configStore';
import { getAllCommentAPI } from '../redux/reducers/commentReducer';
import { UserAvatar } from './UsersAvatarGroup';
import ControllerEditor from './ControllerEditor';
import IconButton from '@mui/material/IconButton';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import Collapse from '@mui/material/Collapse';
import DialogContent from '@mui/material/DialogContent';
import Grid from '@mui/material/Grid';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import Stack from '@mui/material/Stack';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import { useMediaQuery } from '@mui/material';

type CommentsDialogContentProps = {
  taskId: number;
};

const CommentsDialogContent = ({ taskId }: CommentsDialogContentProps) => {
  const { currentUserData } = useAppSelector(
    (state: RootState) => state.userReducer
  );
  const { allCommentsInTask } = useAppSelector(
    (state: RootState) => state.commentReducer
  );
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(getAllCommentAPI(taskId));
  }, [dispatch, taskId]);

  const { control, handleSubmit } = useForm({
    defaultValues: {
      comment: '',
    },
  });

  const up300 = useMediaQuery(theme.breakpoints.up(300));

  return (
    <DialogContent>
      <Grid
        container
        spacing={1}
        flexDirection={{ xs: 'column-reverse', md: 'row' }}
      >
        <Grid item xs={12} md={6}>
          <List>
            {allCommentsInTask
              .slice(0)
              .reverse()
              .map((comment) => (
                <ListItem key={comment.id}>
                  <Card>
                    <CardHeader
                      disableTypography
                      sx={{
                        '& .MuiCardHeader-content': { overflow: 'hidden' },
                      }}
                      avatar={
                        <Avatar
                          alt={comment.user.name}
                          src={comment.user.avatar}
                        />
                      }
                      title={
                        <Tooltip title={comment.user.name}>
                          <Typography noWrap>{comment.user.name}</Typography>
                        </Tooltip>
                      }
                      action={
                        <IconButton aria-label="settings">
                          <MoreVertIcon />
                        </IconButton>
                      }
                    />
                    <CardContent sx={{ '&.MuiCardContent-root': { py: 0 } }}>
                      <Typography
                        component={'div'}
                        variant="body2"
                        color="text.secondary"
                      >
                        {parse(comment.contentComment)}
                      </Typography>
                    </CardContent>
                  </Card>
                </ListItem>
              ))}
          </List>
        </Grid>
        <Grid item xs={12} md={6}>
          <Stack
            spacing={2}
            sx={{
              p: 2,
              '.ql-editor': {
                fontSize: up300 ? theme.typography.body2 : undefined,
              },
            }}
          >
            <Stack direction="row" spacing={2}>
              <UserAvatar
                name={currentUserData?.name!}
                avatar={currentUserData?.avatar!}
              />
              <Typography>{currentUserData?.name}</Typography>
            </Stack>
            <Box
              component={'form'}
              sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'flex-end',
              }}
            >
              <ControllerEditor
                control={control}
                name="comment"
                placeholder="Leave a comment..."
              />
              <Button type="submit" variant="contained" sx={{ mt: 2 }}>
                Send
              </Button>
            </Box>
          </Stack>
        </Grid>
      </Grid>
    </DialogContent>
  );
};

export default CommentsDialogContent;
