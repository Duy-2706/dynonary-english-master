import Button from '@material-ui/core/Button';
import Chip from '@material-ui/core/Chip';
import DeleteIcon from '@material-ui/icons/Delete';
import EditIcon from '@material-ui/icons/Edit';
import PeopleIcon from '@material-ui/icons/People';
import DashboardIcon from '@material-ui/icons/Dashboard';
import SchoolIcon from '@material-ui/icons/School';
import PropTypes from 'prop-types';
import React from 'react';
import useStyle from './style';

function ClassroomCard({ classroom, onEdit, onDelete, onManage }) {
  const classes = useStyle();

  const {
    _id,
    id,
    name,
    description,
    level,
    classCode,
    status,
    students = [],
  } = classroom;

  const classroomId = _id || id;

  return (
    <div className={classes.card}>
      <div className={classes.cardTop}>
        <div className={classes.cardDecor}>
          <SchoolIcon style={{ fontSize: 72 }} />
        </div>

        <div className={classes.levelBadge}>{level || 'Chưa cấp độ'}</div>

        <Chip
          className={
            status === 'active' ? classes.activeChip : classes.inactiveChip
          }
          label={status === 'active' ? 'Đang mở' : 'Tạm đóng'}
        />
      </div>

      <div className={classes.cardBody}>
        <h2 className={classes.cardTitle}>{name || 'Lớp học chưa đặt tên'}</h2>

        <p className={classes.cardDesc}>
          {description || 'Chưa có mô tả cho lớp học này.'}
        </p>

        <div className={classes.codeBox}>
          <span>Mã lớp</span>
          <b>{classCode || '—'}</b>
        </div>

        <div className={classes.metaRow}>
          <PeopleIcon className={classes.metaIcon} />
          <span>{students.length} học viên</span>
        </div>
      </div>

      <div className={classes.cardActions}>
        <Button
          className={classes.manageBtn}
          startIcon={<DashboardIcon />}
          onClick={() => {
            if (!classroomId) return;
            onManage(classroom);
          }}
        >
          Quản lý
        </Button>

        <Button
          className={classes.editBtn}
          startIcon={<EditIcon />}
          onClick={() => onEdit(classroom)}
        >
          Sửa
        </Button>

        <Button
          className={classes.deleteBtn}
          startIcon={<DeleteIcon />}
          onClick={() => onDelete(classroomId)}
        >
          Xóa
        </Button>
      </div>
    </div>
  );
}

ClassroomCard.propTypes = {
  classroom: PropTypes.object,
  onEdit: PropTypes.func,
  onDelete: PropTypes.func,
  onManage: PropTypes.func,
};

ClassroomCard.defaultProps = {
  classroom: {},
  onEdit: function () {},
  onDelete: function () {},
  onManage: function () {},
};

export default ClassroomCard;