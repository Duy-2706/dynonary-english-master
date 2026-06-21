import React, { useEffect, useMemo, useState } from 'react';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import Chip from '@material-ui/core/Chip';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';
import TextField from '@material-ui/core/TextField';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import Switch from '@material-ui/core/Switch';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import CircularProgress from '@material-ui/core/CircularProgress';
import { makeStyles } from '@material-ui/core/styles';

import AddIcon from '@material-ui/icons/Add';
import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';
import VisibilityIcon from '@material-ui/icons/Visibility';
import SchoolIcon from '@material-ui/icons/School';
import MenuBookIcon from '@material-ui/icons/MenuBook';
import PeopleIcon from '@material-ui/icons/People';
import MonetizationOnIcon from '@material-ui/icons/MonetizationOn';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import ErrorIcon from '@material-ui/icons/Error';
import CloseIcon from '@material-ui/icons/Close';
import NavigateBeforeIcon from '@material-ui/icons/NavigateBefore';
import NavigateNextIcon from '@material-ui/icons/NavigateNext';

import courseApi from 'apis/courseApi';
import TeacherCourseDetail from 'components/Course/TeacherCourseDetail';

const GF = '"Baloo 2","Nunito",sans-serif';

const LEVELS = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2', 'Tất cả'];

const STATUS_LABELS = {
  draft: 'Nháp',
  published: 'Đã xuất bản',
  archived: 'Lưu trữ',
};

const STATUS_TEXT = {
  draft: '#9b5c00',
  published: '#057a55',
  archived: '#5b4b8a',
};

const STATUS_BG = {
  draft: '#fff3cd',
  published: '#d4f5eb',
  archived: '#eee7ff',
};

const PAGE_SIZE = 8;

const useStyle = makeStyles(() => ({
  page: {
    minHeight: '100vh',
    background: `
      radial-gradient(circle at 12% 18%, rgba(25,199,168,.18) 0 4px, transparent 5px),
      radial-gradient(circle at 86% 24%, rgba(255,191,31,.13) 0 5px, transparent 6px),
      linear-gradient(180deg, #063c46 0%, #042b33 100%)
    `,
    backgroundSize: '90px 90px, 130px 130px, auto',
    padding: '30px 0 56px',
    fontFamily: GF,
  },

  embeddedPage: {
    height: 'calc(100vh - 112px)',
    minHeight: 620,
    background: 'transparent',
    padding: 0,
    fontFamily: GF,
    overflow: 'hidden',
  },

  wrapper: {
    maxWidth: 1320,
    margin: '0 auto',
    padding: '0 28px',
  },

  embeddedWrapper: {
    width: '100%',
    height: '100%',
    maxWidth: '100%',
    margin: 0,
    padding: 0,
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden',
  },

  hero: {
    background: 'linear-gradient(180deg,#ffffff 0%,#f2fffc 100%)',
    borderRadius: 24,
    border: '4px solid #d6f3ed',
    boxShadow:
      '0 7px 0 rgba(7,148,127,.14), 0 14px 28px rgba(15,23,42,.07)',
    padding: '22px 26px',
    marginBottom: 20,
    position: 'relative',
    overflow: 'hidden',
  },

  heroDecor: {
    position: 'absolute',
    right: 28,
    top: 18,
    color: '#07947f',
    opacity: 0.1,
    transform: 'rotate(-10deg)',
  },

  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 20,
    flexWrap: 'wrap',
    position: 'relative',
    zIndex: 2,
  },

  pageTitle: {
    fontSize: '1.9rem',
    fontWeight: 900,
    lineHeight: 1.12,
    margin: 0,
    color: '#06434b',
    letterSpacing: '-0.025em',
    display: 'flex',
    alignItems: 'center',
    gap: 10,
  },

  pageSubtitle: {
    color: '#07545c',
    margin: '8px 0 0',
    fontSize: '1rem',
    fontWeight: 800,
    lineHeight: 1.45,
    maxWidth: 760,
  },

  statRow: {
    display: 'flex',
    gap: 9,
    flexWrap: 'wrap',
    marginTop: 14,
  },

  statPill: {
    borderRadius: 999,
    padding: '6px 12px',
    fontWeight: 900,
    fontSize: '.9rem',
    border: '2.5px solid #a8e8db',
    background: '#d4f5eb',
    color: '#057a55',
    lineHeight: 1.2,
  },

  statPillYellow: {
    borderRadius: 999,
    padding: '6px 12px',
    fontWeight: 900,
    fontSize: '.9rem',
    border: '2.5px solid #ffe2a6',
    background: '#fff3cd',
    color: '#9b5c00',
    lineHeight: 1.2,
  },

  statPillPurple: {
    borderRadius: 999,
    padding: '6px 12px',
    fontWeight: 900,
    fontSize: '.9rem',
    border: '2.5px solid #dacdff',
    background: '#eee7ff',
    color: '#5b4b8a',
    lineHeight: 1.2,
  },

  createBtn: {
    background: 'linear-gradient(180deg,#ffdf3b,#ff8a00) !important',
    color: '#fff !important',
    border: '3px solid #fff !important',
    borderRadius: '999px !important',
    padding: '10px 18px !important',
    fontSize: '.96rem !important',
    fontWeight: '900 !important',
    fontFamily: `${GF} !important`,
    boxShadow: '0 5px 0 #bd5f00 !important',
    textTransform: 'none !important',
  },

  embeddedToolbar: {
    flexShrink: 0,
    background: '#fff',
    borderRadius: 22,
    border: '3px solid #d6f3ed',
    boxShadow: '0 6px 0 rgba(7,148,127,.10), 0 14px 28px rgba(15,23,42,.07)',
    padding: '16px 20px',
    marginBottom: 18,
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 14,
    flexWrap: 'wrap',
  },

  embeddedTitle: {
    margin: 0,
    color: '#06434b',
    fontWeight: 900,
    fontSize: '1.35rem',
    lineHeight: 1.2,
  },

  embeddedSub: {
    color: '#07545c',
    fontWeight: 750,
    fontSize: '.92rem',
    marginTop: 4,
    lineHeight: 1.35,
  },

  listArea: {
    flex: 1,
    minHeight: 0,
    overflowY: 'auto',
    paddingRight: 4,
  },

  loading: {
    minHeight: 360,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    color: '#07947f',
    background: '#fff',
    borderRadius: 22,
    border: '3px solid #d6f3ed',
  },

  empty: {
    background: '#fff',
    borderRadius: 24,
    padding: 42,
    textAlign: 'center',
    border: '3px dashed #19c7a8',
    boxShadow:
      '0 7px 0 rgba(7,148,127,.12), 0 14px 28px rgba(15,23,42,.07)',
    color: '#06434b',
    fontSize: '1rem',
    fontWeight: 850,
  },

  courseCard: {
    height: '100%',
    minHeight: 318,
    display: 'flex',
    flexDirection: 'column',
    borderRadius: '22px !important',
    border: '3px solid #19c7a8',
    boxShadow: '0 6px 0 #07947f, 0 12px 24px rgba(15,23,42,.09)',
    overflow: 'hidden',
    background: '#fff',
    transition: 'transform .18s ease, box-shadow .18s ease',
    cursor: 'pointer',
    '&:hover': {
      transform: 'translateY(-3px)',
      boxShadow: '0 8px 0 #07947f, 0 18px 32px rgba(15,23,42,.13)',
    },
  },

  cardTop: {
    minHeight: 70,
    background: 'linear-gradient(135deg,#19c7a8,#087565)',
    padding: '14px 16px',
    color: '#fff',
    position: 'relative',
    overflow: 'hidden',
  },

  cardIcon: {
    position: 'absolute',
    right: 18,
    top: 12,
    color: '#fff',
    opacity: 0.16,
    transform: 'rotate(-12deg)',
  },

  statusChip: {
    height: 'auto !important',
    borderRadius: '999px !important',
    border: '2.5px solid #fff !important',
    fontFamily: `${GF} !important`,
    fontWeight: '900 !important',
    fontSize: '.78rem !important',
    padding: '4px 3px !important',
    boxShadow: '0 4px 0 rgba(0,0,0,.12)',
  },

  cardContent: {
    flex: 1,
    padding: '18px !important',
  },

  courseTitle: {
    fontWeight: 900,
    fontSize: '1.22rem',
    margin: '0 0 11px',
    lineHeight: 1.18,
    color: '#06434b',
    letterSpacing: '-0.01em',
  },

  courseMeta: {
    color: '#07545c',
    fontSize: '.92rem',
    margin: '0 0 7px',
    fontWeight: 800,
    lineHeight: 1.35,
    display: 'flex',
    alignItems: 'center',
    gap: 6,
  },

  description: {
    fontSize: '.9rem',
    color: '#24474c',
    margin: '12px 0 0',
    lineHeight: 1.45,
    fontWeight: 700,
  },

  price: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: 5,
    marginTop: 9,
    background: 'linear-gradient(180deg,#ffdf3b,#ff8a00)',
    color: '#fff',
    borderRadius: 999,
    padding: '6px 12px',
    fontSize: '.9rem',
    fontWeight: 900,
    border: '2.5px solid #fff',
    boxShadow: '0 4px 0 #bd5f00',
  },

  freePrice: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: 5,
    marginTop: 9,
    background: 'linear-gradient(180deg,#36e27d,#0ca84f)',
    color: '#fff',
    borderRadius: 999,
    padding: '6px 12px',
    fontSize: '.9rem',
    fontWeight: 900,
    border: '2.5px solid #fff',
    boxShadow: '0 4px 0 #087a3c',
  },

  cardActions: {
    padding: '0 16px 18px !important',
    gap: 8,
    flexWrap: 'wrap',
  },

  actionBtn: {
    borderRadius: '999px !important',
    fontFamily: `${GF} !important`,
    fontWeight: '900 !important',
    fontSize: '.86rem !important',
    textTransform: 'none !important',
    padding: '7px 11px !important',
  },

  manageBtn: {
    background: 'linear-gradient(180deg,#19c7a8,#07947f) !important',
    color: '#fff !important',
    border: '2.5px solid #fff !important',
    boxShadow: '0 4px 0 #087565 !important',
  },

  editBtn: {
    background: 'linear-gradient(180deg,#ffffff,#eefdf9) !important',
    color: '#056d5e !important',
    border: '2.5px solid #19c7a8 !important',
    boxShadow: '0 4px 0 rgba(7,148,127,.16) !important',
  },

  deleteBtn: {
    background: '#fff1f1 !important',
    color: '#e53935 !important',
    border: '2.5px solid #ffb7b7 !important',
    boxShadow: '0 4px 0 rgba(141,22,22,.12) !important',
  },

  pagination: {
    flexShrink: 0,
    marginTop: 16,
    padding: '12px 16px',
    background: '#fff',
    borderRadius: 18,
    border: '3px solid #d6f3ed',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 12,
    flexWrap: 'wrap',
    boxShadow: '0 5px 0 rgba(7,148,127,.10)',
  },

  pageText: {
    color: '#07545c',
    fontWeight: 850,
    fontSize: '.92rem',
  },

  pageBtns: {
    display: 'flex',
    gap: 8,
    alignItems: 'center',
  },

  pageBtn: {
    minWidth: '38px !important',
    width: '38px !important',
    height: '38px !important',
    borderRadius: '12px !important',
    border: '2.5px solid #19c7a8 !important',
    background: '#eefdf9 !important',
    color: '#056d5e !important',
    boxShadow: '0 3px 0 rgba(7,148,127,.16) !important',
  },

  dialogPaper: {
    borderRadius: '24px !important',
    border: '4px solid #19c7a8',
    boxShadow: '0 8px 0 #07947f, 0 18px 42px rgba(0,0,0,.20)',
    overflow: 'hidden',
    fontFamily: GF,
  },

  dialogTitle: {
    background: 'linear-gradient(180deg,#19c7a8,#07947f)',
    color: '#fff',
    fontFamily: GF,
    '& h2': {
      fontSize: '1.35rem',
      fontWeight: 900,
    },
  },

  dialogContent: {
    padding: '24px !important',
    background: '#f3fffc',
  },

  dialogActions: {
    padding: '16px 24px 22px !important',
    background: '#f3fffc',
  },

  formField: {
    marginBottom: '16px !important',
    width: '100%',
    '& label': {
      fontFamily: GF,
      fontSize: '.98rem',
      fontWeight: 850,
      color: '#06434b',
    },
    '& input, & textarea': {
      fontFamily: GF,
      fontSize: '1rem',
      fontWeight: 750,
      color: '#06434b',
      lineHeight: 1.45,
    },
    '& .MuiOutlinedInput-root': {
      borderRadius: 14,
      background: '#fff',
      '& fieldset': {
        borderWidth: 2.5,
        borderColor: '#d6f3ed',
      },
      '&:hover fieldset': {
        borderColor: '#19c7a8',
      },
      '&.Mui-focused fieldset': {
        borderColor: '#19c7a8',
      },
    },
  },

  formControl: {
    marginBottom: '16px !important',
    width: '100%',
    '& label': {
      fontFamily: GF,
      fontSize: '.98rem',
      fontWeight: 850,
      color: '#06434b',
    },
    '& .MuiSelect-root': {
      fontFamily: GF,
      fontSize: '1rem',
      fontWeight: 750,
      color: '#06434b',
    },
    '& .MuiOutlinedInput-root': {
      borderRadius: 14,
      background: '#fff',
      '& fieldset': {
        borderWidth: 2.5,
        borderColor: '#d6f3ed',
      },
      '&:hover fieldset': {
        borderColor: '#19c7a8',
      },
      '&.Mui-focused fieldset': {
        borderColor: '#19c7a8',
      },
    },
  },

  switchLabel: {
    '& .MuiFormControlLabel-label': {
      fontFamily: GF,
      fontSize: '1rem',
      fontWeight: 850,
      color: '#06434b',
    },
  },

  cancelDialogBtn: {
    background: 'linear-gradient(180deg,#ffffff,#eefdf9) !important',
    color: '#056d5e !important',
    border: '2.5px solid #19c7a8 !important',
    borderRadius: '999px !important',
    fontFamily: `${GF} !important`,
    fontWeight: '900 !important',
    fontSize: '.92rem !important',
    padding: '8px 18px !important',
    textTransform: 'none !important',
  },

  saveDialogBtn: {
    background: 'linear-gradient(180deg,#ffdf3b,#ff8a00) !important',
    color: '#fff !important',
    border: '2.5px solid #fff !important',
    borderRadius: '999px !important',
    fontFamily: `${GF} !important`,
    fontWeight: '900 !important',
    fontSize: '.92rem !important',
    padding: '8px 20px !important',
    textTransform: 'none !important',
    boxShadow: '0 5px 0 #bd5f00 !important',
  },
}));

function TeacherToast({ toast, onClose }) {
  if (!toast?.show) return null;

  const ok = toast.type === 'success' || toast.type === 'delete';

  return (
    <div
      style={{
        position: 'fixed',
        top: 92,
        right: 28,
        zIndex: 9999,
        minWidth: 320,
        maxWidth: 430,
        borderRadius: 20,
        padding: '13px 16px',
        display: 'flex',
        alignItems: 'center',
        gap: 12,
        background: ok
          ? 'linear-gradient(135deg,#ecfdf5,#ffffff)'
          : 'linear-gradient(135deg,#fff1f2,#ffffff)',
        border: ok ? '3px solid #19c7a8' : '3px solid #ff8a8a',
        boxShadow: '0 16px 36px rgba(15,23,42,.15)',
        fontFamily: GF,
      }}
    >
      <div
        style={{
          width: 38,
          height: 38,
          borderRadius: 13,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: ok ? '#d4f5eb' : '#ffe4e6',
          color: ok ? '#07947f' : '#e53935',
          flexShrink: 0,
        }}
      >
        {ok ? <CheckCircleIcon /> : <ErrorIcon />}
      </div>

      <div style={{ flex: 1 }}>
        <div
          style={{
            color: ok ? '#06434b' : '#7f1d1d',
            fontSize: '.98rem',
            fontWeight: 900,
            lineHeight: 1.25,
          }}
        >
          {toast.title}
        </div>

        <div
          style={{
            color: '#64748b',
            fontSize: '.88rem',
            fontWeight: 750,
            lineHeight: 1.35,
            marginTop: 2,
          }}
        >
          {toast.message}
        </div>
      </div>

      <button
        type="button"
        onClick={onClose}
        style={{
          width: 30,
          height: 30,
          border: 0,
          borderRadius: 999,
          background: '#f8fafc',
          color: '#64748b',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
        }}
      >
        <CloseIcon style={{ fontSize: 17 }} />
      </button>
    </div>
  );
}

function formatPrice(course) {
  if (course.isFree) return 'Miễn phí';

  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
  }).format(course.price || 0);
}

function CourseFormDialog({ open, onClose, onSubmit, initialData }) {
  const classes = useStyle();

  const [form, setForm] = useState({
    title: '',
    description: '',
    level: 'A1',
    price: 0,
    isFree: true,
    status: 'draft',
  });

  useEffect(() => {
    if (initialData) {
      setForm({
        title: initialData.title || '',
        description: initialData.description || '',
        level: initialData.level || 'A1',
        price: Number(initialData.price || 0),
        isFree: initialData.isFree !== false,
        status: initialData.status || 'draft',
      });
    } else {
      setForm({
        title: '',
        description: '',
        level: 'A1',
        price: 0,
        isFree: true,
        status: 'draft',
      });
    }
  }, [initialData, open]);

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      classes={{ paper: classes.dialogPaper }}
    >
      <DialogTitle className={classes.dialogTitle}>
        {initialData ? 'Sửa khóa học' : 'Tạo khóa học mới'}
      </DialogTitle>

      <DialogContent className={classes.dialogContent}>
        <TextField
          className={classes.formField}
          label="Tên khóa học *"
          value={form.title}
          onChange={(event) =>
            setForm({
              ...form,
              title: event.target.value,
            })
          }
          variant="outlined"
        />

        <TextField
          className={classes.formField}
          label="Mô tả"
          value={form.description}
          onChange={(event) =>
            setForm({
              ...form,
              description: event.target.value,
            })
          }
          variant="outlined"
          multiline
          rows={4}
        />

        <FormControl variant="outlined" className={classes.formControl}>
          <InputLabel>Cấp độ</InputLabel>

          <Select
            value={form.level}
            onChange={(event) =>
              setForm({
                ...form,
                level: event.target.value,
              })
            }
            label="Cấp độ"
          >
            {LEVELS.map((level) => (
              <MenuItem key={level} value={level}>
                {level}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl variant="outlined" className={classes.formControl}>
          <InputLabel>Trạng thái</InputLabel>

          <Select
            value={form.status}
            onChange={(event) =>
              setForm({
                ...form,
                status: event.target.value,
              })
            }
            label="Trạng thái"
          >
            <MenuItem value="draft">Nháp</MenuItem>
            <MenuItem value="published">Xuất bản</MenuItem>
            <MenuItem value="archived">Lưu trữ</MenuItem>
          </Select>
        </FormControl>

        <FormControlLabel
          className={classes.switchLabel}
          control={
            <Switch
              checked={form.isFree}
              onChange={(event) =>
                setForm({
                  ...form,
                  isFree: event.target.checked,
                })
              }
              color="primary"
            />
          }
          label="Miễn phí"
        />

        {!form.isFree && (
          <TextField
            className={classes.formField}
            label="Học phí (VNĐ)"
            type="number"
            helperText="Tối thiểu 2.000 VNĐ."
            value={form.price}
            onChange={(event) =>
              setForm({
                ...form,
                price: Number(event.target.value),
              })
            }
            variant="outlined"
            inputProps={{ min: 2000, step: 1000 }}
          />
        )}
      </DialogContent>

      <DialogActions className={classes.dialogActions}>
        <Button onClick={onClose} className={classes.cancelDialogBtn}>
          Hủy
        </Button>

        <Button
          onClick={() => onSubmit(form)}
          className={classes.saveDialogBtn}
          variant="contained"
          disabled={!form.title.trim()}
        >
          {initialData ? 'Lưu thay đổi' : 'Tạo khóa học'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

function TeacherCourses({ embedded = false }) {
  const classes = useStyle();

  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openForm, setOpenForm] = useState(false);
  const [editingCourse, setEditingCourse] = useState(null);
  const [managingCourseId, setManagingCourseId] = useState('');
  const [page, setPage] = useState(1);

  const [toast, setToast] = useState({
    show: false,
    type: 'success',
    title: '',
    message: '',
  });

  const showToast = (type, title, message) => {
    setToast({
      show: true,
      type,
      title,
      message,
    });

    setTimeout(() => {
      setToast((prev) => ({
        ...prev,
        show: false,
      }));
    }, 2600);
  };

  const loadCourses = async () => {
    setLoading(true);

    try {
      const res = await courseApi.getTeacherCourses();

      if (res.status === 200) {
        setCourses(res.data.courses || []);
      }
    } catch {
      showToast(
        'error',
        'Không tải được dữ liệu',
        'Danh sách khóa học chưa được tải. Vui lòng thử lại.',
      );
    }

    setLoading(false);
  };

  useEffect(() => {
    loadCourses();
  }, []);

  useEffect(() => {
    setPage(1);
  }, [courses.length]);

  const handleSubmit = async (formData) => {
    try {
      if (editingCourse) {
        await courseApi.updateCourse(
          editingCourse._id || editingCourse.id,
          formData,
        );

        showToast(
          'success',
          'Cập nhật thành công',
          'Thông tin khóa học đã được lưu lại.',
        );
      } else {
        await courseApi.createCourse(formData);

        showToast(
          'success',
          'Tạo khóa học thành công',
          'Khóa học mới đã được thêm vào hệ thống.',
        );
      }

      setOpenForm(false);
      setEditingCourse(null);
      loadCourses();
    } catch {
      showToast(
        'error',
        'Không thể lưu khóa học',
        'Có lỗi xảy ra trong quá trình xử lý.',
      );
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Bạn có chắc muốn xóa khóa học này?')) return;

    try {
      await courseApi.deleteCourse(id);

      showToast(
        'delete',
        'Đã xóa khóa học',
        'Khóa học đã được xóa khỏi danh sách quản lý.',
      );

      loadCourses();
    } catch {
      showToast(
        'error',
        'Không thể xóa khóa học',
        'Vui lòng kiểm tra lại hoặc thử lại sau.',
      );
    }
  };

  const publishedCount = courses.filter(
  (course) => course.status === 'published',
).length;

const draftCount = courses.filter(
  (course) => course.status === 'draft',
).length;

const totalPages = Math.max(1, Math.ceil(courses.length / PAGE_SIZE));

const pageCourses = useMemo(() => {
  const start = (page - 1) * PAGE_SIZE;
  return courses.slice(start, start + PAGE_SIZE);
}, [courses, page]);

if (managingCourseId) {
  return (
    <TeacherCourseDetail
      embedded
      courseId={managingCourseId}
      onBack={() => setManagingCourseId('')}
    />
  );
}

  return (
    <div className={embedded ? classes.embeddedPage : classes.page}>
      <div className={embedded ? classes.embeddedWrapper : classes.wrapper}>
        <TeacherToast
          toast={toast}
          onClose={() =>
            setToast((prev) => ({
              ...prev,
              show: false,
            }))
          }
        />

        {!embedded && (
          <div className={classes.hero}>
            <div className={classes.heroDecor}>
              <SchoolIcon style={{ fontSize: 72 }} />
            </div>

            <div className={classes.header}>
              <div>
                <h1 className={classes.pageTitle}>
                  <SchoolIcon style={{ fontSize: 31, color: '#07947f' }} />
                  Quản lý khóa học
                </h1>

                <p className={classes.pageSubtitle}>
                  Tạo chương, bài học, bài tập và theo dõi khóa học của giáo viên.
                </p>

                <div className={classes.statRow}>
                  <span className={classes.statPill}>
                    {publishedCount} xuất bản
                  </span>

                  <span className={classes.statPillYellow}>
                    {draftCount} bản nháp
                  </span>

                  <span className={classes.statPillPurple}>
                    {courses.length} khóa học
                  </span>
                </div>
              </div>

              <Button
                variant="contained"
                className={classes.createBtn}
                startIcon={<AddIcon />}
                onClick={() => {
                  setEditingCourse(null);
                  setOpenForm(true);
                }}
              >
                Tạo khóa học mới
              </Button>
            </div>
          </div>
        )}

        {embedded && (
          <div className={classes.embeddedToolbar}>
            <div>
              <h2 className={classes.embeddedTitle}>Danh sách khóa học</h2>

              <div className={classes.embeddedSub}>
                {publishedCount} xuất bản · {draftCount} bản nháp ·{' '}
                {courses.length} khóa học
              </div>
            </div>

            <Button
              variant="contained"
              className={classes.createBtn}
              startIcon={<AddIcon />}
              onClick={() => {
                setEditingCourse(null);
                setOpenForm(true);
              }}
            >
              Tạo khóa học mới
            </Button>
          </div>
        )}

        <div className={embedded ? classes.listArea : undefined}>
          {loading ? (
            <div className={classes.loading}>
              <CircularProgress
                style={{ color: '#07947f' }}
                size={48}
                thickness={5}
              />
            </div>
          ) : courses.length === 0 ? (
            <div className={classes.empty}>
              <SchoolIcon style={{ fontSize: 58, marginBottom: 10 }} />

              <p style={{ margin: 0 }}>Bạn chưa có khóa học nào.</p>

              <p
                style={{
                  margin: '8px 0 0',
                  color: '#087565',
                  fontSize: '.95rem',
                }}
              >
                Hãy tạo khóa học đầu tiên để bắt đầu.
              </p>
            </div>
          ) : (
            <Grid container spacing={3}>
              {pageCourses.map((course) => (
                <Grid item xs={12} sm={6} md={3} key={course._id || course.id}>
                  <Card
                    className={classes.courseCard}
                    onClick={() => {
                      const id = course._id || course.id;

                      if (!id) {
                        showToast(
                          'error',
                          'Không tìm thấy mã khóa học',
                          'Dữ liệu khóa học chưa có id hợp lệ. Vui lòng tải lại trang.',
                        );
                        return;
                      }

                      setManagingCourseId(id);
                    }}
                  >
                    <div className={classes.cardTop}>
                      <div className={classes.cardIcon}>
                        <SchoolIcon style={{ fontSize: 64 }} />
                      </div>

                      <Chip
                        className={classes.statusChip}
                        size="small"
                        label={STATUS_LABELS[course.status] || course.status}
                        style={{
                          backgroundColor:
                            STATUS_BG[course.status] || '#eefdf9',
                          color: STATUS_TEXT[course.status] || '#06434b',
                        }}
                      />
                    </div>

                    <CardContent className={classes.cardContent}>
                      <h3 className={classes.courseTitle}>{course.title}</h3>

                      <p className={classes.courseMeta}>
                        <MenuBookIcon style={{ fontSize: 17 }} />
                        {course.totalLessons || 0} bài học
                      </p>

                      <p className={classes.courseMeta}>
                        <PeopleIcon style={{ fontSize: 17 }} />
                        {course.totalStudents || 0} học viên
                      </p>

                      <p className={classes.courseMeta}>
                        <SchoolIcon style={{ fontSize: 17 }} />
                        Cấp độ: {course.level || 'Chưa chọn'}
                      </p>

                      <span
                        className={course.isFree ? classes.freePrice : classes.price}
                      >
                        <MonetizationOnIcon style={{ fontSize: 17 }} />
                        {formatPrice(course)}
                      </span>

                      <p className={classes.description}>
                        {course.description
                          ? `${course.description.slice(0, 105)}${
                              course.description.length > 105 ? '...' : ''
                            }`
                          : 'Chưa có mô tả cho khóa học này.'}
                      </p>
                    </CardContent>

                    <CardActions
                      className={classes.cardActions}
                      onClick={(event) => event.stopPropagation()}
                    >
                      <Button
                        size="small"
                        startIcon={<VisibilityIcon />}
                        className={`${classes.actionBtn} ${classes.manageBtn}`}
                        onClick={() => {
                          const id = course._id || course.id;

                          if (!id) {
                            showToast(
                              'error',
                              'Không tìm thấy mã khóa học',
                              'Dữ liệu khóa học chưa có id hợp lệ. Vui lòng tải lại trang.',
                            );
                            return;
                          }

                          setManagingCourseId(id);
                        }}
                      >
                        Quản lý
                      </Button>

                      <Button
                        size="small"
                        startIcon={<EditIcon />}
                        className={`${classes.actionBtn} ${classes.editBtn}`}
                        onClick={() => {
                          setEditingCourse(course);
                          setOpenForm(true);
                        }}
                      >
                        Sửa
                      </Button>

                      <Button
                        size="small"
                        startIcon={<DeleteIcon />}
                        className={`${classes.actionBtn} ${classes.deleteBtn}`}
                        onClick={() => handleDelete(course._id || course.id)}
                      >
                        Xóa
                      </Button>
                    </CardActions>
                  </Card>
                </Grid>
              ))}
            </Grid>
          )}
        </div>

        {!loading && courses.length > PAGE_SIZE && (
          <div className={classes.pagination}>
            <div className={classes.pageText}>
              Trang {page}/{totalPages} · Hiển thị {pageCourses.length}/
              {courses.length} khóa học
            </div>

            <div className={classes.pageBtns}>
              <Button
                className={classes.pageBtn}
                disabled={page <= 1}
                onClick={() => setPage((prev) => Math.max(1, prev - 1))}
              >
                <NavigateBeforeIcon />
              </Button>

              <Button
                className={classes.pageBtn}
                disabled={page >= totalPages}
                onClick={() =>
                  setPage((prev) => Math.min(totalPages, prev + 1))
                }
              >
                <NavigateNextIcon />
              </Button>
            </div>
          </div>
        )}

        <CourseFormDialog
          open={openForm}
          onClose={() => {
            setOpenForm(false);
            setEditingCourse(null);
          }}
          onSubmit={handleSubmit}
          initialData={editingCourse}
        />
      </div>
    </div>
  );
}

export default TeacherCourses;