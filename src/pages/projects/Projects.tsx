import { useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  RootState,
  useAppDispatch,
  useAppSelector,
} from '../../redux/configStore';
import { getAllProjectsAPI } from '../../redux/reducers/projectReducer';
import Loading from '../../components/Loading';
import UsersAvatarGroup from '../../components/UsersAvatarGroup';
import MUIDataGrid from '../../components/MUIDataGrid';
import {
  GridActionsCellItem,
  GridColumns,
  GridValueFormatterParams,
} from '@mui/x-data-grid/';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import Link from '@mui/material/Link';

const Projects = () => {
  const { projects, isLoading } = useAppSelector(
    (state: RootState) => state.projectReducer
  );

  const dispatch = useAppDispatch();

  const navigate = useNavigate();

  useEffect(() => {
    dispatch(getAllProjectsAPI());
  }, [dispatch]);

  const columns: GridColumns = [
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
      renderCell: (params) => (
        <Link
          component={NavLink}
          to={`/projects/${params.row.id}/board`}
          underline="hover"
        >
          {params.value}
        </Link>
      ),
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
      minWidth: 150,
      flex: 1,
      filterable: false,
      sortable: false,
      renderCell: (params) => (
        <UsersAvatarGroup members={params.value} maxAvatarsDisplayed={3} />
      ),
    },
    {
      field: 'actions',
      type: 'actions',
      headerName: 'Actions',
      description: 'Edit / Delete Project',
      minWidth: 70,
      flex: 0.5,
      getActions: (params) => [
        <GridActionsCellItem
          icon={<EditIcon />}
          label="Edit"
          showInMenu
          onClick={() => navigate(`/projects/${params.row.id}/edit`)}
        />,
        <GridActionsCellItem icon={<DeleteIcon />} label="Delete" showInMenu />,
      ],
    },
  ];

  const rows = projects?.map((project) => {
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
    <MUIDataGrid
      columns={columns}
      rows={rows}
      initialPageSizeNumber={10}
      rowId="id"
    />
  );
};

export default Projects;
