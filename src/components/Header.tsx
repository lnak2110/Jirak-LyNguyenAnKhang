import { matchPath, NavLink, useLocation } from 'react-router-dom';
import {
  RootState,
  useAppDispatch,
  useAppSelector,
} from '../redux/configStore';
import { logoutAction } from '../redux/reducers/userReducer';
import { theme } from '../App';
import UserProfile from './UserProfile';
import DialogModal from './DialogModal';
import ListAltIcon from '@mui/icons-material/ListAlt';
import PostAddIcon from '@mui/icons-material/PostAdd';
import PeopleIcon from '@mui/icons-material/People';
import AppBar from '@mui/material/AppBar';
import Avatar from '@mui/material/Avatar';
import BottomNavigation from '@mui/material/BottomNavigation';
import BottomNavigationAction from '@mui/material/BottomNavigationAction';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Paper from '@mui/material/Paper';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import Toolbar from '@mui/material/Toolbar';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import { useMediaQuery } from '@mui/material';
import {
  bindMenu,
  bindTrigger,
  usePopupState,
} from 'material-ui-popup-state/hooks';

const pages = [
  { name: 'Projects', route: '/projects', icon: <ListAltIcon /> },
  { name: 'Create Project', route: '/projects/create', icon: <PostAddIcon /> },
  { name: 'Users', route: '/users', icon: <PeopleIcon /> },
];

const Header = () => {
  const { currentUserData } = useAppSelector(
    (state: RootState) => state.userReducer
  );

  const dispatch = useAppDispatch();

  const downSm = useMediaQuery(theme.breakpoints.down('sm'));

  const popupState = usePopupState({
    variant: 'popover',
    popupId: 'profileSettingMenu',
  });

  const location = useLocation();

  const activeTab = () => {
    const { pathname } = location;
    const projectBoardPath = matchPath('/projects/:projectId/board', pathname);
    const projectEditPath = matchPath('/projects/:projectId/edit', pathname);
    const pagesPath = pages.find((p) => p.route === pathname);

    if (pathname === '/') {
      return false;
    } else if (pagesPath) {
      return pathname;
    } else if (projectBoardPath || projectEditPath) {
      return '/projects';
    }
  };

  const handleLogout = () => {
    dispatch(logoutAction());
  };

  return (
    <AppBar position="sticky" color="inherit" elevation={2}>
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          <Typography
            variant="h5"
            noWrap
            component={NavLink}
            to="/"
            sx={{
              mr: 2,
              display: 'flex',
              flexGrow: { xs: 1, sm: 0 },
              fontWeight: 700,
              letterSpacing: '0.3rem',
              color: 'inherit',
              textDecoration: 'none',
            }}
          >
            JIRAK
          </Typography>
          {downSm ? (
            <Paper
              sx={{ position: 'fixed', bottom: 0, left: 0, right: 0 }}
              elevation={3}
            >
              <BottomNavigation showLabels value={activeTab()}>
                {pages.map((page) => (
                  <BottomNavigationAction
                    key={page.name}
                    value={page.route}
                    label={page.name}
                    icon={page.icon}
                    component={NavLink}
                    to={page.route}
                  />
                ))}
              </BottomNavigation>
            </Paper>
          ) : (
            <Tabs
              value={activeTab()}
              sx={{
                flexGrow: 1,
                display: 'flex',
              }}
            >
              {pages.map((page) => (
                <Tab
                  key={page.name}
                  label={page.name}
                  component={NavLink}
                  to={page.route}
                  value={page.route}
                  sx={{
                    mr: 1,
                    py: 3,
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    color: 'inherit',
                  }}
                />
              ))}
            </Tabs>
          )}

          <Box {...bindTrigger(popupState)}>
            <Tooltip title="Open settings">
              <IconButton sx={{ p: 0 }}>
                <Avatar
                  alt={currentUserData?.name}
                  src={currentUserData?.avatar}
                />
              </IconButton>
            </Tooltip>
          </Box>
          <Menu
            {...bindMenu(popupState)}
            keepMounted
            anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
            transformOrigin={{ vertical: 'top', horizontal: 'right' }}
          >
            <DialogModal
              buttonOpen={
                <MenuItem>
                  <Typography textAlign="center">Profile</Typography>
                </MenuItem>
              }
              title="Your Profile"
              popupId="userProfileDialog"
              ariaLabel="user-profile-dialog-modal"
              preventCloseBackdrop
            >
              <UserProfile />
            </DialogModal>
            <MenuItem onClick={handleLogout}>
              <Typography textAlign="center">Logout</Typography>
            </MenuItem>
          </Menu>
        </Toolbar>
      </Container>
    </AppBar>
  );
};
export default Header;
