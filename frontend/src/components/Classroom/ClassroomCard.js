import Button from '@material-ui/core/Button';
import Chip from '@material-ui/core/Chip';
import DeleteIcon from '@material-ui/icons/Delete';
import EditIcon from '@material-ui/icons/Edit';
import PeopleIcon from '@material-ui/icons/People';
import PropTypes from 'prop-types';
import React from 'react';
import useStyle from './style';

function ClassroomCard({ classroom, onEdit, onDelete }) {
  const classes = useStyle();

  const {
    _id,
    name,
    description,
    level,
    classCode,
    status,
    students = [],
  } = classroom;

  return (
    <div className={classes.card}>
      <div className={classes.cardTop}>
        <div className={classes.levelBadge}>{level}</div>
        <Chip
          className={status === 'active' ? classes.activeChip : classes.inactiveChip}
          label={status === 'active' ? 'Đang mở' : 'Tạm đóng'}
        />
      </div>

      <h2 className={classes.cardTitle}>{name}</h2>

      <p className={classes.cardDesc}>
        {description || 'Chưa có mô tả cho lớp học này.'}
      </p>

      <div className={classes.codeBox}>
        <span>Mã lớp</span>
        <b>{classCode}</b>
      </div>

      <div className={classes.metaRow}>
        <PeopleIcon className={classes.metaIcon} />
        <span>{students.length} học viên</span>
      </div>

      <div className={classes.cardActions}>
        <Button
          className={classes.editBtn}
          startIcon={<EditIcon />}
          onClick={() => onEdit(classroom)}>
          Sửa
        </Button>

        <Button
          className={classes.deleteBtn}
          startIcon={<DeleteIcon />}
          onClick={() => onDelete(_id)}>
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
};

ClassroomCard.defaultProps = {
  classroom: {},
  onEdit: function () {},
  onDelete: function () {},
};

export default ClassroomCard;