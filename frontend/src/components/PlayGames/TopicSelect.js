import { TOPICS } from 'constant/topics';
import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import courseApi from 'apis/courseApi';

const COLORS = [
  '#4CAF50', '#2196F3', '#E91E63', '#FF9800', '#9C27B0',
  '#00BCD4', '#F44336', '#3F51B5', '#009688', '#FF5722',
  '#8BC34A', '#673AB7', '#FFC107', '#03A9F4', '#E91E63',
  '#795548', '#607D8B', '#CDDC39', '#FF4081', '#00E5FF',
  '#76FF03', '#FF6D00', '#AA00FF', '#00BFA5', '#FFD600',
];

function TopicSelect({ title, onStart }) {
  const history = useHistory();
  const [hovered, setHovered] = useState(null);
  const [tab, setTab] = useState('topic');
  const [courses, setCourses] = useState([]);
  const [loadingCourses, setLoadingCourses] = useState(false);

  const handleSelect = (topicKey) => {
    onStart({
      topics: topicKey === 'all' ? [] : [topicKey],
      type: '-1',
      level: '-1',
      specialty: '-1',
    });
  };

  const handleLessonSelect = (lesson) => {
    if (!lesson.words?.length) return;
    onStart({ wordList: lesson.words, type: '-1', level: '-1', specialty: '-1', topics: [] });
  };

  const handleSwitchToLesson = async () => {
    setTab('lesson');
    if (courses.length > 0) return;
    setLoadingCourses(true);
    try {
      const res = await courseApi.getStudentCourses();
      setCourses(res.data?.courses || res.data || []);
    } catch {
      setCourses([]);
    } finally {
      setLoadingCourses(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', background: '#fdf6ee', fontFamily: "'Montserrat', 'Segoe UI', sans-serif" }}>
      {/* Header */}
      <div style={{ background: '#fff', borderBottom: '1px solid #eee', padding: '16px 24px', display: 'flex', alignItems: 'center', gap: 16, boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
        <button onClick={() => history.goBack()} style={{ background: '#f0f4ff', border: 'none', borderRadius: 10, padding: '8px 16px', color: '#5c6bc0', fontWeight: 700, cursor: 'pointer', fontSize: '0.95rem', fontFamily: 'inherit' }}>
          ← Quay lại
        </button>
        <div>
          <h1 style={{ margin: 0, fontSize: 'clamp(1.1rem, 2.5vw, 1.5rem)', fontWeight: 800, color: '#222' }}>
            {title || 'Chọn chủ đề'}
          </h1>
          <p style={{ margin: 0, color: '#999', fontSize: '0.82rem' }}>Nhấn vào một chủ đề để bắt đầu chơi</p>
        </div>
      </div>

      {/* Tab switcher */}
      <div style={{ display: 'flex', gap: 8, padding: '12px 24px', background: '#fff', borderBottom: '1px solid #eee' }}>
        <button onClick={() => setTab('topic')} style={{ padding: '8px 20px', borderRadius: 20, border: 'none', cursor: 'pointer', background: tab === 'topic' ? '#5c6bc0' : '#f0f4ff', color: tab === 'topic' ? '#fff' : '#5c6bc0', fontWeight: 700, fontFamily: 'inherit' }}>
          📚 Chủ đề từ vựng
        </button>
        <button onClick={handleSwitchToLesson} style={{ padding: '8px 20px', borderRadius: 20, border: 'none', cursor: 'pointer', background: tab === 'lesson' ? '#5c6bc0' : '#f0f4ff', color: tab === 'lesson' ? '#fff' : '#5c6bc0', fontWeight: 700, fontFamily: 'inherit' }}>
          🎓 Bài học cô giáo
        </button>
      </div>

      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '28px 20px 60px' }}>

        {tab === 'topic' && (
          <>
            {/* All topics card */}
            <div onClick={() => handleSelect('all')} onMouseEnter={() => setHovered('all')} onMouseLeave={() => setHovered(null)}
              style={{ background: hovered === 'all' ? 'linear-gradient(135deg, #5c6bc0, #3949ab)' : '#fff', border: '2px solid #c5cae9', borderRadius: 16, padding: '18px 24px', marginBottom: 28, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 18, transition: 'all 0.2s ease', boxShadow: hovered === 'all' ? '0 8px 24px rgba(92,107,192,0.35)' : '0 2px 8px rgba(0,0,0,0.05)', transform: hovered === 'all' ? 'translateY(-2px)' : 'none' }}>
              <span style={{ fontSize: '2.4rem' }}>🌐</span>
              <div>
                <div style={{ fontWeight: 800, fontSize: '1.1rem', color: hovered === 'all' ? '#fff' : '#333' }}>Tất cả chủ đề</div>
                <div style={{ fontSize: '0.85rem', color: hovered === 'all' ? 'rgba(255,255,255,0.8)' : '#999' }}>Lấy từ vựng ngẫu nhiên từ mọi chủ đề</div>
              </div>
              <span style={{ marginLeft: 'auto', fontSize: '1.4rem', color: hovered === 'all' ? '#fff' : '#bbb' }}>→</span>
            </div>

            {/* Topic grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(130px, 1fr))', gap: 16 }}>
              {TOPICS.map((topic, i) => {
                const color = COLORS[i % COLORS.length];
                const isHov = hovered === topic.key;
                return (
                  <div key={topic.key} onClick={() => handleSelect(topic.key)} onMouseEnter={() => setHovered(topic.key)} onMouseLeave={() => setHovered(null)}
                    style={{ background: '#fff', borderRadius: 16, padding: '20px 12px 16px', cursor: 'pointer', textAlign: 'center', border: `2px solid ${isHov ? color : '#eee'}`, boxShadow: isHov ? `0 8px 20px ${color}44` : '0 2px 8px rgba(0,0,0,0.05)', transform: isHov ? 'translateY(-4px)' : 'none', transition: 'all 0.18s cubic-bezier(.34,1.56,.64,1)', fontFamily: 'inherit', position: 'relative', overflow: 'hidden' }}>
                    <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 4, background: color, borderRadius: '16px 16px 0 0', opacity: isHov ? 1 : 0.5 }} />
                    <img src={topic.icon} alt={topic.title} style={{ width: 52, height: 52, objectFit: 'contain', marginBottom: 10 }} />
                    <div style={{ fontWeight: 700, fontSize: '0.88rem', color: isHov ? color : '#444', lineHeight: 1.3 }}>{topic.title}</div>
                  </div>
                );
              })}
            </div>
          </>
        )}

        {tab === 'lesson' && (
          <div>
            {loadingCourses && <div style={{ textAlign: 'center', padding: '48px 0', color: '#999' }}>⏳ Đang tải khóa học...</div>}
            {!loadingCourses && courses.length === 0 && (
              <div style={{ textAlign: 'center', padding: '48px 0', color: '#999' }}>
                <div style={{ fontSize: '3rem', marginBottom: 12 }}>🎓</div>
                <p style={{ fontWeight: 700, color: '#555' }}>Bạn chưa tham gia khóa học nào</p>
                <p style={{ fontSize: '0.9rem' }}>Hãy tham gia khóa học của giáo viên để luyện từ vựng tại đây!</p>
              </div>
            )}
            {!loadingCourses && courses.map((course) => (
              <div key={course._id || course.id} style={{ marginBottom: 32 }}>
                <div style={{ background: 'linear-gradient(135deg, #5c6bc0, #3949ab)', borderRadius: '14px 14px 0 0', padding: '14px 20px', color: '#fff' }}>
                  <div style={{ fontWeight: 800, fontSize: '1.05rem' }}>{course.title}</div>
                  {course.teacherName && <div style={{ fontSize: '0.82rem', opacity: 0.85 }}>Giáo viên: {course.teacherName}</div>}
                </div>
                <div style={{ background: '#fff', borderRadius: '0 0 14px 14px', border: '2px solid #e8eaf6', borderTop: 'none', padding: '12px 16px' }}>
                  {(course.chapters || []).map((chapter) => (
                    <div key={chapter._id || chapter.id} style={{ marginBottom: 12 }}>
                      <div style={{ fontWeight: 700, fontSize: '0.9rem', color: '#555', marginBottom: 8 }}>📖 {chapter.title}</div>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
                        {(chapter.lessons || []).map((lesson) => {
                          const hasWords = lesson.words?.length > 0;
                          return (
                            <div key={lesson._id || lesson.id} onClick={() => hasWords && handleLessonSelect(lesson)}
                              style={{ background: hasWords ? '#f0f4ff' : '#f5f5f5', border: `2px solid ${hasWords ? '#c5cae9' : '#ddd'}`, borderRadius: 10, padding: '10px 16px', cursor: hasWords ? 'pointer' : 'not-allowed', opacity: hasWords ? 1 : 0.6, minWidth: 140 }}
                              onMouseEnter={(e) => { if (hasWords) { e.currentTarget.style.background = '#5c6bc0'; e.currentTarget.style.color = '#fff'; e.currentTarget.style.borderColor = '#5c6bc0'; } }}
                              onMouseLeave={(e) => { e.currentTarget.style.background = hasWords ? '#f0f4ff' : '#f5f5f5'; e.currentTarget.style.color = ''; e.currentTarget.style.borderColor = hasWords ? '#c5cae9' : '#ddd'; }}>
                              <div style={{ fontWeight: 700, fontSize: '0.88rem' }}>{lesson.title}</div>
                              <div style={{ fontSize: '0.78rem', color: '#888', marginTop: 2 }}>{hasWords ? `${lesson.words.length} từ vựng` : 'Chưa có từ vựng'}</div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default TopicSelect;