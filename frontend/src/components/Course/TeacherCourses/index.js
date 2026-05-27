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

const useStyle = makeStyles((theme) => ({
  wrapper: { padding: '32px 0' },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 32,
    flexWrap: 'wrap',
    gap: 16,
  },
  pageTitle: { fontSize: '2.3rem', fontWeight: 700 },
  card: {
    borderRadius: 16,
    boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
  },
  cardContent: { flex: 1 },
courseMeta: { color: theme.palette.text.secondary, fontSize: '1.5rem', marginBottom: 6 },
courseTitle: { fontWeight: 700, fontSize: '1.7rem', marginBottom: 8 },
  statusChip: { marginBottom: 8 },
  empty: { textAlign: 'center', padding: 60, color: theme.palette.text.secondary },
  formField: { marginBottom: 16, width: '100%' },
}));

const LEVELS = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2', 'Tất cả'];
const STATUS_LABELS = { draft: '📝 Nháp', published: '✅ Đã xuất bản', archived: '📦 Lưu trữ' };
const STATUS_COLORS = { draft: 'default', published: 'primary', archived: 'secondary' };

function CourseFormDialog({ open, onClose, onSubmit, initialData }) {
  const classes = useStyle();
  const [form, setForm] = useState({
    title: '', description: '', level: 'A1', price: 0, isFree: true, status: 'draft',
  });

  useEffect(() => {
    if (initialData) setForm({ ...initialData });
    else setForm({ title: '', description: '', level: 'A1', price: 0, isFree: true, status: 'draft' });
  }, [initialData, open]);

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>{initialData ? 'Sửa khóa học' : 'Tạo khóa học mới'}</DialogTitle>
      <DialogContent>
        <TextField className={classes.formField} label="Tên khóa học *" value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })} variant="outlined" />
        <TextField className={classes.formField} label="Mô tả" value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
          variant="outlined" multiline rows={3} />
        <FormControl variant="outlined" className={classes.formField}>
          <InputLabel>Cấp độ</InputLabel>
          <Select value={form.level} onChange={(e) => setForm({ ...form, level: e.target.value })} label="Cấp độ">
            {LEVELS.map(l => <MenuItem key={l} value={l}>{l}</MenuItem>)}
          </Select>
        </FormControl>
        <FormControl variant="outlined" className={classes.formField}>
          <InputLabel>Trạng thái</InputLabel>
          <Select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })} label="Trạng thái">
            <MenuItem value="draft">📝 Nháp</MenuItem>
            <MenuItem value="published">✅ Xuất bản</MenuItem>
            <MenuItem value="archived">📦 Lưu trữ</MenuItem>
          </Select>
        </FormControl>
        <FormControlLabel
          control={<Switch checked={form.isFree} onChange={(e) => setForm({ ...form, isFree: e.target.checked })} />}
          label="Miễn phí" />
        {!form.isFree && (
          <TextField className={classes.formField} label="Giá (xu)" type="number"
            value={form.price} onChange={(e) => setForm({ ...form, price: Number(e.target.value) })}
            variant="outlined" />
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} className="_btn _btn-stand">Hủy</Button>
        <Button onClick={() => onSubmit(form)} className="_btn _btn-primary" variant="contained"
          disabled={!form.title.trim()}>
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
      if (res.status === 200) setCourses(res.data.courses || []);
    } catch (e) {}
    setLoading(false);
  };

  useEffect(() => { loadCourses(); }, []);

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

  return (
    <div className={`container ${classes.wrapper}`}>
      <div className={classes.header}>
        <div>
          <h1 className={classes.pageTitle}>📚 Quản lý khóa học</h1>
          <p style={{ color: '#888' }}>Tạo và quản lý các khóa học của bạn</p>
        </div>
        <Button variant="contained" className="_btn _btn-primary"
          startIcon={<AddIcon />} onClick={() => { setEditingCourse(null); setOpenForm(true); }}>
          Tạo khóa học mới
        </Button>
      </div>

      {loading ? (
        <div style={{ display: 'flex', justifyContent: 'center', padding: 60 }}><CircularProgress /></div>
      ) : courses.length === 0 ? (
        <div className={classes.empty}>
          <p>Bạn chưa có khóa học nào. Hãy tạo khóa học đầu tiên!</p>
        </div>
      ) : (
        <Grid container spacing={3}>
          {courses.map((course) => (
            <Grid item xs={12} sm={6} md={4} key={course._id}>
              <Card className={classes.card}>
                <CardContent className={classes.cardContent}>
                  <Chip
                    className={classes.statusChip}
                    size="small"
                    label={STATUS_LABELS[course.status]}
                    color={STATUS_COLORS[course.status]}
                  />
                  <h3 className={classes.courseTitle}>{course.title}</h3>
                  <p className={classes.courseMeta}>📚 {course.totalLessons} bài • 👥 {course.totalStudents} học viên</p>
                  <p className={classes.courseMeta}>🎯 Cấp độ: {course.level}</p>
                 <p className={classes.courseMeta}> 💰 {course.isFree ? 'Miễn phí' : new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(course.price)}
                </p>
                  <p style={{ fontSize: '0.88rem', color: '#666', marginTop: 8 }}>
                    {course.description?.slice(0, 80)}{course.description?.length > 80 ? '...' : ''}
                  </p>
                </CardContent>
                <CardActions style={{ padding: '8px 16px 16px', gap: 8 }}>
                  <Button size="small" startIcon={<VisibilityIcon />}
                    onClick={() => history.push(`/teacher/courses/${course._id}`)}>
                    Quản lý
                  </Button>
                  <Button size="small" startIcon={<EditIcon />}
                    onClick={() => { setEditingCourse(course); setOpenForm(true); }}>
                    Sửa
                  </Button>
                  <Button size="small" startIcon={<DeleteIcon />} style={{ color: '#e91e63' }}
                    onClick={() => handleDelete(course._id)}>
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
        onClose={() => { setOpenForm(false); setEditingCourse(null); }}
        onSubmit={handleSubmit}
        initialData={editingCourse}
      />
    </div>
  );
}

export default TeacherCourses;