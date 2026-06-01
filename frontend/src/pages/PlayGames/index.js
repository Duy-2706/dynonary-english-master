import { ROUTES } from 'constant';
import useScrollTop from 'hooks/useScrollTop';
import useTitle from 'hooks/useTitle';
import React, { useState } from 'react';
import { Link, useHistory, useLocation } from 'react-router-dom';
import basketballCover from 'assets/images/games/Bong_ro.png';
import friendsCover from 'assets/images/games/Choi_cung_ban_be.png';
import listenCover from 'assets/images/games/Nghe_va_chon.png';
import mountainCover from 'assets/images/games/Leo_nui.png';
import memoryCover from 'assets/images/games/Lat_the_ghi_nho.png';
import wordOrderCover from 'assets/images/games/Sap_xep_tu.png';
import wordMatchingCover from 'assets/images/games/Ghep_tu.png';
import correctWordCover from 'assets/images/games/Hay_chon_tu_dung.png';
import fillLetter from 'assets/images/games/Tim_tu_con_thieu.png';

const { GAMES } = ROUTES;
const GAME_FONT = '"Baloo 2", "Nunito", sans-serif';

const GAME_LIST = [
  {
    title: 'Hãy Chọn Từ Đúng',
    subTitle: 'Chọn đáp án đúng trong 4 lựa chọn.',
      cover: correctWordCover,
      theme: '#31c41f',
      shadow: '#14840f',
      to: GAMES.CORRECT_WORD,
      tag: null,
      coverFit: 'contain',
      coverScale: 0.86,
      coverPosition: 'left center',
      coverInset: 14,
      coverBg: '#2bbf1f',
  },
  {
    title: 'Ghép Từ',
    subTitle: 'Ghép các mảnh chữ để tạo thành từ đúng.',
    cover: wordMatchingCover,
    theme: '#0877ff',
    shadow: '#003f9e',
    to: GAMES.WORD_MATCHING,
    tag: null,
  },
  {
    title: 'Sắp Xếp Từ',
    subTitle: 'Sắp xếp các chữ cái thành từ đúng.',
    cover: wordOrderCover,
    theme: '#ff7a00',
    shadow: '#b64a00',
    to: GAMES.WORD_ORDER,
    tag: 'HOT',
  },
  {
    title: 'Lật Thẻ Ghi Nhớ',
    subTitle: 'Lật thẻ để tìm cặp từ và hình ảnh khớp nhau.',
    cover: memoryCover,
    theme: '#ff1493',
    shadow: '#9b0054',
    to: GAMES.MEMORY_MATCH,
    tag: null,
  },
   {
    title: 'Điền từ còn thiếu',
    subTitle: 'Ghép các mảnh chữ để tạo thành từ đúng.',
    cover: fillLetter,
    theme: '#14d9e0',
    shadow: '#008d95',
    to: GAMES.FILL_LETTERS,
    tag: null,
  },
  {
    title: 'Ném Bóng Từ Vựng',
    subTitle: 'Chọn đúng để ném bóng vào rổ.',
    cover: basketballCover,
    theme: '#ff7a00',
    shadow: '#aa3c00',
    to: GAMES.BASKETBALL,
    tag: 'HOT',
  },
  {
    title: 'Leo Núi Từ Vựng',
    subTitle: 'Trả lời đúng để leo lên đỉnh núi.',
    cover: mountainCover,
    theme: '#0877ff',
    shadow: '#003f9e',
    to: GAMES.MOUNTAIN,
    tag: null,
  },
  {
    title: 'Nghe Và Chọn',
    subTitle: 'Nghe phát âm và chọn đáp án đúng.',
    cover: listenCover,
    theme: '#7b1cff',
    shadow: '#360087',
    to: GAMES.LISTEN_CHOOSE,
    tag: null,
  },
  {
    title: 'Chơi Cùng Bạn Bè',
    subTitle: 'Thi đấu vui cùng bạn bè theo thời gian thực.',
    cover: friendsCover,
    theme: '#006dff',
    shadow: '#00378a',
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

function TagBadge({ tag, color }) {
  if (!tag) return null;

  return (
    <span
      style={{
        position: 'absolute',
        top: 18,
        right: 18,
        padding: '8px 16px',
        borderRadius: 999,
        fontSize: '1rem',
        fontWeight: 900,
        background: tag === 'MỚI'
          ? 'linear-gradient(180deg, #ff4fc3, #c40075)'
          : 'linear-gradient(180deg, #ffdf3b, #ff8a00)',
        color: '#fff',
        border: '3px solid #fff',
        boxShadow: `0 5px 0 ${color}`,
        zIndex: 5,
        fontFamily: GAME_FONT,
      }}
    >
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
    <div
      onClick={handleClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        cursor: 'pointer',
        borderRadius: 34,
        background: '#fff',
        padding: 10,
        border: `5px solid ${game.theme}`,
        boxShadow: hovered
          ? `0 12px 0 ${game.shadow}, 0 26px 48px ${game.theme}66`
          : `0 8px 0 ${game.shadow}, 0 18px 34px rgba(0,0,0,.20)`,
        transform: hovered ? 'translateY(-8px) scale(1.025)' : 'none',
        transition: 'all .22s cubic-bezier(.34,1.56,.64,1)',
        position: 'relative',
        overflow: 'hidden',
        fontFamily: GAME_FONT,
      }}
    >
      <TagBadge tag={game.tag} color={game.theme} />

      <div
        style={{
          borderRadius: 24,
          overflow: 'hidden',
          background: game.theme,
          aspectRatio: '1 / 1',
          position: 'relative',
        }}
      >
        <img
          src={game.cover}
          alt={game.title}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            display: 'block',
            transform: hovered ? 'scale(1.06)' : 'scale(1)',
            transition: 'transform .25s ease',
          }}
        />

        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: hovered
              ? 'linear-gradient(180deg, transparent 45%, rgba(0,0,0,.45))'
              : 'linear-gradient(180deg, transparent 60%, rgba(0,0,0,.35))',
            transition: 'background .2s ease',
          }}
        />
      </div>

      <div style={{ padding: '20px 18px 18px' }}>
        <h3
          style={{
            margin: '0 0 6px',
            fontSize: '1.7rem',
            lineHeight: 1.05,
            fontWeight: 900,
            color: game.theme,
            textShadow: '0 2px 0 rgba(0,0,0,.10)',
          }}
        >
          {game.title}
        </h3>

        <p
          style={{
            margin: '0 0 18px',
            color: '#263238',
            fontSize: '1.05rem',
            lineHeight: 1.45,
            fontWeight: 800,
          }}
        >
          {game.subTitle}
        </p>

        <button
          style={{
            width: '100%',
            border: 'none',
            borderRadius: 999,
            padding: '13px 18px',
            background: `linear-gradient(180deg, ${game.theme}, ${game.shadow})`,
            color: '#fff',
            fontSize: '1.18rem',
            fontWeight: 900,
            fontFamily: GAME_FONT,
            cursor: 'pointer',
            boxShadow: `0 5px 0 ${game.shadow}`,
          }}
        >
          ▶ Chơi ngay
        </button>
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
   <div
      style={{
        minHeight: '100vh',
        background: '#042b33',
        backgroundImage: `
          radial-gradient(circle at 12% 18%, rgba(25,199,168,.28) 0 4px, transparent 5px),
          radial-gradient(circle at 80% 28%, rgba(255,191,31,.18) 0 5px, transparent 6px),
          radial-gradient(circle at 30% 70%, rgba(255,255,255,.12) 0 3px, transparent 4px)
        `,
        backgroundSize: '90px 90px, 130px 130px, 100px 100px',
        fontFamily: GAME_FONT,
        paddingBottom: 90,
      }}
    >
      {/* Hero banner */}
    <div
      style={{
        background: 'linear-gradient(180deg, #063c46 0%, #042b33 100%)',
        padding: '76px 24px 120px',
        textAlign: 'center',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <div
        style={{
          display: 'inline-block',
          background: 'linear-gradient(180deg, #ffdf3b, #ff8a00)',
          border: '4px solid #fff',
          borderRadius: 999,
          padding: '10px 30px',
          color: '#fff',
          fontSize: '1.25rem',
          fontWeight: 900,
          marginBottom: 24,
          boxShadow: '0 6px 0 #bd5f00',
        }}
      >
        {/* 🎮 {GAME_LIST.length} trò chơi vui nhộn */}
      </div>

      <h1
        style={{
          fontSize: 'clamp(4rem, 7vw, 7rem)',
          fontWeight: 900,
          color: '#fff',
          margin: '0 0 14px',
          lineHeight: .92,
          textTransform: 'uppercase',
          textShadow: '0 7px 0 #00b894, 0 14px 0 rgba(0,0,0,.28)',
        }}
      >
        Kho Game Tiếng Anh
      </h1>

      <p
        style={{
          fontSize: 'clamp(1.5rem, 3vw, 2.1rem)',
          color: '#20e0bd',
          margin: 0,
          fontWeight: 900,
          textShadow: '0 3px 0 rgba(0,0,0,.25)',
        }}
      >
        Học từ vựng vui hơn với hình ảnh, âm thanh và thử thách!
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
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
          gap: 34,
          maxWidth: 1320,
          margin: '-58px auto 0',
          padding: '0 28px',
          position: 'relative',
          zIndex: 2,
        }}
      >
        {GAME_LIST.map((game, i) => (
          <GameCard key={game.to} game={game} practicePackInfo={practicePackInfo} />
        ))}
      </div>
    </div>
  );
}

export default PlayGamesPage;