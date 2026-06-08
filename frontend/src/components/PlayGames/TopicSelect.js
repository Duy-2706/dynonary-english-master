import { TOPICS } from 'constant/topics';
import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import courseApi from 'apis/courseApi';

const GAME_FONT = '"Baloo 2", "Nunito", sans-serif';

const COLORS = [
  ['#19c7a8', '#07947f'],
  ['#0a84ff', '#00439d'],
  ['#ff8a00', '#bd5f00'],
  ['#ff4fa3', '#c40075'],
  ['#7b1cff', '#360087'],
  ['#36e27d', '#087a3c'],
  ['#ff6b6b', '#d63031'],
  ['#ffdf3b', '#ff8a00'],
];

const CSS = `
  @media (max-width: 900px) {
    .topic-header {
      grid-template-columns: 1fr !important;
      text-align: left !important;
    }

    .topic-header-spacer {
      display: none !important;
    }

    .topic-title-box {
      text-align: left !important;
    }

    .topic-grid {
      grid-template-columns: repeat(auto-fill, minmax(130px, 1fr)) !important;
    }

    .topic-tab-box {
      border-radius: 24px !important;
      flex-direction: column !important;
    }
  }

  @media (max-width: 520px) {
    .topic-content {
      padding-left: 12px !important;
      padding-right: 12px !important;
    }

    .topic-grid {
      grid-template-columns: repeat(2, minmax(0, 1fr)) !important;
      gap: 12px !important;
    }
  }
`;

const S = {
  page: {
    minHeight: '100vh',
    background: `
      radial-gradient(circle at 12% 16%, rgba(25,199,168,.13) 0 4px, transparent 5px),
      radial-gradient(circle at 84% 22%, rgba(255,138,0,.11) 0 5px, transparent 6px),
      radial-gradient(circle at 32% 74%, rgba(10,132,255,.10) 0 4px, transparent 5px),
      linear-gradient(180deg,#f7fffc 0%,#eef7f4 48%,#f8fbff 100%)
    `,
    backgroundSize: '90px 90px, 130px 130px, 110px 110px, auto',
    fontFamily: GAME_FONT,
    color: '#12313a',
  },

  header: {
    background: 'rgba(255,255,255,.94)',
    borderBottom: '3px solid rgba(25,199,168,.22)',
    padding: '12px 24px',
    display: 'grid',
    gridTemplateColumns: '150px 1fr 150px',
    alignItems: 'center',
    gap: 16,
    boxShadow: '0 7px 18px rgba(7,148,127,.08)',
    position: 'sticky',
    top: 0,
    zIndex: 10,
    backdropFilter: 'blur(8px)',
  },

  backBtn: {
    background: 'linear-gradient(180deg,#17252d,#0b1419)',
    color: '#d8fffa',
    border: '3px solid rgba(25,199,168,.76)',
    borderRadius: 999,
    padding: '9px 20px',
    fontSize: '.95rem',
    fontWeight: 900,
    cursor: 'pointer',
    fontFamily: GAME_FONT,
    boxShadow: '0 5px 0 rgba(25,199,168,.18)',
    whiteSpace: 'nowrap',
    width: 'fit-content',
  },

  titleBox: {
    textAlign: 'center',
    minWidth: 0,
  },

  title: {
    margin: 0,
    fontSize: 'clamp(1.65rem, 3vw, 2.65rem)',
    fontWeight: 900,
    color: '#12313a',
    lineHeight: 1,
  },

  subtitle: {
    margin: '5px 0 0',
    color: '#386069',
    fontSize: '.92rem',
    fontWeight: 850,
    lineHeight: 1.3,
  },

  tabWrap: {
    maxWidth: 1040,
    margin: '18px auto 0',
    padding: '0 18px',
  },

  tabBox: {
    background: '#ffffff',
    border: '4px solid rgba(25,199,168,.28)',
    borderRadius: 999,
    padding: 5,
    display: 'flex',
    gap: 6,
    boxShadow: '0 5px 0 rgba(25,199,168,.12), 0 12px 24px rgba(0,0,0,.06)',
  },

  tab: (active) => ({
    flex: 1,
    padding: '10px 16px',
    borderRadius: 999,
    border: active ? '3px solid #ffffff' : '3px solid transparent',
    cursor: 'pointer',
    background: active
      ? 'linear-gradient(180deg,#ffdf3b,#ff8a00)'
      : 'transparent',
    color: active ? '#ffffff' : '#12313a',
    fontWeight: 900,
    fontSize: '.98rem',
    fontFamily: GAME_FONT,
    boxShadow: active ? '0 5px 0 #bd5f00' : 'none',
    textShadow: active ? '0 2px 0 rgba(0,0,0,.20)' : 'none',
  }),

  content: {
    maxWidth: 1040,
    margin: '0 auto',
    padding: '22px 18px 54px',
  },

  allCard: (hovered) => ({
    background: hovered
      ? 'linear-gradient(180deg,#17252d,#0b1419)'
      : 'linear-gradient(180deg,#ffffff,#f3fffc)',
    border: hovered
      ? '4px solid rgba(25,199,168,.78)'
      : '4px solid rgba(25,199,168,.36)',
    borderRadius: 24,
    padding: '18px 22px',
    marginBottom: 24,
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    gap: 16,
    transition: 'all .22s cubic-bezier(.34,1.56,.64,1)',
    boxShadow: hovered
      ? '0 8px 0 rgba(25,199,168,.24), 0 18px 34px rgba(0,0,0,.22)'
      : '0 6px 0 rgba(25,199,168,.14), 0 14px 28px rgba(0,0,0,.08)',
    transform: hovered ? 'translateY(-3px)' : 'none',
  }),

  allIcon: (hovered) => ({
    width: 58,
    height: 58,
    borderRadius: 18,
    background: hovered
      ? 'linear-gradient(180deg,#ffdf3b,#ff8a00)'
      : 'linear-gradient(180deg,#19c7a8,#07947f)',
    border: '4px solid #fff',
    boxShadow: hovered ? '0 5px 0 #bd5f00' : '0 5px 0 rgba(7,148,127,.28)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: '#fff',
    fontSize: '1.38rem',
    fontWeight: 900,
    flexShrink: 0,
  }),

  allTitle: (hovered) => ({
    fontWeight: 900,
    fontSize: '1.35rem',
    color: hovered ? '#ffffff' : '#12313a',
    lineHeight: 1.05,
  }),

  allSub: (hovered) => ({
    fontSize: '.9rem',
    color: hovered ? '#bff8ee' : '#386069',
    fontWeight: 850,
    marginTop: 5,
    lineHeight: 1.35,
  }),

  arrow: (hovered) => ({
    marginLeft: 'auto',
    color: hovered ? '#ffdf3b' : '#07947f',
    fontSize: '1.65rem',
    fontWeight: 900,
  }),

  topicGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(138px, 1fr))',
    gap: 16,
  },

  topicCard: (isHov, color1, color2) => ({
    background: '#ffffff',
    borderRadius: 22,
    padding: '14px 12px 14px',
    cursor: 'pointer',
    textAlign: 'center',
    border: `4px solid ${isHov ? color1 : 'rgba(25,199,168,.22)'}`,
    boxShadow: isHov
      ? `0 6px 0 ${color2}, 0 14px 26px rgba(0,0,0,.16)`
      : '0 5px 0 rgba(25,199,168,.10), 0 10px 22px rgba(0,0,0,.06)',
    transform: isHov ? 'translateY(-4px) scale(1.01)' : 'none',
    transition: 'all .18s cubic-bezier(.34,1.56,.64,1)',
    position: 'relative',
    overflow: 'hidden',
    minHeight: 140,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  }),

  topicTopBar: (color1, color2) => ({
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 7,
    background: `linear-gradient(90deg,${color1},${color2})`,
  }),

  topicIconWrap: (color1, color2) => ({
    width: 72,
    height: 72,
    borderRadius: 22,
    background: '#ffffff',
    border: `4px solid ${color1}`,
    boxShadow: `0 5px 0 ${color2}44, 0 10px 18px rgba(0,0,0,.09)`,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
    overflow: 'hidden',
  }),

  topicIcon: {
    width: 56,
    height: 56,
    objectFit: 'contain',
    display: 'block',
    filter: 'none',
    imageRendering: 'auto',
  },

  topicTitle: (isHov, color2) => ({
    fontWeight: 900,
    fontSize: '.9rem',
    color: isHov ? color2 : '#12313a',
    lineHeight: 1.15,
  }),

  loadingBox: {
    background: '#ffffff',
    border: '4px dashed rgba(25,199,168,.45)',
    borderRadius: 24,
    padding: '38px 20px',
    textAlign: 'center',
    color: '#386069',
    fontSize: '1.05rem',
    fontWeight: 900,
    boxShadow: '0 5px 0 rgba(25,199,168,.10)',
  },

  emptyBox: {
    background: '#ffffff',
    border: '4px dashed rgba(255,138,0,.46)',
    borderRadius: 24,
    padding: '38px 20px',
    textAlign: 'center',
    color: '#386069',
    boxShadow: '0 5px 0 rgba(255,138,0,.12)',
  },

  emptyTitle: {
    fontWeight: 900,
    color: '#12313a',
    fontSize: '1.2rem',
    margin: '0 0 6px',
  },

  emptySub: {
    fontSize: '.92rem',
    color: '#386069',
    fontWeight: 850,
    margin: 0,
  },

  courseCard: {
    marginBottom: 24,
    borderRadius: 26,
    overflow: 'hidden',
    background: '#ffffff',
    border: '4px solid rgba(25,199,168,.32)',
    boxShadow: '0 6px 0 rgba(25,199,168,.14), 0 14px 28px rgba(0,0,0,.08)',
  },

  courseHead: {
    background: 'linear-gradient(180deg,#17252d,#0b1419)',
    padding: '17px 22px',
    color: '#ffffff',
    borderBottom: '4px solid rgba(25,199,168,.55)',
  },

  courseTitle: {
    fontWeight: 900,
    fontSize: '1.25rem',
    lineHeight: 1.1,
  },

  teacherName: {
    fontSize: '.9rem',
    opacity: 0.95,
    color: '#bff8ee',
    marginTop: 5,
    fontWeight: 850,
  },

  courseBody: {
    background: 'linear-gradient(180deg,#ffffff,#f7fffc)',
    padding: '18px 20px 20px',
  },

  chapterBox: {
    marginBottom: 16,
  },

  chapterTitle: {
    fontWeight: 900,
    fontSize: '1.05rem',
    color: '#12313a',
    marginBottom: 10,
    lineHeight: 1.25,
  },

  lessonGrid: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: 12,
  },

  lessonCard: (hasWords, isHov) => ({
    background: isHov
      ? 'linear-gradient(180deg,#19c7a8,#07947f)'
      : hasWords
      ? 'linear-gradient(180deg,#ffffff,#eefdf9)'
      : 'linear-gradient(180deg,#f3f4f6,#e5e7eb)',
    border: `3px solid ${
      isHov ? '#19c7a8' : hasWords ? 'rgba(25,199,168,.45)' : '#d1d5db'
    }`,
    borderRadius: 18,
    padding: '12px 15px',
    cursor: hasWords ? 'pointer' : 'not-allowed',
    opacity: hasWords ? 1 : 0.62,
    minWidth: 150,
    maxWidth: 230,
    boxShadow: isHov
      ? '0 6px 0 #087565, 0 12px 24px rgba(0,0,0,.14)'
      : hasWords
      ? '0 5px 0 rgba(25,199,168,.14)'
      : '0 4px 0 rgba(0,0,0,.08)',
    transition: 'all .18s ease',
    transform: isHov ? 'translateY(-3px)' : 'none',
  }),

  lessonName: (isHov) => ({
    fontWeight: 900,
    fontSize: '.92rem',
    color: isHov ? '#ffffff' : '#12313a',
    lineHeight: 1.2,
  }),

  lessonMeta: (hasWords, isHov) => ({
    fontSize: '.84rem',
    color: isHov ? '#d8fffa' : hasWords ? '#07947f' : '#6b7280',
    marginTop: 5,
    fontWeight: 900,
  }),
};

function TopicSelect({ title, onStart }) {
  const history = useHistory();
  const [hovered, setHovered] = useState(null);
  const [hoveredLesson, setHoveredLesson] = useState(null);
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

    onStart({
      wordList: lesson.words,
      type: '-1',
      level: '-1',
      specialty: '-1',
      topics: [],
    });
  };

  const handleSwitchToLesson = async () => {
    setTab('lesson');

    if (courses.length > 0) return;

    setLoadingCourses(true);

    try {
      const res = await courseApi.getStudentCourses();
      // setCourses(res.data?.courses || res.data || []);
      const enrollments = res.data?.enrollments || [];
      const courseDetails = await Promise.all(
        enrollments
          .map((e) => e.courseId)
          .filter(Boolean)
          .map(async (course) => {
            try {
              const detailRes = await courseApi.getCourseDetail(course._id || course.id);
              return detailRes.data?.course || null;
            } catch {
              return null;
            }
          }),
      );
      setCourses(courseDetails.filter(Boolean));
    } catch {
      setCourses([]);
    } finally {
      setLoadingCourses(false);
    }
  };

  return (
    <div style={S.page}>
      <style>{CSS}</style>

      <div style={S.header} className="topic-header">
        <button onClick={() => history.goBack()} style={S.backBtn}>
          Quay lại
        </button>

        <div style={S.titleBox} className="topic-title-box">
          <h1 style={S.title}>{title || 'Chọn chủ đề'}</h1>

          <p style={S.subtitle}>
            Chọn chủ đề hoặc bài học để bắt đầu luyện từ vựng.
          </p>
        </div>

        <div className="topic-header-spacer" />
      </div>

      <div style={S.tabWrap}>
        <div style={S.tabBox} className="topic-tab-box">
          <button onClick={() => setTab('topic')} style={S.tab(tab === 'topic')}>
            Chủ đề từ vựng
          </button>

          <button onClick={handleSwitchToLesson} style={S.tab(tab === 'lesson')}>
            Bài học giáo viên
          </button>
        </div>
      </div>

      <div style={S.content} className="topic-content">
        {tab === 'topic' && (
          <>
            <div
              onClick={() => handleSelect('all')}
              onMouseEnter={() => setHovered('all')}
              onMouseLeave={() => setHovered(null)}
              style={S.allCard(hovered === 'all')}
            >
              <div style={S.allIcon(hovered === 'all')}>ALL</div>

              <div>
                <div style={S.allTitle(hovered === 'all')}>Tất cả chủ đề</div>

                <div style={S.allSub(hovered === 'all')}>
                  Lấy từ vựng ngẫu nhiên từ mọi chủ đề để chơi nhanh.
                </div>
              </div>

              <span style={S.arrow(hovered === 'all')}>›</span>
            </div>

            <div style={S.topicGrid} className="topic-grid">
              {TOPICS.map((topic, i) => {
                const [color1, color2] = COLORS[i % COLORS.length];
                const isHov = hovered === topic.key;

                return (
                  <div
                    key={topic.key}
                    onClick={() => handleSelect(topic.key)}
                    onMouseEnter={() => setHovered(topic.key)}
                    onMouseLeave={() => setHovered(null)}
                    style={S.topicCard(isHov, color1, color2)}
                  >
                    <div style={S.topicTopBar(color1, color2)} />

                    <div style={S.topicIconWrap(color1, color2)}>
                      <img
                        src={topic.icon}
                        alt={topic.title}
                        style={S.topicIcon}
                        draggable={false}
                      />
                    </div>

                    <div style={S.topicTitle(isHov, color2)}>
                      {topic.title}
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        )}

        {tab === 'lesson' && (
          <div>
            {loadingCourses && (
              <div style={S.loadingBox}>
                Đang tải khóa học...
              </div>
            )}

            {!loadingCourses && courses.length === 0 && (
              <div style={S.emptyBox}>
                <p style={S.emptyTitle}>Bạn chưa tham gia khóa học nào</p>

                <p style={S.emptySub}>
                  Hãy tham gia khóa học của giáo viên để luyện từ vựng tại đây.
                </p>
              </div>
            )}

            {!loadingCourses && courses.map((course) => (
              <div key={course._id || course.id} style={S.courseCard}>
                <div style={S.courseHead}>
                  <div style={S.courseTitle}>{course.title}</div>

                  {course.teacherName && (
                    <div style={S.teacherName}>
                      Giáo viên: {course.teacherName}
                    </div>
                  )}
                </div>

                <div style={S.courseBody}>
                  {(course.chapters || []).map((chapter) => (
                    <div key={chapter._id || chapter.id} style={S.chapterBox}>
                      <div style={S.chapterTitle}>
                        {chapter.title}
                      </div>

                      <div style={S.lessonGrid}>
                        {(chapter.lessons || []).map((lesson) => {
                          const hasWords = lesson.words?.length > 0;
                          const lessonId = lesson._id || lesson.id;
                          const isHov = hoveredLesson === lessonId && hasWords;

                          return (
                            <div
                              key={lessonId}
                              onClick={() => hasWords && handleLessonSelect(lesson)}
                              onMouseEnter={() => setHoveredLesson(lessonId)}
                              onMouseLeave={() => setHoveredLesson(null)}
                              style={S.lessonCard(hasWords, isHov)}
                            >
                              <div style={S.lessonName(isHov)}>
                                {lesson.title}
                              </div>

                              <div style={S.lessonMeta(hasWords, isHov)}>
                                {hasWords ? `${lesson.words.length} từ vựng` : 'Chưa có từ vựng'}
                              </div>
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