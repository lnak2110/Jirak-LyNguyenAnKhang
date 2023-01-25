import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../redux/configStore';
import { getAllProjectsAPI, Member } from '../../redux/reducers/projectReducer';
import Loading from '../../components/Loading';
import { DataGrid, GridColDef } from '@mui/x-data-grid/';
import Avatar from '@mui/material/Avatar';
import AvatarGroup from '@mui/material/AvatarGroup';

const columns: GridColDef[] = [
  {
    field: 'id',
    headerName: 'ID',
    minWidth: 70,
    flex: 0.5,
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
    renderCell: (params) => (
      <AvatarGroup max={3}>
        {params.value.map((member: Member) => (
          <Avatar key={member.userId} alt={member.name} src={member.avatar} />
        ))}
      </AvatarGroup>
    ),
  },
];

const Projects = () => {
  const { projects, isLoading } = useAppSelector(
    (state) => state.projectReducer
  );

  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(getAllProjectsAPI());
  }, [dispatch]);

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
      pageSize={10}
      rowsPerPageOptions={[10, 20]}
      checkboxSelection
    />
  );
};

export default Projects;
