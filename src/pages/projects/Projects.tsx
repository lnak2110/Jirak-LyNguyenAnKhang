import { useEffect, useMemo } from 'react';
import { NavLink } from 'react-router-dom';
import useTitle from '../../hooks/useTitle';
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
import { theme } from '../../App';
import DialogModal from '../../components/DialogModal';
import Loading from '../../components/Loading';
import ProjectsUsersDialogContent from '../../components/ProjectsUsersDialogContent';
import UsersAvatarGroup from '../../components/UsersAvatarGroup';
import MUIDataGrid from '../../components/MUIDataGrid';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import Avatar from '@mui/material/Avatar';
import IconButton from '@mui/material/IconButton';
import Link from '@mui/material/Link';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import MenuItem from '@mui/material/MenuItem';
import Menu from '@mui/material/Menu';
import Stack from '@mui/material/Stack';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
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
      titleProps: { sx: { wordWrap: 'break-word' } },
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
  const { currentUserData } = useAppSelector(
    (state: RootState) => state.userReducer
  );

  const dispatch = useAppDispatch();

  useTitle('Projects');

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
            noWrap
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
        renderCell: (params) => (
          <Typography>{params.row.creator.name}</Typography>
        ),
      },
      {
        field: 'members',
        headerName: 'Members',
        minWidth: 180,
        flex: 1.2,
        filterable: false,
        sortable: false,
        renderCell: (params) => {
          if (currentUserData?.id === params.row.creator.id) {
            return (
              <Stack direction="row">
                <DialogModal
                  maxWidthValue="sm"
                  heightValue="300px"
                  preventCloseBackdrop
                  buttonOpen={
                    <Avatar
                      sx={{
                        bgcolor: theme.palette.primary.light,
                        cursor: 'pointer',
                      }}
                    >
                      <PersonAddIcon />
                    </Avatar>
                  }
                  title={params.row.projectName}
                  popupId={`project-${params.row.id}-users`}
                  ariaLabel="project-users-dialog"
                >
                  <ProjectsUsersDialogContent
                    membersInProject={params.value}
                    projectId={params.row.id}
                  />
                </DialogModal>

                <UsersAvatarGroup
                  members={params.value}
                  maxAvatarsDisplayed={3}
                />
              </Stack>
            );
          }

          return (
            <UsersAvatarGroup members={params.value} maxAvatarsDisplayed={3} />
          );
        },
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
    [currentUserData]
  );

  const rows = useMemo(
    () =>
      projects?.map((project) => {
        const { id, projectName, categoryName, creator, members } = project;

        return {
          id,
          projectName,
          categoryName,
          creator,
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
