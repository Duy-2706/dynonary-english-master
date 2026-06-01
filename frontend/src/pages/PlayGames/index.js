import { ROUTES } from 'constant';
import useScrollTop from 'hooks/useScrollTop';
import useTitle from 'hooks/useTitle';
import React, { useState } from 'react';
import { Link, useHistory, useLocation } from 'react-router-dom';

const { GAMES } = ROUTES;

const GAME_LIST = [
  {
    title: 'Chọn Từ Đúng',
    subTitle: 'Chọn 1 đáp án đúng nghĩa trong 4 lựa chọn.',
    icon: '✅',
    color: '#667eea',
    bg: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    light: '#eef0ff',
    to: GAMES.CORRECT_WORD,
    tag: null,
  },
  {
    title: 'Ghép Từ',
    subTitle: 'Ghép ký tự thành từ đúng nghĩa.',
    icon: '🔡',
    color: '#f5576c',
    bg: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
    light: '#fff0f2',
    to: GAMES.WORD_MATCHING,
    tag: null,
  },
  {
    title: 'Tay Nhanh Hơn Não',
    subTitle: 'Chọn hình ảnh đúng trong thời gian nhanh nhất.',
    icon: '⚡',
    color: '#00b4d8',
    bg: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
    light: '#e6f9ff',
    to: GAMES.FAST_GAME,
    tag: null,
  },
  {
    title: 'Sắp Xếp Từ',
    subTitle: 'Kéo thả các từ để tạo thành câu đúng.',
    icon: '🔤',
    color: '#f77f00',
    bg: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
    light: '#fff8e6',
    to: GAMES.WORD_ORDER,
    tag: 'HOT',
  },
  {
    title: 'Điền Chữ Thiếu',
    subTitle: 'Điền các chữ cái bị thiếu vào từ đúng.',
    icon: '✏️',
    color: '#2dc653',
    bg: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
    light: '#edfff5',
    to: GAMES.FILL_LETTERS,
    tag: null,
  },
  {
    title: 'Lật Thẻ Ghi Nhớ',
    subTitle: 'Lật thẻ để tìm cặp từ và nghĩa khớp nhau.',
    icon: '🃏',
    color: '#9b59b6',
    bg: 'linear-gradient(135deg, #a18cd1 0%, #fbc2eb 100%)',
    light: '#f8f0ff',
    to: GAMES.MEMORY_MATCH,
    tag: null,
  },
  {
    title: 'Ném Bóng Từ Vựng',
    subTitle: 'Chọn đáp án đúng, bóng sẽ bay vào rổ!',
    icon: '🏀',
    color: '#f39c12',
    bg: 'linear-gradient(135deg, #f7971e 0%, #ffd200 100%)',
    light: '#fff9e6',
    to: GAMES.BASKETBALL,
    tag: 'HOT',
  },
  {
    title: 'Leo Núi Từ Vựng',
    subTitle: 'Trả lời đúng liên tiếp để leo đến đỉnh núi!',
    icon: '🏔️',
    color: '#11998e',
    bg: 'linear-gradient(135deg, #11998e 0%, #38ef7d 100%)',
    light: '#eafff7',
    to: GAMES.MOUNTAIN,
    tag: null,
  },
  {
    title: 'Nghe Và Chọn',
    subTitle: 'Nghe phát âm và chọn hình ảnh đúng.',
    icon: '🔊',
    color: '#c471f5',
    bg: 'linear-gradient(135deg, #c471f5 0%, #fa71cd 100%)',
    light: '#fdf0ff',
    to: GAMES.LISTEN_CHOOSE,
    tag: null,
  },
  {
    title: 'Chơi Cùng Bạn Bè',
    subTitle: 'Thi đấu trực tuyến theo thời gian thực!',
    icon: '🎮',
    color: '#e84393',
    bg: 'linear-gradient(135deg, #f953c6 0%, #b91d73 100%)',
    light: '#fff0f8',
    to: GAMES.MULTIPLAYER,
    tag: 'MỚI',
  },
];

function CloudSVG({ style }) {
  return (
    <svg viewBox="0 0 120 60" xmlns="http://www.w3.org/2000/svg" style={style}>
      <ellipse cx="60" cy="40" rx="50" ry="22" fill="white" opacity="0.85" />
      <ellipse cx="40" cy="35" rx="28" ry="20" fill="white" opacity="0.85" />
      <ellipse cx="80" cy="32" rx="24" ry="18" fill="white" opacity="0.85" />
    </svg>
  );
}

function TagBadge({ tag }) {
  if (!tag) return null;
  const isNew = tag === 'MỚI';
  return (
    <span style={{
      position: 'absolute',
      top: 12,
      right: 12,
      padding: '4px 12px',
      borderRadius: 20,
      fontSize: '0.82rem',
      fontWeight: 800,
      letterSpacing: '0.5px',
      background: isNew
        ? 'linear-gradient(90deg, #f953c6, #b91d73)'
        : 'linear-gradient(90deg, #ff416c, #ff4b2b)',
      color: '#fff',
      boxShadow: '0 2px 10px rgba(0,0,0,0.22)',
      zIndex: 2,
      fontFamily: "'Montserrat', sans-serif",
    }}>
      {tag}
    </span>
  );
}

function GameCard({ game, practicePackInfo }) {
  const history = useHistory();
  const [hovered, setHovered] = useState(false);

  const handleClick = () => {
    if (practicePackInfo) {
      history.push(game.to, { packInfo: practicePackInfo });
    } else {
      history.push(game.to);
    }
  };

  return (
    <div onClick={handleClick} style={{ textDecoration: 'none', cursor: 'pointer' }}>
      <div
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        style={{
          borderRadius: 22,
          overflow: 'hidden',
          background: '#fff',
          boxShadow: hovered
            ? `0 16px 48px ${game.color}55, 0 4px 12px rgba(0,0,0,0.08)`
            : '0 4px 20px rgba(0,0,0,0.08)',
          transform: hovered ? 'translateY(-8px) scale(1.02)' : 'none',
          transition: 'all 0.25s cubic-bezier(.34,1.56,.64,1)',
          cursor: 'pointer',
          position: 'relative',
          fontFamily: "'Montserrat', sans-serif",
          border: `2px solid ${hovered ? game.color + '44' : 'transparent'}`,
        }}
      >
        <TagBadge tag={game.tag} />

        {/* Colored header area */}
        <div style={{
          background: game.bg,
          height: 180,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative',
          overflow: 'hidden',
        }}>
          <div style={{
            width: 110,
            height: 110,
            borderRadius: '50%',
            background: 'rgba(255,255,255,0.28)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 6px 24px rgba(0,0,0,0.18)',
            border: '3px solid rgba(255,255,255,0.45)',
            transform: hovered ? 'scale(1.12) rotate(-6deg)' : 'scale(1)',
            transition: 'transform 0.3s ease',
          }}>
            <span style={{ fontSize: '4rem', lineHeight: 1 }}>{game.icon}</span>
          </div>
          <div style={{ position: 'absolute', top: 10, left: 12, width: 10, height: 10, borderRadius: '50%', background: 'rgba(255,255,255,0.4)' }} />
          <div style={{ position: 'absolute', bottom: 12, right: 16, width: 18, height: 18, borderRadius: '50%', background: 'rgba(255,255,255,0.28)' }} />
          <div style={{ position: 'absolute', top: 22, right: 24, width: 8, height: 8, borderRadius: '50%', background: 'rgba(255,255,255,0.5)' }} />
        </div>

        {/* Card body */}
        <div style={{ padding: '22px 24px 24px' }}>
          <p style={{
            margin: '0 0 8px',
            fontSize: '1.25rem',
            fontWeight: 800,
            color: '#1a1a2e',
            lineHeight: 1.3,
          }}>
            {game.title}
          </p>
          <p style={{
            margin: '0 0 18px',
            fontSize: '1rem',
            color: '#555',
            lineHeight: 1.55,
          }}>
            {game.subTitle}
          </p>
          <button style={{
            width: '100%',
            padding: '13px 0',
            borderRadius: 14,
            border: 'none',
            background: hovered ? game.bg : game.light,
            color: hovered ? '#fff' : game.color,
            fontWeight: 800,
            fontSize: '1.05rem',
            cursor: 'pointer',
            transition: 'all 0.2s',
            fontFamily: "'Montserrat', sans-serif",
            letterSpacing: '0.3px',
          }}>
            {hovered ? '▶ Chơi ngay!' : 'Chơi ngay →'}
          </button>
        </div>
      </div>
    </div>
  );
}

function PlayGamesPage() {
  useTitle('Game');
  useScrollTop();
  const location = useLocation();
  const practicePackInfo = location.state?.practicePackInfo || null;
  const practiceTitle = location.state?.practiceTitle || null;

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(160deg, #dbeafe 0%, #ede9fe 40%, #d1fae5 100%)',
      fontFamily: "'Montserrat', sans-serif",
      paddingBottom: 80,
    }}>
      {/* Hero banner */}
      <div style={{
        background: 'linear-gradient(135deg, #4facfe 0%, #667eea 60%, #764ba2 100%)',
        padding: '72px 24px 110px',
        textAlign: 'center',
        position: 'relative',
        overflow: 'hidden',
      }}>
        <CloudSVG style={{ position: 'absolute', top: 10, left: '5%', width: 130, opacity: 0.55, pointerEvents: 'none' }} />
        <CloudSVG style={{ position: 'absolute', top: 20, right: '8%', width: 110, opacity: 0.45, pointerEvents: 'none' }} />
        <CloudSVG style={{ position: 'absolute', bottom: 28, left: '22%', width: 95, opacity: 0.35, pointerEvents: 'none' }} />

        <div style={{
          display: 'inline-block',
          background: 'rgba(255,255,255,0.22)',
          border: '1.5px solid rgba(255,255,255,0.45)',
          borderRadius: 28,
          padding: '10px 28px',
          color: '#fff',
          fontSize: '1.1rem',
          fontWeight: 700,
          marginBottom: 24,
          backdropFilter: 'blur(8px)',
          position: 'relative',
        }}>
          🎯 {GAME_LIST.length} trò chơi · Miễn phí
        </div>

        <h1 style={{
          fontSize: 'clamp(2.6rem, 6vw, 4rem)',
          fontWeight: 900,
          color: '#fff',
          margin: '0 0 16px',
          textShadow: '0 4px 20px rgba(0,0,0,0.22)',
          letterSpacing: '-0.5px',
          position: 'relative',
        }}>
          🎮 Kho Game Tiếng Anh
        </h1>
        <p style={{
          fontSize: 'clamp(1.2rem, 2.5vw, 1.55rem)',
          color: 'rgba(255,255,255,0.9)',
          margin: 0,
          position: 'relative',
          fontWeight: 500,
        }}>
          Học từ vựng vui hơn với các trò chơi tương tác hấp dẫn!
        </p>
      </div>

      {/* Wave divider */}
      <div style={{
        height: 60,
        background: 'linear-gradient(160deg, #dbeafe 0%, #ede9fe 40%, #d1fae5 100%)',
        clipPath: 'ellipse(55% 100% at 50% 100%)',
        marginTop: -2,
      }} />

      {/* Game grid */}
      {practicePackInfo && (
        <div style={{ maxWidth: 1100, margin: '0 auto 16px', padding: '0 20px' }}>
          <div style={{ background: 'linear-gradient(135deg, #4caf50, #2e7d32)', borderRadius: 16, padding: '14px 24px', display: 'flex', alignItems: 'center', gap: 12, color: '#fff', boxShadow: '0 4px 16px rgba(46,125,50,0.35)' }}>
            <span style={{ fontSize: '1.5rem' }}>🎯</span>
            <div>
              <strong>Luyện tập sau học tập</strong>
              {practiceTitle && <span style={{ marginLeft: 8, opacity: 0.9 }}>— Chủ đề: {practiceTitle}</span>}
            </div>
          </div>
        </div>
      )}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
        gap: 28,
        maxWidth: 1260,
        margin: '-36px auto 0',
        padding: '0 28px',
      }}>
        {GAME_LIST.map((game, i) => (
          <GameCard key={game.to} game={game} practicePackInfo={practicePackInfo} />
        ))}
      </div>
    </div>
  );
}

export default PlayGamesPage;