import { Member } from '../redux/reducers/projectReducer';
import Avatar from '@mui/material/Avatar';
import AvatarGroup from '@mui/material/AvatarGroup';
import Tooltip from '@mui/material/Tooltip';
import Popper from '@mui/material/Popper';
import Stack from '@mui/material/Stack';
import {
  usePopupState,
  bindPopper,
  bindHover,
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

function UsersAvatarGroup({
  members,
  maxAvatarsDisplayed,
}: UsersAvatarGroupPropsType) {
  const popupState = usePopupState({
    variant: 'popper',
    popupId: 'demoPopper',
  });

  return (
    <>
      <AvatarGroup
        max={maxAvatarsDisplayed}
        slotProps={{
          additionalAvatar: {
            ...bindHover(popupState),
            sx: { cursor: 'pointer' },
          },
        }}
      >
        {members.map((member: Member) => (
          <UserAvatar key={member.userId} {...member} />
        ))}
      </AvatarGroup>
      <Popper {...bindPopper(popupState)} placement="top">
        <Stack spacing={0.5}>
          {members.slice(maxAvatarsDisplayed - 1).map((member: Member) => (
            <UserAvatar key={member.userId} {...member} />
          ))}
        </Stack>
      </Popper>
    </>
  );
}

export default UsersAvatarGroup;
