import { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../redux/configStore';
import { getAllProjectsAPI } from '../../redux/reducers/projectReducer';
import Loading from '../../components/Loading';
import UsersAvatarGroup from '../../components/UsersAvatarGroup';
import {
  DataGrid,
  GridColDef,
  GridValueFormatterParams,
} from '@mui/x-data-grid/';

const Projects = () => {
  const [pageSize, setPageSize] = useState(10);

  const { projects, isLoading } = useAppSelector(
    (state) => state.projectReducer
  );

  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(getAllProjectsAPI());
  }, [dispatch]);

  const columns: GridColDef[] = [
    {
      field: 'id',
      headerName: 'ID',
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
      field: 'projectName',
      headerName: 'Project Name',
      minWidth: 150,
      flex: 1,
    },
    {
      field: 'categoryName',
      headerName: 'Category Name',
      minWidth: 150,
      flex: 1,
    },
    {
      field: 'creator',
      headerName: 'Creator',
      minWidth: 150,
      flex: 1,
    },
    {
      field: 'members',
      headerName: 'Members',
      minWidth: 200,
      flex: 1.5,
      filterable: false,
      sortable: false,
      renderCell: (params) => (
        <UsersAvatarGroup members={params.value} maxAvatarsDisplayed={3} />
      ),
    },
  ];

  const rows = projects.map((project) => {
    const { id, projectName, categoryName, creator, members } = project;

    return {
      id,
      projectName,
      categoryName,
      creator: creator.name,
      members,
    };
  });

  if (isLoading) {
    return <Loading />;
  }

  return (
    <DataGrid
      rows={rows}
      columns={columns}
      autoHeight
      checkboxSelection
      disableSelectionOnClick
      rowsPerPageOptions={[10, 20]}
      pageSize={pageSize}
      onPageSizeChange={(newPageSize) => setPageSize(newPageSize)}
    />
  );
};

export default Projects;
