import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import Divider from '@material-ui/core/Divider';
import AccountCircleIcon from '@material-ui/icons/AccountCircle';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import HelpIcon from '@material-ui/icons/Help';
import SettingsIcon from '@material-ui/icons/Settings';
import SchoolIcon from '@material-ui/icons/School';
import MenuBookIcon from '@material-ui/icons/MenuBook';
import SettingModal from 'components/SpeedDial/Settings/Modal';
import { LINKS, ROUTES } from 'constant';
import PropTypes from 'prop-types';
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import useStyle from './style';
import SupervisorAccountIcon from '@material-ui/icons/SupervisorAccount';
import SportsEsportsIcon from '@material-ui/icons/SportsEsports';

function SettingMenu({ anchorEl, onClose }) {
  const classes = useStyle();
  const [open, setOpen] = useState(false);
  const { isAuth, role } = useSelector((state) => state.userInfo);

  return (
    <Menu
      classes={{ paper: classes.root }}
      anchorEl={anchorEl}
      disableScrollLock={true}
      getContentAnchorEl={null}
      onClose={onClose}
      open={Boolean(anchorEl)}
      anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}>

      {/* Thông tin cá nhân */}
      <Link to={ROUTES.USER_ACCOUNT}>
        <MenuItem className={classes.menuItem}>
          <AccountCircleIcon className={classes.icon} fontSize="small" />
          <p className={classes.text}>Thông tin cá nhân</p>
        </MenuItem>
      </Link>

      <Divider style={{ margin: '4px 0' }} />

      {/* Khóa học - tất cả đều thấy */}
      <Link to={ROUTES.COURSES}>
        <MenuItem className={classes.menuItem}>
          <MenuBookIcon className={classes.icon} fontSize="small" />
          <p className={classes.text}>Khóa học</p>
        </MenuItem>
      </Link>

      {/* Khóa học của tôi - học sinh */}
      {isAuth && role === 'student' && (
        <Link to="/my-courses">
          <MenuItem className={classes.menuItem}>
            <SchoolIcon className={classes.icon} fontSize="small" />
            <p className={classes.text}>Khóa học của tôi</p>
          </MenuItem>
        </Link>
      )}

      {/* Quản lý khóa học - chỉ giáo viên */}
      {isAuth && (role === 'teacher' || role === 'admin') && (
        <Link to="/teacher/courses">
          <MenuItem className={classes.menuItem}>
            <SchoolIcon className={classes.icon} fontSize="small" />
            <p className={classes.text}>Quản lý khóa học</p>
          </MenuItem>
        </Link>
      )}

      {/* Quản lý lớp học - giáo viên và admin */}
      {isAuth && (role === 'teacher' || role === 'admin') && (
        <Link to={ROUTES.CLASSROOM}>
          <MenuItem className={classes.menuItem}>
            <SupervisorAccountIcon className={classes.icon} fontSize="small" />
            <p className={classes.text}>Quản lý lớp học</p>
          </MenuItem>
        </Link>
      )}

      {/* Quản lý phòng game - giáo viên và admin */}
      {isAuth && (role === 'teacher' || role === 'admin') && (
        <Link to="/teacher/game-rooms">
          <MenuItem className={classes.menuItem}>
            <SportsEsportsIcon className={classes.icon} fontSize="small" />
            <p className={classes.text}>Quản lý phòng game</p>
          </MenuItem>
        </Link>
      )}
      
        {/* Quản lý người dùng - chỉ admin */}
      {isAuth && role === 'admin' && (
        <Link to="/admin/users">
          <MenuItem className={classes.menuItem}>
            <SupervisorAccountIcon className={classes.icon} fontSize="small" />
            <p className={classes.text}>Quản lý người dùng</p>
          </MenuItem>
        </Link>
      )}
      <Divider style={{ margin: '4px 0' }} />

      {/* Cài đặt */}
      <MenuItem onClick={() => setOpen(true)} className={classes.menuItem}>
        <SettingsIcon className={classes.icon} fontSize="small" />
        <p className={classes.text}>Cài đặt</p>
      </MenuItem>

      {/* Liên hệ */}
      <a href={LINKS.FB} target="_blank" rel="noreferrer">
        <MenuItem className={classes.menuItem}>
          <HelpIcon className={classes.icon} fontSize="small" />
          <p className={classes.text}>Liên hệ - Giúp đỡ</p>
        </MenuItem>
      </a>

      {/* Đăng xuất */}
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