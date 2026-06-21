import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import Divider from '@material-ui/core/Divider';
import AccountCircleIcon from '@material-ui/icons/AccountCircle';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import HelpIcon from '@material-ui/icons/Help';
import SettingsIcon from '@material-ui/icons/Settings';
import SchoolIcon from '@material-ui/icons/School';
import MenuBookIcon from '@material-ui/icons/MenuBook';
import SupervisorAccountIcon from '@material-ui/icons/SupervisorAccount';
import SportsEsportsIcon from '@material-ui/icons/SportsEsports';
import AssessmentIcon from '@material-ui/icons/Assessment';
import StorageIcon from '@material-ui/icons/Storage';
import SettingModal from 'components/SpeedDial/Settings/Modal';
import { LINKS, ROUTES } from 'constant';
import PropTypes from 'prop-types';
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import useStyle from './style';

function SettingMenu({ anchorEl, onClose }) {
  const classes = useStyle();
  const [open, setOpen] = useState(false);
  const { isAuth, role } = useSelector((state) => state.userInfo);

  const isAdmin = isAuth && role === 'admin';
  const isTeacher = isAuth && role === 'teacher';
  const isStudent = isAuth && role === 'student';

  return (
    <Menu
      classes={{ paper: classes.root }}
      anchorEl={anchorEl}
      disableScrollLock={true}
      getContentAnchorEl={null}
      onClose={onClose}
      open={Boolean(anchorEl)}
      anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
    >
      <Link to={ROUTES.USER_ACCOUNT}>
        <MenuItem className={classes.menuItem}>
          <AccountCircleIcon className={classes.icon} fontSize="small" />
          <p className={classes.text}>Thông tin cá nhân</p>
        </MenuItem>
      </Link>

      <Divider style={{ margin: '4px 0' }} />

      {isAdmin && (
        <>
          <Link to={`${ROUTES.ADMIN.USERS}?tab=accounts`}>
            <MenuItem className={classes.menuItem}>
              <SupervisorAccountIcon className={classes.icon} fontSize="small" />
              <p className={classes.text}>Quản lý hệ thống</p>
            </MenuItem>
          </Link>

          <Link to={`${ROUTES.ADMIN.USERS}?tab=statistics`}>
            <MenuItem className={classes.menuItem}>
              <AssessmentIcon className={classes.icon} fontSize="small" />
              <p className={classes.text}>Thống kê báo cáo</p>
            </MenuItem>
          </Link>

          <Link to={`${ROUTES.ADMIN.USERS}?tab=systemData`}>
            <MenuItem className={classes.menuItem}>
              <StorageIcon className={classes.icon} fontSize="small" />
              <p className={classes.text}>Quản trị dữ liệu hệ thống</p>
            </MenuItem>
          </Link>
        </>
      )}

      {isTeacher && (
        <>
          <Link to={ROUTES.TEACHER.COURSES}>
            <MenuItem className={classes.menuItem}>
              <SchoolIcon className={classes.icon} fontSize="small" />
              <p className={classes.text}>Quản lý khóa học</p>
            </MenuItem>
          </Link>

          <Link to={ROUTES.TEACHER.GRAMMAR}>
            <MenuItem className={classes.menuItem}>
              <MenuBookIcon className={classes.icon} fontSize="small" />
              <p className={classes.text}>Quản lý ngữ pháp</p>
            </MenuItem>
          </Link>

          <Link to={ROUTES.CLASSROOM}>
            <MenuItem className={classes.menuItem}>
              <SupervisorAccountIcon className={classes.icon} fontSize="small" />
              <p className={classes.text}>Quản lý lớp học</p>
            </MenuItem>
          </Link>

          <Link to={ROUTES.TEACHER.GAME_ROOMS}>
            <MenuItem className={classes.menuItem}>
              <SportsEsportsIcon className={classes.icon} fontSize="small" />
              <p className={classes.text}>Quản lý phòng game</p>
            </MenuItem>
          </Link>
        </>
      )}

      {isStudent && (
        <>
          <Link to={ROUTES.COURSES}>
            <MenuItem className={classes.menuItem}>
              <MenuBookIcon className={classes.icon} fontSize="small" />
              <p className={classes.text}>Khóa học</p>
            </MenuItem>
          </Link>

          <Link to={ROUTES.MY_COURSES}>
            <MenuItem className={classes.menuItem}>
              <SchoolIcon className={classes.icon} fontSize="small" />
              <p className={classes.text}>Khóa học của tôi</p>
            </MenuItem>
          </Link>

          <Link to={ROUTES.CLASSROOM}>
            <MenuItem className={classes.menuItem}>
              <SupervisorAccountIcon className={classes.icon} fontSize="small" />
              <p className={classes.text}>Lớp học của tôi</p>
            </MenuItem>
          </Link>
        </>
      )}

      <Divider style={{ margin: '4px 0' }} />

      <MenuItem onClick={() => setOpen(true)} className={classes.menuItem}>
        <SettingsIcon className={classes.icon} fontSize="small" />
        <p className={classes.text}>Cài đặt</p>
      </MenuItem>

      <a href={LINKS.FB} target="_blank" rel="noreferrer">
        <MenuItem className={classes.menuItem}>
          <HelpIcon className={classes.icon} fontSize="small" />
          <p className={classes.text}>Liên hệ - Giúp đỡ</p>
        </MenuItem>
      </a>

      <Link to={ROUTES.LOGOUT}>
        <MenuItem className={classes.menuItem}>
          <ExitToAppIcon className={classes.icon} fontSize="small" />
          <p className={classes.text}>Đăng xuất</p>
        </MenuItem>
      </Link>

      {open && <SettingModal open={open} onClose={() => setOpen(false)} />}
    </Menu>
  );
}

SettingMenu.propTypes = {
  anchorEl: PropTypes.any,
  onClose: PropTypes.func,
};

SettingMenu.defaultProps = {
  anchorEl: null,
  onClose: function () {},
};

export default SettingMenu;