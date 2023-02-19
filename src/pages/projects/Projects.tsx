import { useEffect, useMemo } from 'react';
import { NavLink } from 'react-router-dom';
import {
  RootState,
  useAppDispatch,
  useAppSelector,
} from '../../redux/configStore';
import { ProjectDetailType } from '../../types/projectTypes';
import {
  deleteProjectAPI,
  getAllProjectsAPI,
} from '../../redux/reducers/projectReducer';
import Loading from '../../components/Loading';
import UsersAvatarGroup from '../../components/UsersAvatarGroup';
import MUIDataGrid from '../../components/MUIDataGrid';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import IconButton from '@mui/material/IconButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import MenuItem from '@mui/material/MenuItem';
import Menu from '@mui/material/Menu';
import Tooltip from '@mui/material/Tooltip';
import Link from '@mui/material/Link';
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

const RowActionsMenu = ({ project }: { project: ProjectDetailType }) => {
  const dispatch = useAppDispatch();

  const popupState = usePopupState({
    variant: 'popover',
    popupId: `projectActionsMenu-${project.id}`,
  });

  const confirm = useConfirm();

  const handleDeleteProject = (project: ProjectDetailType) => {
    confirm({
      title: `Delete project "${project.projectName}"?`,
    })
      .then(() => {
        dispatch(deleteProjectAPI(project.id));
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
        {...bindMenu(popupState)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <MenuItem component={NavLink} to={`/projects/${project.id}/edit`}>
          <ListItemIcon>
            <EditIcon />
          </ListItemIcon>
          <ListItemText>Edit</ListItemText>
        </MenuItem>
        <MenuItem onClick={() => handleDeleteProject(project)}>
          <ListItemIcon>
            <DeleteIcon />
          </ListItemIcon>
          <ListItemText>Delete</ListItemText>
        </MenuItem>
      </Menu>
    </>
  );
};

const Projects = () => {
  const { projects, isLoading } = useAppSelector(
    (state: RootState) => state.projectReducer
  );

  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(getAllProjectsAPI());
  }, [dispatch]);

  const columns = useMemo<GridColDef[]>(
    () => [
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
        renderCell: (params: GridRenderCellParams<ProjectDetailType>) => (
          <RowActionsMenu project={params.row} />
        ),
      },
    ],
    []
  );

  const rows = useMemo(
    () =>
      projects?.map((project) => {
        const { id, projectName, categoryName, creator, members } = project;

        return {
          id,
          projectName,
          categoryName,
          creator: creator.name,
          members,
        };
      }),
    [projects]
  );

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
