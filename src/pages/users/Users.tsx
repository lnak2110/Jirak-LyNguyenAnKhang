import { useEffect } from 'react';
import {
  RootState,
  useAppDispatch,
  useAppSelector,
} from '../../redux/configStore';
import { getAllUsersAPI } from '../../redux/reducers/userReducer';
import MUIDataGrid from '../../components/MUIDataGrid';
import Loading from '../../components/Loading';
import { UserAvatar } from '../../components/UsersAvatarGroup';
import { GridColDef, GridValueFormatterParams } from '@mui/x-data-grid/';

const Users = () => {
  const { users, isLoading } = useAppSelector(
    (state: RootState) => state.userReducer
  );

  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(getAllUsersAPI());
  }, [dispatch]);

  const columns: GridColDef[] = [
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
      flex: 0.3,
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
      minWidth: 150,
      flex: 1,
    },
  ];

  const rows = users?.map((user) => {
    const { userId, name, avatar, phoneNumber, email } = user;

    return {
      userId,
      name,
      avatar,
      phoneNumber,
      email,
    };
  });

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
