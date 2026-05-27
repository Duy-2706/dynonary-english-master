import { yupResolver } from '@hookform/resolvers/yup';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import Grid from '@material-ui/core/Grid';
import LoopIcon from '@material-ui/icons/Loop';
import SaveIcon from '@material-ui/icons/Save';
import InputCustom from 'components/UI/InputCustom';
import SelectCustom from 'components/UI/SelectCustom';
import PropTypes from 'prop-types';
import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';
import useStyle from './style';

const schema = yup.object().shape({
  name: yup
    .string()
    .trim()
    .required('Vui lòng nhập tên lớp học')
    .max(80, 'Tên lớp học tối đa 80 ký tự'),
  description: yup
    .string()
    .trim()
    .max(300, 'Mô tả lớp học tối đa 300 ký tự'),
});

const LEVEL_OPTIONS = [
  { value: 'A1', label: 'A1 - Cơ bản' },
  { value: 'A2', label: 'A2 - Sơ cấp' },
  { value: 'B1', label: 'B1 - Trung cấp' },
  { value: 'B2', label: 'B2 - Khá' },
  { value: 'C1', label: 'C1 - Nâng cao' },
  { value: 'C2', label: 'C2 - Thành thạo' },
  { value: 'Khác', label: 'Khác' },
];

const STATUS_OPTIONS = [
  { value: 'active', label: 'Đang mở' },
  { value: 'inactive', label: 'Tạm đóng' },
];

function ClassroomFormModal({
  open,
  submitting,
  initialData,
  onClose,
  onSubmit,
}) {
  const classes = useStyle();
  const isEdit = Boolean(initialData);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      name: '',
      description: '',
      level: 'A1',
      status: 'active',
    },
  });

  useEffect(() => {
    if (initialData) {
      reset({
        name: initialData.name || '',
        description: initialData.description || '',
        level: initialData.level || 'A1',
        status: initialData.status || 'active',
      });
    } else {
      reset({
        name: '',
        description: '',
        level: 'A1',
        status: 'active',
      });
    }
  }, [initialData, open]);

  const submitForm = (data) => {
    onSubmit(data);
  };

  return (
    <Dialog
      open={open}
      onClose={submitting ? undefined : onClose}
      maxWidth="md"
      fullWidth
      classes={{ paper: classes.modalPaper }}>
      <DialogTitle classes={{ root: classes.modalTitle }}>
        {isEdit ? 'Cập nhật lớp học' : 'Tạo lớp học mới'}
      </DialogTitle>

      <DialogContent dividers classes={{ dividers: classes.modalContent }}>
        <form id="classroomForm" onSubmit={handleSubmit(submitForm)}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <InputCustom
                className="w-100"
                label="Tên lớp học (*)"
                error={Boolean(errors.name)}
                inputProps={{
                  name: 'name',
                  maxLength: 80,
                  ...register('name'),
                }}
              />
              {errors.name && (
                <p className="text-error">{errors.name.message}</p>
              )}
            </Grid>

            <Grid item xs={12}>
              <InputCustom
                className="w-100"
                label="Mô tả lớp học"
                multiline
                rows={4}
                error={Boolean(errors.description)}
                inputProps={{
                  name: 'description',
                  maxLength: 300,
                  ...register('description'),
                }}
              />
              {errors.description && (
                <p className="text-error">{errors.description.message}</p>
              )}
            </Grid>

            <Grid item xs={12} md={6}>
              <SelectCustom
                className="w-100"
                label="Trình độ"
                options={LEVEL_OPTIONS}
                inputProps={{ name: 'level' }}
                onChange={(e) => setValue('level', e.target.value)}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <SelectCustom
                className="w-100"
                label="Trạng thái"
                options={STATUS_OPTIONS}
                inputProps={{ name: 'status' }}
                onChange={(e) => setValue('status', e.target.value)}
              />
            </Grid>
          </Grid>
        </form>
      </DialogContent>

      <DialogActions classes={{ root: classes.modalActions }}>
        <Button
          className="_btn _btn-outlined-stand"
          disabled={submitting}
          onClick={onClose}>
          Hủy
        </Button>

        <Button
          form="classroomForm"
          type="submit"
          className="_btn _btn-primary"
          disabled={submitting}
          endIcon={submitting ? <LoopIcon className="ani-spin" /> : <SaveIcon />}
          variant="contained">
          {isEdit ? 'Lưu thay đổi' : 'Tạo lớp'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

ClassroomFormModal.propTypes = {
  open: PropTypes.bool,
  submitting: PropTypes.bool,
  initialData: PropTypes.object,
  onClose: PropTypes.func,
  onSubmit: PropTypes.func,
};

ClassroomFormModal.defaultProps = {
  open: false,
  submitting: false,
  initialData: null,
  onClose: function () {},
  onSubmit: function () {},
};

export default ClassroomFormModal;