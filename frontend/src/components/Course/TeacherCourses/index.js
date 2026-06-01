import React, { useEffect, useState } from 'react';
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
import AddIcon from '@material-ui/icons/Add';
import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';
import VisibilityIcon from '@material-ui/icons/Visibility';
import CircularProgress from '@material-ui/core/CircularProgress';
import { makeStyles } from '@material-ui/core/styles';
import { useHistory } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setMessage } from 'redux/slices/message.slice';
import courseApi from 'apis/courseApi';

const GAME_FONT = '"Baloo 2", "Nunito", sans-serif';

const LEVELS = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2', 'Tất cả'];

const STATUS_LABELS = {
  draft: '📝 Nháp',
  published: '✅ Đã xuất bản',
  archived: '📦 Lưu trữ',
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

const useStyle = makeStyles(() => ({
  page: {
    minHeight: '100vh',
    background: `
      radial-gradient(circle at 12% 18%, rgba(25,199,168,.22) 0 4px, transparent 5px),
      radial-gradient(circle at 86% 24%, rgba(255,191,31,.16) 0 5px, transparent 6px),
      radial-gradient(circle at 34% 74%, rgba(255,255,255,.10) 0 3px, transparent 4px),
      linear-gradient(180deg, #063c46 0%, #042b33 100%)
    `,
    backgroundSize: '90px 90px, 130px 130px, 110px 110px, auto',
    padding: '42px 0 80px',
    fontFamily: GAME_FONT,
  },

  wrapper: {
    maxWidth: 1380,
    margin: '0 auto',
    padding: '0 34px',
  },

  hero: {
    background: 'linear-gradient(180deg,#ffffff 0%,#eefdf9 100%)',
    borderRadius: 38,
    border: '7px solid rgba(255,255,255,.96)',
    boxShadow: '0 12px 0 rgba(7,148,127,.55), 0 24px 48px rgba(0,0,0,.22)',
    padding: '42px 46px',
    marginBottom: 42,
    position: 'relative',
    overflow: 'hidden',
  },

  heroDecor: {
    position: 'absolute',
    right: 42,
    top: 26,
    fontSize: '5.4rem',
    opacity: 0.15,
    transform: 'rotate(-10deg)',
  },

  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 24,
    flexWrap: 'wrap',
    position: 'relative',
    zIndex: 2,
  },

  pageTitle: {
    fontSize: 'clamp(3rem, 5vw, 5rem)',
    fontWeight: 900,
    lineHeight: 0.95,
    margin: 0,
    color: '#06434b',
    letterSpacing: '.2px',
    textShadow: '0 4px 0 rgba(25,199,168,.18)',
  },

  pageSubtitle: {
    color: '#07685d',
    margin: '16px 0 0',
    fontSize: '1.35rem',
    fontWeight: 900,
    lineHeight: 1.45,
  },

  createBtn: {
    background: 'linear-gradient(180deg,#ffdf3b,#ff8a00) !important',
    color: '#fff !important',
    border: '4px solid #fff !important',
    borderRadius: '999px !important',
    padding: '15px 28px !important',
    fontSize: '1.18rem !important',
    fontWeight: '900 !important',
    fontFamily: `${GAME_FONT} !important`,
    boxShadow: '0 8px 0 #bd5f00 !important',
    textTransform: 'none !important',
    textShadow: '0 2px 0 rgba(0,0,0,.18)',
  },

  loading: {
    display: 'flex',
    justifyContent: 'center',
    padding: 80,
    color: '#fff',
  },

  empty: {
    background: '#fff',
    borderRadius: 34,
    padding: 70,
    textAlign: 'center',
    border: '6px dashed #19c7a8',
    boxShadow: '0 10px 0 rgba(7,148,127,.35), 0 22px 45px rgba(0,0,0,.18)',
    color: '#06434b',
    fontSize: '1.35rem',
    fontWeight: 900,
  },

  courseCard: {
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    borderRadius: '34px !important',
    border: '6px solid #19c7a8',
    boxShadow: '0 10px 0 #07947f, 0 22px 40px rgba(0,0,0,.24)',
    overflow: 'hidden',
    background: '#fff',
    transition: 'transform .22s cubic-bezier(.34,1.56,.64,1), box-shadow .22s ease',
    cursor: 'pointer',
    '&:hover': {
      transform: 'translateY(-7px) scale(1.015)',
      boxShadow: '0 13px 0 #07947f, 0 28px 52px rgba(0,0,0,.28)',
    },
  },

  cardTop: {
    minHeight: 110,
    background: `
      radial-gradient(circle at 18% 22%, rgba(255,255,255,.30), transparent 18%),
      linear-gradient(135deg,#19c7a8,#087565)
    `,
    padding: '22px 24px',
    color: '#fff',
    position: 'relative',
    overflow: 'hidden',
  },

  cardIcon: {
    position: 'absolute',
    right: 22,
    top: 18,
    fontSize: '4.4rem',
    opacity: 0.18,
    transform: 'rotate(-12deg)',
  },

  statusChip: {
    height: 'auto !important',
    borderRadius: '999px !important',
    border: '3px solid #fff !important',
    fontFamily: `${GAME_FONT} !important`,
    fontWeight: '900 !important',
    fontSize: '1rem !important',
    padding: '6px 4px !important',
    boxShadow: '0 5px 0 rgba(0,0,0,.14)',
  },

  cardContent: {
    flex: 1,
    padding: '24px !important',
  },

  courseTitle: {
    fontWeight: 900,
    fontSize: '1.75rem',
    margin: '0 0 14px',
    lineHeight: 1.15,
    color: '#06434b',
  },

  courseMeta: {
    color: '#07545c',
    fontSize: '1.16rem',
    marginBottom: 9,
    fontWeight: 900,
    lineHeight: 1.45,
  },

  description: {
    fontSize: '1.08rem',
    color: '#24474c',
    marginTop: 14,
    lineHeight: 1.55,
    fontWeight: 800,
  },

  price: {
    display: 'inline-block',
    marginTop: 10,
    background: 'linear-gradient(180deg,#ffdf3b,#ff8a00)',
    color: '#fff',
    borderRadius: 999,
    padding: '8px 16px',
    fontSize: '1.1rem',
    fontWeight: 900,
    border: '3px solid #fff',
    boxShadow: '0 5px 0 #bd5f00',
  },

  freePrice: {
    display: 'inline-block',
    marginTop: 10,
    background: 'linear-gradient(180deg,#36e27d,#0ca84f)',
    color: '#fff',
    borderRadius: 999,
    padding: '8px 16px',
    fontSize: '1.1rem',
    fontWeight: 900,
    border: '3px solid #fff',
    boxShadow: '0 5px 0 #087a3c',
  },

  cardActions: {
    padding: '0 20px 22px !important',
    gap: 10,
    flexWrap: 'wrap',
  },

  actionBtn: {
    borderRadius: '999px !important',
    fontFamily: `${GAME_FONT} !important`,
    fontWeight: '900 !important',
    fontSize: '1rem !important',
    textTransform: 'none !important',
    padding: '8px 14px !important',
  },

  manageBtn: {
    background: 'linear-gradient(180deg,#19c7a8,#07947f) !important',
    color: '#fff !important',
    border: '3px solid #fff !important',
    boxShadow: '0 5px 0 #087565 !important',
  },

  editBtn: {
    background: 'linear-gradient(180deg,#ffffff,#eefdf9) !important',
    color: '#056d5e !important',
    border: '3px solid #19c7a8 !important',
    boxShadow: '0 5px 0 rgba(7,148,127,.18) !important',
  },

  deleteBtn: {
    background: 'linear-gradient(180deg,#ff8a8a,#e53935) !important',
    color: '#fff !important',
    border: '3px solid #fff !important',
    boxShadow: '0 5px 0 rgba(141,22,22,.28) !important',
  },

  dialogPaper: {
    borderRadius: '34px !important',
    border: '6px solid #19c7a8',
    boxShadow: '0 14px 0 #07947f, 0 28px 60px rgba(0,0,0,.28)',
    overflow: 'hidden',
    fontFamily: GAME_FONT,
  },

  dialogTitle: {
    background: 'linear-gradient(180deg,#19c7a8,#07947f)',
    color: '#fff',
    fontFamily: GAME_FONT,
    '& h2': {
      fontSize: '2rem',
      fontWeight: 900,
      textShadow: '0 3px 0 rgba(0,0,0,.18)',
    },
  },

  dialogContent: {
    padding: '30px !important',
    background: '#f3fffc',
  },

  formField: {
    marginBottom: '22px !important',
    width: '100%',
    '& label': {
      fontFamily: GAME_FONT,
      fontSize: '1.12rem',
      fontWeight: 900,
      color: '#06434b',
    },
    '& input': {
      fontFamily: GAME_FONT,
      fontSize: '1.15rem',
      fontWeight: 800,
      color: '#06434b',
    },
    '& textarea': {
      fontFamily: GAME_FONT,
      fontSize: '1.15rem',
      fontWeight: 800,
      color: '#06434b',
      lineHeight: 1.55,
    },
    '& .MuiOutlinedInput-root': {
      borderRadius: 20,
      background: '#fff',
      boxShadow: '0 5px 0 rgba(7,148,127,.10)',
      '& fieldset': {
        borderWidth: 3,
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
    marginBottom: '22px !important',
    width: '100%',
    '& label': {
      fontFamily: GAME_FONT,
      fontSize: '1.12rem',
      fontWeight: 900,
      color: '#06434b',
    },
    '& .MuiSelect-root': {
      fontFamily: GAME_FONT,
      fontSize: '1.15rem',
      fontWeight: 800,
      color: '#06434b',
    },
    '& .MuiOutlinedInput-root': {
      borderRadius: 20,
      background: '#fff',
      boxShadow: '0 5px 0 rgba(7,148,127,.10)',
      '& fieldset': {
        borderWidth: 3,
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
      fontFamily: GAME_FONT,
      fontSize: '1.15rem',
      fontWeight: 900,
      color: '#06434b',
    },
  },

  dialogActions: {
    padding: '20px 30px 28px !important',
    background: '#f3fffc',
  },

  cancelDialogBtn: {
    background: 'linear-gradient(180deg,#ffffff,#eefdf9) !important',
    color: '#056d5e !important',
    border: '3px solid #19c7a8 !important',
    borderRadius: '999px !important',
    fontFamily: `${GAME_FONT} !important`,
    fontWeight: '900 !important',
    fontSize: '1.08rem !important',
    padding: '10px 22px !important',
    textTransform: 'none !important',
  },

  saveDialogBtn: {
    background: 'linear-gradient(180deg,#ffdf3b,#ff8a00) !important',
    color: '#fff !important',
    border: '3px solid #fff !important',
    borderRadius: '999px !important',
    fontFamily: `${GAME_FONT} !important`,
    fontWeight: '900 !important',
    fontSize: '1.08rem !important',
    padding: '10px 24px !important',
    textTransform: 'none !important',
    boxShadow: '0 6px 0 #bd5f00 !important',
  },
}));

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
        {initialData ? '✏️ Sửa khóa học' : '➕ Tạo khóa học mới'}
      </DialogTitle>

      <DialogContent className={classes.dialogContent}>
        <TextField
          className={classes.formField}
          label="Tên khóa học *"
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
          variant="outlined"
        />

        <TextField
          className={classes.formField}
          label="Mô tả"
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
          variant="outlined"
          multiline
          rows={4}
        />

        <FormControl variant="outlined" className={classes.formControl}>
          <InputLabel>Cấp độ</InputLabel>
          <Select
            value={form.level}
            onChange={(e) => setForm({ ...form, level: e.target.value })}
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
            onChange={(e) => setForm({ ...form, status: e.target.value })}
            label="Trạng thái"
          >
            <MenuItem value="draft">📝 Nháp</MenuItem>
            <MenuItem value="published">✅ Xuất bản</MenuItem>
            <MenuItem value="archived">📦 Lưu trữ</MenuItem>
          </Select>
        </FormControl>

        <FormControlLabel
          className={classes.switchLabel}
          control={
            <Switch
              checked={form.isFree}
              onChange={(e) => setForm({ ...form, isFree: e.target.checked })}
              color="primary"
            />
          }
          label="Miễn phí"
        />

        {!form.isFree && (
          <TextField
            className={classes.formField}
            label="Giá (VND)"
            type="number"
            value={form.price}
            onChange={(e) => setForm({ ...form, price: Number(e.target.value) })}
            variant="outlined"
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

function TeacherCourses() {
  const classes = useStyle();
  const history = useHistory();
  const dispatch = useDispatch();

  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openForm, setOpenForm] = useState(false);
  const [editingCourse, setEditingCourse] = useState(null);

  const loadCourses = async () => {
    setLoading(true);

    try {
      const res = await courseApi.getTeacherCourses();

      if (res.status === 200) {
        setCourses(res.data.courses || []);
      }
    } catch (e) {
      dispatch(setMessage({ type: 'error', message: 'Không tải được danh sách khóa học!' }));
    }

    setLoading(false);
  };

  useEffect(() => {
    loadCourses();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSubmit = async (formData) => {
    try {
      if (editingCourse) {
        await courseApi.updateCourse(editingCourse._id, formData);
        dispatch(setMessage({ type: 'success', message: 'Cập nhật khóa học thành công!' }));
      } else {
        await courseApi.createCourse(formData);
        dispatch(setMessage({ type: 'success', message: 'Tạo khóa học thành công!' }));
      }

      setOpenForm(false);
      setEditingCourse(null);
      loadCourses();
    } catch (e) {
      dispatch(setMessage({ type: 'error', message: 'Có lỗi xảy ra!' }));
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Bạn có chắc muốn xóa khóa học này?')) return;

    try {
      await courseApi.deleteCourse(id);
      dispatch(setMessage({ type: 'success', message: 'Xóa khóa học thành công!' }));
      loadCourses();
    } catch (e) {
      dispatch(setMessage({ type: 'error', message: 'Lỗi xóa khóa học!' }));
    }
  };

  const publishedCount = courses.filter((course) => course.status === 'published').length;
  const draftCount = courses.filter((course) => course.status === 'draft').length;

  return (
    <div className={classes.page}>
      <div className={classes.wrapper}>
        <div className={classes.hero}>
          <div className={classes.heroDecor}>📚</div>

          <div className={classes.header}>
            <div>
              <h1 className={classes.pageTitle}>Quản Lý Khóa Học</h1>
              <p className={classes.pageSubtitle}>
                Tạo chương, bài học, bài tập và theo dõi khóa học của giáo viên.
              </p>

              <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginTop: 18 }}>
                <span
                  style={{
                    background: '#d4f5eb',
                    color: '#057a55',
                    border: '3px solid #a8e8db',
                    borderRadius: 999,
                    padding: '8px 16px',
                    fontWeight: 900,
                    fontSize: '1.05rem',
                  }}
                >
                  ✅ {publishedCount} xuất bản
                </span>

                <span
                  style={{
                    background: '#fff3cd',
                    color: '#9b5c00',
                    border: '3px solid #ffe2a6',
                    borderRadius: 999,
                    padding: '8px 16px',
                    fontWeight: 900,
                    fontSize: '1.05rem',
                  }}
                >
                  📝 {draftCount} bản nháp
                </span>

                <span
                  style={{
                    background: '#eee7ff',
                    color: '#5b4b8a',
                    border: '3px solid #dacdff',
                    borderRadius: 999,
                    padding: '8px 16px',
                    fontWeight: 900,
                    fontSize: '1.05rem',
                  }}
                >
                  📦 {courses.length} khóa học
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

        {loading ? (
          <div className={classes.loading}>
            <CircularProgress style={{ color: '#fff' }} size={58} thickness={5} />
          </div>
        ) : courses.length === 0 ? (
          <div className={classes.empty}>
            <div style={{ fontSize: '4.5rem', marginBottom: 12 }}>📚</div>
            <p style={{ margin: 0 }}>Bạn chưa có khóa học nào.</p>
            <p style={{ margin: '8px 0 0', color: '#087565' }}>
              Hãy tạo khóa học đầu tiên để bắt đầu nhé!
            </p>
          </div>
        ) : (
          <Grid container spacing={4}>
            {courses.map((course) => (
              <Grid item xs={12} sm={6} md={4} key={course._id}>
                <Card
                  className={classes.courseCard}
                  onClick={() => history.push(`/teacher/courses/${course._id}`)}
                >
                  <div className={classes.cardTop}>
                    <div className={classes.cardIcon}>🎓</div>

                    <Chip
                      className={classes.statusChip}
                      size="small"
                      label={STATUS_LABELS[course.status] || course.status}
                      style={{
                        backgroundColor: STATUS_BG[course.status] || '#eefdf9',
                        color: STATUS_TEXT[course.status] || '#06434b',
                      }}
                    />
                  </div>

                  <CardContent className={classes.cardContent}>
                    <h3 className={classes.courseTitle}>{course.title}</h3>

                    <p className={classes.courseMeta}>
                      📚 {course.totalLessons || 0} bài học
                    </p>

                    <p className={classes.courseMeta}>
                      👥 {course.totalStudents || 0} học viên
                    </p>

                    <p className={classes.courseMeta}>
                      🎯 Cấp độ: {course.level || 'Chưa chọn'}
                    </p>

                    <span className={course.isFree ? classes.freePrice : classes.price}>
                      💰 {formatPrice(course)}
                    </span>

                    <p className={classes.description}>
                      {course.description
                        ? `${course.description.slice(0, 110)}${
                            course.description.length > 110 ? '...' : ''
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
                      onClick={() => history.push(`/teacher/courses/${course._id}`)}
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
                      onClick={() => handleDelete(course._id)}
                    >
                      Xóa
                    </Button>
                  </CardActions>
                </Card>
              </Grid>
            ))}
          </Grid>
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