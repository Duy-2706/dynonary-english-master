import useTitle from 'hooks/useTitle';
import React, { useCallback, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import gameRoomApi from 'apis/gameRoomApi';

const GAME_FONT = '"Baloo 2", "Nunito", sans-serif';

const SITE_GRAD = 'linear-gradient(180deg, #ffdf3b 0%, #ff8a00 100%)';

const S = {
  page: {
    minHeight: '100vh',
    background: `
      radial-gradient(circle at 14% 18%, rgba(25,199,168,.18) 0 4px, transparent 5px),
      radial-gradient(circle at 82% 22%, rgba(255,138,0,.16) 0 5px, transparent 6px),
      radial-gradient(circle at 28% 72%, rgba(255,20,147,.12) 0 4px, transparent 5px),
      linear-gradient(180deg, #05090d 0%, #071217 45%, #05090d 100%)
    `,
    backgroundSize: '90px 90px, 130px 130px, 110px 110px, auto',
    padding: '44px 28px 80px',
    fontFamily: GAME_FONT,
    color: '#f6fffd',
  },

  wrap: {
    maxWidth: 1180,
    margin: '0 auto',
  },

  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 18,
    marginBottom: 34,
    background: 'linear-gradient(180deg, rgba(18,31,38,.98), rgba(10,19,24,.98))',
    border: '5px solid rgba(25,199,168,.55)',
    borderRadius: 34,
    padding: '30px 34px',
    boxShadow: '0 10px 0 rgba(25,199,168,.22), 0 24px 48px rgba(0,0,0,.42)',
  },

  title: {
    fontSize: 'clamp(2.5rem, 4.8vw, 4.4rem)',
    fontWeight: 900,
    color: '#ffffff',
    margin: 0,
    lineHeight: 0.95,
    textShadow: '0 5px 0 rgba(25,199,168,.35), 0 12px 24px rgba(0,0,0,.55)',
  },

  headerSub: {
    color: '#bff8ee',
    margin: '12px 0 0',
    fontSize: '1.2rem',
    fontWeight: 900,
    lineHeight: 1.45,
  },

  btnPrimary: (disabled) => ({
    padding: '14px 26px',
    borderRadius: 999,
    border: '4px solid #fff',
    cursor: disabled ? 'not-allowed' : 'pointer',
    background: disabled ? '#4b5563' : SITE_GRAD,
    color: '#fff',
    fontWeight: 900,
    fontSize: '1.12rem',
    fontFamily: GAME_FONT,
    opacity: disabled ? 0.7 : 1,
    boxShadow: disabled ? 'none' : '0 8px 0 #bd5f00, 0 16px 28px rgba(0,0,0,.32)',
    textShadow: '0 2px 0 rgba(0,0,0,.25)',
  }),

  btnSecondary: {
    padding: '11px 20px',
    borderRadius: 999,
    border: '3px solid rgba(25,199,168,.8)',
    cursor: 'pointer',
    background: 'linear-gradient(180deg,#14252d,#0d1a20)',
    color: '#d8fffa',
    fontWeight: 900,
    fontSize: '1rem',
    fontFamily: GAME_FONT,
    boxShadow: '0 6px 0 rgba(25,199,168,.16)',
  },

  btnDanger: {
    padding: '11px 20px',
    borderRadius: 999,
    border: '3px solid #ff8a8a',
    cursor: 'pointer',
    background: 'linear-gradient(180deg,#2b1015,#18080b)',
    color: '#ffb7b7',
    fontWeight: 900,
    fontSize: '1rem',
    fontFamily: GAME_FONT,
    boxShadow: '0 6px 0 rgba(255,80,80,.18)',
  },

  btnGreen: {
    padding: '11px 20px',
    borderRadius: 999,
    border: '3px solid #fff',
    cursor: 'pointer',
    background: 'linear-gradient(180deg,#36e27d,#0ca84f)',
    color: '#fff',
    fontWeight: 900,
    fontSize: '1rem',
    fontFamily: GAME_FONT,
    boxShadow: '0 7px 0 #087a3c',
    textShadow: '0 2px 0 rgba(0,0,0,.22)',
  },

  btnOrange: {
    padding: '11px 20px',
    borderRadius: 999,
    border: '3px solid #fff',
    cursor: 'pointer',
    background: 'linear-gradient(180deg,#ff8a00,#e85d00)',
    color: '#fff',
    fontWeight: 900,
    fontSize: '1rem',
    fontFamily: GAME_FONT,
    boxShadow: '0 7px 0 #9b3200',
    textShadow: '0 2px 0 rgba(0,0,0,.22)',
  },

  card: {
    background: 'linear-gradient(180deg, rgba(18,31,38,.98), rgba(10,19,24,.98))',
    borderRadius: 30,
    padding: '26px 28px',
    marginBottom: 22,
    border: '4px solid rgba(25,199,168,.42)',
    boxShadow: '0 9px 0 rgba(25,199,168,.18), 0 22px 42px rgba(0,0,0,.36)',
  },

  roomTitle: {
    fontWeight: 900,
    fontSize: '1.55rem',
    color: '#ffffff',
    marginBottom: 8,
    lineHeight: 1.2,
    textShadow: '0 3px 0 rgba(0,0,0,.26)',
  },

  roomDesc: {
    color: '#b7d8d4',
    fontSize: '1.08rem',
    marginBottom: 14,
    fontWeight: 800,
    lineHeight: 1.45,
  },

  mutedText: {
    color: '#a7c9c4',
    fontSize: '1rem',
    fontWeight: 850,
  },

  roomCode: {
    fontFamily: 'monospace',
    fontSize: '1.65rem',
    fontWeight: 900,
    color: '#ffffff',
    letterSpacing: '0.2em',
    background: 'linear-gradient(180deg,#0a84ff,#00439d)',
    border: '3px solid #fff',
    borderRadius: 16,
    padding: '7px 16px',
    display: 'inline-block',
    boxShadow: '0 6px 0 rgba(0,67,157,.55)',
    textShadow: '0 2px 0 rgba(0,0,0,.28)',
  },

  badge: (n) => ({
    display: 'inline-block',
    background:
      n > 0
        ? 'linear-gradient(180deg,#36e27d,#0ca84f)'
        : 'linear-gradient(180deg,#475569,#1f2937)',
    color: '#fff',
    borderRadius: 999,
    padding: '7px 15px',
    fontSize: '1rem',
    fontWeight: 900,
    border: '3px solid rgba(255,255,255,.9)',
    boxShadow: n > 0 ? '0 5px 0 #087a3c' : '0 5px 0 rgba(0,0,0,.22)',
  }),

  liveBadge: {
    display: 'inline-block',
    background: 'linear-gradient(180deg,#ff4fa3,#c40075)',
    color: '#fff',
    borderRadius: 999,
    padding: '6px 13px',
    fontSize: '.9rem',
    fontWeight: 900,
    marginLeft: 10,
    border: '3px solid #fff',
    boxShadow: '0 5px 0 #7c004b',
    textShadow: '0 2px 0 rgba(0,0,0,.22)',
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
    borderRadius: 34,
    padding: '34px 30px',
    width: '100%',
    maxWidth: 620,
    maxHeight: '90vh',
    overflowY: 'auto',
    border: '5px solid rgba(25,199,168,.72)',
    boxShadow: '0 12px 0 rgba(25,199,168,.26), 0 28px 60px rgba(0,0,0,.58)',
  },

  modalTitle: {
    fontSize: '2rem',
    fontWeight: 900,
    color: '#ffffff',
    margin: '0 0 24px',
    textShadow: '0 4px 0 rgba(25,199,168,.28)',
  },

  label: {
    display: 'block',
    fontWeight: 900,
    color: '#d8fffa',
    marginBottom: 9,
    fontSize: '1.1rem',
  },

  input: {
    width: '100%',
    padding: '15px 17px',
    borderRadius: 18,
    border: '3px solid rgba(25,199,168,.55)',
    background: '#071217',
    color: '#ffffff',
    fontSize: '1.08rem',
    fontWeight: 850,
    fontFamily: GAME_FONT,
    outline: 'none',
    boxSizing: 'border-box',
    marginBottom: 18,
    boxShadow: '0 5px 0 rgba(25,199,168,.10)',
  },

  textarea: {
    width: '100%',
    padding: '15px 17px',
    borderRadius: 18,
    border: '3px solid rgba(25,199,168,.55)',
    background: '#071217',
    color: '#ffffff',
    fontSize: '1.08rem',
    fontWeight: 850,
    fontFamily: GAME_FONT,
    outline: 'none',
    boxSizing: 'border-box',
    marginBottom: 18,
    resize: 'vertical',
    minHeight: 92,
    lineHeight: 1.5,
    boxShadow: '0 5px 0 rgba(25,199,168,.10)',
  },

  qItem: {
    background: 'linear-gradient(180deg,#111e25,#091217)',
    borderRadius: 24,
    padding: '20px 22px',
    marginBottom: 16,
    border: '4px solid rgba(10,132,255,.45)',
    boxShadow: '0 8px 0 rgba(10,132,255,.18), 0 18px 34px rgba(0,0,0,.30)',
  },

  qIndex: {
    color: '#7dd3fc',
    fontSize: '1rem',
    marginBottom: 7,
    fontWeight: 900,
  },

  qText: {
    fontWeight: 900,
    color: '#ffffff',
    marginBottom: 8,
    fontSize: '1.22rem',
    lineHeight: 1.45,
  },

  qAnswer: {
    color: '#72ffad',
    fontSize: '1.05rem',
    fontWeight: 900,
    marginTop: 5,
  },

  qChoices: {
    color: '#c6d7d4',
    fontSize: '1rem',
    marginTop: 6,
    fontWeight: 800,
    lineHeight: 1.4,
  },

  hintText: {
    color: '#ffd86f',
    fontSize: '1rem',
    marginTop: 6,
    fontWeight: 900,
  },

  timeText: {
    color: '#95aeb0',
    fontSize: '.95rem',
    marginTop: 6,
    fontWeight: 900,
  },

  alertBanner: (ok) => ({
    padding: '15px 18px',
    borderRadius: 20,
    fontWeight: 900,
    marginBottom: 20,
    fontSize: '1.08rem',
    background: ok
      ? 'linear-gradient(180deg,#123a2b,#0b241b)'
      : 'linear-gradient(180deg,#3a1518,#1d090b)',
    color: ok ? '#72ffad' : '#ffb7b7',
    border: ok ? '3px solid #36e27d' : '3px solid #ff8a8a',
    boxShadow: '0 6px 0 rgba(0,0,0,.22)',
  }),

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
    fontSize: '1.25rem',
  },

  sessionBanner: {
    background: 'linear-gradient(180deg,#271900,#111111)',
    border: '4px solid #ffcf45',
    borderRadius: 26,
    padding: '20px 22px',
    marginBottom: 22,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    gap: 14,
    boxShadow: '0 8px 0 rgba(189,120,0,.35), 0 18px 34px rgba(0,0,0,.35)',
  },

  sessionTitle: {
    fontWeight: 900,
    color: '#ffdf3b',
    marginBottom: 6,
    fontSize: '1.22rem',
    textShadow: '0 2px 0 rgba(0,0,0,.28)',
  },

  pinBig: {
    fontFamily: 'monospace',
    fontSize: '2.7rem',
    fontWeight: 900,
    color: '#ffffff',
    letterSpacing: '0.25em',
    textShadow: '0 4px 0 #bd5f00',
  },

  emptyBox: {
    background: 'linear-gradient(180deg, rgba(18,31,38,.98), rgba(10,19,24,.98))',
    borderRadius: 30,
    padding: '54px 24px',
    marginBottom: 18,
    textAlign: 'center',
    border: '4px dashed rgba(25,199,168,.5)',
    boxShadow: '0 9px 0 rgba(25,199,168,.14), 0 22px 42px rgba(0,0,0,.32)',
  },

  sectionTitle: {
    fontSize: '1.55rem',
    fontWeight: 900,
    color: '#ffffff',
    margin: 0,
    textShadow: '0 3px 0 rgba(25,199,168,.24)',
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

function ChoicesEditor({ choices, onChange }) {
  return (
    <div>
      {choices.map((c, i) => (
        <div key={i} style={{ display: 'flex', gap: 10, marginBottom: 10 }}>
          <span
            style={{
              color: '#7dd3fc',
              minWidth: 28,
              paddingTop: 14,
              fontSize: '1rem',
              fontWeight: 900,
            }}
          >
            {i + 1}.
          </span>

          <input
            style={{ ...S.input, marginBottom: 0, flex: 1 }}
            placeholder={`Lựa chọn ${i + 1}`}
            value={c}
            onChange={(e) => {
              const updated = [...choices];
              updated[i] = e.target.value;
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

  const userInfo = useSelector((s) => s.userInfo);
  const history = useHistory();

  const isAllowed = userInfo?.role === 'teacher' || userInfo?.role === 'admin';

  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [msg, setMsg] = useState(null);

  const [showCreateRoom, setShowCreateRoom] = useState(false);
  const [roomForm, setRoomForm] = useState(EMPTY_ROOM);
  const [editingRoom, setEditingRoom] = useState(null);

  const [selectedRoom, setSelectedRoom] = useState(null);
  const [showAddQ, setShowAddQ] = useState(false);
  const [qForm, setQForm] = useState(EMPTY_Q);
  const [editingQ, setEditingQ] = useState(null);

  const showMsg = (ok, text) => {
    setMsg({ ok, text });
    setTimeout(() => setMsg(null), 3500);
  };

  const loadRooms = useCallback(async () => {
    setLoading(true);

    try {
      const res = await gameRoomApi.getTeacherRooms();
      setRooms(res.data.rooms || []);
    } catch {
      setRooms([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (isAllowed) loadRooms();
  }, [isAllowed, loadRooms]);

  useEffect(() => {
    if (selectedRoom) {
      const updated = rooms.find((r) => r.id === selectedRoom.id);
      if (updated) setSelectedRoom(updated);
    }
  }, [rooms, selectedRoom]);

  const handleCreateRoom = async () => {
    if (!roomForm.title.trim()) {
      showMsg(false, 'Vui lòng nhập tên phòng');
      return;
    }

    try {
      await gameRoomApi.createTeacherRoom({
        title: roomForm.title.trim(),
        description: roomForm.description,
      });

      setShowCreateRoom(false);
      setRoomForm(EMPTY_ROOM);

      showMsg(true, 'Tạo phòng thành công!');
      loadRooms();
    } catch {
      showMsg(false, 'Lỗi khi tạo phòng');
    }
  };

  const handleUpdateRoom = async () => {
    if (!editingRoom || !roomForm.title.trim()) {
      showMsg(false, 'Vui lòng nhập tên phòng');
      return;
    }

    try {
      await gameRoomApi.updateTeacherRoom(editingRoom.id, {
        title: roomForm.title.trim(),
        description: roomForm.description,
      });

      setEditingRoom(null);
      setRoomForm(EMPTY_ROOM);

      showMsg(true, 'Cập nhật thành công!');
      loadRooms();
    } catch {
      showMsg(false, 'Lỗi khi cập nhật phòng');
    }
  };

  const handleDeleteRoom = async (room) => {
    if (!window.confirm(`Xóa phòng "${room.title}"? Hành động này không thể hoàn tác.`)) return;

    try {
      if (room.activeLiveSession) {
        await gameRoomApi.cancelLiveSession(room.id).catch(() => {});
      }

      await gameRoomApi.deleteTeacherRoom(room.id);

      if (selectedRoom?.id === room.id) setSelectedRoom(null);

      showMsg(true, 'Đã xóa phòng');
      loadRooms();
    } catch {
      showMsg(false, 'Lỗi khi xóa phòng');
    }
  };

  const handleAddQuestion = async () => {
    if (!qForm.question.trim() || !qForm.answer.trim()) {
      showMsg(false, 'Vui lòng nhập câu hỏi và đáp án');
      return;
    }

    const filteredChoices = qForm.choices.filter((c) => c.trim());

    if (filteredChoices.length < 2) {
      showMsg(false, 'Cần ít nhất 2 lựa chọn');
      return;
    }

    if (!filteredChoices.includes(qForm.answer.trim())) {
      showMsg(false, 'Đáp án phải nằm trong danh sách lựa chọn');
      return;
    }

    try {
      const res = await gameRoomApi.addQuestion(selectedRoom.id, {
        question: qForm.question.trim(),
        answer: qForm.answer.trim(),
        choices: filteredChoices,
        timeLimit: qForm.timeLimit || 20,
        hint: qForm.hint,
      });

      setShowAddQ(false);
      setQForm(EMPTY_Q);
      setSelectedRoom(res.data.room);

      showMsg(true, 'Thêm câu hỏi thành công!');
      loadRooms();
    } catch {
      showMsg(false, 'Lỗi khi thêm câu hỏi');
    }
  };

  const handleUpdateQuestion = async () => {
    if (!editingQ) return;

    if (!qForm.question.trim() || !qForm.answer.trim()) {
      showMsg(false, 'Vui lòng nhập câu hỏi và đáp án');
      return;
    }

    const filteredChoices = qForm.choices.filter((c) => c.trim());

    if (filteredChoices.length < 2) {
      showMsg(false, 'Cần ít nhất 2 lựa chọn');
      return;
    }

    if (!filteredChoices.includes(qForm.answer.trim())) {
      showMsg(false, 'Đáp án phải nằm trong danh sách lựa chọn');
      return;
    }

    try {
      const res = await gameRoomApi.updateQuestion(selectedRoom.id, editingQ.id, {
        question: qForm.question.trim(),
        answer: qForm.answer.trim(),
        choices: filteredChoices,
        timeLimit: qForm.timeLimit || 20,
        hint: qForm.hint,
      });

      setEditingQ(null);
      setQForm(EMPTY_Q);
      setSelectedRoom(res.data.room);

      showMsg(true, 'Cập nhật câu hỏi thành công!');
      loadRooms();
    } catch {
      showMsg(false, 'Lỗi khi cập nhật câu hỏi');
    }
  };

  const handleDeleteQuestion = async (q) => {
    if (!window.confirm('Xóa câu hỏi này?')) return;

    try {
      const res = await gameRoomApi.deleteQuestion(selectedRoom.id, q.id);

      setSelectedRoom(res.data.room);

      showMsg(true, 'Đã xóa câu hỏi');
      loadRooms();
    } catch {
      showMsg(false, 'Lỗi khi xóa câu hỏi');
    }
  };

  const handleStartLive = async (room) => {
    try {
      const res = await gameRoomApi.startLiveSession(room.id);
      const { pin, room: gameRoom, existing } = res.data;

      if (existing) showMsg(true, `Phòng đang có mã PIN: ${pin}`);

      await loadRooms();

      history.push('/games/multiplayer', {
        pin,
        gameRoomId: gameRoom?.id,
        isHost: true,
        teacherRoomId: room.id,
      });
    } catch (err) {
      showMsg(false, err?.response?.data?.message || 'Lỗi khi tạo phòng trực tiếp');
    }
  };

  const handleCancelLive = async (room) => {
    if (!window.confirm('Hủy phòng chơi đang hoạt động? Học sinh sẽ bị thoát.')) return;

    try {
      await gameRoomApi.cancelLiveSession(room.id);

      showMsg(true, 'Đã hủy phòng chơi');
      loadRooms();

      if (selectedRoom?.id === room.id) {
        setSelectedRoom((p) => ({
          ...p,
          activeLiveSession: null,
        }));
      }
    } catch {
      showMsg(false, 'Lỗi khi hủy phòng');
    }
  };

  const copyCode = (code) => {
    navigator.clipboard.writeText(code).catch(() => {});
    showMsg(true, `Đã sao chép: ${code}`);
  };

  if (!isAllowed) {
    return (
      <div style={S.noAccess}>
        <div style={{ fontSize: '4rem' }}>🔒</div>

        <div style={S.noAccessText}>
          Chỉ giáo viên hoặc admin mới có thể truy cập.
        </div>

        <button style={S.btnPrimary(false)} onClick={() => history.push('/')}>
          Về trang chủ
        </button>
      </div>
    );
  }

  const roomModal = (showCreateRoom || editingRoom) && (
    <div
      style={S.modal}
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          setShowCreateRoom(false);
          setEditingRoom(null);
          setRoomForm(EMPTY_ROOM);
        }
      }}
    >
      <div style={S.modalCard}>
        <h2 style={S.modalTitle}>
          {editingRoom ? '✏️ Chỉnh sửa phòng' : '🏠 Tạo phòng mới'}
        </h2>

        <label style={S.label}>Tên phòng *</label>

        <input
          style={S.input}
          placeholder="VD: Ôn tập Unit 1..."
          value={roomForm.title}
          onChange={(e) => setRoomForm({ ...roomForm, title: e.target.value })}
        />

        <label style={S.label}>Mô tả</label>

        <textarea
          style={S.textarea}
          placeholder="Mô tả nội dung..."
          value={roomForm.description}
          onChange={(e) => setRoomForm({ ...roomForm, description: e.target.value })}
        />

        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
          <button
            style={S.btnPrimary(false)}
            onClick={editingRoom ? handleUpdateRoom : handleCreateRoom}
          >
            {editingRoom ? 'Lưu thay đổi' : 'Tạo phòng'}
          </button>

          <button
            style={S.btnSecondary}
            onClick={() => {
              setShowCreateRoom(false);
              setEditingRoom(null);
              setRoomForm(EMPTY_ROOM);
            }}
          >
            Hủy
          </button>
        </div>
      </div>
    </div>
  );

  const questionModal = (showAddQ || editingQ) && selectedRoom && (
    <div
      style={S.modal}
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          setShowAddQ(false);
          setEditingQ(null);
          setQForm(EMPTY_Q);
        }
      }}
    >
      <div style={S.modalCard}>
        <h2 style={S.modalTitle}>
          {editingQ ? '✏️ Sửa câu hỏi' : '➕ Thêm câu hỏi'}
        </h2>

        <label style={S.label}>Câu hỏi / nghĩa / gợi ý *</label>

        <textarea
          style={S.textarea}
          placeholder="VD: What is the English word for 'con chó'?"
          value={qForm.question}
          onChange={(e) => setQForm({ ...qForm, question: e.target.value })}
        />

        <label style={S.label}>Đáp án đúng *</label>

        <input
          style={S.input}
          placeholder="VD: dog"
          value={qForm.answer}
          onChange={(e) => setQForm({ ...qForm, answer: e.target.value })}
        />

        <label style={S.label}>
          Các lựa chọn, tối thiểu 2 lựa chọn và phải có đáp án đúng *
        </label>

        <ChoicesEditor
          choices={qForm.choices}
          onChange={(c) => setQForm({ ...qForm, choices: c })}
        />

        <label style={S.label}>Gợi ý phonetic</label>

        <input
          style={S.input}
          placeholder="VD: /dɒɡ/"
          value={qForm.hint}
          onChange={(e) => setQForm({ ...qForm, hint: e.target.value })}
        />

        <label style={S.label}>Thời gian trả lời, tính bằng giây</label>

        <input
          type="number"
          min={5}
          max={60}
          style={{ ...S.input, width: 160 }}
          value={qForm.timeLimit}
          onChange={(e) =>
            setQForm({
              ...qForm,
              timeLimit: parseInt(e.target.value, 10) || 20,
            })
          }
        />

        <div style={{ display: 'flex', gap: 12, marginTop: 4, flexWrap: 'wrap' }}>
          <button
            style={S.btnPrimary(false)}
            onClick={editingQ ? handleUpdateQuestion : handleAddQuestion}
          >
            {editingQ ? 'Lưu câu hỏi' : 'Thêm câu hỏi'}
          </button>

          <button
            style={S.btnSecondary}
            onClick={() => {
              setShowAddQ(false);
              setEditingQ(null);
              setQForm(EMPTY_Q);
            }}
          >
            Hủy
          </button>
        </div>
      </div>
    </div>
  );

  if (!selectedRoom) {
    return (
      <div style={S.page}>
        <div style={S.wrap}>
          <div style={S.header}>
            <div>
              <h1 style={S.title}>🎮 Quản Lý Phòng Game</h1>

              <p style={S.headerSub}>
                Tạo phòng, thêm câu hỏi và bắt đầu chơi live với học sinh.
              </p>
            </div>

            <button
              style={S.btnPrimary(false)}
              onClick={() => {
                setShowCreateRoom(true);
                setRoomForm(EMPTY_ROOM);
              }}
            >
              + Tạo phòng mới
            </button>
          </div>

          {msg && (
            <div style={S.alertBanner(msg.ok)}>
              {msg.ok ? '✅' : '❌'} {msg.text}
            </div>
          )}

          {loading ? (
            <p
              style={{
                color: '#d8fffa',
                textAlign: 'center',
                padding: 46,
                fontSize: '1.25rem',
                fontWeight: 900,
              }}
            >
              ⏳ Đang tải...
            </p>
          ) : rooms.length === 0 ? (
            <div style={S.emptyBox}>
              <div style={{ fontSize: '4.2rem', marginBottom: 14 }}>🎯</div>

              <p
                style={{
                  color: '#d8fffa',
                  fontWeight: 900,
                  fontSize: '1.25rem',
                  margin: 0,
                }}
              >
                Bạn chưa có phòng game nào
              </p>
            </div>
          ) : (
            rooms.map((room) => (
              <div key={room.id} style={S.card}>
                {room.activeLiveSession && (
                  <div style={S.sessionBanner}>
                    <div>
                      <div style={S.sessionTitle}>🔴 Đang có phòng chơi live</div>

                      <div style={S.mutedText}>
                        Chia sẻ mã PIN này cho học sinh:
                      </div>

                      <div style={S.pinBig}>{room.activeLiveSession.pin}</div>
                    </div>

                    <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                      <button
                        style={S.btnPrimary(false)}
                        onClick={() =>
                          history.push('/games/multiplayer', {
                            pin: room.activeLiveSession.pin,
                            isHost: true,
                            teacherRoomId: room.id,
                          })
                        }
                      >
                        🎮 Vào phòng chờ
                      </button>

                      <button style={S.btnOrange} onClick={() => handleCancelLive(room)}>
                        ⛔ Hủy phòng
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
                    gap: 16,
                  }}
                >
                  <div style={{ flex: 1, minWidth: 260 }}>
                    <div style={S.roomTitle}>
                      {room.title}
                      {room.activeLiveSession && <span style={S.liveBadge}>LIVE</span>}
                    </div>

                    {room.description && <div style={S.roomDesc}>{room.description}</div>}

                    <div
                      style={{
                        display: 'flex',
                        gap: 12,
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

                  <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                    <button style={S.btnSecondary} onClick={() => copyCode(room.roomCode)}>
                      📋 Sao chép mã
                    </button>

                    <button style={S.btnGreen} onClick={() => setSelectedRoom(room)}>
                      ⚙️ Quản lý
                    </button>

                    {!room.activeLiveSession && (
                      <button style={S.btnPrimary(false)} onClick={() => handleStartLive(room)}>
                        🚀 Bắt đầu chơi
                      </button>
                    )}

                    <button
                      style={S.btnSecondary}
                      onClick={() => {
                        setEditingRoom(room);
                        setRoomForm({
                          title: room.title,
                          description: room.description || '',
                        });
                      }}
                    >
                      ✏️ Sửa
                    </button>

                    <button style={S.btnDanger} onClick={() => handleDeleteRoom(room)}>
                      🗑️ Xóa
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {roomModal}
      </div>
    );
  }

  const questions = selectedRoom.questions || [];

  return (
    <div style={S.page}>
      <div style={S.wrap}>
        <div style={S.header}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16, flexWrap: 'wrap' }}>
            <button style={S.btnSecondary} onClick={() => setSelectedRoom(null)}>
              ← Quay lại
            </button>

            <h1 style={{ ...S.title, margin: 0 }}>{selectedRoom.title}</h1>
          </div>
        </div>

        <div
          style={{
            display: 'flex',
            gap: 12,
            alignItems: 'center',
            marginBottom: 24,
            flexWrap: 'wrap',
          }}
        >
          <span style={S.mutedText}>Mã phòng luyện tập:</span>

          <span style={S.roomCode}>{selectedRoom.roomCode}</span>

          <button style={S.btnSecondary} onClick={() => copyCode(selectedRoom.roomCode)}>
            📋 Sao chép
          </button>

          <span style={S.badge(questions.length)}>{questions.length} câu hỏi</span>

          {selectedRoom.activeLiveSession ? (
            <>
              <button
                style={S.btnPrimary(false)}
                onClick={() =>
                  history.push('/games/multiplayer', {
                    pin: selectedRoom.activeLiveSession.pin,
                    isHost: true,
                    teacherRoomId: selectedRoom.id,
                  })
                }
              >
                🎮 Vào phòng ({selectedRoom.activeLiveSession.pin})
              </button>

              <button style={S.btnOrange} onClick={() => handleCancelLive(selectedRoom)}>
                ⛔ Hủy phòng
              </button>
            </>
          ) : (
            <button style={S.btnPrimary(false)} onClick={() => handleStartLive(selectedRoom)}>
              🚀 Bắt đầu chơi
            </button>
          )}
        </div>

        {msg && (
          <div style={S.alertBanner(msg.ok)}>
            {msg.ok ? '✅' : '❌'} {msg.text}
          </div>
        )}

        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: 18,
            gap: 14,
            flexWrap: 'wrap',
          }}
        >
          <h2 style={S.sectionTitle}>Danh sách câu hỏi</h2>

          <button
            style={S.btnPrimary(false)}
            onClick={() => {
              setShowAddQ(true);
              setQForm(EMPTY_Q);
            }}
          >
            + Thêm câu hỏi
          </button>
        </div>

        {questions.length === 0 ? (
          <div style={S.emptyBox}>
            <div style={{ fontSize: '3.6rem', marginBottom: 12 }}>📝</div>

            <p
              style={{
                color: '#d8fffa',
                fontWeight: 900,
                fontSize: '1.25rem',
                margin: 0,
              }}
            >
              Chưa có câu hỏi nào
            </p>
          </div>
        ) : (
          questions.map((q, i) => (
            <div key={q.id} style={S.qItem}>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'flex-start',
                  gap: 14,
                }}
              >
                <div style={{ flex: 1 }}>
                  <div style={S.qIndex}>Câu {i + 1}</div>

                  <div style={S.qText}>{q.question}</div>

                  <div style={S.qAnswer}>✅ Đáp án: {q.answer}</div>

                  {q.choices?.length > 0 && (
                    <div style={S.qChoices}>
                      Lựa chọn: {q.choices.join(' | ')}
                    </div>
                  )}

                  {q.hint && <div style={S.hintText}>💡 {q.hint}</div>}

                  <div style={S.timeText}>⏱️ {q.timeLimit || 20}s</div>
                </div>

                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                  <button
                    style={S.btnSecondary}
                    onClick={() => {
                      setEditingQ(q);
                      setQForm({
                        question: q.question,
                        answer: q.answer,
                        choices:
                          q.choices?.length >= 4
                            ? q.choices
                            : [...(q.choices || []), '', '', '', ''].slice(0, 4),
                        timeLimit: q.timeLimit || 20,
                        hint: q.hint || '',
                      });
                    }}
                  >
                    ✏️ Sửa
                  </button>

                  <button style={S.btnDanger} onClick={() => handleDeleteQuestion(q)}>
                    🗑️ Xóa
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {questionModal}
      {roomModal}
    </div>
  );
}