import { useEffect, useMemo } from 'react';
import useTitle from '../../hooks/useTitle';
import {
  RootState,
  useAppDispatch,
  useAppSelector,
} from '../../redux/configStore';
import { UserDetailType } from '../../types/userTypes';
import {
  deleteUserAPI,
  getAllUsersAPI,
} from '../../redux/reducers/userReducer';
import MUIDataGrid from '../../components/MUIDataGrid';
import { UserAvatar } from '../../components/UsersAvatarGroup';
import EditUserDialogContent from '../../components/EditUserDialogContent';
import Loading from '../../components/Loading';
import DialogModal from '../../components/DialogModal';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import IconButton from '@mui/material/IconButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import MenuItem from '@mui/material/MenuItem';
import Menu from '@mui/material/Menu';
import Tooltip from '@mui/material/Tooltip';
import {
  GridColDef,
  GridRenderCellParams,
  GridValueFormatterParams,
} from '@mui/x-data-grid/';
import {
  bindMenu,
  bindTrigger,
  usePopupState,
} from 'material-ui-popup-state/hooks';
import { useConfirm } from 'material-ui-confirm';

const RowActionsMenu = ({ user }: { user: UserDetailType }) => {
  const dispatch = useAppDispatch();

  const popupState = usePopupState({
    variant: 'popover',
    popupId: `userActionsMenu-${user.userId}`,
  });

  const confirm = useConfirm();

  const handleDeleteUser = (user: UserDetailType) => {
    confirm({
      title: `Delete user "${user.name}"?`,
      titleProps: { sx: { wordWrap: 'break-word' } },
    })
      .then(() => {
        dispatch(deleteUserAPI(user.userId));
      })
      .catch(() => ({}));
  };

  return (
    <>
      <Tooltip title="More actions">
        <IconButton aria-label="more actions" {...bindTrigger(popupState)}>
          <MoreVertIcon />
        </IconButton>
      </Tooltip>
      <Menu
        elevation={2}
        keepMounted
        {...bindMenu(popupState)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <DialogModal
          buttonOpen={
            <MenuItem>
              <ListItemIcon>
                <EditIcon />
              </ListItemIcon>
              <ListItemText>Edit</ListItemText>
            </MenuItem>
          }
          title={user.name}
          popupId={`editUserDialog-${user.userId}`}
          ariaLabel="edit-user-dialog-modal"
          preventCloseBackdrop
        >
          <EditUserDialogContent
            userData={{
              ...user,
              id: user.userId,
            }}
          />
        </DialogModal>
        <MenuItem onClick={() => handleDeleteUser(user)}>
          <ListItemIcon>
            <DeleteIcon />
          </ListItemIcon>
          <ListItemText>Delete</ListItemText>
        </MenuItem>
      </Menu>
    </>
  );
};

const Users = () => {
  const { users, isLoading } = useAppSelector(
    (state: RootState) => state.userReducer
  );

  const dispatch = useAppDispatch();

  useTitle('Users');

  useEffect(() => {
    dispatch(getAllUsersAPI());
  }, [dispatch]);

  const columns = useMemo<GridColDef[]>(
    () => [
      {
        field: 'userId',
        headerName: 'User ID',
        type: 'number',
        headerAlign: 'left',
        align: 'left',
        minWidth: 70,
        flex: 0.5,
        valueFormatter: (params: GridValueFormatterParams<number>) => {
          return +params.value.toString().replace(/,/g, '');
        },
      },
      {
        field: 'avatar',
        headerName: 'Avatar',
        minWidth: 50,
        flex: 0.4,
        filterable: false,
        sortable: false,
        renderCell: (params) => (
          <UserAvatar name={params.row.name} avatar={params.row.avatar} />
        ),
      },
      {
        field: 'name',
        headerName: 'Name',
        minWidth: 150,
        flex: 1,
      },
      {
        field: 'email',
        headerName: 'Email',
        minWidth: 150,
        flex: 1,
      },
      {
        field: 'phoneNumber',
        headerName: 'Phone Number',
        minWidth: 100,
        flex: 0.6,
      },
      {
        field: 'actions',
        type: 'actions',
        headerName: 'Actions',
        description: 'Edit / Delete User',
        minWidth: 70,
        flex: 0.5,
        renderCell: (params: GridRenderCellParams<UserDetailType>) => (
          <RowActionsMenu user={params.row} />
        ),
      },
    ],
    []
  );

  const rows = useMemo(
    () =>
      users?.map((user) => {
        const { userId, name, avatar, phoneNumber, email } = user;

        return {
          userId,
          name,
          avatar,
          phoneNumber,
          email,
        };
      }),
    [users]
  );

  if (isLoading) {
    return <Loading />;
  }

  return (
    <MUIDataGrid
      columns={columns}
      rows={rows}
      initialPageSizeNumber={10}
      rowId="userId"
    />
  );
};

export default Users;
