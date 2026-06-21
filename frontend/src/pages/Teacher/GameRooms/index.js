import useTitle from 'hooks/useTitle';
import React, { useCallback, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import gameRoomApi from 'apis/gameRoomApi';

import AddIcon from '@material-ui/icons/Add';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import CloseIcon from '@material-ui/icons/Close';
import DeleteIcon from '@material-ui/icons/Delete';
import EditIcon from '@material-ui/icons/Edit';
import ErrorIcon from '@material-ui/icons/Error';
import FileCopyIcon from '@material-ui/icons/FileCopy';
import GamesIcon from '@material-ui/icons/Games';
import MeetingRoomIcon from '@material-ui/icons/MeetingRoom';
import PlayArrowIcon from '@material-ui/icons/PlayArrow';
import RefreshIcon from '@material-ui/icons/Refresh';
import SettingsIcon from '@material-ui/icons/Settings';
import StopIcon from '@material-ui/icons/Stop';

const GAME_FONT = '"Baloo 2", "Nunito", sans-serif';

const SITE_GRAD = 'linear-gradient(180deg, #ffdf3b 0%, #ff8a00 100%)';

const COLORS = {
  bg: '#05090d',
  panel: '#101c22',
  panel2: '#0b151a',
  border: 'rgba(25,199,168,.45)',
  main: '#19c7a8',
  mainDark: '#07947f',
  text: '#f6fffd',
  sub: '#bff8ee',
  muted: '#a7c9c4',
  yellow: '#ffdf3b',
  orange: '#ff8a00',
  green: '#36e27d',
  red: '#ff8a8a',
};

const S = {
  page: {
    height: 'calc(100vh - 112px)',
    minHeight: 620,
    background: `
      radial-gradient(circle at 14% 18%, rgba(25,199,168,.16) 0 4px, transparent 5px),
      radial-gradient(circle at 82% 22%, rgba(255,138,0,.13) 0 5px, transparent 6px),
      radial-gradient(circle at 28% 72%, rgba(255,20,147,.09) 0 4px, transparent 5px),
      linear-gradient(180deg, #05090d 0%, #071217 45%, #05090d 100%)
    `,
    backgroundSize: '90px 90px, 130px 130px, 110px 110px, auto',
    padding: 0,
    fontFamily: GAME_FONT,
    color: COLORS.text,
    overflow: 'hidden',
  },

  wrap: {
    height: '100%',
    maxWidth: 1320,
    margin: '0 auto',
    padding: '0 24px',
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden',
  },

  header: {
    flexShrink: 0,
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 16,
    marginBottom: 18,
    background: 'linear-gradient(180deg, rgba(18,31,38,.98), rgba(10,19,24,.98))',
    border: '3px solid rgba(25,199,168,.52)',
    borderRadius: 24,
    padding: '20px 24px',
    boxShadow: '0 7px 0 rgba(25,199,168,.16), 0 16px 34px rgba(0,0,0,.34)',
  },

  title: {
    fontSize: '1.9rem',
    fontWeight: 900,
    color: '#ffffff',
    margin: 0,
    lineHeight: 1.12,
    letterSpacing: '-0.025em',
    display: 'flex',
    alignItems: 'center',
    gap: 10,
    textShadow: '0 3px 0 rgba(25,199,168,.22)',
  },

  headerSub: {
    color: COLORS.sub,
    margin: '7px 0 0',
    fontSize: '.98rem',
    fontWeight: 800,
    lineHeight: 1.4,
  },

  content: {
    flex: 1,
    minHeight: 0,
    overflow: 'hidden',
    display: 'flex',
    flexDirection: 'column',
  },

  scrollArea: {
    flex: 1,
    minHeight: 0,
    overflowY: 'auto',
    paddingRight: 4,
    paddingBottom: 18,
  },

  btnPrimary: (disabled) => ({
    padding: '10px 18px',
    borderRadius: 999,
    border: '3px solid #fff',
    cursor: disabled ? 'not-allowed' : 'pointer',
    background: disabled ? '#4b5563' : SITE_GRAD,
    color: '#fff',
    fontWeight: 900,
    fontSize: '.94rem',
    fontFamily: GAME_FONT,
    opacity: disabled ? 0.7 : 1,
    boxShadow: disabled ? 'none' : '0 5px 0 #bd5f00, 0 12px 22px rgba(0,0,0,.26)',
    textShadow: '0 2px 0 rgba(0,0,0,.22)',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 7,
  }),

  btnSecondary: {
    padding: '9px 15px',
    borderRadius: 999,
    border: '2.5px solid rgba(25,199,168,.78)',
    cursor: 'pointer',
    background: 'linear-gradient(180deg,#14252d,#0d1a20)',
    color: '#d8fffa',
    fontWeight: 900,
    fontSize: '.88rem',
    fontFamily: GAME_FONT,
    boxShadow: '0 4px 0 rgba(25,199,168,.13)',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },

  btnDanger: {
    padding: '9px 15px',
    borderRadius: 999,
    border: '2.5px solid #ff8a8a',
    cursor: 'pointer',
    background: 'linear-gradient(180deg,#2b1015,#18080b)',
    color: '#ffb7b7',
    fontWeight: 900,
    fontSize: '.88rem',
    fontFamily: GAME_FONT,
    boxShadow: '0 4px 0 rgba(255,80,80,.15)',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },

  btnGreen: {
    padding: '9px 15px',
    borderRadius: 999,
    border: '2.5px solid #fff',
    cursor: 'pointer',
    background: 'linear-gradient(180deg,#36e27d,#0ca84f)',
    color: '#fff',
    fontWeight: 900,
    fontSize: '.88rem',
    fontFamily: GAME_FONT,
    boxShadow: '0 5px 0 #087a3c',
    textShadow: '0 2px 0 rgba(0,0,0,.22)',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },

  btnOrange: {
    padding: '9px 15px',
    borderRadius: 999,
    border: '2.5px solid #fff',
    cursor: 'pointer',
    background: 'linear-gradient(180deg,#ff8a00,#e85d00)',
    color: '#fff',
    fontWeight: 900,
    fontSize: '.88rem',
    fontFamily: GAME_FONT,
    boxShadow: '0 5px 0 #9b3200',
    textShadow: '0 2px 0 rgba(0,0,0,.22)',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },

  card: {
    background: 'linear-gradient(180deg, rgba(18,31,38,.98), rgba(10,19,24,.98))',
    borderRadius: 24,
    padding: '20px 22px',
    marginBottom: 16,
    border: '3px solid rgba(25,199,168,.42)',
    boxShadow: '0 6px 0 rgba(25,199,168,.13), 0 16px 32px rgba(0,0,0,.28)',
  },

  roomTitle: {
    fontWeight: 900,
    fontSize: '1.22rem',
    color: '#ffffff',
    marginBottom: 6,
    lineHeight: 1.22,
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    flexWrap: 'wrap',
  },

  roomDesc: {
    color: '#b7d8d4',
    fontSize: '.94rem',
    marginBottom: 12,
    fontWeight: 750,
    lineHeight: 1.45,
  },

  mutedText: {
    color: COLORS.muted,
    fontSize: '.9rem',
    fontWeight: 850,
  },

  roomCode: {
    fontFamily: 'monospace',
    fontSize: '1.08rem',
    fontWeight: 900,
    color: '#ffffff',
    letterSpacing: '0.13em',
    background: 'linear-gradient(180deg,#0a84ff,#00439d)',
    border: '2.5px solid #fff',
    borderRadius: 13,
    padding: '5px 12px',
    display: 'inline-block',
    boxShadow: '0 4px 0 rgba(0,67,157,.45)',
    textShadow: '0 2px 0 rgba(0,0,0,.24)',
  },

  badge: (n) => ({
    display: 'inline-flex',
    alignItems: 'center',
    background:
      n > 0
        ? 'linear-gradient(180deg,#36e27d,#0ca84f)'
        : 'linear-gradient(180deg,#475569,#1f2937)',
    color: '#fff',
    borderRadius: 999,
    padding: '5px 12px',
    fontSize: '.84rem',
    fontWeight: 900,
    border: '2.5px solid rgba(255,255,255,.9)',
    boxShadow: n > 0 ? '0 4px 0 #087a3c' : '0 4px 0 rgba(0,0,0,.20)',
  }),

  liveBadge: {
    display: 'inline-flex',
    background: 'linear-gradient(180deg,#ff4fa3,#c40075)',
    color: '#fff',
    borderRadius: 999,
    padding: '4px 10px',
    fontSize: '.78rem',
    fontWeight: 900,
    border: '2.5px solid #fff',
    boxShadow: '0 4px 0 #7c004b',
    textShadow: '0 2px 0 rgba(0,0,0,.20)',
  },

  modal: {
    position: 'fixed',
    inset: 0,
    background: 'rgba(0,0,0,0.76)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000,
    padding: 20,
    backdropFilter: 'blur(4px)',
  },

  modalCard: {
    background: 'linear-gradient(180deg,#121f26,#0a1318)',
    borderRadius: 26,
    padding: 0,
    width: '100%',
    maxWidth: 620,
    maxHeight: '88vh',
    overflow: 'hidden',
    border: '4px solid rgba(25,199,168,.72)',
    boxShadow: '0 9px 0 rgba(25,199,168,.20), 0 24px 54px rgba(0,0,0,.52)',
    display: 'flex',
    flexDirection: 'column',
  },

  modalHead: {
    flexShrink: 0,
    padding: '20px 24px',
    borderBottom: '3px solid rgba(25,199,168,.32)',
    background: 'linear-gradient(180deg,#14252d,#0d1a20)',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 14,
  },

  modalTitle: {
    fontSize: '1.35rem',
    fontWeight: 900,
    color: '#ffffff',
    margin: 0,
    lineHeight: 1.2,
    textShadow: '0 3px 0 rgba(25,199,168,.22)',
  },

  modalBody: {
    flex: 1,
    minHeight: 0,
    overflowY: 'auto',
    padding: '22px 24px',
  },

  label: {
    display: 'block',
    fontWeight: 900,
    color: '#d8fffa',
    marginBottom: 7,
    fontSize: '.94rem',
  },

  input: {
    width: '100%',
    padding: '11px 13px',
    borderRadius: 14,
    border: '2.5px solid rgba(25,199,168,.55)',
    background: '#071217',
    color: '#ffffff',
    fontSize: '.96rem',
    fontWeight: 800,
    fontFamily: GAME_FONT,
    outline: 'none',
    boxSizing: 'border-box',
    marginBottom: 15,
    boxShadow: '0 4px 0 rgba(25,199,168,.08)',
  },

  textarea: {
    width: '100%',
    padding: '11px 13px',
    borderRadius: 14,
    border: '2.5px solid rgba(25,199,168,.55)',
    background: '#071217',
    color: '#ffffff',
    fontSize: '.96rem',
    fontWeight: 800,
    fontFamily: GAME_FONT,
    outline: 'none',
    boxSizing: 'border-box',
    marginBottom: 15,
    resize: 'vertical',
    minHeight: 88,
    lineHeight: 1.5,
    boxShadow: '0 4px 0 rgba(25,199,168,.08)',
  },

  qHeader: {
    flexShrink: 0,
    background: 'linear-gradient(180deg, rgba(18,31,38,.98), rgba(10,19,24,.98))',
    border: '3px solid rgba(25,199,168,.42)',
    borderRadius: 22,
    padding: '16px 20px',
    marginBottom: 16,
    boxShadow: '0 5px 0 rgba(25,199,168,.12)',
  },

  questionList: {
    flex: 1,
    minHeight: 0,
    overflowY: 'auto',
    paddingRight: 4,
    paddingBottom: 18,
  },

  qItem: {
    background: 'linear-gradient(180deg,#111e25,#091217)',
    borderRadius: 22,
    padding: '17px 19px',
    marginBottom: 14,
    border: '3px solid rgba(10,132,255,.42)',
    boxShadow: '0 6px 0 rgba(10,132,255,.14), 0 14px 28px rgba(0,0,0,.24)',
  },

  qIndex: {
    color: '#7dd3fc',
    fontSize: '.88rem',
    marginBottom: 6,
    fontWeight: 900,
  },

  qText: {
    fontWeight: 900,
    color: '#ffffff',
    marginBottom: 8,
    fontSize: '1.03rem',
    lineHeight: 1.42,
  },

  qAnswer: {
    color: '#72ffad',
    fontSize: '.92rem',
    fontWeight: 900,
    marginTop: 4,
  },

  qChoices: {
    color: '#c6d7d4',
    fontSize: '.9rem',
    marginTop: 6,
    fontWeight: 750,
    lineHeight: 1.4,
  },

  hintText: {
    color: '#ffd86f',
    fontSize: '.9rem',
    marginTop: 6,
    fontWeight: 900,
  },

  timeText: {
    color: '#95aeb0',
    fontSize: '.84rem',
    marginTop: 6,
    fontWeight: 850,
  },

  noAccess: {
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'column',
    gap: 14,
    background: '#05090d',
    fontFamily: GAME_FONT,
  },

  noAccessText: {
    fontWeight: 900,
    color: '#d8fffa',
    fontSize: '1.05rem',
  },

  sessionBanner: {
    background: 'linear-gradient(180deg,#271900,#111111)',
    border: '3px solid #ffcf45',
    borderRadius: 22,
    padding: '15px 17px',
    marginBottom: 16,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    gap: 12,
    boxShadow: '0 5px 0 rgba(189,120,0,.25), 0 14px 28px rgba(0,0,0,.26)',
  },

  sessionTitle: {
    fontWeight: 900,
    color: COLORS.yellow,
    marginBottom: 5,
    fontSize: '1rem',
    textShadow: '0 2px 0 rgba(0,0,0,.24)',
  },

  pinBig: {
    fontFamily: 'monospace',
    fontSize: '1.75rem',
    fontWeight: 900,
    color: '#ffffff',
    letterSpacing: '0.18em',
    textShadow: '0 3px 0 #bd5f00',
    marginTop: 3,
  },

  emptyBox: {
    background: 'linear-gradient(180deg, rgba(18,31,38,.98), rgba(10,19,24,.98))',
    borderRadius: 24,
    padding: '42px 22px',
    marginBottom: 16,
    textAlign: 'center',
    border: '3px dashed rgba(25,199,168,.5)',
    boxShadow: '0 6px 0 rgba(25,199,168,.10), 0 16px 32px rgba(0,0,0,.28)',
  },

  sectionTitle: {
    fontSize: '1.16rem',
    fontWeight: 900,
    color: '#ffffff',
    margin: 0,
    textShadow: '0 3px 0 rgba(25,199,168,.20)',
    display: 'flex',
    alignItems: 'center',
    gap: 8,
  },
};

const EMPTY_ROOM = {
  title: '',
  description: '',
};

const EMPTY_Q = {
  question: '',
  answer: '',
  choices: ['', '', '', ''],
  timeLimit: 20,
  hint: '',
};

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
        fontFamily: GAME_FONT,
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

function ChoicesEditor({ choices, onChange }) {
  return (
    <div>
      {choices.map((choice, index) => (
        <div key={index} style={{ display: 'flex', gap: 10, marginBottom: 10 }}>
          <span
            style={{
              color: '#7dd3fc',
              minWidth: 24,
              paddingTop: 10,
              fontSize: '.9rem',
              fontWeight: 900,
            }}
          >
            {index + 1}.
          </span>

          <input
            style={{ ...S.input, marginBottom: 0, flex: 1 }}
            placeholder={`Lựa chọn ${index + 1}`}
            value={choice}
            onChange={(event) => {
              const updated = [...choices];
              updated[index] = event.target.value;
              onChange(updated);
            }}
          />
        </div>
      ))}
    </div>
  );
}

export default function TeacherGameRoomsPage() {
  useTitle('Quản lý phòng game');

  const userInfo = useSelector((state) => state.userInfo);
  const history = useHistory();

  const isAllowed = userInfo?.role === 'teacher' || userInfo?.role === 'admin';

  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);

  const [toast, setToast] = useState({
    show: false,
    type: 'success',
    title: '',
    message: '',
  });

  const [showCreateRoom, setShowCreateRoom] = useState(false);
  const [roomForm, setRoomForm] = useState(EMPTY_ROOM);
  const [editingRoom, setEditingRoom] = useState(null);

  const [selectedRoom, setSelectedRoom] = useState(null);
  const [showAddQ, setShowAddQ] = useState(false);
  const [qForm, setQForm] = useState(EMPTY_Q);
  const [editingQ, setEditingQ] = useState(null);

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

  const loadRooms = useCallback(async () => {
    setLoading(true);

    try {
      const res = await gameRoomApi.getTeacherRooms();
      setRooms(res.data.rooms || []);
    } catch {
      setRooms([]);

      showToast(
        'error',
        'Không tải được phòng game',
        'Danh sách phòng game chưa được tải. Vui lòng thử lại.',
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (isAllowed) loadRooms();
  }, [isAllowed, loadRooms]);

  useEffect(() => {
    if (!selectedRoom?.id) return;

    const updated = rooms.find((room) => room.id === selectedRoom.id);

    if (updated) setSelectedRoom(updated);
  }, [rooms, selectedRoom?.id]);

  const resetRoomModal = () => {
    setShowCreateRoom(false);
    setEditingRoom(null);
    setRoomForm(EMPTY_ROOM);
  };

  const resetQuestionModal = () => {
    setShowAddQ(false);
    setEditingQ(null);
    setQForm(EMPTY_Q);
  };

  const handleCreateRoom = async () => {
    if (!roomForm.title.trim()) {
      showToast('error', 'Thiếu tên phòng', 'Bạn cần nhập tên phòng trước khi tạo.');
      return;
    }

    try {
      await gameRoomApi.createTeacherRoom({
        title: roomForm.title.trim(),
        description: roomForm.description,
      });

      resetRoomModal();

      showToast(
        'success',
        'Tạo phòng thành công',
        'Phòng game mới đã được thêm vào danh sách.',
      );

      loadRooms();
    } catch {
      showToast('error', 'Không thể tạo phòng', 'Vui lòng thử lại sau.');
    }
  };

  const handleUpdateRoom = async () => {
    if (!editingRoom || !roomForm.title.trim()) {
      showToast('error', 'Thiếu tên phòng', 'Bạn cần nhập tên phòng trước khi lưu.');
      return;
    }

    try {
      await gameRoomApi.updateTeacherRoom(editingRoom.id, {
        title: roomForm.title.trim(),
        description: roomForm.description,
      });

      resetRoomModal();

      showToast(
        'success',
        'Cập nhật phòng thành công',
        'Thông tin phòng game đã được lưu lại.',
      );

      loadRooms();
    } catch {
      showToast('error', 'Không thể cập nhật phòng', 'Vui lòng thử lại sau.');
    }
  };

  const handleDeleteRoom = async (room) => {
    if (!window.confirm(`Xóa phòng "${room.title}"? Hành động này không thể hoàn tác.`)) {
      return;
    }

    try {
      if (room.activeLiveSession) {
        await gameRoomApi.cancelLiveSession(room.id).catch(() => {});
      }

      await gameRoomApi.deleteTeacherRoom(room.id);

      if (selectedRoom?.id === room.id) setSelectedRoom(null);

      showToast(
        'delete',
        'Đã xóa phòng',
        'Phòng game đã được xóa khỏi danh sách.',
      );

      loadRooms();
    } catch {
      showToast('error', 'Không thể xóa phòng', 'Vui lòng thử lại sau.');
    }
  };

  const validateQuestion = () => {
    if (!qForm.question.trim() || !qForm.answer.trim()) {
      showToast(
        'error',
        'Thiếu câu hỏi hoặc đáp án',
        'Bạn cần nhập đầy đủ câu hỏi và đáp án đúng.',
      );
      return null;
    }

    const filteredChoices = qForm.choices.filter((choice) => choice.trim());

    if (filteredChoices.length < 2) {
      showToast(
        'error',
        'Thiếu lựa chọn',
        'Câu hỏi cần có ít nhất 2 lựa chọn.',
      );
      return null;
    }

    if (!filteredChoices.includes(qForm.answer.trim())) {
      showToast(
        'error',
        'Đáp án chưa khớp',
        'Đáp án đúng phải nằm trong danh sách lựa chọn.',
      );
      return null;
    }

    return filteredChoices;
  };

  const handleAddQuestion = async () => {
    if (!selectedRoom) return;

    const filteredChoices = validateQuestion();

    if (!filteredChoices) return;

    try {
      const res = await gameRoomApi.addQuestion(selectedRoom.id, {
        question: qForm.question.trim(),
        answer: qForm.answer.trim(),
        choices: filteredChoices,
        timeLimit: qForm.timeLimit || 20,
        hint: qForm.hint,
      });

      resetQuestionModal();
      setSelectedRoom(res.data.room);

      showToast(
        'success',
        'Thêm câu hỏi thành công',
        'Câu hỏi mới đã được thêm vào phòng game.',
      );

      loadRooms();
    } catch {
      showToast('error', 'Không thể thêm câu hỏi', 'Vui lòng thử lại sau.');
    }
  };

  const handleUpdateQuestion = async () => {
    if (!editingQ || !selectedRoom) return;

    const filteredChoices = validateQuestion();

    if (!filteredChoices) return;

    try {
      const res = await gameRoomApi.updateQuestion(selectedRoom.id, editingQ.id, {
        question: qForm.question.trim(),
        answer: qForm.answer.trim(),
        choices: filteredChoices,
        timeLimit: qForm.timeLimit || 20,
        hint: qForm.hint,
      });

      resetQuestionModal();
      setSelectedRoom(res.data.room);

      showToast(
        'success',
        'Cập nhật câu hỏi thành công',
        'Nội dung câu hỏi đã được lưu lại.',
      );

      loadRooms();
    } catch {
      showToast('error', 'Không thể cập nhật câu hỏi', 'Vui lòng thử lại sau.');
    }
  };

  const handleDeleteQuestion = async (question) => {
    if (!selectedRoom) return;
    if (!window.confirm('Xóa câu hỏi này?')) return;

    try {
      const res = await gameRoomApi.deleteQuestion(selectedRoom.id, question.id);

      setSelectedRoom(res.data.room);

      showToast(
        'delete',
        'Đã xóa câu hỏi',
        'Câu hỏi đã được xóa khỏi phòng game.',
      );

      loadRooms();
    } catch {
      showToast('error', 'Không thể xóa câu hỏi', 'Vui lòng thử lại sau.');
    }
  };

  const handleStartLive = async (room) => {
    try {
      const res = await gameRoomApi.startLiveSession(room.id);
      const { pin, room: gameRoom, existing } = res.data;

      if (existing) {
        showToast(
          'success',
          'Phòng đang hoạt động',
          `Mã PIN hiện tại là ${pin}.`,
        );
      }

      await loadRooms();

      history.push('/games/multiplayer', {
        pin,
        gameRoomId: gameRoom?.id,
        isHost: true,
        teacherRoomId: room.id,
      });
    } catch (err) {
      showToast(
        'error',
        'Không thể tạo phòng live',
        err?.response?.data?.message || 'Vui lòng thử lại sau.',
      );
    }
  };

  const handleCancelLive = async (room) => {
    if (!window.confirm('Hủy phòng chơi đang hoạt động? Học sinh sẽ bị thoát.')) {
      return;
    }

    try {
      await gameRoomApi.cancelLiveSession(room.id);

      showToast(
        'delete',
        'Đã hủy phòng chơi',
        'Phiên chơi live đã được kết thúc.',
      );

      loadRooms();

      if (selectedRoom?.id === room.id) {
        setSelectedRoom((prev) => ({
          ...prev,
          activeLiveSession: null,
        }));
      }
    } catch {
      showToast('error', 'Không thể hủy phòng', 'Vui lòng thử lại sau.');
    }
  };

  const copyCode = (code) => {
    navigator.clipboard.writeText(code).catch(() => {});

    showToast(
      'success',
      'Đã sao chép mã',
      `Mã ${code} đã được lưu vào clipboard.`,
    );
  };

  const roomModal = (showCreateRoom || editingRoom) && (
    <div
      style={S.modal}
      onClick={(event) => {
        if (event.target === event.currentTarget) resetRoomModal();
      }}
    >
      <div style={S.modalCard}>
        <div style={S.modalHead}>
          <h2 style={S.modalTitle}>
            {editingRoom ? 'Chỉnh sửa phòng' : 'Tạo phòng mới'}
          </h2>

          <button type="button" style={S.btnSecondary} onClick={resetRoomModal}>
            <CloseIcon style={{ fontSize: 17 }} />
            Đóng
          </button>
        </div>

        <div style={S.modalBody}>
          <label style={S.label}>Tên phòng *</label>

          <input
            style={S.input}
            placeholder="VD: Ôn tập Unit 1..."
            value={roomForm.title}
            onChange={(event) =>
              setRoomForm({
                ...roomForm,
                title: event.target.value,
              })
            }
          />

          <label style={S.label}>Mô tả</label>

          <textarea
            style={S.textarea}
            placeholder="Mô tả nội dung..."
            value={roomForm.description}
            onChange={(event) =>
              setRoomForm({
                ...roomForm,
                description: event.target.value,
              })
            }
          />

          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
            <button
              type="button"
              style={S.btnPrimary(false)}
              onClick={editingRoom ? handleUpdateRoom : handleCreateRoom}
            >
              {editingRoom ? (
                <EditIcon style={{ fontSize: 18 }} />
              ) : (
                <AddIcon style={{ fontSize: 18 }} />
              )}
              {editingRoom ? 'Lưu thay đổi' : 'Tạo phòng'}
            </button>

            <button type="button" style={S.btnSecondary} onClick={resetRoomModal}>
              Hủy
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  const questionModal = (showAddQ || editingQ) && selectedRoom && (
    <div
      style={S.modal}
      onClick={(event) => {
        if (event.target === event.currentTarget) resetQuestionModal();
      }}
    >
      <div style={S.modalCard}>
        <div style={S.modalHead}>
          <h2 style={S.modalTitle}>
            {editingQ ? 'Sửa câu hỏi' : 'Thêm câu hỏi'}
          </h2>

          <button type="button" style={S.btnSecondary} onClick={resetQuestionModal}>
            <CloseIcon style={{ fontSize: 17 }} />
            Đóng
          </button>
        </div>

        <div style={S.modalBody}>
          <label style={S.label}>Câu hỏi / nghĩa / gợi ý *</label>

          <textarea
            style={S.textarea}
            placeholder="VD: What is the English word for 'con chó'?"
            value={qForm.question}
            onChange={(event) =>
              setQForm({
                ...qForm,
                question: event.target.value,
              })
            }
          />

          <label style={S.label}>Đáp án đúng *</label>

          <input
            style={S.input}
            placeholder="VD: dog"
            value={qForm.answer}
            onChange={(event) =>
              setQForm({
                ...qForm,
                answer: event.target.value,
              })
            }
          />

          <label style={S.label}>
            Các lựa chọn, tối thiểu 2 lựa chọn và phải có đáp án đúng *
          </label>

          <ChoicesEditor
            choices={qForm.choices}
            onChange={(choices) =>
              setQForm({
                ...qForm,
                choices,
              })
            }
          />

          <label style={S.label}>Gợi ý phonetic</label>

          <input
            style={S.input}
            placeholder="VD: /dɒɡ/"
            value={qForm.hint}
            onChange={(event) =>
              setQForm({
                ...qForm,
                hint: event.target.value,
              })
            }
          />

          <label style={S.label}>Thời gian trả lời, tính bằng giây</label>

          <input
            type="number"
            min={5}
            max={60}
            style={{ ...S.input, width: 160 }}
            value={qForm.timeLimit}
            onChange={(event) =>
              setQForm({
                ...qForm,
                timeLimit: parseInt(event.target.value, 10) || 20,
              })
            }
          />

          <div style={{ display: 'flex', gap: 10, marginTop: 4, flexWrap: 'wrap' }}>
            <button
              type="button"
              style={S.btnPrimary(false)}
              onClick={editingQ ? handleUpdateQuestion : handleAddQuestion}
            >
              {editingQ ? (
                <EditIcon style={{ fontSize: 18 }} />
              ) : (
                <AddIcon style={{ fontSize: 18 }} />
              )}
              {editingQ ? 'Lưu câu hỏi' : 'Thêm câu hỏi'}
            </button>

            <button type="button" style={S.btnSecondary} onClick={resetQuestionModal}>
              Hủy
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  if (!isAllowed) {
    return (
      <div style={S.noAccess}>
        <div style={{ fontSize: '3.4rem' }}>🔒</div>

        <div style={S.noAccessText}>
          Chỉ giáo viên hoặc admin mới có thể truy cập.
        </div>

        <button type="button" style={S.btnPrimary(false)} onClick={() => history.push('/')}>
          Về trang chủ
        </button>
      </div>
    );
  }

  if (!selectedRoom) {
    return (
      <div style={S.page}>
        <TeacherToast
          toast={toast}
          onClose={() =>
            setToast((prev) => ({
              ...prev,
              show: false,
            }))
          }
        />

        <div style={S.wrap}>
          <div style={S.header}>
            <div>
              <h1 style={S.title}>
                <GamesIcon style={{ fontSize: 31, color: COLORS.main }} />
                Quản lý phòng game
              </h1>

              <p style={S.headerSub}>
                Tạo phòng, thêm câu hỏi và bắt đầu chơi live với học sinh.
              </p>
            </div>

            <button
              type="button"
              style={S.btnPrimary(false)}
              onClick={() => {
                setShowCreateRoom(true);
                setRoomForm(EMPTY_ROOM);
              }}
            >
              <AddIcon style={{ fontSize: 18 }} />
              Tạo phòng mới
            </button>
          </div>

          <div style={S.content}>
            <div style={S.scrollArea}>
              {loading ? (
                <div style={S.emptyBox}>
                  <RefreshIcon
                    style={{
                      fontSize: 46,
                      marginBottom: 10,
                      color: COLORS.main,
                    }}
                  />

                  <p
                    style={{
                      color: '#d8fffa',
                      fontWeight: 900,
                      fontSize: '1rem',
                      margin: 0,
                    }}
                  >
                    Đang tải phòng game...
                  </p>
                </div>
              ) : rooms.length === 0 ? (
                <div style={S.emptyBox}>
                  <div style={{ fontSize: '3.4rem', marginBottom: 12 }}>🎯</div>

                  <p
                    style={{
                      color: '#d8fffa',
                      fontWeight: 900,
                      fontSize: '1rem',
                      margin: 0,
                    }}
                  >
                    Bạn chưa có phòng game nào.
                  </p>
                </div>
              ) : (
                rooms.map((room) => (
                  <div key={room.id} style={S.card}>
                    {room.activeLiveSession && (
                      <div style={S.sessionBanner}>
                        <div>
                          <div style={S.sessionTitle}>Đang có phòng chơi live</div>

                          <div style={S.mutedText}>Chia sẻ mã PIN này cho học sinh:</div>

                          <div style={S.pinBig}>{room.activeLiveSession.pin}</div>
                        </div>

                        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                          <button
                            type="button"
                            style={S.btnPrimary(false)}
                            onClick={() =>
                              history.push('/games/multiplayer', {
                                pin: room.activeLiveSession.pin,
                                isHost: true,
                                teacherRoomId: room.id,
                              })
                            }
                          >
                            <PlayArrowIcon style={{ fontSize: 18 }} />
                            Vào phòng chờ
                          </button>

                          <button
                            type="button"
                            style={S.btnOrange}
                            onClick={() => handleCancelLive(room)}
                          >
                            <StopIcon style={{ fontSize: 18 }} />
                            Hủy phòng
                          </button>
                        </div>
                      </div>
                    )}

                    <div
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'flex-start',
                        flexWrap: 'wrap',
                        gap: 14,
                      }}
                    >
                      <div style={{ flex: 1, minWidth: 260 }}>
                        <div style={S.roomTitle}>
                          <MeetingRoomIcon style={{ fontSize: 22, color: COLORS.main }} />
                          {room.title}
                          {room.activeLiveSession && <span style={S.liveBadge}>LIVE</span>}
                        </div>

                        {room.description && <div style={S.roomDesc}>{room.description}</div>}

                        <div
                          style={{
                            display: 'flex',
                            gap: 10,
                            flexWrap: 'wrap',
                            alignItems: 'center',
                          }}
                        >
                          <div>
                            <span style={S.mutedText}>Mã phòng: </span>
                            <span style={S.roomCode}>{room.roomCode}</span>
                          </div>

                          <span style={S.badge(room.questions?.length || 0)}>
                            {room.questions?.length || 0} câu hỏi
                          </span>
                        </div>
                      </div>

                      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                        <button
                          type="button"
                          style={S.btnSecondary}
                          onClick={() => copyCode(room.roomCode)}
                        >
                          <FileCopyIcon style={{ fontSize: 17 }} />
                          Sao chép
                        </button>

                        <button
                          type="button"
                          style={S.btnGreen}
                          onClick={() => setSelectedRoom(room)}
                        >
                          <SettingsIcon style={{ fontSize: 17 }} />
                          Quản lý
                        </button>

                        {!room.activeLiveSession && (
                          <button
                            type="button"
                            style={S.btnPrimary(false)}
                            onClick={() => handleStartLive(room)}
                          >
                            <PlayArrowIcon style={{ fontSize: 18 }} />
                            Bắt đầu
                          </button>
                        )}

                        <button
                          type="button"
                          style={S.btnSecondary}
                          onClick={() => {
                            setEditingRoom(room);
                            setRoomForm({
                              title: room.title,
                              description: room.description || '',
                            });
                          }}
                        >
                          <EditIcon style={{ fontSize: 17 }} />
                          Sửa
                        </button>

                        <button
                          type="button"
                          style={S.btnDanger}
                          onClick={() => handleDeleteRoom(room)}
                        >
                          <DeleteIcon style={{ fontSize: 17 }} />
                          Xóa
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {roomModal}
      </div>
    );
  }

  const questions = selectedRoom.questions || [];

  return (
    <div style={S.page}>
      <TeacherToast
        toast={toast}
        onClose={() =>
          setToast((prev) => ({
            ...prev,
            show: false,
          }))
        }
      />

      <div style={S.wrap}>
        <div style={S.header}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 14,
              flexWrap: 'wrap',
            }}
          >
            <button
              type="button"
              style={S.btnSecondary}
              onClick={() => setSelectedRoom(null)}
            >
              ← Quay lại
            </button>

            <h1 style={S.title}>
              <GamesIcon style={{ fontSize: 31, color: COLORS.main }} />
              {selectedRoom.title}
            </h1>
          </div>
        </div>

        <div style={S.qHeader}>
          <div
            style={{
              display: 'flex',
              gap: 10,
              alignItems: 'center',
              flexWrap: 'wrap',
              marginBottom: 12,
            }}
          >
            <span style={S.mutedText}>Mã phòng luyện tập:</span>

            <span style={S.roomCode}>{selectedRoom.roomCode}</span>

            <button
              type="button"
              style={S.btnSecondary}
              onClick={() => copyCode(selectedRoom.roomCode)}
            >
              <FileCopyIcon style={{ fontSize: 17 }} />
              Sao chép
            </button>

            <span style={S.badge(questions.length)}>{questions.length} câu hỏi</span>

            {selectedRoom.activeLiveSession ? (
              <>
                <button
                  type="button"
                  style={S.btnPrimary(false)}
                  onClick={() =>
                    history.push('/games/multiplayer', {
                      pin: selectedRoom.activeLiveSession.pin,
                      isHost: true,
                      teacherRoomId: selectedRoom.id,
                    })
                  }
                >
                  <PlayArrowIcon style={{ fontSize: 18 }} />
                  Vào phòng ({selectedRoom.activeLiveSession.pin})
                </button>

                <button
                  type="button"
                  style={S.btnOrange}
                  onClick={() => handleCancelLive(selectedRoom)}
                >
                  <StopIcon style={{ fontSize: 18 }} />
                  Hủy phòng
                </button>
              </>
            ) : (
              <button
                type="button"
                style={S.btnPrimary(false)}
                onClick={() => handleStartLive(selectedRoom)}
              >
                <PlayArrowIcon style={{ fontSize: 18 }} />
                Bắt đầu chơi
              </button>
            )}
          </div>

          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              gap: 14,
              flexWrap: 'wrap',
            }}
          >
            <h2 style={S.sectionTitle}>
              <AssignmentLikeIcon />
              Danh sách câu hỏi
            </h2>

            <button
              type="button"
              style={S.btnPrimary(false)}
              onClick={() => {
                setShowAddQ(true);
                setQForm(EMPTY_Q);
              }}
            >
              <AddIcon style={{ fontSize: 18 }} />
              Thêm câu hỏi
            </button>
          </div>
        </div>

        <div style={S.questionList}>
          {questions.length === 0 ? (
            <div style={S.emptyBox}>
              <div style={{ fontSize: '3.2rem', marginBottom: 12 }}>📝</div>

              <p
                style={{
                  color: '#d8fffa',
                  fontWeight: 900,
                  fontSize: '1rem',
                  margin: 0,
                }}
              >
                Chưa có câu hỏi nào.
              </p>
            </div>
          ) : (
            questions.map((question, index) => (
              <div key={question.id} style={S.qItem}>
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'flex-start',
                    gap: 14,
                    flexWrap: 'wrap',
                  }}
                >
                  <div style={{ flex: 1, minWidth: 260 }}>
                    <div style={S.qIndex}>Câu {index + 1}</div>

                    <div style={S.qText}>{question.question}</div>

                    <div style={S.qAnswer}>Đáp án: {question.answer}</div>

                    {question.choices?.length > 0 && (
                      <div style={S.qChoices}>
                        Lựa chọn: {question.choices.join(' | ')}
                      </div>
                    )}

                    {question.hint && <div style={S.hintText}>Gợi ý: {question.hint}</div>}

                    <div style={S.timeText}>Thời gian: {question.timeLimit || 20}s</div>
                  </div>

                  <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                    <button
                      type="button"
                      style={S.btnSecondary}
                      onClick={() => {
                        setEditingQ(question);
                        setQForm({
                          question: question.question,
                          answer: question.answer,
                          choices:
                            question.choices?.length >= 4
                              ? question.choices
                              : [...(question.choices || []), '', '', '', ''].slice(0, 4),
                          timeLimit: question.timeLimit || 20,
                          hint: question.hint || '',
                        });
                      }}
                    >
                      <EditIcon style={{ fontSize: 17 }} />
                      Sửa
                    </button>

                    <button
                      type="button"
                      style={S.btnDanger}
                      onClick={() => handleDeleteQuestion(question)}
                    >
                      <DeleteIcon style={{ fontSize: 17 }} />
                      Xóa
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {questionModal}
      {roomModal}
    </div>
  );
}

function AssignmentLikeIcon() {
  return <GamesIcon style={{ fontSize: 22, color: COLORS.main }} />;
}