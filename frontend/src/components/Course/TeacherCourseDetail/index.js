import React, { useEffect, useState } from 'react';
import Button from '@material-ui/core/Button';
import Accordion from '@material-ui/core/Accordion';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import AccordionDetails from '@material-ui/core/AccordionDetails';
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
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import IconButton from '@material-ui/core/IconButton';
import Chip from '@material-ui/core/Chip';
import CircularProgress from '@material-ui/core/CircularProgress';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import AddIcon from '@material-ui/icons/Add';
import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import CheckIcon from '@material-ui/icons/Check';
import CloseIcon from '@material-ui/icons/Close';
import PeopleIcon from '@material-ui/icons/People';
import { makeStyles } from '@material-ui/core/styles';
import { useHistory, useParams } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setMessage } from 'redux/slices/message.slice';
import courseApi from 'apis/courseApi';

const useStyle = makeStyles((theme) => ({
  wrapper: { padding: '24px 0' },
  header: {
    display: 'flex',
    alignItems: 'center',
    gap: 16,
    marginBottom: 32,
    flexWrap: 'wrap',
  },
  pageTitle: { fontSize: '1.8rem', fontWeight: 700, flex: 1 },
  chapterHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
  },
  chapterTitle: { fontWeight: 700, fontSize: '1rem' },
  lessonItem: {
    borderRadius: 8,
    border: `1px solid ${theme.palette.divider}`,
    marginBottom: 8,
    backgroundColor: theme.palette.background.paper,
  },
  lessonType: { fontSize: '0.85rem', color: theme.palette.text.secondary },
  addChapterBtn: { marginTop: 16 },
  sectionTitle: { fontWeight: 700, marginBottom: 12, fontSize: '1rem' },
  pendingBox: {
    marginTop: 32,
    border: '2px solid #ff9800',
    borderRadius: 12,
    padding: 20,
    backgroundColor: '#fff8e1',
  },
  pendingTitle: {
    fontWeight: 700,
    color: '#e65100',
    marginBottom: 16,
    fontSize: '1.1rem',
    display: 'flex',
    alignItems: 'center',
    gap: 8,
  },
  pendingItem: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '12px 0',
    borderBottom: `1px solid ${theme.palette.divider}`,
    '&:last-child': { borderBottom: 'none' },
  },
}));

const LESSON_TYPES = [
  { value: 'video', label: 'Video + Bai tap' },
  { value: 'flashcard', label: 'Flashcard' },
  { value: 'quiz', label: 'Trac nghiem' },
  { value: 'fill_blank', label: 'Dien tu' },
  { value: 'text', label: 'Ly thuyet' },
  { value: 'mixed', label: 'Ket hop' },
];

// ===== CHAPTER FORM =====
function ChapterForm({ open, onClose, onSubmit, initialData }) {
  const classes = useStyle();
  const [form, setForm] = useState({ title: '', description: '', isFree: false });

  useEffect(() => {
    if (initialData) {
      setForm({ title: initialData.title || '', description: initialData.description || '', isFree: initialData.isFree || false });
    } else {
      setForm({ title: '', description: '', isFree: false });
    }
  }, [initialData, open]);

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>{initialData ? 'Sua chuong' : 'Them chuong moi'}</DialogTitle>
      <DialogContent>
        <TextField
          style={{ marginBottom: 16, width: '100%' }}
          label="Ten chuong *" value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
          variant="outlined"
        />
        <TextField
          style={{ marginBottom: 16, width: '100%' }}
          label="Mo ta" value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
          variant="outlined" multiline minRows={2}
        />
        <FormControlLabel
          control={<Switch checked={form.isFree} onChange={(e) => setForm({ ...form, isFree: e.target.checked })} />}
          label="Xem thu mien phi"
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Huy</Button>
        <Button onClick={() => onSubmit(form)} variant="contained" className="_btn _btn-primary"
          disabled={!form.title.trim()}>
          {initialData ? 'Luu' : 'Them chuong'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

// ===== LESSON FORM =====
function LessonForm({ open, onClose, onSubmit, initialData }) {
  const [tab, setTab] = useState(0);
  const [form, setForm] = useState({
    title: '', type: 'video', videoUrl: '', content: '',
    isFree: false, timeLimit: 0, hasExercise: true,
    words: [], questions: [], fillBlanks: [], materials: [],
  });

useEffect(() => {
    if (!open) return; // chỉ chạy khi dialog mở

    if (initialData && initialData._id) {
      setForm({
        title: initialData.title || '',
        type: initialData.type || 'video',
        videoUrl: initialData.videoUrl || '',
        content: initialData.content || '',
        isFree: initialData.isFree || false,
        timeLimit: initialData.timeLimit || 0,
        hasExercise: initialData.hasExercise !== false,
        words: Array.isArray(initialData.words) ? initialData.words : [],
        questions: Array.isArray(initialData.questions) ? initialData.questions : [],
        fillBlanks: Array.isArray(initialData.fillBlanks) ? initialData.fillBlanks : [],
        materials: Array.isArray(initialData.materials) ? initialData.materials : [],
      });
    } else {
      setForm({
        title: '', type: 'video', videoUrl: '', content: '',
        isFree: false, timeLimit: 0, hasExercise: true,
        words: [], questions: [], fillBlanks: [], materials: [],
      });
    }
    setTab(0);
  }, [open, initialData?._id]); // ← chỉ dùng _id thay vì toàn bộ object

  const addWord = () => setForm({ ...form, words: [...form.words, { word: '', mean: '', phonetic: '', picture: '', example: '' }] });
  const updateWord = (i, field, val) => { const w = [...form.words]; w[i] = { ...w[i], [field]: val }; setForm({ ...form, words: w }); };
  const removeWord = (i) => setForm({ ...form, words: form.words.filter((_, idx) => idx !== i) });

  const addQuestion = () => setForm({ ...form, questions: [...form.questions, { question: '', options: ['', '', '', ''], correctIndex: 0, explanation: '' }] });
  const updateQuestion = (i, field, val) => { const q = [...form.questions]; q[i] = { ...q[i], [field]: val }; setForm({ ...form, questions: q }); };
  const updateOption = (qi, oi, val) => { const q = [...form.questions]; q[qi].options[oi] = val; setForm({ ...form, questions: q }); };
  const removeQuestion = (i) => setForm({ ...form, questions: form.questions.filter((_, idx) => idx !== i) });

  const addFillBlank = () => setForm({ ...form, fillBlanks: [...form.fillBlanks, { sentence: '', correctAnswer: '', hint: '' }] });
  const updateFillBlank = (i, field, val) => { const fb = [...form.fillBlanks]; fb[i] = { ...fb[i], [field]: val }; setForm({ ...form, fillBlanks: fb }); };
  const removeFillBlank = (i) => setForm({ ...form, fillBlanks: form.fillBlanks.filter((_, idx) => idx !== i) });

  const addMaterial = () => setForm({ ...form, materials: [...form.materials, { title: '', content: '', fileUrl: '' }] });
  const updateMaterial = (i, field, val) => { const m = [...form.materials]; m[i] = { ...m[i], [field]: val }; setForm({ ...form, materials: m }); };
  const removeMaterial = (i) => setForm({ ...form, materials: form.materials.filter((_, idx) => idx !== i) });

  const getYoutubePreview = (url) => {
    if (!url) return '';
    const match = url.match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|shorts\/))([^&\n?#]+)/);
    if (match) return `https://www.youtube.com/embed/${match[1]}`;
    if (url.includes('drive.google.com')) return url.replace('/view', '/preview');
    return url;
  };

  const showQuiz = form.type === 'quiz' || form.type === 'video' || form.type === 'mixed';
  const showFlashcard = form.type === 'flashcard' || form.type === 'mixed';
  const showFillBlank = form.type === 'fill_blank' || form.type === 'video' || form.type === 'mixed';

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>{initialData ? 'Sua bai hoc' : 'Them bai hoc moi'}</DialogTitle>
      <DialogContent>
        <Tabs value={tab} onChange={(_, v) => setTab(v)} style={{ marginBottom: 16 }}>
          <Tab label="Thong tin" />
          <Tab label="Video & Tai lieu" />
          <Tab label="Bai tap" />
        </Tabs>

        {/* TAB 1: THONG TIN */}
        {tab === 0 && (
          <div>
            <TextField style={{ marginBottom: 16, width: '100%' }} label="Ten bai hoc *"
              value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} variant="outlined" />
            <FormControl variant="outlined" style={{ marginBottom: 16, width: '100%' }}>
              <InputLabel>Loai bai hoc</InputLabel>
              <Select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })} label="Loai bai hoc">
                <MenuItem value="video">Video bai giang + Bai tap</MenuItem>
                <MenuItem value="quiz">Chi trac nghiem</MenuItem>
                <MenuItem value="fill_blank">Chi dien tu</MenuItem>
                <MenuItem value="flashcard">Chi flashcard tu vung</MenuItem>
                <MenuItem value="mixed">Ket hop nhieu loai</MenuItem>
                <MenuItem value="text">Chi ly thuyet/tai lieu</MenuItem>
              </Select>
            </FormControl>
            <TextField style={{ marginBottom: 16, width: '100%' }}
              label="Thoi gian lam bai (phut, 0 = khong gioi han)"
              type="number" value={form.timeLimit}
              onChange={(e) => setForm({ ...form, timeLimit: Number(e.target.value) })} variant="outlined" />
            <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
              <FormControlLabel
                control={<Switch checked={form.isFree} onChange={(e) => setForm({ ...form, isFree: e.target.checked })} />}
                label="Xem thu mien phi (bai demo)" />
              <FormControlLabel
                control={<Switch checked={form.hasExercise} onChange={(e) => setForm({ ...form, hasExercise: e.target.checked })} />}
                label="Co bai tap" />
            </div>
            {form.isFree && (
              <div style={{ backgroundColor: '#e8f5e9', padding: 10, borderRadius: 8, marginTop: 8, fontSize: '0.9rem', color: '#2e7d32' }}>
                Bai nay se hien thi mien phi cho tat ca hoc vien, ke ca chua dang ky.
              </div>
            )}
          </div>
        )}

        {/* TAB 2: VIDEO & TAI LIEU */}
        {tab === 1 && (
          <div>
            <p style={{ fontWeight: 700, marginBottom: 8 }}>Video bai giang</p>
            <p style={{ color: '#888', fontSize: '0.85rem', marginBottom: 8 }}>
              Dan link YouTube hoac Google Drive. Drive can bat "Anyone with the link can view".
            </p>
            <TextField style={{ marginBottom: 12, width: '100%' }}
              label="Link video (YouTube / Google Drive)"
              value={form.videoUrl} onChange={(e) => setForm({ ...form, videoUrl: e.target.value })}
              variant="outlined"
              placeholder="https://www.youtube.com/watch?v=..." />
            {form.videoUrl && getYoutubePreview(form.videoUrl) && (
              <div style={{ marginBottom: 16, borderRadius: 8, overflow: 'hidden', maxWidth: 480, position: 'relative', paddingTop: '27%' }}>
                <iframe src={getYoutubePreview(form.videoUrl)}
                  style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', border: 'none' }}
                  allowFullScreen title="preview" />
              </div>
            )}

            <p style={{ fontWeight: 700, margin: '16px 0 8px' }}>Noi dung ly thuyet (HTML)</p>
            <p style={{ color: '#888', fontSize: '0.85rem', marginBottom: 8 }}>
              Ho tro HTML co ban: &lt;h3&gt;, &lt;p&gt;, &lt;ul&gt;, &lt;li&gt;, &lt;b&gt;, &lt;table&gt;...
            </p>
            <TextField style={{ marginBottom: 16, width: '100%' }}
              label="Noi dung ly thuyet" value={form.content}
              onChange={(e) => setForm({ ...form, content: e.target.value })}
              variant="outlined" multiline minRows={5}
              placeholder="<h3>Ly thuyet</h3><p>Noi dung...</p>" />

            <p style={{ fontWeight: 700, margin: '8px 0' }}>Tai lieu dinh kem ({form.materials.length})</p>
            <p style={{ color: '#888', fontSize: '0.85rem', marginBottom: 8 }}>
              Upload len Google Drive, Share link, dan vao day.
            </p>
            {form.materials.map((m, i) => (
              <div key={i} style={{ border: '1px solid #e0e0e0', borderRadius: 8, padding: 12, marginBottom: 8, position: 'relative' }}>
                <IconButton size="small" style={{ position: 'absolute', top: 4, right: 4, color: '#e91e63' }}
                  onClick={() => removeMaterial(i)}><DeleteIcon fontSize="small" /></IconButton>
                <TextField label="Ten tai lieu *" value={m.title}
                  onChange={(e) => updateMaterial(i, 'title', e.target.value)}
                  variant="outlined" size="small" style={{ width: '100%', marginBottom: 8 }} />
                <TextField label="Link tai lieu (Google Drive)" value={m.fileUrl}
                  onChange={(e) => updateMaterial(i, 'fileUrl', e.target.value)}
                  variant="outlined" size="small" style={{ width: '100%', marginBottom: 8 }}
                  placeholder="https://drive.google.com/file/d/.../view" />
                <TextField label="Mo ta ngan" value={m.content}
                  onChange={(e) => updateMaterial(i, 'content', e.target.value)}
                  variant="outlined" size="small" style={{ width: '100%' }} />
              </div>
            ))}
            <Button startIcon={<AddIcon />} onClick={addMaterial} variant="outlined" size="small">
              Them tai lieu
            </Button>
          </div>
        )}

        {/* TAB 3: BAI TAP */}
        {tab === 2 && (
          <div>
            {form.type === 'text' ? (
              <div style={{ textAlign: 'center', padding: 32, color: '#888' }}>
                Bai "Chi ly thuyet" khong can bai tap. Chuyen sang loai khac neu muon them bai tap.
              </div>
            ) : (
              <>
                {/* Flashcard */}
                {showFlashcard && (
                  <div style={{ marginBottom: 20 }}>
                    <p style={{ fontWeight: 700, marginBottom: 8 }}>Flashcard tu vung ({form.words.length} tu)</p>
                    {form.words.map((w, i) => (
                      <div key={i} style={{ border: '1px solid #e0e0e0', borderRadius: 8, padding: 10, marginBottom: 8 }}>
                        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                          <IconButton size="small" onClick={() => removeWord(i)} style={{ color: '#e91e63' }}><DeleteIcon fontSize="small" /></IconButton>
                        </div>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                          <TextField label="Tu vung *" value={w.word} onChange={(e) => updateWord(i, 'word', e.target.value)} variant="outlined" size="small" />
                          <TextField label="Nghia *" value={w.mean} onChange={(e) => updateWord(i, 'mean', e.target.value)} variant="outlined" size="small" />
                          <TextField label="Phien am" value={w.phonetic} onChange={(e) => updateWord(i, 'phonetic', e.target.value)} variant="outlined" size="small" />
                          <TextField label="Vi du" value={w.example} onChange={(e) => updateWord(i, 'example', e.target.value)} variant="outlined" size="small" />
                        </div>
                        <TextField label="Link anh (tuy chon)" value={w.picture}
                          onChange={(e) => updateWord(i, 'picture', e.target.value)}
                          variant="outlined" size="small" style={{ width: '100%', marginTop: 8 }} />
                      </div>
                    ))}
                    <Button startIcon={<AddIcon />} onClick={addWord} variant="outlined" size="small">Them tu</Button>
                  </div>
                )}

                {/* Trac nghiem */}
                {showQuiz && (
                  <div style={{ marginBottom: 20 }}>
                    <p style={{ fontWeight: 700, marginBottom: 8 }}>Cau hoi trac nghiem ({form.questions.length} cau)</p>
                    {form.questions.map((q, qi) => (
                      <div key={qi} style={{ border: '1px solid #e0e0e0', borderRadius: 8, padding: 12, marginBottom: 12 }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                          <strong>Cau {qi + 1}</strong>
                          <IconButton size="small" onClick={() => removeQuestion(qi)} style={{ color: '#e91e63' }}><DeleteIcon /></IconButton>
                        </div>
                        <TextField label="Cau hoi *" value={q.question}
                          onChange={(e) => updateQuestion(qi, 'question', e.target.value)}
                          variant="outlined" size="small" style={{ width: '100%', marginBottom: 8 }} multiline />
                        {q.options.map((opt, oi) => (
                          <div key={oi} style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 6 }}>
                            <input type="radio" name={`q${qi}`} checked={q.correctIndex === oi}
                              onChange={() => updateQuestion(qi, 'correctIndex', oi)}
                              style={{ cursor: 'pointer', width: 16, height: 16 }} />
                            <span style={{ minWidth: 24, fontWeight: 700 }}>{['A','B','C','D'][oi]}.</span>
                            <TextField label={`Dap an ${['A','B','C','D'][oi]}`} value={opt}
                              onChange={(e) => updateOption(qi, oi, e.target.value)}
                              variant="outlined" size="small" style={{ flex: 1 }} />
                          </div>
                        ))}
                        <p style={{ fontSize: '0.78rem', color: '#888', margin: '4px 0' }}>
                          Chon radio de danh dau dap an dung
                        </p>
                        <TextField label="Giai thich dap an (quan trong!)" value={q.explanation}
                          onChange={(e) => updateQuestion(qi, 'explanation', e.target.value)}
                          variant="outlined" size="small" style={{ width: '100%' }} />
                      </div>
                    ))}
                    <Button startIcon={<AddIcon />} onClick={addQuestion} variant="outlined" size="small">Them cau hoi</Button>
                  </div>
                )}

                {/* Dien tu */}
                {showFillBlank && (
                  <div>
                    <p style={{ fontWeight: 700, marginBottom: 8 }}>Cau dien tu ({form.fillBlanks.length} cau)</p>
                    {form.fillBlanks.map((fb, i) => (
                      <div key={i} style={{ border: '1px solid #e0e0e0', borderRadius: 8, padding: 12, marginBottom: 8 }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                          <strong>Cau {i + 1}</strong>
                          <IconButton size="small" onClick={() => removeFillBlank(i)} style={{ color: '#e91e63' }}><DeleteIcon /></IconButton>
                        </div>
                        <TextField label="Cau (dung ___ cho cho trong) *" value={fb.sentence}
                          onChange={(e) => updateFillBlank(i, 'sentence', e.target.value)}
                          variant="outlined" size="small" style={{ width: '100%', marginBottom: 8 }}
                          placeholder="She ___ to school every day." multiline />
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                          <TextField label="Dap an dung *" value={fb.correctAnswer}
                            onChange={(e) => updateFillBlank(i, 'correctAnswer', e.target.value)}
                            variant="outlined" size="small" />
                          <TextField label="Goi y cho hoc sinh" value={fb.hint}
                            onChange={(e) => updateFillBlank(i, 'hint', e.target.value)}
                            variant="outlined" size="small" />
                        </div>
                      </div>
                    ))}
                    <Button startIcon={<AddIcon />} onClick={addFillBlank} variant="outlined" size="small">Them cau dien tu</Button>
                  </div>
                )}
              </>
            )}
          </div>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Huy</Button>
        <Button onClick={() => onSubmit(form)} variant="contained" className="_btn _btn-primary"
          disabled={!form.title.trim()}>
          {initialData ? 'Luu thay doi' : 'Them bai hoc'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

// ===== MAIN COMPONENT =====
function TeacherCourseDetail() {
  const classes = useStyle();
  const { id: courseId } = useParams();
  const history = useHistory();
  const dispatch = useDispatch();

  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [chapterDialog, setChapterDialog] = useState({ open: false, data: null });
  const [lessonDialog, setLessonDialog] = useState({ open: false, data: null, chapterId: null });

  // ===== STATE CHO HOC VIEN CHO DUYET =====
  const [pendingList, setPendingList] = useState([]);

  const loadCourse = async () => {
    setLoading(true);
    try {
      const res = await courseApi.getCourseDetail(courseId);
      if (res.status === 200) setCourse(res.data.course);
    } catch (e) {}
    setLoading(false);
  };

  const loadPending = async () => {
    try {
      const res = await courseApi.getPendingEnrollments();
      if (res.status === 200) {
        const filtered = (res.data.list || []).filter(
          (e) => {
            const cId = e.courseId?._id || e.courseId;
            return cId === courseId || cId?.toString() === courseId;
          }
        );
        setPendingList(filtered);
      }
    } catch (e) {}
  };

  useEffect(() => {
    loadCourse();
    loadPending();
  }, [courseId]);

  const handleApprove = async (enrollmentId) => {
    try {
      await courseApi.approveEnrollment(enrollmentId);
      setPendingList((prev) => prev.filter((e) => e._id !== enrollmentId));
      dispatch(setMessage({ type: 'success', message: 'Da duyet hoc vien vao lop!' }));
    } catch (e) {
      dispatch(setMessage({ type: 'error', message: 'Loi duyet!' }));
    }
  };

  const handleReject = async (enrollmentId) => {
    try {
      await courseApi.rejectEnrollment(enrollmentId);
      setPendingList((prev) => prev.filter((e) => e._id !== enrollmentId));
      dispatch(setMessage({ type: 'warning', message: 'Da tu choi hoc vien.' }));
    } catch (e) {}
  };

  const handleChapterSubmit = async (formData) => {
    try {
      if (chapterDialog.data) {
        await courseApi.updateChapter(courseId, chapterDialog.data._id, formData);
        dispatch(setMessage({ type: 'success', message: 'Cap nhat chuong thanh cong!' }));
      } else {
        await courseApi.createChapter(courseId, formData);
        dispatch(setMessage({ type: 'success', message: 'Them chuong thanh cong!' }));
      }
      setChapterDialog({ open: false, data: null });
      loadCourse();
    } catch (e) {
      dispatch(setMessage({ type: 'error', message: 'Co loi xay ra!' }));
    }
  };

  const handleDeleteChapter = async (chapterId) => {
    if (!window.confirm('Xoa chuong nay se xoa tat ca bai hoc ben trong. Tiep tuc?')) return;
    try {
      await courseApi.deleteChapter(courseId, chapterId);
      dispatch(setMessage({ type: 'success', message: 'Xoa chuong thanh cong!' }));
      loadCourse();
    } catch (e) {
      dispatch(setMessage({ type: 'error', message: 'Loi xoa chuong!' }));
    }
  };

  const handleLessonSubmit = async (formData) => {
    try {
      if (lessonDialog.data) {
        await courseApi.updateLesson(courseId, lessonDialog.data._id, formData);
        dispatch(setMessage({ type: 'success', message: 'Cap nhat bai hoc thanh cong!' }));
      } else {
        await courseApi.createLesson(courseId, lessonDialog.chapterId, formData);
        dispatch(setMessage({ type: 'success', message: 'Them bai hoc thanh cong!' }));
      }
      setLessonDialog({ open: false, data: null, chapterId: null });
      loadCourse();
    } catch (e) {
      dispatch(setMessage({ type: 'error', message: 'Co loi xay ra!' }));
    }
  };

  const handleDeleteLesson = async (lessonId) => {
    if (!window.confirm('Ban co chac muon xoa bai hoc nay?')) return;
    try {
      await courseApi.deleteLesson(courseId, lessonId);
      dispatch(setMessage({ type: 'success', message: 'Xoa bai hoc thanh cong!' }));
      loadCourse();
    } catch (e) {
      dispatch(setMessage({ type: 'error', message: 'Loi xoa bai hoc!' }));
    }
  };

  if (loading) {
    return <div style={{ display: 'flex', justifyContent: 'center', padding: 60 }}><CircularProgress /></div>;
  }

  if (!course) {
    return <div className="container" style={{ padding: 60, textAlign: 'center' }}>Khong tim thay khoa hoc.</div>;
  }

  return (
    <div className={`container ${classes.wrapper}`}>
      {/* Header */}
      <div className={classes.header}>
        <Button startIcon={<ArrowBackIcon />} onClick={() => history.push('/teacher/courses')}>
          Quay lai
        </Button>
        <div style={{ flex: 1 }}>
          <h1 className={classes.pageTitle}>{course.title}</h1>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginTop: 8 }}>
            <Chip size="small" label={course.level} color="primary" />
            <Chip size="small" label={course.status === 'published' ? 'Da xuat ban' : 'Nhap'} />
            <Chip size="small" label={`${course.totalChapters || 0} chuong`} />
            <Chip size="small" label={`${course.totalLessons || 0} bai hoc`} />
            <Chip size="small" label={`${course.totalStudents || 0} hoc vien`} />
          </div>
        </div>
      </div>

      {/* ===== HOC VIEN CHO DUYET ===== */}
      {pendingList.length > 0 && (
        <div className={classes.pendingBox}>
          <div className={classes.pendingTitle}>
            <PeopleIcon />
            Hoc vien cho duyet vao lop ({pendingList.length} nguoi)
          </div>
          {pendingList.map((enrollment) => (
            <div key={enrollment._id} className={classes.pendingItem}>
              <div>
                <strong style={{ fontSize: '1rem' }}>{enrollment.studentName}</strong>
                <div style={{ color: '#888', fontSize: '0.85rem', marginTop: 2 }}>
                  Xin vao: {enrollment.courseId?.title || 'Khoa hoc nay'}
                </div>
              </div>
              <div style={{ display: 'flex', gap: 8 }}>
                <Button size="small" variant="contained"
                  style={{ backgroundColor: '#4caf50', color: '#fff', fontWeight: 700 }}
                  startIcon={<CheckIcon />}
                  onClick={() => handleApprove(enrollment._id)}>
                  Duyet
                </Button>
                <Button size="small" variant="outlined"
                  style={{ borderColor: '#e91e63', color: '#e91e63', fontWeight: 700 }}
                  startIcon={<CloseIcon />}
                  onClick={() => handleReject(enrollment._id)}>
                  Tu choi
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ===== DANH SACH CHUONG ===== */}
      <div style={{ marginTop: 24 }}>
        {!course.chapters || course.chapters.length === 0 ? (
          <div style={{ textAlign: 'center', padding: 40, color: '#888', border: '2px dashed #e0e0e0', borderRadius: 12 }}>
            <p style={{ fontSize: '1.1rem' }}>Khoa hoc chua co chuong nao.</p>
            <p>Hay them chuong dau tien!</p>
          </div>
        ) : (
          course.chapters.map((chapter) => (
            <Accordion key={chapter._id} defaultExpanded style={{ marginBottom: 8 }}>
              <AccordionSummary expandIcon={<ExpandMoreIcon />} style={{ backgroundColor: '#f5f5f5' }}>
                <div className={classes.chapterHeader}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <span style={{
                      backgroundColor: '#1a237e', color: '#fff',
                      borderRadius: '50%', width: 28, height: 28,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: '0.85rem', fontWeight: 700, flexShrink: 0,
                    }}>{chapter.order}</span>
                    <div>
                      <span className={classes.chapterTitle}>{chapter.title}</span>
                      <span style={{ color: '#888', fontSize: '0.85rem', marginLeft: 8 }}>
                        ({chapter.lessons?.length || 0} bai)
                      </span>
                      {chapter.isFree && (
                        <Chip size="small" label="Xem thu" style={{ marginLeft: 8, backgroundColor: '#e8f5e9', color: '#2e7d32', fontSize: '0.7rem' }} />
                      )}
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: 4 }} onClick={(e) => e.stopPropagation()}>
                    <IconButton size="small" onClick={() => setChapterDialog({ open: true, data: chapter })}>
                      <EditIcon fontSize="small" />
                    </IconButton>
                    <IconButton size="small" style={{ color: '#e91e63' }} onClick={() => handleDeleteChapter(chapter._id)}>
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  </div>
                </div>
              </AccordionSummary>
              <AccordionDetails style={{ flexDirection: 'column', padding: '8px 16px 16px' }}>
                <List dense>
                  {chapter.lessons?.map((lesson) => (
                    <ListItem key={lesson._id} className={classes.lessonItem}>
                      <ListItemText
                        primary={
                          <span style={{ fontSize: '1rem', fontWeight: 500 }}>
                            Bai {lesson.order}: {lesson.title}
                            {lesson.isFree && (
                              <Chip size="small" label="Xem thu" style={{ marginLeft: 8, backgroundColor: '#e8f5e9', color: '#2e7d32', fontSize: '0.7rem' }} />
                            )}
                          </span>
                        }
                        secondary={
                          <span className={classes.lessonType}>
                            {LESSON_TYPES.find(t => t.value === lesson.type)?.label || lesson.type}
                            {lesson.timeLimit > 0 && ` | ${lesson.timeLimit} phut`}
                            {lesson.videoUrl && ' | Co video'}
                          </span>
                        }
                      />
                      <ListItemSecondaryAction>
                        <IconButton size="small"
                          onClick={() => setLessonDialog({ open: true, data: lesson, chapterId: chapter._id })}>
                          <EditIcon fontSize="small" />
                        </IconButton>
                        <IconButton size="small" style={{ color: '#e91e63' }}
                          onClick={() => handleDeleteLesson(lesson._id)}>
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </ListItemSecondaryAction>
                    </ListItem>
                  ))}
                </List>
                <Button startIcon={<AddIcon />} variant="outlined" size="small"
                  onClick={() => setLessonDialog({ open: true, data: null, chapterId: chapter._id })}>
                  Them bai hoc
                </Button>
              </AccordionDetails>
            </Accordion>
          ))
        )}
      </div>

      {/* Nut them chuong */}
      <Button
        startIcon={<AddIcon />}
        variant="contained"
        className={`_btn _btn-primary ${classes.addChapterBtn}`}
        onClick={() => setChapterDialog({ open: true, data: null })}>
        Them chuong moi
      </Button>

      {/* Dialogs */}
      <ChapterForm
        open={chapterDialog.open}
        onClose={() => setChapterDialog({ open: false, data: null })}
        onSubmit={handleChapterSubmit}
        initialData={chapterDialog.data}
      />
      <LessonForm
        open={lessonDialog.open}
        onClose={() => setLessonDialog({ open: false, data: null, chapterId: null })}
        onSubmit={handleLessonSubmit}
        initialData={lessonDialog.data}
      />
    </div>
  );
}

export default TeacherCourseDetail;