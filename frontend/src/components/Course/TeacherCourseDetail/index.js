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
import AddIcon from '@material-ui/icons/Add';
import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import CheckIcon from '@material-ui/icons/Check';
import CloseIcon from '@material-ui/icons/Close';
import PeopleIcon from '@material-ui/icons/People';
import LinearProgress from '@material-ui/core/LinearProgress';
import Avatar from '@material-ui/core/Avatar';
import Collapse from '@material-ui/core/Collapse';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import SchoolIcon from '@material-ui/icons/School';
import DoneIcon from '@material-ui/icons/Done';
import HourglassEmptyIcon from '@material-ui/icons/HourglassEmpty';
import FiberManualRecordIcon from '@material-ui/icons/FiberManualRecord';
import { makeStyles } from '@material-ui/core/styles';
import { useHistory, useParams } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setMessage } from 'redux/slices/message.slice';
import courseApi from 'apis/courseApi';

const GAME_FONT = '"Baloo 2", "Nunito", sans-serif';

const LESSON_TYPES = [
  { value: 'video', label: 'Video + Bài tập' },
  { value: 'flashcard', label: 'Flashcard' },
  { value: 'quiz', label: 'Trắc nghiệm' },
  { value: 'fill_blank', label: 'Điền từ' },
  { value: 'text', label: 'Lý thuyết' },
  { value: 'mixed', label: 'Kết hợp' },
];

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
    padding: '42px 0 90px',
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
    padding: '38px 42px',
    marginBottom: 36,
    position: 'relative',
    overflow: 'hidden',
  },

  heroDecor: {
    position: 'absolute',
    right: 40,
    top: 24,
    fontSize: '5.4rem',
    opacity: 0.14,
    transform: 'rotate(-10deg)',
  },

  header: {
    display: 'flex',
    alignItems: 'center',
    gap: 18,
    flexWrap: 'wrap',
    position: 'relative',
    zIndex: 2,
  },

  backBtn: {
    background: 'linear-gradient(180deg,#ffffff,#eefdf9) !important',
    color: '#056d5e !important',
    border: '4px solid #19c7a8 !important',
    borderRadius: '999px !important',
    padding: '12px 22px !important',
    fontSize: '1.08rem !important',
    fontWeight: '900 !important',
    fontFamily: `${GAME_FONT} !important`,
    textTransform: 'none !important',
    boxShadow: '0 6px 0 rgba(7,148,127,.20) !important',
  },

  pageTitle: {
    fontSize: 'clamp(2.6rem, 4.5vw, 4.5rem)',
    fontWeight: 900,
    flex: 1,
    color: '#06434b',
    margin: 0,
    lineHeight: 0.95,
    textShadow: '0 4px 0 rgba(25,199,168,.18)',
  },

  chipsRow: {
    display: 'flex',
    gap: 10,
    flexWrap: 'wrap',
    marginTop: 18,
  },

  heroChip: {
    height: 'auto !important',
    borderRadius: '999px !important',
    background: '#d4f5eb !important',
    color: '#057a55 !important',
    border: '3px solid #a8e8db !important',
    fontFamily: `${GAME_FONT} !important`,
    fontWeight: '900 !important',
    fontSize: '1.05rem !important',
    padding: '6px 6px !important',
  },

  mainGrid: {
    display: 'grid',
    gridTemplateColumns: '1fr',
    gap: 28,
  },

  sectionCard: {
    background: '#fff',
    borderRadius: 34,
    padding: 30,
    border: '6px solid rgba(255,255,255,.95)',
    boxShadow: '0 10px 0 rgba(7,148,127,.35), 0 22px 45px rgba(0,0,0,.18)',
    marginBottom: 28,
  },

  sectionTitle: {
    display: 'flex',
    alignItems: 'center',
    gap: 12,
    color: '#06434b',
    fontWeight: 900,
    fontSize: '1.85rem',
    margin: '0 0 22px',
    lineHeight: 1.15,
  },

  pendingCard: {
    background: 'linear-gradient(180deg,#fff8e1,#ffffff)',
    borderRadius: 34,
    padding: 30,
    border: '6px solid #ffcf45',
    boxShadow: '0 10px 0 #bd7800, 0 22px 45px rgba(0,0,0,.18)',
    marginBottom: 28,
  },

  pendingTitle: {
    display: 'flex',
    alignItems: 'center',
    gap: 12,
    color: '#9b5c00',
    fontWeight: 900,
    fontSize: '1.85rem',
    margin: '0 0 20px',
  },

  pendingItem: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 16,
    padding: '18px 0',
    borderBottom: '3px solid rgba(255,207,69,.35)',
    '&:last-child': {
      borderBottom: 'none',
    },
  },

  pendingName: {
    fontSize: '1.25rem',
    fontWeight: 900,
    color: '#4b3300',
  },

  pendingMeta: {
    color: '#8a6400',
    fontSize: '1.02rem',
    marginTop: 4,
    fontWeight: 800,
  },

  approveBtn: {
    background: 'linear-gradient(180deg,#36e27d,#0ca84f) !important',
    color: '#fff !important',
    border: '3px solid #fff !important',
    borderRadius: '999px !important',
    fontFamily: `${GAME_FONT} !important`,
    fontWeight: '900 !important',
    fontSize: '1rem !important',
    textTransform: 'none !important',
    boxShadow: '0 6px 0 #087a3c !important',
  },

  rejectBtn: {
    background: 'linear-gradient(180deg,#ffffff,#fff3cd) !important',
    color: '#b84f00 !important',
    border: '3px solid #ffcf45 !important',
    borderRadius: '999px !important',
    fontFamily: `${GAME_FONT} !important`,
    fontWeight: '900 !important',
    fontSize: '1rem !important',
    textTransform: 'none !important',
    boxShadow: '0 6px 0 rgba(184,79,0,.20) !important',
  },

  studentCard: {
    background: 'linear-gradient(180deg,#ffffff,#f3fffc)',
    borderRadius: 26,
    padding: '20px 22px',
    marginBottom: 16,
    border: '4px solid #d6f3ed',
    boxShadow: '0 7px 0 rgba(7,148,127,.12)',
    cursor: 'pointer',
    transition: 'transform .18s ease, box-shadow .18s ease',
    '&:hover': {
      transform: 'translateY(-4px)',
      boxShadow: '0 10px 0 rgba(7,148,127,.16)',
    },
  },

  studentCardHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: 14,
  },

  avatar: {
    background: 'linear-gradient(180deg,#19c7a8,#07947f) !important',
    width: '48px !important',
    height: '48px !important',
    fontSize: '1.25rem !important',
    fontWeight: '900 !important',
    border: '3px solid #fff',
    boxShadow: '0 5px 0 rgba(0,0,0,.14)',
    fontFamily: `${GAME_FONT} !important`,
  },

  studentName: {
    fontWeight: 900,
    fontSize: '1.25rem',
    color: '#06434b',
  },

  studentMeta: {
    fontSize: '1.02rem',
    color: '#07545c',
    fontWeight: 800,
    marginTop: 3,
    lineHeight: 1.45,
  },

  progressLabel: {
    fontSize: '1.08rem',
    fontWeight: 900,
    color: '#07947f',
    minWidth: 70,
    textAlign: 'right',
  },

  progressBar: {
    marginTop: 12,
    borderRadius: 999,
    height: '12px !important',
    backgroundColor: '#dff7f2 !important',
    '& .MuiLinearProgress-bar': {
      borderRadius: 999,
      background: 'linear-gradient(90deg,#19c7a8,#ffdf3b)',
    },
  },

  lessonProgressRow: {
    display: 'flex',
    alignItems: 'center',
    gap: 10,
    padding: '10px 0',
    borderBottom: '2px solid #eef7f5',
    fontSize: '1.02rem',
    color: '#06434b',
    fontWeight: 800,
    '&:last-child': {
      borderBottom: 'none',
    },
  },

  refreshBtn: {
    marginLeft: 'auto !important',
    background: 'linear-gradient(180deg,#ffffff,#eefdf9) !important',
    color: '#056d5e !important',
    border: '3px solid #19c7a8 !important',
    borderRadius: '999px !important',
    fontFamily: `${GAME_FONT} !important`,
    fontWeight: '900 !important',
    fontSize: '1rem !important',
    textTransform: 'none !important',
  },

  emptyBox: {
    textAlign: 'center',
    padding: 46,
    color: '#07545c',
    border: '5px dashed #d6f3ed',
    borderRadius: 28,
    background: '#f7fffd',
    fontWeight: 900,
    fontSize: '1.25rem',
    lineHeight: 1.5,
  },

  accordion: {
    borderRadius: '28px !important',
    marginBottom: '18px !important',
    overflow: 'hidden',
    border: '5px solid #d6f3ed',
    boxShadow: '0 8px 0 rgba(7,148,127,.18), 0 16px 32px rgba(0,0,0,.12)',
    '&:before': {
      display: 'none',
    },
  },

  accordionSummary: {
    background: 'linear-gradient(180deg,#eefdf9,#ffffff) !important',
    padding: '10px 22px !important',
    minHeight: '74px !important',
  },

  chapterHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    gap: 14,
  },

  chapterLeft: {
    display: 'flex',
    alignItems: 'center',
    gap: 14,
    minWidth: 0,
  },

  chapterOrder: {
    background: 'linear-gradient(180deg,#19c7a8,#07947f)',
    color: '#fff',
    borderRadius: '50%',
    width: 46,
    height: 46,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '1.25rem',
    fontWeight: 900,
    flexShrink: 0,
    border: '4px solid #fff',
    boxShadow: '0 5px 0 rgba(0,0,0,.14)',
  },

  chapterTitle: {
    fontWeight: 900,
    fontSize: '1.35rem',
    color: '#06434b',
    lineHeight: 1.25,
  },

  chapterMeta: {
    color: '#07545c',
    fontSize: '1.02rem',
    fontWeight: 800,
    marginLeft: 8,
  },

  iconBtn: {
    background: '#fff !important',
    border: '3px solid #d6f3ed !important',
    marginLeft: '4px !important',
    boxShadow: '0 4px 0 rgba(7,148,127,.10)',
  },

  iconBtnDelete: {
    background: '#fff1f1 !important',
    border: '3px solid #ffb7b7 !important',
    color: '#e53935 !important',
    marginLeft: '4px !important',
    boxShadow: '0 4px 0 rgba(141,22,22,.12)',
  },

  lessonItem: {
    borderRadius: '22px !important',
    border: '4px solid #eef7f5',
    marginBottom: 12,
    background: '#fff',
    padding: '12px 18px !important',
    boxShadow: '0 5px 0 rgba(7,148,127,.08)',
    '&:hover': {
      background: '#f3fffc',
      borderColor: '#19c7a8',
    },
  },

  lessonPrimary: {
    fontSize: '1.15rem',
    fontWeight: 900,
    color: '#06434b',
  },

  lessonSecondary: {
    fontSize: '1rem',
    color: '#07545c',
    fontWeight: 800,
  },

  addLessonBtn: {
    background: 'linear-gradient(180deg,#ffffff,#eefdf9) !important',
    color: '#056d5e !important',
    border: '3px solid #19c7a8 !important',
    borderRadius: '999px !important',
    padding: '10px 20px !important',
    fontSize: '1.05rem !important',
    fontWeight: '900 !important',
    fontFamily: `${GAME_FONT} !important`,
    textTransform: 'none !important',
    boxShadow: '0 6px 0 rgba(7,148,127,.18) !important',
  },

  addChapterBtn: {
    background: 'linear-gradient(180deg,#ffdf3b,#ff8a00) !important',
    color: '#fff !important',
    border: '4px solid #fff !important',
    borderRadius: '999px !important',
    padding: '15px 30px !important',
    fontSize: '1.18rem !important',
    fontWeight: '900 !important',
    fontFamily: `${GAME_FONT} !important`,
    textTransform: 'none !important',
    boxShadow: '0 8px 0 #bd5f00 !important',
    marginTop: '10px !important',
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

  dialogActions: {
    padding: '20px 30px 28px !important',
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

  tabs: {
    marginBottom: 22,
    background: '#fff',
    borderRadius: 999,
    border: '3px solid #d6f3ed',
    padding: 4,
    '& .MuiTab-root': {
      fontFamily: GAME_FONT,
      fontSize: '1.05rem',
      fontWeight: 900,
      textTransform: 'none',
      borderRadius: 999,
      minHeight: 46,
    },
    '& .Mui-selected': {
      color: '#07947f !important',
    },
    '& .MuiTabs-indicator': {
      display: 'none',
    },
  },

  miniBox: {
    border: '4px solid #d6f3ed',
    borderRadius: 24,
    padding: 18,
    marginBottom: 16,
    background: '#fff',
    boxShadow: '0 6px 0 rgba(7,148,127,.10)',
  },

  miniTitle: {
    fontWeight: 900,
    color: '#06434b',
    fontSize: '1.18rem',
    marginBottom: 12,
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

  loading: {
    minHeight: '80vh',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    background: '#042b33',
  },

  notFound: {
    minHeight: '80vh',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    background: '#042b33',
    color: '#fff',
    fontFamily: GAME_FONT,
    fontSize: '1.4rem',
    fontWeight: 900,
  },
}));

function ChapterForm({ open, onClose, onSubmit, initialData }) {
  const classes = useStyle();

  const [form, setForm] = useState({
    title: '',
    description: '',
    isFree: false,
  });

  useEffect(() => {
    if (initialData) {
      setForm({
        title: initialData.title || '',
        description: initialData.description || '',
        isFree: initialData.isFree || false,
      });
    } else {
      setForm({
        title: '',
        description: '',
        isFree: false,
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
        {initialData ? '✏️ Sửa chương' : '➕ Thêm chương mới'}
      </DialogTitle>

      <DialogContent className={classes.dialogContent}>
        <TextField
          className={classes.formField}
          label="Tên chương *"
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
          minRows={3}
        />

        <FormControlLabel
          className={classes.switchLabel}
          control={
            <Switch
              checked={form.isFree}
              onChange={(e) => setForm({ ...form, isFree: e.target.checked })}
              color="primary"
            />
          }
          label="Xem thử miễn phí"
        />
      </DialogContent>

      <DialogActions className={classes.dialogActions}>
        <Button onClick={onClose} className={classes.cancelDialogBtn}>
          Hủy
        </Button>

        <Button
          onClick={() => onSubmit(form)}
          variant="contained"
          className={classes.saveDialogBtn}
          disabled={!form.title.trim()}
        >
          {initialData ? 'Lưu' : 'Thêm chương'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

function LessonForm({ open, onClose, onSubmit, initialData }) {
  const classes = useStyle();

  const [tab, setTab] = useState(0);

  const [form, setForm] = useState({
    title: '',
    type: 'video',
    videoUrl: '',
    content: '',
    isFree: false,
    timeLimit: 0,
    hasExercise: true,
    words: [],
    questions: [],
    fillBlanks: [],
    materials: [],
  });

  useEffect(() => {
    if (!open) return;

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
        title: '',
        type: 'video',
        videoUrl: '',
        content: '',
        isFree: false,
        timeLimit: 0,
        hasExercise: true,
        words: [],
        questions: [],
        fillBlanks: [],
        materials: [],
      });
    }

    setTab(0);
  }, [open, initialData?._id]);

  const addWord = () => {
    setForm({
      ...form,
      words: [...form.words, { word: '', mean: '', phonetic: '', picture: '', example: '' }],
    });
  };

  const updateWord = (i, field, val) => {
    const words = [...form.words];
    words[i] = { ...words[i], [field]: val };
    setForm({ ...form, words });
  };

  const removeWord = (i) => {
    setForm({ ...form, words: form.words.filter((_, idx) => idx !== i) });
  };

  const addQuestion = () => {
    setForm({
      ...form,
      questions: [
        ...form.questions,
        {
          question: '',
          options: ['', '', '', ''],
          correctIndex: 0,
          explanation: '',
        },
      ],
    });
  };

  const updateQuestion = (i, field, val) => {
    const questions = [...form.questions];
    questions[i] = { ...questions[i], [field]: val };
    setForm({ ...form, questions });
  };

  const updateOption = (qi, oi, val) => {
    const questions = [...form.questions];
    questions[qi].options[oi] = val;
    setForm({ ...form, questions });
  };

  const removeQuestion = (i) => {
    setForm({ ...form, questions: form.questions.filter((_, idx) => idx !== i) });
  };

  const addFillBlank = () => {
    setForm({
      ...form,
      fillBlanks: [...form.fillBlanks, { sentence: '', correctAnswer: '', hint: '' }],
    });
  };

  const updateFillBlank = (i, field, val) => {
    const fillBlanks = [...form.fillBlanks];
    fillBlanks[i] = { ...fillBlanks[i], [field]: val };
    setForm({ ...form, fillBlanks });
  };

  const removeFillBlank = (i) => {
    setForm({ ...form, fillBlanks: form.fillBlanks.filter((_, idx) => idx !== i) });
  };

  const addMaterial = () => {
    setForm({
      ...form,
      materials: [...form.materials, { title: '', content: '', fileUrl: '' }],
    });
  };

  const updateMaterial = (i, field, val) => {
    const materials = [...form.materials];
    materials[i] = { ...materials[i], [field]: val };
    setForm({ ...form, materials });
  };

  const removeMaterial = (i) => {
    setForm({ ...form, materials: form.materials.filter((_, idx) => idx !== i) });
  };

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
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      classes={{ paper: classes.dialogPaper }}
    >
      <DialogTitle className={classes.dialogTitle}>
        {initialData ? '✏️ Sửa bài học' : '➕ Thêm bài học mới'}
      </DialogTitle>

      <DialogContent className={classes.dialogContent}>
        <Tabs value={tab} onChange={(_, v) => setTab(v)} className={classes.tabs}>
          <Tab label="Thông tin" />
          <Tab label="Video & Tài liệu" />
          <Tab label="Bài tập" />
        </Tabs>

        {tab === 0 && (
          <div>
            <TextField
              className={classes.formField}
              label="Tên bài học *"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              variant="outlined"
            />

            <FormControl variant="outlined" className={classes.formControl}>
              <InputLabel>Loại bài học</InputLabel>
              <Select
                value={form.type}
                onChange={(e) => setForm({ ...form, type: e.target.value })}
                label="Loại bài học"
              >
                <MenuItem value="video">Video bài giảng + Bài tập</MenuItem>
                <MenuItem value="quiz">Chỉ trắc nghiệm</MenuItem>
                <MenuItem value="fill_blank">Chỉ điền từ</MenuItem>
                <MenuItem value="flashcard">Chỉ flashcard từ vựng</MenuItem>
                <MenuItem value="mixed">Kết hợp nhiều loại</MenuItem>
                <MenuItem value="text">Chỉ lý thuyết/tài liệu</MenuItem>
              </Select>
            </FormControl>

            <TextField
              className={classes.formField}
              label="Thời gian làm bài (phút, 0 = không giới hạn)"
              type="number"
              value={form.timeLimit}
              onChange={(e) => setForm({ ...form, timeLimit: Number(e.target.value) })}
              variant="outlined"
            />

            <div style={{ display: 'flex', gap: 18, flexWrap: 'wrap' }}>
              <FormControlLabel
                className={classes.switchLabel}
                control={
                  <Switch
                    checked={form.isFree}
                    onChange={(e) => setForm({ ...form, isFree: e.target.checked })}
                    color="primary"
                  />
                }
                label="Xem thử miễn phí"
              />

              <FormControlLabel
                className={classes.switchLabel}
                control={
                  <Switch
                    checked={form.hasExercise}
                    onChange={(e) => setForm({ ...form, hasExercise: e.target.checked })}
                    color="primary"
                  />
                }
                label="Có bài tập"
              />
            </div>

            {form.isFree && (
              <div
                style={{
                  background: '#d4f5eb',
                  padding: 16,
                  borderRadius: 20,
                  marginTop: 14,
                  fontSize: '1.08rem',
                  color: '#057a55',
                  fontWeight: 900,
                  border: '3px solid #a8e8db',
                }}
              >
                Bài này sẽ hiển thị miễn phí cho tất cả học viên, kể cả chưa đăng ký.
              </div>
            )}
          </div>
        )}

        {tab === 1 && (
          <div>
            <div className={classes.miniTitle}>🎬 Video bài giảng</div>

            <p style={{ color: '#07545c', fontSize: '1.05rem', fontWeight: 800, marginBottom: 12 }}>
              Dán link YouTube hoặc Google Drive. Drive cần bật “Anyone with the link can view”.
            </p>

            <TextField
              className={classes.formField}
              label="Link video"
              value={form.videoUrl}
              onChange={(e) => setForm({ ...form, videoUrl: e.target.value })}
              variant="outlined"
              placeholder="https://www.youtube.com/watch?v=..."
            />

            {form.videoUrl && getYoutubePreview(form.videoUrl) && (
              <div
                style={{
                  marginBottom: 24,
                  borderRadius: 24,
                  overflow: 'hidden',
                  maxWidth: 580,
                  position: 'relative',
                  paddingTop: '32%',
                  border: '5px solid #d6f3ed',
                  boxShadow: '0 8px 0 rgba(7,148,127,.16)',
                }}
              >
                <iframe
                  src={getYoutubePreview(form.videoUrl)}
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    border: 'none',
                  }}
                  allowFullScreen
                  title="preview"
                />
              </div>
            )}

            <div className={classes.miniTitle}>📖 Nội dung lý thuyết</div>

            <TextField
              className={classes.formField}
              label="Nội dung lý thuyết"
              value={form.content}
              onChange={(e) => setForm({ ...form, content: e.target.value })}
              variant="outlined"
              multiline
              minRows={6}
              placeholder="<h3>Lý thuyết</h3><p>Nội dung...</p>"
            />

            <div className={classes.miniTitle}>📎 Tài liệu đính kèm ({form.materials.length})</div>

            {form.materials.map((material, i) => (
              <div key={i} className={classes.miniBox}>
                <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12 }}>
                  <div className={classes.miniTitle}>Tài liệu {i + 1}</div>

                  <IconButton
                    size="small"
                    className={classes.iconBtnDelete}
                    onClick={() => removeMaterial(i)}
                  >
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                </div>

                <TextField
                  label="Tên tài liệu *"
                  value={material.title}
                  onChange={(e) => updateMaterial(i, 'title', e.target.value)}
                  variant="outlined"
                  size="small"
                  className={classes.formField}
                />

                <TextField
                  label="Link tài liệu"
                  value={material.fileUrl}
                  onChange={(e) => updateMaterial(i, 'fileUrl', e.target.value)}
                  variant="outlined"
                  size="small"
                  className={classes.formField}
                  placeholder="https://drive.google.com/file/d/.../view"
                />

                <TextField
                  label="Mô tả ngắn"
                  value={material.content}
                  onChange={(e) => updateMaterial(i, 'content', e.target.value)}
                  variant="outlined"
                  size="small"
                  className={classes.formField}
                />
              </div>
            ))}

            <Button startIcon={<AddIcon />} onClick={addMaterial} className={classes.addLessonBtn}>
              Thêm tài liệu
            </Button>
          </div>
        )}

        {tab === 2 && (
          <div>
            {form.type === 'text' ? (
              <div className={classes.emptyBox}>
                Bài “Chỉ lý thuyết” không cần bài tập. Chuyển sang loại khác nếu muốn thêm bài tập.
              </div>
            ) : (
              <>
                {showFlashcard && (
                  <div style={{ marginBottom: 28 }}>
                    <div className={classes.miniTitle}>🃏 Flashcard từ vựng ({form.words.length} từ)</div>

                    {form.words.map((word, i) => (
                      <div key={i} className={classes.miniBox}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12 }}>
                          <div className={classes.miniTitle}>Từ {i + 1}</div>

                          <IconButton
                            size="small"
                            onClick={() => removeWord(i)}
                            className={classes.iconBtnDelete}
                          >
                            <DeleteIcon fontSize="small" />
                          </IconButton>
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                          <TextField
                            label="Từ vựng *"
                            value={word.word}
                            onChange={(e) => updateWord(i, 'word', e.target.value)}
                            variant="outlined"
                            size="small"
                            className={classes.formField}
                          />

                          <TextField
                            label="Nghĩa *"
                            value={word.mean}
                            onChange={(e) => updateWord(i, 'mean', e.target.value)}
                            variant="outlined"
                            size="small"
                            className={classes.formField}
                          />

                          <TextField
                            label="Phiên âm"
                            value={word.phonetic}
                            onChange={(e) => updateWord(i, 'phonetic', e.target.value)}
                            variant="outlined"
                            size="small"
                            className={classes.formField}
                          />

                          <TextField
                            label="Ví dụ"
                            value={word.example}
                            onChange={(e) => updateWord(i, 'example', e.target.value)}
                            variant="outlined"
                            size="small"
                            className={classes.formField}
                          />
                        </div>

                        <TextField
                          label="Link ảnh"
                          value={word.picture}
                          onChange={(e) => updateWord(i, 'picture', e.target.value)}
                          variant="outlined"
                          size="small"
                          className={classes.formField}
                        />
                      </div>
                    ))}

                    <Button startIcon={<AddIcon />} onClick={addWord} className={classes.addLessonBtn}>
                      Thêm từ
                    </Button>
                  </div>
                )}

                {showQuiz && (
                  <div style={{ marginBottom: 28 }}>
                    <div className={classes.miniTitle}>
                      ✅ Câu hỏi trắc nghiệm ({form.questions.length} câu)
                    </div>

                    {form.questions.map((question, qi) => (
                      <div key={qi} className={classes.miniBox}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12 }}>
                          <div className={classes.miniTitle}>Câu {qi + 1}</div>

                          <IconButton
                            size="small"
                            onClick={() => removeQuestion(qi)}
                            className={classes.iconBtnDelete}
                          >
                            <DeleteIcon fontSize="small" />
                          </IconButton>
                        </div>

                        <TextField
                          label="Câu hỏi *"
                          value={question.question}
                          onChange={(e) => updateQuestion(qi, 'question', e.target.value)}
                          variant="outlined"
                          size="small"
                          className={classes.formField}
                          multiline
                        />

                        {question.options.map((opt, oi) => (
                          <div
                            key={oi}
                            style={{
                              display: 'flex',
                              gap: 10,
                              alignItems: 'center',
                              marginBottom: 10,
                            }}
                          >
                            <input
                              type="radio"
                              name={`q${qi}`}
                              checked={question.correctIndex === oi}
                              onChange={() => updateQuestion(qi, 'correctIndex', oi)}
                              style={{ cursor: 'pointer', width: 20, height: 20 }}
                            />

                            <span
                              style={{
                                minWidth: 34,
                                fontWeight: 900,
                                color: '#06434b',
                                fontSize: '1.08rem',
                              }}
                            >
                              {['A', 'B', 'C', 'D'][oi]}.
                            </span>

                            <TextField
                              label={`Đáp án ${['A', 'B', 'C', 'D'][oi]}`}
                              value={opt}
                              onChange={(e) => updateOption(qi, oi, e.target.value)}
                              variant="outlined"
                              size="small"
                              className={classes.formField}
                              style={{ marginBottom: 0 }}
                            />
                          </div>
                        ))}

                        <TextField
                          label="Giải thích đáp án"
                          value={question.explanation}
                          onChange={(e) => updateQuestion(qi, 'explanation', e.target.value)}
                          variant="outlined"
                          size="small"
                          className={classes.formField}
                        />
                      </div>
                    ))}

                    <Button startIcon={<AddIcon />} onClick={addQuestion} className={classes.addLessonBtn}>
                      Thêm câu hỏi
                    </Button>
                  </div>
                )}

                {showFillBlank && (
                  <div>
                    <div className={classes.miniTitle}>
                      ✏️ Câu điền từ ({form.fillBlanks.length} câu)
                    </div>

                    {form.fillBlanks.map((fillBlank, i) => (
                      <div key={i} className={classes.miniBox}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12 }}>
                          <div className={classes.miniTitle}>Câu {i + 1}</div>

                          <IconButton
                            size="small"
                            onClick={() => removeFillBlank(i)}
                            className={classes.iconBtnDelete}
                          >
                            <DeleteIcon fontSize="small" />
                          </IconButton>
                        </div>

                        <TextField
                          label="Câu có chỗ trống *"
                          value={fillBlank.sentence}
                          onChange={(e) => updateFillBlank(i, 'sentence', e.target.value)}
                          variant="outlined"
                          size="small"
                          className={classes.formField}
                          placeholder="She ___ to school every day."
                          multiline
                        />

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                          <TextField
                            label="Đáp án đúng *"
                            value={fillBlank.correctAnswer}
                            onChange={(e) => updateFillBlank(i, 'correctAnswer', e.target.value)}
                            variant="outlined"
                            size="small"
                            className={classes.formField}
                          />

                          <TextField
                            label="Gợi ý"
                            value={fillBlank.hint}
                            onChange={(e) => updateFillBlank(i, 'hint', e.target.value)}
                            variant="outlined"
                            size="small"
                            className={classes.formField}
                          />
                        </div>
                      </div>
                    ))}

                    <Button startIcon={<AddIcon />} onClick={addFillBlank} className={classes.addLessonBtn}>
                      Thêm câu điền từ
                    </Button>
                  </div>
                )}
              </>
            )}
          </div>
        )}
      </DialogContent>

      <DialogActions className={classes.dialogActions}>
        <Button onClick={onClose} className={classes.cancelDialogBtn}>
          Hủy
        </Button>

        <Button
          onClick={() => onSubmit(form)}
          variant="contained"
          className={classes.saveDialogBtn}
          disabled={!form.title.trim()}
        >
          {initialData ? 'Lưu thay đổi' : 'Thêm bài học'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

function TeacherCourseDetail() {
  const classes = useStyle();
  const { id: courseId } = useParams();
  const history = useHistory();
  const dispatch = useDispatch();

  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);

  const [chapterDialog, setChapterDialog] = useState({
    open: false,
    data: null,
  });

  const [lessonDialog, setLessonDialog] = useState({
    open: false,
    data: null,
    chapterId: null,
  });

  const [pendingList, setPendingList] = useState([]);
  const [studentsProgress, setStudentsProgress] = useState([]);
  const [expandedStudent, setExpandedStudent] = useState(null);

  const loadCourse = async () => {
    setLoading(true);

    try {
      const res = await courseApi.getCourseDetail(courseId);

      if (res.status === 200) {
        setCourse(res.data.course);
      }
    } catch (e) {}

    setLoading(false);
  };

  const loadPending = async () => {
    try {
      const res = await courseApi.getPendingEnrollments();

      if (res.status === 200) {
        const filtered = (res.data.list || []).filter((enrollment) => {
          const cId = enrollment.courseId?._id || enrollment.courseId;
          return cId === courseId || cId?.toString() === courseId;
        });

        setPendingList(filtered);
      }
    } catch (e) {}
  };

  const loadStudentsProgress = async () => {
    try {
      const res = await courseApi.getStudentsProgress(courseId);

      if (res.status === 200) {
        setStudentsProgress(res.data.students || []);
      }
    } catch (e) {}
  };

  useEffect(() => {
    loadCourse();
    loadPending();
    loadStudentsProgress();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [courseId]);

  const handleApprove = async (enrollmentId) => {
    try {
      await courseApi.approveEnrollment(enrollmentId);
      setPendingList((prev) => prev.filter((enrollment) => enrollment._id !== enrollmentId));
      dispatch(setMessage({ type: 'success', message: 'Đã duyệt học viên vào lớp!' }));
    } catch (e) {
      dispatch(setMessage({ type: 'error', message: 'Lỗi duyệt!' }));
    }
  };

  const handleReject = async (enrollmentId) => {
    try {
      await courseApi.rejectEnrollment(enrollmentId);
      setPendingList((prev) => prev.filter((enrollment) => enrollment._id !== enrollmentId));
      dispatch(setMessage({ type: 'warning', message: 'Đã từ chối học viên.' }));
    } catch (e) {}
  };

  const handleChapterSubmit = async (formData) => {
    try {
      if (chapterDialog.data) {
        await courseApi.updateChapter(courseId, chapterDialog.data._id, formData);
        dispatch(setMessage({ type: 'success', message: 'Cập nhật chương thành công!' }));
      } else {
        await courseApi.createChapter(courseId, formData);
        dispatch(setMessage({ type: 'success', message: 'Thêm chương thành công!' }));
      }

      setChapterDialog({ open: false, data: null });
      loadCourse();
    } catch (e) {
      dispatch(setMessage({ type: 'error', message: 'Có lỗi xảy ra!' }));
    }
  };

  const handleDeleteChapter = async (chapterId) => {
    if (!window.confirm('Xóa chương này sẽ xóa tất cả bài học bên trong. Tiếp tục?')) return;

    try {
      await courseApi.deleteChapter(courseId, chapterId);
      dispatch(setMessage({ type: 'success', message: 'Xóa chương thành công!' }));
      loadCourse();
    } catch (e) {
      dispatch(setMessage({ type: 'error', message: 'Lỗi xóa chương!' }));
    }
  };

  const handleLessonSubmit = async (formData) => {
    try {
      if (lessonDialog.data) {
        await courseApi.updateLesson(courseId, lessonDialog.data._id, formData);
        dispatch(setMessage({ type: 'success', message: 'Cập nhật bài học thành công!' }));
      } else {
        await courseApi.createLesson(courseId, lessonDialog.chapterId, formData);
        dispatch(setMessage({ type: 'success', message: 'Thêm bài học thành công!' }));
      }

      setLessonDialog({ open: false, data: null, chapterId: null });
      loadCourse();
    } catch (e) {
      dispatch(setMessage({ type: 'error', message: 'Có lỗi xảy ra!' }));
    }
  };

  const handleDeleteLesson = async (lessonId) => {
    if (!window.confirm('Bạn có chắc muốn xóa bài học này?')) return;

    try {
      await courseApi.deleteLesson(courseId, lessonId);
      dispatch(setMessage({ type: 'success', message: 'Xóa bài học thành công!' }));
      loadCourse();
    } catch (e) {
      dispatch(setMessage({ type: 'error', message: 'Lỗi xóa bài học!' }));
    }
  };

  if (loading) {
    return (
      <div className={classes.loading}>
        <CircularProgress style={{ color: '#fff' }} size={58} thickness={5} />
      </div>
    );
  }

  if (!course) {
    return <div className={classes.notFound}>Không tìm thấy khóa học.</div>;
  }

  return (
    <div className={classes.page}>
      <div className={classes.wrapper}>
        <div className={classes.hero}>
          <div className={classes.heroDecor}>🎓</div>

          <div className={classes.header}>
            <Button
              startIcon={<ArrowBackIcon />}
              onClick={() => history.push('/teacher/courses')}
              className={classes.backBtn}
            >
              Quay lại
            </Button>

            <div style={{ flex: 1, minWidth: 280 }}>
              <h1 className={classes.pageTitle}>{course.title}</h1>

              <div className={classes.chipsRow}>
                <Chip className={classes.heroChip} label={`🎯 ${course.level}`} />
                <Chip
                  className={classes.heroChip}
                  label={course.status === 'published' ? '✅ Đã xuất bản' : '📝 Nháp'}
                />
                <Chip className={classes.heroChip} label={`📚 ${course.totalChapters || 0} chương`} />
                <Chip className={classes.heroChip} label={`✏️ ${course.totalLessons || 0} bài học`} />
                <Chip className={classes.heroChip} label={`👥 ${course.totalStudents || 0} học viên`} />
              </div>
            </div>
          </div>
        </div>

        {pendingList.length > 0 && (
          <div className={classes.pendingCard}>
            <div className={classes.pendingTitle}>
              <PeopleIcon />
              Học viên chờ duyệt vào lớp ({pendingList.length} người)
            </div>

            {pendingList.map((enrollment) => (
              <div key={enrollment._id} className={classes.pendingItem}>
                <div>
                  <div className={classes.pendingName}>{enrollment.studentName}</div>
                  <div className={classes.pendingMeta}>
                    Xin vào: {enrollment.courseId?.title || 'Khóa học này'}
                  </div>
                </div>

                <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                  <Button
                    size="small"
                    variant="contained"
                    className={classes.approveBtn}
                    startIcon={<CheckIcon />}
                    onClick={() => handleApprove(enrollment._id)}
                  >
                    Duyệt
                  </Button>

                  <Button
                    size="small"
                    variant="outlined"
                    className={classes.rejectBtn}
                    startIcon={<CloseIcon />}
                    onClick={() => handleReject(enrollment._id)}
                  >
                    Từ chối
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className={classes.sectionCard}>
          <div className={classes.sectionTitle}>
            <SchoolIcon />
            Học sinh đã đăng ký ({studentsProgress.length} người)
            <Button
              size="small"
              variant="outlined"
              className={classes.refreshBtn}
              onClick={loadStudentsProgress}
            >
              Làm mới
            </Button>
          </div>

          {studentsProgress.length === 0 ? (
            <div className={classes.emptyBox}>
              Chưa có học sinh nào đăng ký khóa học này.
            </div>
          ) : (
            studentsProgress.map((student) => (
              <div
                key={student.studentAccountId}
                className={classes.studentCard}
                onClick={() =>
                  setExpandedStudent(
                    expandedStudent === student.studentAccountId
                      ? null
                      : student.studentAccountId
                  )
                }
              >
                <div className={classes.studentCardHeader}>
                  <Avatar className={classes.avatar}>
                    {student.studentName ? student.studentName[0].toUpperCase() : '?'}
                  </Avatar>

                  <div style={{ flex: 1 }}>
                    <div className={classes.studentName}>{student.studentName}</div>

                    <div className={classes.studentMeta}>
                      Hoàn thành: {student.completedLessons}/{student.totalLessons} bài
                      {' · '}
                      {student.progressPercent}%
                      {' · '}
                      Đăng ký:{' '}
                      {student.enrolledAt
                        ? new Date(student.enrolledAt).toLocaleDateString('vi-VN')
                        : '—'}
                    </div>
                  </div>

                  <div
                    className={classes.progressLabel}
                    style={{
                      color: student.progressPercent === 100 ? '#0ca84f' : '#07947f',
                    }}
                  >
                    {student.progressPercent === 100 ? '✅ Xong' : `${student.progressPercent}%`}
                  </div>
                </div>

                <LinearProgress
                  className={classes.progressBar}
                  variant="determinate"
                  value={student.progressPercent}
                />

                <Collapse in={expandedStudent === student.studentAccountId}>
                  <div
                    style={{
                      marginTop: 18,
                      paddingTop: 12,
                      borderTop: '3px solid #eef7f5',
                    }}
                  >
                    <div
                      style={{
                        fontWeight: 900,
                        fontSize: '1.12rem',
                        marginBottom: 8,
                        color: '#06434b',
                      }}
                    >
                      Chi tiết từng bài:
                    </div>

                    {student.lessons.map((lesson) => (
                      <div key={lesson.lessonId} className={classes.lessonProgressRow}>
                        {lesson.status === 'completed' ? (
                          <DoneIcon style={{ color: '#4caf50', fontSize: 20 }} />
                        ) : lesson.status === 'in_progress' ? (
                          <HourglassEmptyIcon style={{ color: '#ff9800', fontSize: 20 }} />
                        ) : (
                          <FiberManualRecordIcon style={{ color: '#ccc', fontSize: 18 }} />
                        )}

                        <span style={{ flex: 1 }}>
                          Bài {lesson.lessonOrder}: {lesson.lessonTitle}
                        </span>

                        <span
                          style={{
                            fontSize: '0.95rem',
                            color:
                              lesson.status === 'completed'
                                ? '#4caf50'
                                : lesson.status === 'in_progress'
                                ? '#ff9800'
                                : '#aaa',
                            fontWeight: 900,
                          }}
                        >
                          {lesson.status === 'completed'
                            ? 'Hoàn thành'
                            : lesson.status === 'in_progress'
                            ? 'Đang học'
                            : 'Chưa học'}
                        </span>

                        {lesson.completedAt && (
                          <span style={{ fontSize: '0.9rem', color: '#888', marginLeft: 6 }}>
                            {new Date(lesson.completedAt).toLocaleDateString('vi-VN')}
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                </Collapse>
              </div>
            ))
          )}
        </div>

        <div className={classes.sectionCard}>
          <div className={classes.sectionTitle}>📚 Danh sách chương và bài học</div>

          {!course.chapters || course.chapters.length === 0 ? (
            <div className={classes.emptyBox}>
              <p style={{ margin: 0 }}>Khóa học chưa có chương nào.</p>
              <p style={{ margin: '8px 0 0', color: '#087565' }}>
                Hãy thêm chương đầu tiên!
              </p>
            </div>
          ) : (
            course.chapters.map((chapter) => (
              <Accordion key={chapter._id} defaultExpanded className={classes.accordion}>
                <AccordionSummary
                  expandIcon={<ExpandMoreIcon />}
                  className={classes.accordionSummary}
                >
                  <div className={classes.chapterHeader}>
                    <div className={classes.chapterLeft}>
                      <span className={classes.chapterOrder}>{chapter.order}</span>

                      <div>
                        <span className={classes.chapterTitle}>{chapter.title}</span>
                        <span className={classes.chapterMeta}>
                          ({chapter.lessons?.length || 0} bài)
                        </span>

                        {chapter.isFree && (
                          <Chip
                            size="small"
                            label="Xem thử"
                            style={{
                              marginLeft: 10,
                              backgroundColor: '#d4f5eb',
                              color: '#057a55',
                              fontSize: '0.85rem',
                              fontWeight: 900,
                              fontFamily: GAME_FONT,
                            }}
                          />
                        )}
                      </div>
                    </div>

                    <div
                      style={{ display: 'flex', gap: 4 }}
                      onClick={(event) => event.stopPropagation()}
                    >
                      <IconButton
                        size="small"
                        className={classes.iconBtn}
                        onClick={() => setChapterDialog({ open: true, data: chapter })}
                      >
                        <EditIcon fontSize="small" />
                      </IconButton>

                      <IconButton
                        size="small"
                        className={classes.iconBtnDelete}
                        onClick={() => handleDeleteChapter(chapter._id)}
                      >
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </div>
                  </div>
                </AccordionSummary>

                <AccordionDetails style={{ flexDirection: 'column', padding: '16px 20px 22px' }}>
                  <List dense>
                    {chapter.lessons?.map((lesson) => (
                      <ListItem key={lesson._id} className={classes.lessonItem}>
                        <ListItemText
                          primary={
                            <span className={classes.lessonPrimary}>
                              Bài {lesson.order}: {lesson.title}
                              {lesson.isFree && (
                                <Chip
                                  size="small"
                                  label="Xem thử"
                                  style={{
                                    marginLeft: 10,
                                    backgroundColor: '#d4f5eb',
                                    color: '#057a55',
                                    fontSize: '0.82rem',
                                    fontWeight: 900,
                                    fontFamily: GAME_FONT,
                                  }}
                                />
                              )}
                            </span>
                          }
                          secondary={
                            <span className={classes.lessonSecondary}>
                              {LESSON_TYPES.find((type) => type.value === lesson.type)?.label ||
                                lesson.type}
                              {lesson.timeLimit > 0 && ` · ${lesson.timeLimit} phút`}
                              {lesson.videoUrl && ' · Có video'}
                            </span>
                          }
                        />

                        <ListItemSecondaryAction>
                          <IconButton
                            size="small"
                            className={classes.iconBtn}
                            onClick={() =>
                              setLessonDialog({
                                open: true,
                                data: lesson,
                                chapterId: chapter._id,
                              })
                            }
                          >
                            <EditIcon fontSize="small" />
                          </IconButton>

                          <IconButton
                            size="small"
                            className={classes.iconBtnDelete}
                            onClick={() => handleDeleteLesson(lesson._id)}
                          >
                            <DeleteIcon fontSize="small" />
                          </IconButton>
                        </ListItemSecondaryAction>
                      </ListItem>
                    ))}
                  </List>

                  <Button
                    startIcon={<AddIcon />}
                    variant="outlined"
                    size="small"
                    className={classes.addLessonBtn}
                    onClick={() =>
                      setLessonDialog({
                        open: true,
                        data: null,
                        chapterId: chapter._id,
                      })
                    }
                  >
                    Thêm bài học
                  </Button>
                </AccordionDetails>
              </Accordion>
            ))
          )}

          <Button
            startIcon={<AddIcon />}
            variant="contained"
            className={classes.addChapterBtn}
            onClick={() => setChapterDialog({ open: true, data: null })}
          >
            Thêm chương mới
          </Button>
        </div>

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
    </div>
  );
}

export default TeacherCourseDetail;