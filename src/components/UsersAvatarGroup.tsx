import { theme } from '../App';
import { Member } from '../redux/reducers/projectReducer';
import Avatar from '@mui/material/Avatar';
import AvatarGroup from '@mui/material/AvatarGroup';
import Tooltip from '@mui/material/Tooltip';
import Popper from '@mui/material/Popper';
import Stack from '@mui/material/Stack';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Grid from '@mui/material/Grid';
import useMediaQuery from '@mui/material/useMediaQuery';
import {
  usePopupState,
  bindPopper,
  bindHover,
  bindTrigger,
  bindDialog,
} from 'material-ui-popup-state/hooks';

type UsersAvatarGroupPropsType = {
  members: Member[];
  maxAvatarsDisplayed: number;
};

const UserAvatar = ({ name, avatar }: Member) => {
  return (
    <Tooltip title={name}>
      <Avatar alt={name} src={avatar} />
    </Tooltip>
  );
};

const UsersAvatarGroup = ({
  members,
  maxAvatarsDisplayed,
}: UsersAvatarGroupPropsType) => {
  const downMd = useMediaQuery(theme.breakpoints.down('md'));

  const popperPopupState = usePopupState({
    variant: 'popper',
    popupId: 'viewMembersPopper',
  });

  const dialogPopupState = usePopupState({
    variant: 'dialog',
    popupId: 'allMembersDialog',
  });

  if (downMd) {
    return (
      <>
        <AvatarGroup
          max={maxAvatarsDisplayed}
          slotProps={{
            additionalAvatar: {
              ...bindTrigger(dialogPopupState),
              sx: {
                cursor: 'pointer',
              },
            },
          }}
        >
          {members.map((member: Member) => (
            <UserAvatar key={member.userId} {...member} />
          ))}
        </AvatarGroup>
        <Dialog
          {...bindDialog(dialogPopupState)}
          scroll="paper"
          maxWidth="xs"
          aria-labelledby="all-members-dialog-title"
          aria-describedby="all-members-dialog-description"
        >
          <DialogTitle id="all-members-dialog-title">All members</DialogTitle>
          <DialogContent>
            <Grid container spacing={3}>
              {members.map((member: Member) => (
                <Grid item xs={3} sm={2} key={member.userId}>
                  <UserAvatar {...member} />
                </Grid>
              ))}
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button onClick={dialogPopupState.close} autoFocus>
              Close
            </Button>
          </DialogActions>
        </Dialog>
      </>
    );
  }

  return (
    <>
      <AvatarGroup
        max={maxAvatarsDisplayed}
        slotProps={{
          additionalAvatar: {
            ...bindHover(popperPopupState),
          },
        }}
      >
        {members.map((member: Member) => (
          <UserAvatar key={member.userId} {...member} />
        ))}
      </AvatarGroup>
      <Popper {...bindPopper(popperPopupState)}>
        <Stack
          direction="row"
          spacing={0.5}
          component={Paper}
          elevation={2}
          sx={{ p: 1, maxWidth: '300px', flexWrap: 'wrap', gap: 0.5 }}
        >
          {members.slice(maxAvatarsDisplayed - 1).map((member: Member) => (
            <UserAvatar key={member.userId} {...member} />
          ))}
        </Stack>
      </Popper>
    </>
  );
};

export default UsersAvatarGroup;
