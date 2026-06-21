import Grid from '@material-ui/core/Grid';
import adminApi from 'apis/adminApi';
import communicateIcon from 'assets/icons/communicate.png';
import dictionaryIcon from 'assets/icons/dictionary.png';
import editIcon from 'assets/icons/edit.png';
import favoriteIcon from 'assets/icons/favorite.png';
import flashcardIcon from 'assets/icons/flashcard.png';
import gameIcon from 'assets/icons/game.png';
import grammarIcon from 'assets/icons/grammar.png';
import ipaIcon from 'assets/icons/ipa.png';
import verbIcon from 'assets/icons/verb.png';
import classroomIcon from 'assets/icons/lop_hoc.png';

import bauTroi from 'assets/images/home/bau_troi.jpg';
import dieuHau from 'assets/images/home/dieu_hau.png';
import nhaTrenDoi from 'assets/images/home/nha_tren_doi.jpg';
import saMac from 'assets/images/home/sa_mac.jpg';
import khuVuonCoTich from 'assets/images/home/khu_vuon_co_tich.jpg';
import monkeyGroup from 'assets/images/home/anh_dan_khi_khong_nen.png';

import FeatureBox from 'components/FeatureBox';
import { ROUTES } from 'constant';
import useScrollTop from 'hooks/useScrollTop';
import useTitle from 'hooks/useTitle';
import React, { Suspense, useEffect, useMemo, useState } from 'react';
import { useSelector } from 'react-redux';

const TeacherCoursesPage = React.lazy(() =>
  import('pages/Course/TeacherCoursesPage'),
);
const TeacherGrammarPage = React.lazy(() => import('pages/Teacher/Grammar'));
const TeacherGameRoomsPage = React.lazy(() => import('pages/Teacher/GameRooms'));
const TeacherVocabSetPage = React.lazy(() => import('pages/Teacher/VocabSet'));
const ClassroomPage = React.lazy(() => import('pages/Classroom'));

const STUDENT_FEATURE_LIST = [
  {
    title: 'Bảng phiên âm IPA',
    subTitle: 'Luyện nghe, phát âm chuẩn với 44 âm trong bảng phiên âm quốc tế.',
    imgUrl: ipaIcon,
    to: ROUTES.IPA,
    theme: 'blue',
  },
  {
    title: '1000+ câu giao tiếp',
    subTitle: 'Luyện nghe và nói các mẫu câu tiếng Anh giao tiếp hằng ngày.',
    imgUrl: communicateIcon,
    to: ROUTES.COMMUNICATION_PHRASE,
    theme: 'orange',
  },
  {
    title: 'Flashcard từ vựng',
    subTitle: 'Ghi nhớ từ vựng nhanh hơn bằng thẻ học tương tác.',
    imgUrl: flashcardIcon,
    to: ROUTES.FLASHCARD,
    theme: 'cyan',
  },
  {
    title: 'Từ điển',
    subTitle: 'Tra cứu từ vựng theo cấp độ, loại từ và chủ đề học tập.',
    imgUrl: dictionaryIcon,
    to: ROUTES.DYNO_DICTIONARY,
    theme: 'purple',
  },
  {
    title: 'Từ vựng yêu thích',
    subTitle: 'Lưu lại những từ quan trọng để ôn tập dễ dàng hơn.',
    imgUrl: favoriteIcon,
    to: ROUTES.FAVORITE,
    theme: 'pink',
  },
  {
    title: 'Động từ bất quy tắc',
    subTitle: 'Hệ thống các động từ bất quy tắc phổ biến trong tiếng Anh.',
    imgUrl: verbIcon,
    to: ROUTES.IRREGULAR,
    theme: 'orange',
  },
  {
    title: 'Ngữ pháp',
    subTitle: 'Tổng hợp cấu trúc câu và điểm ngữ pháp cần thiết.',
    imgUrl: grammarIcon,
    to: ROUTES.GRAMMAR,
    theme: 'green',
  },
  {
    title: 'Play Games',
    subTitle: 'Ôn luyện kiến thức qua trò chơi để học vui và nhớ lâu hơn.',
    imgUrl: gameIcon,
    to: ROUTES.GAMES.HOME,
    theme: 'blue',
  },
  {
    title: 'Đóng góp nội dung',
    subTitle: 'Thêm từ mới, câu mới hoặc đề xuất chỉnh sửa nội dung.',
    imgUrl: editIcon,
    to: ROUTES.CONTRIBUTION,
    theme: 'pink',
  },
];

const TEACHER_TABS = [
  {
    id: 'courses',
    title: 'Quản lý khóa học',
    shortTitle: 'Khóa học',
    subTitle: 'Tạo khóa học, chia chương, thêm bài học và quản lý nội dung học tập.',
    imgUrl: flashcardIcon,
    color: '#2563eb',
    tone: 'blue',
  },
  {
    id: 'classrooms',
    title: 'Quản lý lớp học',
    shortTitle: 'Lớp học',
    subTitle: 'Theo dõi danh sách lớp, học sinh và hoạt động học tập.',
    imgUrl: classroomIcon,
    color: '#0891b2',
    tone: 'cyan',
  },
  {
    id: 'grammar',
    title: 'Quản lý ngữ pháp',
    shortTitle: 'Ngữ pháp',
    subTitle: 'Soạn bài ngữ pháp, thêm bài tập và xuất bản nội dung cho học sinh.',
    imgUrl: grammarIcon,
    color: '#059669',
    tone: 'green',
  },
  {
    id: 'games',
    title: 'Quản lý phòng game',
    shortTitle: 'Phòng game',
    subTitle: 'Tổ chức trò chơi tương tác, tạo mã phòng và theo dõi kết quả.',
    imgUrl: gameIcon,
    color: '#d97706',
    tone: 'orange',
  },
  {
    id: 'vocab',
    title: 'Quản lý từ vựng',
    shortTitle: 'Từ vựng',
    subTitle: 'Tạo bộ từ theo unit, chủ đề, cấp độ và gán nội dung cho lớp học.',
    imgUrl: dictionaryIcon,
    color: '#7c3aed',
    tone: 'purple',
  },
];

const ADMIN_ACTIONS = [
  {
    title: 'Quản lý tài khoản',
    desc: 'Tạo giáo viên, tạo học sinh, đổi quyền, khóa hoặc mở tài khoản người dùng.',
    icon: '👥',
    color: '#2563eb',
    to: `${ROUTES.ADMIN.USERS}?tab=accounts`,
  },
  {
    title: 'Thống kê báo cáo',
    desc: 'Theo dõi người dùng, khóa học, lượt đăng ký và hoạt động game bằng biểu đồ.',
    icon: '📊',
    color: '#f97316',
    to: `${ROUTES.ADMIN.USERS}?tab=statistics`,
  },
  {
    title: 'Quản trị dữ liệu',
    desc: 'Quản lý lớp học, bài ngữ pháp, dữ liệu mẫu và khóa học toàn hệ thống.',
    icon: '🗂',
    color: '#10b981',
    to: `${ROUTES.ADMIN.USERS}?tab=systemData`,
  },
  {
    title: 'Seed grammar',
    desc: 'Khởi tạo nhanh dữ liệu ngữ pháp mẫu cho hệ thống học tiếng Anh.',
    icon: '⚙️',
    color: '#ec4899',
    to: `${ROUTES.ADMIN.USERS}?tab=systemData`,
  },
];

function formatNumber(value) {
  const n = Number(value || 0);
  if (Number.isNaN(n)) return value || 0;
  return n.toLocaleString('vi-VN');
}

function getTeacherTab() {
  const params = new URLSearchParams(window.location.search);
  const tab = params.get('teacherTab');

  return TEACHER_TABS.some((item) => item.id === tab) ? tab : 'dashboard';
}

function AdminMiniChart() {
  return (
    <div className="admin-chart-card">
      <div className="admin-card-head">
        <div>
          <h3>Hoạt động hệ thống</h3>
          <p>Theo dõi nhanh mức độ vận hành trong tuần</p>
        </div>
        <span>•••</span>
      </div>

      <div className="admin-area-chart">
        <svg viewBox="0 0 720 250" preserveAspectRatio="none">
          <defs>
            <linearGradient id="areaOne" x1="0" x2="0" y1="0" y2="1">
              <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.45" />
              <stop offset="100%" stopColor="#38bdf8" stopOpacity="0.05" />
            </linearGradient>
            <linearGradient id="areaTwo" x1="0" x2="0" y1="0" y2="1">
              <stop offset="0%" stopColor="#2563eb" stopOpacity="0.38" />
              <stop offset="100%" stopColor="#2563eb" stopOpacity="0.04" />
            </linearGradient>
          </defs>

          <path
            d="M0,145 C70,120 90,165 150,118 C210,70 240,120 300,90 C365,55 390,140 455,105 C520,70 555,140 620,95 C670,65 690,110 720,82 L720,250 L0,250 Z"
            fill="url(#areaOne)"
          />
          <path
            d="M0,175 C65,150 105,190 155,150 C215,105 260,160 320,122 C380,86 420,178 480,135 C540,95 575,170 635,130 C690,88 705,138 720,118 L720,250 L0,250 Z"
            fill="url(#areaTwo)"
          />
          <path
            d="M0,145 C70,120 90,165 150,118 C210,70 240,120 300,90 C365,55 390,140 455,105 C520,70 555,140 620,95 C670,65 690,110 720,82"
            fill="none"
            stroke="#0ea5e9"
            strokeWidth="5"
            strokeLinecap="round"
          />
          <path
            d="M0,175 C65,150 105,190 155,150 C215,105 260,160 320,122 C380,86 420,178 480,135 C540,95 575,170 635,130 C690,88 705,138 720,118"
            fill="none"
            stroke="#2563eb"
            strokeWidth="5"
            strokeLinecap="round"
          />
        </svg>
      </div>
    </div>
  );
}

function AdminDashboardHome() {
  const userInfo = useSelector((s) => s.userInfo);
  const [systemStats, setSystemStats] = useState(null);
  const [courseStats, setCourseStats] = useState(null);
  const [gameStats, setGameStats] = useState(null);

  useEffect(() => {
    let mounted = true;

    Promise.all([
      adminApi.getSystemStats().catch(() => null),
      adminApi.getCourseStats().catch(() => null),
      adminApi.getGameStats().catch(() => null),
    ]).then(([systemRes, courseRes, gameRes]) => {
      if (!mounted) return;

      setSystemStats(systemRes?.data?.stats || null);
      setCourseStats(courseRes?.data?.stats || null);
      setGameStats(gameRes?.data?.stats || null);
    });

    return () => {
      mounted = false;
    };
  }, []);

  const statCards = useMemo(() => {
    return [
      {
        label: 'Tổng người dùng',
        value: systemStats?.totalUsers || 0,
        icon: '👥',
        gradient: 'linear-gradient(135deg,#4f46e5,#2563eb)',
      },
      {
        label: 'Khóa học',
        value: systemStats?.totalCourses || courseStats?.totalCourses || 0,
        icon: '📚',
        gradient: 'linear-gradient(135deg,#f97316,#fb923c)',
      },
      {
        label: 'Học sinh',
        value: systemStats?.totalStudents || 0,
        icon: '🎓',
        gradient: 'linear-gradient(135deg,#22c55e,#16a34a)',
      },
      {
        label: 'Phòng game',
        value: systemStats?.totalGameRooms || gameStats?.totalGameRooms || 0,
        icon: '🎮',
        gradient: 'linear-gradient(135deg,#ef4444,#f97316)',
      },
    ];
  }, [systemStats, courseStats, gameStats]);

  return (
    <div className="admin-pro-dashboard">
      <style>
        {`
          .admin-pro-dashboard,
          .admin-pro-dashboard * {
            font-family: 'Inter', 'Segoe UI', Roboto, Arial, sans-serif !important;
            box-sizing: border-box;
          }

          .admin-pro-dashboard {
            min-height: calc(100vh - 78px);
            margin: 0 calc((100vw - 100%) / -2);
            background: #f3f7fb;
            display: grid;
            grid-template-columns: 250px minmax(0, 1fr);
            color: #172033;
          }

          .admin-sidebar {
            background: linear-gradient(180deg, #516b76 0%, #31434b 100%);
            color: #e8f2f7;
            min-height: calc(100vh - 78px);
            padding: 22px 0;
            box-shadow: 8px 0 28px rgba(15,23,42,.10);
          }

          .admin-brand {
            display: flex;
            align-items: center;
            gap: 12px;
            padding: 0 22px 22px;
            border-bottom: 1px solid rgba(255,255,255,.12);
          }

          .admin-brand-mark {
            width: 38px;
            height: 38px;
            border-radius: 12px;
            background: rgba(255,255,255,.16);
            display: flex;
            align-items: center;
            justify-content: center;
            color: #fff;
            font-size: 1.25rem;
            font-weight: 950;
          }

          .admin-brand strong {
            display: block;
            font-size: 1.35rem;
            line-height: 1;
            color: #fff;
            font-weight: 950;
          }

          .admin-brand span {
            display: block;
            margin-top: 4px;
            font-size: .85rem;
            color: #b8c8d0;
            font-weight: 700;
          }

          .admin-nav-group {
            padding: 18px 12px 0;
          }

          .admin-nav-title {
            padding: 10px 12px 8px;
            color: #aebdc5;
            font-size: .8rem;
            text-transform: uppercase;
            letter-spacing: .12em;
            font-weight: 950;
          }

          .admin-nav-item {
            display: flex;
            align-items: center;
            gap: 12px;
            min-height: 44px;
            padding: 0 14px;
            border-radius: 12px;
            color: #e8f2f7;
            text-decoration: none;
            font-size: 1.05rem;
            font-weight: 850;
            margin-bottom: 5px;
            transition: all .15s ease;
          }

          .admin-nav-item:hover,
          .admin-nav-item.active {
            background: rgba(255,255,255,.14);
            transform: translateX(3px);
          }

          .admin-main {
            min-width: 0;
            padding: 24px 26px 44px;
          }

          .admin-topbar {
            height: 58px;
            display: flex;
            align-items: center;
            justify-content: space-between;
            gap: 18px;
            margin-bottom: 22px;
          }

          .admin-search {
            flex: 1;
            max-width: 700px;
            height: 48px;
            border-radius: 6px;
            border: 1px solid #dbe4ea;
            background: #fff;
            display: flex;
            align-items: center;
            padding: 0 16px;
            color: #94a3b8;
            box-shadow: 0 8px 18px rgba(15,23,42,.04);
          }

          .admin-search input {
            border: none;
            outline: none;
            flex: 1;
            height: 100%;
            margin-left: 12px;
            font-size: 1.05rem;
            color: #334155;
            background: transparent;
          }

          .admin-user-mini {
            display: flex;
            align-items: center;
            gap: 12px;
            min-width: 220px;
            justify-content: flex-end;
          }

          .admin-user-mini .avatar {
            width: 42px;
            height: 42px;
            border-radius: 50%;
            object-fit: cover;
            background: #e2e8f0;
          }

          .admin-user-mini strong {
            display: block;
            color: #0f172a;
            font-size: 1rem;
            font-weight: 950;
          }

          .admin-user-mini span {
            color: #64748b;
            font-size: .88rem;
            font-weight: 700;
          }

          .admin-hero-line {
            display: flex;
            align-items: flex-end;
            justify-content: space-between;
            gap: 16px;
            margin-bottom: 18px;
          }

          .admin-hero-line h1 {
            margin: 0;
            color: #0f172a;
            font-size: 2.05rem;
            font-weight: 950;
            letter-spacing: -.04em;
          }

          .admin-hero-line p {
            margin: 8px 0 0;
            color: #64748b;
            font-size: 1.08rem;
            line-height: 1.55;
            font-weight: 700;
          }

          .admin-quick-actions {
            display: flex;
            gap: 10px;
            flex-wrap: wrap;
          }

          .admin-action-link {
            height: 42px;
            display: inline-flex;
            align-items: center;
            justify-content: center;
            padding: 0 16px;
            border-radius: 999px;
            background: #fff;
            color: #334155;
            border: 1px solid #dbe4ea;
            text-decoration: none;
            font-size: .95rem;
            font-weight: 900;
            box-shadow: 0 8px 18px rgba(15,23,42,.05);
          }

          .admin-stat-grid {
            display: grid;
            grid-template-columns: repeat(4, minmax(0, 1fr));
            gap: 20px;
            margin-bottom: 22px;
          }

          .admin-stat-card {
            min-height: 122px;
            border-radius: 10px;
            color: #fff;
            padding: 22px 22px 18px;
            box-shadow: 0 16px 30px rgba(15,23,42,.12);
            position: relative;
            overflow: hidden;
          }

          .admin-stat-card::after {
            content: '';
            position: absolute;
            width: 130px;
            height: 130px;
            right: -42px;
            top: -48px;
            border-radius: 50%;
            background: rgba(255,255,255,.13);
          }

          .admin-stat-top {
            display: flex;
            justify-content: space-between;
            align-items: flex-start;
            position: relative;
            z-index: 1;
          }

          .admin-stat-value {
            font-size: 1.72rem;
            line-height: 1;
            font-weight: 950;
            letter-spacing: -.035em;
          }

          .admin-stat-icon {
            font-size: 1.4rem;
            opacity: .95;
          }

          .admin-stat-line {
            width: 58%;
            height: 4px;
            border-radius: 999px;
            background: rgba(255,255,255,.72);
            margin: 20px 0 16px;
            position: relative;
            z-index: 1;
          }

          .admin-stat-bottom {
            position: relative;
            z-index: 1;
            color: rgba(255,255,255,.92);
            font-size: .98rem;
            font-weight: 850;
          }

          .admin-content-grid {
            display: grid;
            grid-template-columns: minmax(0, 1.2fr) minmax(0, .8fr);
            gap: 22px;
            margin-bottom: 22px;
          }

          .admin-chart-card {
            background: #fff;
            border: 1px solid #e2e8f0;
            border-radius: 10px;
            box-shadow: 0 14px 30px rgba(15,23,42,.08);
            padding: 20px;
            min-height: 315px;
          }

          .admin-card-head {
            display: flex;
            justify-content: space-between;
            align-items: flex-start;
            gap: 12px;
            margin-bottom: 16px;
          }

          .admin-card-head h3 {
            margin: 0;
            color: #0f172a;
            font-size: 1.22rem;
            font-weight: 950;
          }

          .admin-card-head p {
            margin: 6px 0 0;
            color: #64748b;
            font-size: .98rem;
            font-weight: 700;
          }

          .admin-area-chart {
            height: 245px;
          }

          .admin-area-chart svg {
            width: 100%;
            height: 100%;
          }

          .admin-action-grid {
            display: grid;
            grid-template-columns: repeat(4, minmax(0, 1fr));
            gap: 18px;
          }

          .admin-work-card {
            min-height: 210px;
            padding: 22px;
            border-radius: 12px;
            background: #fff;
            border: 1px solid #e2e8f0;
            box-shadow: 0 14px 30px rgba(15,23,42,.07);
            text-decoration: none;
            color: inherit;
            position: relative;
            overflow: hidden;
            transition: all .15s ease;
          }

          .admin-work-card:hover {
            transform: translateY(-4px);
            box-shadow: 0 20px 42px rgba(15,23,42,.12);
          }

          .admin-work-icon {
            width: 58px;
            height: 58px;
            border-radius: 16px;
            background: var(--soft);
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 1.65rem;
            margin-bottom: 16px;
          }

          .admin-work-card h3 {
            margin: 0 0 9px;
            color: #0f172a;
            font-size: 1.16rem;
            line-height: 1.28;
            font-weight: 950;
          }

          .admin-work-card p {
            margin: 0;
            color: #64748b;
            font-size: .98rem;
            line-height: 1.52;
            font-weight: 700;
          }

          .admin-work-card b {
            position: absolute;
            left: 22px;
            bottom: 18px;
            color: var(--main);
            font-size: .94rem;
            font-weight: 950;
          }

          @media (max-width: 1200px) {
            .admin-pro-dashboard {
              grid-template-columns: 1fr;
            }

            .admin-sidebar {
              display: none;
            }

            .admin-stat-grid,
            .admin-action-grid {
              grid-template-columns: repeat(2, minmax(0, 1fr));
            }

            .admin-content-grid {
              grid-template-columns: 1fr;
            }
          }
        `}
      </style>

      <aside className="admin-sidebar">
        <div className="admin-brand">
          <div className="admin-brand-mark">E</div>
          <div>
            <strong>EDWARDS</strong>
            <span>Admin System</span>
          </div>
        </div>

        <div className="admin-nav-group">
          <div className="admin-nav-title">Main</div>

          <a href="/" className="admin-nav-item active">
            <span>▦</span>
            Dashboard
          </a>

          <a href={`${ROUTES.ADMIN.USERS}?tab=accounts`} className="admin-nav-item">
            <span>👥</span>
            Quản lý tài khoản
          </a>

          <a href={`${ROUTES.ADMIN.USERS}?tab=statistics`} className="admin-nav-item">
            <span>📊</span>
            Thống kê báo cáo
          </a>

          <a href={`${ROUTES.ADMIN.USERS}?tab=systemData`} className="admin-nav-item">
            <span>🗂</span>
            Quản trị dữ liệu
          </a>
        </div>
      </aside>

      <main className="admin-main">
        <div className="admin-topbar">
          <div className="admin-search">
            <span>🔍</span>
            <input placeholder="Tìm kiếm nhanh trong hệ thống..." />
          </div>

          <div className="admin-user-mini">
            {userInfo?.avt ? (
              <img className="avatar" src={userInfo.avt} alt="" />
            ) : (
              <div className="avatar" />
            )}

            <div>
              <strong>{userInfo?.name || 'Admin'}</strong>
              <span>Web Administrator</span>
            </div>
          </div>
        </div>

        <div className="admin-hero-line">
          <div>
            <h1>Dashboard quản trị</h1>
            <p>
              Trung tâm điều phối tài khoản, báo cáo và dữ liệu vận hành của
              website học tiếng Anh.
            </p>
          </div>

          <div className="admin-quick-actions">
            <a className="admin-action-link" href={`${ROUTES.ADMIN.USERS}?tab=accounts`}>
              Quản lý tài khoản
            </a>

            <a className="admin-action-link" href={`${ROUTES.ADMIN.USERS}?tab=statistics`}>
              Xem báo cáo
            </a>
          </div>
        </div>

        <section className="admin-stat-grid">
          {statCards.map((item) => (
            <div
              className="admin-stat-card"
              key={item.label}
              style={{ background: item.gradient }}
            >
              <div className="admin-stat-top">
                <div className="admin-stat-value">{formatNumber(item.value)}</div>
                <div className="admin-stat-icon">{item.icon}</div>
              </div>

              <div className="admin-stat-line" />

              <div className="admin-stat-bottom">{item.label}</div>
            </div>
          ))}
        </section>

        <section className="admin-content-grid">
          <AdminMiniChart />

          <div className="admin-chart-card">
            <div className="admin-card-head">
              <div>
                <h3>Tổng quan người dùng</h3>
                <p>Phân bổ tài khoản theo vai trò</p>
              </div>
              <span>•••</span>
            </div>

            <div style={{ display: 'grid', gap: 14 }}>
              <div style={{ fontWeight: 900, fontSize: '1.1rem' }}>
                Học sinh: {formatNumber(systemStats?.totalStudents || 0)}
              </div>
              <div style={{ fontWeight: 900, fontSize: '1.1rem' }}>
                Giáo viên: {formatNumber(systemStats?.totalTeachers || 0)}
              </div>
              <div style={{ fontWeight: 900, fontSize: '1.1rem' }}>
                Admin: {formatNumber(systemStats?.totalAdmins || 1)}
              </div>
            </div>
          </div>
        </section>

        <section className="admin-action-grid">
          {ADMIN_ACTIONS.map((item) => (
            <a
              href={item.to}
              key={item.title}
              className="admin-work-card"
              style={{
                '--main': item.color,
                '--soft': `${item.color}18`,
              }}
            >
              <div className="admin-work-icon">{item.icon}</div>
              <h3>{item.title}</h3>
              <p>{item.desc}</p>
              <b>Mở chức năng →</b>
            </a>
          ))}
        </section>
      </main>
    </div>
  );
}

function TeacherDashboardHome() {
  const userInfo = useSelector((s) => s.userInfo);
  const [activeTeacherTab, setActiveTeacherTab] = useState(getTeacherTab());

  const activeTabInfo =
    TEACHER_TABS.find((item) => item.id === activeTeacherTab) || null;

  const changeTeacherTab = (tab) => {
    setActiveTeacherTab(tab);

    const url = tab === 'dashboard' ? '/' : `/?teacherTab=${tab}`;
    window.history.replaceState(null, '', url);
  };

  const renderTeacherContent = () => {
    if (activeTeacherTab === 'courses') {
      return <TeacherCoursesPage embedded />;
    }

    if (activeTeacherTab === 'classrooms') {
      return <ClassroomPage embedded />;
    }

    if (activeTeacherTab === 'grammar') {
      return <TeacherGrammarPage embedded />;
    }

    if (activeTeacherTab === 'games') {
      return <TeacherGameRoomsPage embedded />;
    }

    if (activeTeacherTab === 'vocab') {
      return <TeacherVocabSetPage embedded />;
    }

    return null;
  };

  const teacherStats = [
    {
      label: 'Khóa học',
      value: '12',
      sub: 'Nội dung giảng dạy',
      icon: flashcardIcon,
      color: '#2563eb',
    },
    {
      label: 'Lớp học',
      value: '4',
      sub: 'Lớp đang phụ trách',
      icon: classroomIcon,
      color: '#0891b2',
    },
    {
      label: 'Bài ngữ pháp',
      value: '36',
      sub: 'Bài học đã soạn',
      icon: grammarIcon,
      color: '#059669',
    },
    {
      label: 'Phòng game',
      value: '8',
      sub: 'Hoạt động tương tác',
      icon: gameIcon,
      color: '#d97706',
    },
  ];

  const teacherTasks = [
    {
      title: 'Rà soát bài học trong tuần',
      desc: 'Kiểm tra nội dung khóa học, bài tập ngữ pháp và tiến độ học tập của học sinh.',
      tag: 'Hôm nay',
      color: '#2563eb',
    },
    {
      title: 'Theo dõi lớp học',
      desc: 'Xem danh sách học sinh, sĩ số lớp và các hoạt động học tập gần đây.',
      tag: 'Ưu tiên',
      color: '#059669',
    },
    {
      title: 'Tổ chức hoạt động game',
      desc: 'Tạo phòng game để ôn luyện từ vựng, ngữ pháp và tăng tương tác trên lớp.',
      tag: 'Gợi ý',
      color: '#d97706',
    },
  ];

  return (
    <div className="teacher-admin-dashboard">
      <style>
        {`
          .teacher-admin-dashboard,
          .teacher-admin-dashboard * {
            font-family: 'Inter', 'Segoe UI', Roboto, Arial, sans-serif !important;
            box-sizing: border-box;
          }

          .teacher-admin-dashboard {
            min-height: calc(100vh - 78px);
            margin: 0 calc((100vw - 100%) / -2);
            background: #f3f6fb;
            display: grid;
            grid-template-columns: 312px minmax(0, 1fr);
            color: #0f172a;
          }

          .teacher-sidebar {
            min-height: calc(100vh - 78px);
            background: #070b14;
            color: #e5edf7;
            padding: 24px 18px;
            display: flex;
            flex-direction: column;
            box-shadow: 12px 0 34px rgba(15, 23, 42, .16);
          }

          .teacher-brand {
            display: flex;
            align-items: center;
            gap: 13px;
            padding: 0 10px 24px;
            border-bottom: 1px solid rgba(255,255,255,.09);
          }

          .teacher-brand-logo {
            width: 48px;
            height: 48px;
            border-radius: 16px;
            background: #111827;
            border: 1px solid rgba(255,255,255,.10);
            display: flex;
            align-items: center;
            justify-content: center;
            color: #fff;
            font-size: 1.16rem;
            font-weight: 950;
          }

          .teacher-brand strong {
            display: block;
            color: #fff;
            font-size: 1.08rem;
            font-weight: 950;
            line-height: 1.1;
          }

          .teacher-brand span {
            display: block;
            margin-top: 5px;
            color: #93a4b8;
            font-size: .92rem;
            font-weight: 750;
          }

          .teacher-menu {
            padding-top: 20px;
            flex: 1;
          }

          .teacher-menu-title {
            margin: 0 0 12px;
            padding: 0 10px;
            color: #7f8ea3;
            font-size: .82rem;
            font-weight: 950;
            letter-spacing: .14em;
            text-transform: uppercase;
          }

          .teacher-menu-item {
            width: 100%;
            min-height: 76px;
            border: 1px solid transparent;
            border-radius: 17px;
            background: transparent;
            color: #cbd5e1;
            display: flex;
            align-items: center;
            gap: 13px;
            padding: 12px;
            cursor: pointer;
            text-align: left;
            margin-bottom: 8px;
            transition: all .16s ease;
            text-decoration: none;
            font-family: inherit;
            outline: none;
          }

          .teacher-menu-item:hover,
          .teacher-menu-item.active {
            background: #111827;
            border-color: rgba(255,255,255,.13);
            color: #fff;
            box-shadow: 0 12px 28px rgba(0,0,0,.22);
          }

          .teacher-menu-icon {
            width: 42px;
            height: 42px;
            border-radius: 14px;
            background: rgba(255,255,255,.07);
            display: flex;
            align-items: center;
            justify-content: center;
            flex: 0 0 42px;
          }

          .teacher-menu-icon img {
            width: 24px;
            height: 24px;
            object-fit: contain;
          }

          .teacher-menu-item.active .teacher-menu-icon {
            background: #059669;
          }

          .teacher-menu-text strong {
            display: block;
            color: inherit;
            font-size: 1.08rem;
            font-weight: 900;
            line-height: 1.22;
          }

          .teacher-menu-text em {
            display: block;
            margin-top: 6px;
            color: #cbd5e1;
            font-size: .96rem;
            font-style: normal;
            font-weight: 700;
            line-height: 1.45;
          }

          .teacher-side-card {
            margin: 32px 8px 0;
            padding: 20px;
            border-radius: 20px;
            background: #111827;
            border: 1px solid rgba(255,255,255,.10);
          }

          .teacher-side-card span {
            display: block;
            color: #cbd5e1;
            font-size: .96rem;
            font-weight: 800;
          }

          .teacher-side-card strong {
            display: block;
            color: #fff;
            font-size: 1.85rem;
            font-weight: 950;
            margin: 8px 0 5px;
            letter-spacing: -.03em;
          }

          .teacher-side-card p {
            margin: 0;
            color: #cbd5e1;
            font-size: .96rem;
            line-height: 1.45;
            font-weight: 750;
          }

          .teacher-main {
            min-width: 0;
            padding: 24px 30px 44px;
          }

          .teacher-topbar {
            min-height: 54px;
            display: flex;
            align-items: center;
            justify-content: space-between;
            gap: 18px;
            margin-bottom: 20px;
          }

          .teacher-search {
            flex: 1;
            max-width: 760px;
            height: 46px;
            border-radius: 10px;
            border: 1px solid #d8e2ee;
            background: #fff;
            display: flex;
            align-items: center;
            gap: 10px;
            padding: 0 16px;
            color: #64748b;
            box-shadow: 0 8px 18px rgba(15,23,42,.045);
          }

          .teacher-search input {
            border: none;
            outline: none;
            flex: 1;
            height: 100%;
            font-size: .96rem;
            color: #334155;
            background: transparent;
            font-weight: 650;
          }

          .teacher-profile {
            min-width: 210px;
            display: flex;
            align-items: center;
            justify-content: flex-end;
            gap: 12px;
          }

          .teacher-avatar {
            width: 44px;
            height: 44px;
            border-radius: 50%;
            background: linear-gradient(135deg, #059669, #22c55e);
            color: #fff;
            display: flex;
            align-items: center;
            justify-content: center;
            font-weight: 950;
            overflow: hidden;
          }

          .teacher-avatar img {
            width: 100%;
            height: 100%;
            object-fit: cover;
          }

          .teacher-profile strong {
            display: block;
            color: #0f172a;
            font-size: .94rem;
            font-weight: 900;
            line-height: 1.2;
          }

          .teacher-profile span {
            color: #64748b;
            font-size: .82rem;
            font-weight: 750;
          }

          .teacher-hero-card {
            display: flex;
            align-items: center;
            justify-content: space-between;
            gap: 22px;
            border-radius: 18px;
            padding: 25px 28px;
            background: linear-gradient(135deg, #064e3b 0%, #0f766e 58%, #0891b2 100%);
            color: #fff;
            box-shadow: 0 18px 42px rgba(15,23,42,.16);
            margin-bottom: 22px;
          }

          .teacher-hero-card p {
            margin: 0 0 8px;
            color: #ccfbf1;
            font-size: .82rem;
            font-weight: 950;
            letter-spacing: .14em;
            text-transform: uppercase;
          }

          .teacher-hero-card h1 {
            margin: 0;
            color: #fff;
            font-size: 1.72rem;
            font-weight: 950;
            line-height: 1.25;
          }

          .teacher-hero-card span {
            display: block;
            margin-top: 10px;
            max-width: 780px;
            color: #ecfeff;
            font-size: .96rem;
            line-height: 1.62;
            font-weight: 650;
          }

          .teacher-hero-card button {
            border: none;
            font-family: inherit;
            border-radius: 999px;
            min-height: 42px;
            padding: 0 20px;
            background: #fff;
            color: #0f172a;
            font-size: .9rem;
            font-weight: 900;
            cursor: pointer;
            white-space: nowrap;
            display: inline-flex;
            align-items: center;
            text-decoration: none;
          }

          .teacher-stat-grid {
            display: grid;
            grid-template-columns: repeat(4, minmax(0, 1fr));
            gap: 18px;
            margin-bottom: 22px;
          }

          .teacher-stat-card {
            min-height: 116px;
            border: none;
            border-radius: 14px;
            padding: 18px;
            background: #fff;
            box-shadow: 0 14px 30px rgba(15,23,42,.08);
            display: flex;
            justify-content: space-between;
            align-items: flex-start;
            text-align: left;
            border-top: 5px solid var(--main);
            transition: all .16s ease;
          }

          .teacher-stat-card:hover {
            transform: translateY(-4px);
            box-shadow: 0 20px 42px rgba(15,23,42,.12);
          }

          .teacher-stat-card span {
            display: block;
            color: #475569;
            font-size: .96rem;
            font-weight: 850;
            margin-bottom: 10px;
          }

          .teacher-stat-card strong {
            display: block;
            color: #0f172a;
            font-size: 1.7rem;
            font-weight: 950;
            letter-spacing: -.04em;
          }

          .teacher-stat-card p {
            margin: 8px 0 0;
            color: #64748b;
            font-size: .96rem;
            line-height: 1.45;
            font-weight: 750;
          }

          .teacher-stat-card em {
            width: 42px;
            height: 42px;
            border-radius: 14px;
            background: rgba(37,99,235,.10);
            display: flex;
            align-items: center;
            justify-content: center;
            font-style: normal;
          }

          .teacher-stat-card em img {
            width: 23px;
            height: 23px;
            object-fit: contain;
          }

          .teacher-main-grid {
            display: grid;
            grid-template-columns: minmax(0, 1.2fr) minmax(330px, .8fr);
            gap: 22px;
            margin-bottom: 22px;
          }

          .teacher-panel {
            background: #fff;
            border: 1px solid #e2e8f0;
            border-radius: 14px;
            box-shadow: 0 14px 30px rgba(15,23,42,.08);
            padding: 22px;
            min-height: 315px;
          }

          .teacher-panel-head {
            display: flex;
            justify-content: space-between;
            align-items: flex-start;
            gap: 12px;
            margin-bottom: 18px;
          }

          .teacher-panel-head h3 {
            margin: 0;
            color: #0f172a;
            font-size: 1.16rem;
            font-weight: 950;
          }

          .teacher-panel-head p {
            margin: 7px 0 0;
            color: #64748b;
            font-size: .96rem;
            line-height: 1.45;
            font-weight: 750;
          }

          .teacher-tools-grid {
            display: grid;
            grid-template-columns: repeat(2, minmax(0, 1fr));
            gap: 14px;
          }

          .teacher-tool-card {
            min-height: 138px;
            text-align: left;
            cursor: pointer;
            font-family: inherit;
            border-radius: 14px;
            border: 1px solid #e2e8f0;
            background: #f8fafc;
            padding: 16px;
            color: inherit;
            display: block;
            transition: all .16s ease;
          }

          .teacher-tool-card:hover {
            transform: translateY(-3px);
            box-shadow: 0 14px 28px rgba(15,23,42,.09);
          }

          .teacher-tool-icon {
            width: 44px;
            height: 44px;
            border-radius: 14px;
            background: #fff;
            border: 1px solid #e2e8f0;
            display: flex;
            align-items: center;
            justify-content: center;
            margin-bottom: 12px;
          }

          .teacher-tool-icon img {
            width: 25px;
            height: 25px;
            object-fit: contain;
          }

          .teacher-tool-card h3 {
            margin: 0 0 7px;
            color: #0f172a;
            font-size: 1.03rem;
            line-height: 1.32;
            font-weight: 950;
          }

          .teacher-tool-card p {
            margin: 0;
            color: #64748b;
            font-size: .92rem;
            line-height: 1.5;
            font-weight: 700;
          }

          .teacher-task-list {
            display: grid;
            gap: 13px;
          }

          .teacher-task {
            display: grid;
            grid-template-columns: 12px minmax(0, 1fr) auto;
            gap: 12px;
            align-items: center;
            padding: 15px;
            border: 1px solid #e2e8f0;
            border-radius: 14px;
            background: #f8fafc;
          }

          .teacher-task i {
            width: 11px;
            height: 11px;
            border-radius: 50%;
            background: var(--main);
          }

          .teacher-task strong {
            display: block;
            color: #0f172a;
            font-size: 1rem;
            font-weight: 950;
            margin-bottom: 4px;
          }

          .teacher-task span {
            display: block;
            color: #64748b;
            font-size: .92rem;
            line-height: 1.48;
            font-weight: 700;
          }

          .teacher-task em {
            font-style: normal;
            border-radius: 999px;
            padding: 7px 10px;
            background: #fff;
            border: 1px solid #e2e8f0;
            color: #475569;
            font-size: .82rem;
            font-weight: 900;
            white-space: nowrap;
          }

          .teacher-embedded-head {
            background: #fff;
            border: 1px solid #e2e8f0;
            border-radius: 18px;
            box-shadow: 0 14px 30px rgba(15,23,42,.06);
            padding: 20px 22px;
            margin-bottom: 18px;
            display: flex;
            align-items: center;
            gap: 14px;
          }

          .teacher-embedded-head-icon {
            width: 48px;
            height: 48px;
            border-radius: 16px;
            display: flex;
            align-items: center;
            justify-content: center;
            background: #f8fafc;
            border: 1px solid #e2e8f0;
            flex: 0 0 48px;
          }

          .teacher-embedded-head-icon img {
            width: 27px;
            height: 27px;
            object-fit: contain;
          }

          .teacher-embedded-head h1 {
            margin: 0;
            color: #0f172a;
            font-size: 1.35rem;
            font-weight: 950;
            line-height: 1.25;
          }

          .teacher-embedded-head p {
            margin: 5px 0 0;
            color: #64748b;
            font-size: .96rem;
            line-height: 1.45;
            font-weight: 700;
          }

          .teacher-embedded-page {
            background: transparent;
            border: none;
            border-radius: 0;
            box-shadow: none;
            padding: 0;
            min-height: 520px;
            overflow: visible;
          }

          .teacher-embedded-page .container {
            max-width: 100% !important;
            width: 100% !important;
            padding-left: 0 !important;
            padding-right: 0 !important;
          }

          .teacher-embedded-page .classroom-page > section:first-child {
            display: none !important;
          }

          .teacher-loading {
            padding: 50px;
            text-align: center;
            color: #64748b;
            font-size: 1rem;
            font-weight: 800;
          }

          @media (max-width: 1200px) {
            .teacher-admin-dashboard {
              grid-template-columns: 1fr;
            }

            .teacher-sidebar {
              display: none;
            }

            .teacher-stat-grid {
              grid-template-columns: repeat(2, minmax(0, 1fr));
            }

            .teacher-main-grid {
              grid-template-columns: 1fr;
            }
          }

          @media (max-width: 760px) {
            .teacher-main {
              padding: 18px;
            }

            .teacher-topbar,
            .teacher-hero-card,
            .teacher-embedded-head {
              flex-direction: column;
              align-items: flex-start;
            }

            .teacher-stat-grid,
            .teacher-tools-grid {
              grid-template-columns: 1fr;
            }

            .teacher-profile {
              justify-content: flex-start;
            }
          }
        `}
      </style>

      <aside className="teacher-sidebar">
        <div className="teacher-brand">
          <div className="teacher-brand-logo">T</div>

          <div>
            <strong>EDWARDS</strong>
            <span>Teacher System</span>
          </div>
        </div>

        <div className="teacher-menu">
          <p className="teacher-menu-title">Main menu</p>

          <button
            type="button"
            onClick={() => changeTeacherTab('dashboard')}
            className={`teacher-menu-item ${
              activeTeacherTab === 'dashboard' ? 'active' : ''
            }`}
          >
            <span className="teacher-menu-icon">
              <img src={flashcardIcon} alt="" />
            </span>

            <span className="teacher-menu-text">
              <strong>Dashboard</strong>
              <em>Tổng quan giảng dạy</em>
            </span>
          </button>

          {TEACHER_TABS.map((item) => (
            <button
              type="button"
              key={item.id}
              onClick={() => changeTeacherTab(item.id)}
              className={`teacher-menu-item ${
                activeTeacherTab === item.id ? 'active' : ''
              }`}
            >
              <span className="teacher-menu-icon">
                <img src={item.imgUrl} alt="" />
              </span>

              <span className="teacher-menu-text">
                <strong>{item.title}</strong>
                <em>{item.subTitle}</em>
              </span>
            </button>
          ))}
        </div>

        <div className="teacher-side-card">
          <span>Lớp học đang phụ trách</span>
          <strong>4</strong>
          <p>Theo dõi học sinh và nội dung giảng dạy</p>
        </div>
      </aside>

      <main className="teacher-main">
        <div className="teacher-topbar">
          <div className="teacher-search">
            <span>🔍</span>
            <input placeholder="Tìm kiếm nhanh trong khu vực giáo viên..." />
          </div>

          <div className="teacher-profile">
            <div className="teacher-avatar">
              {userInfo?.avt ? (
                <img src={userInfo.avt} alt="" />
              ) : (
                (userInfo?.name || 'T').charAt(0).toUpperCase()
              )}
            </div>

            <div>
              <strong>{userInfo?.name || 'Giáo viên'}</strong>
              <span>Teacher Workspace</span>
            </div>
          </div>
        </div>

        {activeTeacherTab === 'dashboard' ? (
          <>
            <section className="teacher-hero-card">
              <div>
                <p>Teacher Dashboard</p>
                <h1>Trung tâm điều phối giảng dạy</h1>
                <span>
                  Quản lý khóa học, lớp học, bài ngữ pháp, bộ từ vựng và phòng
                  game trong cùng một không gian làm việc dành riêng cho giáo
                  viên.
                </span>
              </div>

              <button type="button" onClick={() => changeTeacherTab('courses')}>
                Quản lý khóa học
              </button>
            </section>

            <section className="teacher-stat-grid">
              {teacherStats.map((item) => (
                <div
                  key={item.label}
                  className="teacher-stat-card"
                  style={{ '--main': item.color }}
                >
                  <div>
                    <span>{item.label}</span>
                    <strong>{item.value}</strong>
                    <p>{item.sub}</p>
                  </div>

                  <em>
                    <img src={item.icon} alt="" />
                  </em>
                </div>
              ))}
            </section>

            <section className="teacher-main-grid">
              <div className="teacher-panel">
                <div className="teacher-panel-head">
                  <div>
                    <h3>Công cụ giảng dạy</h3>
                    <p>Truy cập nhanh các chức năng nghiệp vụ của giáo viên.</p>
                  </div>
                  <span>•••</span>
                </div>

                <div className="teacher-tools-grid">
                  {TEACHER_TABS.map((item) => (
                    <button
                      type="button"
                      key={item.id}
                      onClick={() => changeTeacherTab(item.id)}
                      className="teacher-tool-card"
                    >
                      <div className="teacher-tool-icon">
                        <img src={item.imgUrl} alt="" />
                      </div>

                      <h3>{item.title}</h3>
                      <p>{item.subTitle}</p>
                    </button>
                  ))}
                </div>
              </div>

              <div className="teacher-panel">
                <div className="teacher-panel-head">
                  <div>
                    <h3>Công việc cần lưu ý</h3>
                    <p>Các đầu việc gợi ý cho quá trình giảng dạy.</p>
                  </div>
                  <span>•••</span>
                </div>

                <div className="teacher-task-list">
                  {teacherTasks.map((item) => (
                    <div
                      key={item.title}
                      className="teacher-task"
                      style={{ '--main': item.color }}
                    >
                      <i />
                      <div>
                        <strong>{item.title}</strong>
                        <span>{item.desc}</span>
                      </div>
                      <em>{item.tag}</em>
                    </div>
                  ))}
                </div>
              </div>
            </section>
          </>
        ) : (
          <>
            {activeTabInfo && (
              <div
                className="teacher-embedded-head"
                style={{ borderTop: `5px solid ${activeTabInfo.color}` }}
              >
                <div className="teacher-embedded-head-icon">
                  <img src={activeTabInfo.imgUrl} alt="" />
                </div>

                <div>
                  <h1>{activeTabInfo.title}</h1>
                  <p>{activeTabInfo.subTitle}</p>
                </div>
              </div>
            )}

            <div className="teacher-embedded-page">
              <Suspense
                fallback={
                  <div className="teacher-loading">Đang tải chức năng...</div>
                }
              >
                {renderTeacherContent()}
              </Suspense>
            </div>
          </>
        )}
      </main>
    </div>
  );
}

function StudentHomePage() {
  return (
    <div className="container home-page">
      <section className="home-hero">
        <img className="home-hero-bg" src={bauTroi} alt="" />

        <div className="home-hero-content">
          <p className="home-eyebrow">EDWARDS ENGLISH</p>

          <h1>Học tiếng Anh mỗi ngày qua trò chơi và hình ảnh.</h1>

          <p className="home-description">
            Edwards giúp trẻ luyện phát âm, ghi nhớ từ vựng và sử dụng tiếng
            Anh tự nhiên hơn thông qua flashcard, câu giao tiếp và các hoạt động
            tương tác.
          </p>

          <div className="home-actions">
            <a className="home-btn home-btn-primary" href={ROUTES.FLASHCARD}>
              Bắt đầu học
            </a>

            <a className="home-btn home-btn-secondary" href={ROUTES.GAMES.HOME}>
              Khám phá trò chơi
            </a>
          </div>
        </div>

        <div className="home-visual">
          <img className="home-monkey-group" src={monkeyGroup} alt="" />
          <img className="home-eagle" src={dieuHau} alt="" />
        </div>
      </section>

      <section className="home-showcase">
        <div className="home-showcase-card">
          <img src={nhaTrenDoi} alt="Learning world" />
          <div>
            <p>Không gian học tập</p>
            <h3>Sinh động như một chuyến phiêu lưu</h3>
          </div>
        </div>

        <div className="home-showcase-card">
          <img src={khuVuonCoTich} alt="Games" />
          <div>
            <p>Game & thử thách</p>
            <h3>Học mà chơi, chơi mà nhớ lâu</h3>
          </div>
        </div>

        <div className="home-showcase-card">
          <img src={saMac} alt="Vocabulary" />
          <div>
            <p>Từ vựng mỗi ngày</p>
            <h3>Ôn tập bằng flashcard và trò chơi</h3>
          </div>
        </div>
      </section>

      <div className="home-section-heading">
        <p>Learning modules</p>
        <h2>Khám phá nội dung học tập</h2>
      </div>

      <Grid container spacing={4}>
        {STUDENT_FEATURE_LIST.map((box, index) => (
          <Grid item xs={12} md={6} lg={4} key={index}>
            <FeatureBox
              imgUrl={box.imgUrl}
              title={box.title}
              to={box.to}
              subTitle={box.subTitle}
              theme={box.theme}
            />
          </Grid>
        ))}
      </Grid>
    </div>
  );
}

function HomePage() {
  useTitle('Trang chủ');
  useScrollTop();

  const { role } = useSelector((state) => state.userInfo);

  if (role === 'admin') {
    return <AdminDashboardHome />;
  }

  if (role === 'teacher') {
    return <TeacherDashboardHome />;
  }

  return <StudentHomePage />;
}

export default HomePage;