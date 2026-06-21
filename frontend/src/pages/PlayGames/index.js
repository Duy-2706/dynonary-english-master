import { ROUTES } from 'constant';
import useScrollTop from 'hooks/useScrollTop';
import useTitle from 'hooks/useTitle';
import React, { useState } from 'react';
import { useHistory, useLocation } from 'react-router-dom';

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
    title: 'Điền Từ Còn Thiếu',
    subTitle: 'Điền chữ còn thiếu để hoàn thành từ.',
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

const S = {
  page: {
    minHeight: '100vh',
    background: '#042b33',
    backgroundImage: `
      radial-gradient(circle at 12% 18%, rgba(25,199,168,.24) 0 4px, transparent 5px),
      radial-gradient(circle at 80% 28%, rgba(255,191,31,.15) 0 5px, transparent 6px),
      radial-gradient(circle at 30% 70%, rgba(255,255,255,.10) 0 3px, transparent 4px)
    `,
    backgroundSize: '90px 90px, 130px 130px, 100px 100px',
    fontFamily: GAME_FONT,
    paddingBottom: 64,
  },

  hero: {
    background: 'linear-gradient(180deg, #063c46 0%, #042b33 100%)',
    padding: '42px 24px 80px',
    textAlign: 'center',
    position: 'relative',
    overflow: 'hidden',
  },

  heroBadge: {
    display: 'inline-block',
    background: 'linear-gradient(180deg, #ffdf3b, #ff8a00)',
    border: '3px solid #fff',
    borderRadius: 999,
    padding: '7px 22px',
    color: '#fff',
    fontSize: '.95rem',
    fontWeight: 900,
    marginBottom: 18,
    boxShadow: '0 4px 0 #bd5f00',
  },

  heroTitle: {
    fontSize: 'clamp(2.8rem, 5.2vw, 5rem)',
    fontWeight: 900,
    color: '#fff',
    margin: '0 0 10px',
    lineHeight: .94,
    textTransform: 'uppercase',
    textShadow: '0 5px 0 #00b894, 0 10px 0 rgba(0,0,0,.25)',
  },

  heroSub: {
    fontSize: 'clamp(1.05rem, 2vw, 1.45rem)',
    color: '#20e0bd',
    margin: 0,
    fontWeight: 900,
    textShadow: '0 2px 0 rgba(0,0,0,.22)',
  },

  wave: {
    height: 42,
    background: 'linear-gradient(160deg, #dbeafe 0%, #ede9fe 40%, #d1fae5 100%)',
    clipPath: 'ellipse(55% 100% at 50% 100%)',
    marginTop: -2,
  },

  practiceWrap: {
    maxWidth: 1040,
    margin: '0 auto 14px',
    padding: '0 20px',
  },

  practiceBox: {
    background: 'linear-gradient(135deg, #4caf50, #2e7d32)',
    borderRadius: 14,
    padding: '12px 20px',
    display: 'flex',
    alignItems: 'center',
    gap: 10,
    color: '#fff',
    boxShadow: '0 4px 16px rgba(46,125,50,0.35)',
    fontSize: '.95rem',
    fontWeight: 800,
  },

  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(230px, 1fr))',
    gap: 24,
    maxWidth: 1180,
    margin: '-42px auto 0',
    padding: '0 24px',
    position: 'relative',
    zIndex: 2,
  },

  card: (game, hovered) => ({
    cursor: 'pointer',
    borderRadius: 26,
    background: '#fff',
    padding: 8,
    border: `4px solid ${game.theme}`,
    boxShadow: hovered
      ? `0 9px 0 ${game.shadow}, 0 20px 36px ${game.theme}55`
      : `0 6px 0 ${game.shadow}, 0 14px 26px rgba(0,0,0,.18)`,
    transform: hovered ? 'translateY(-5px) scale(1.015)' : 'none',
    transition: 'all .22s cubic-bezier(.34,1.56,.64,1)',
    position: 'relative',
    overflow: 'hidden',
    fontFamily: GAME_FONT,
  }),

  coverBox: {
    borderRadius: 20,
    overflow: 'hidden',
    aspectRatio: '1 / .82',
    position: 'relative',
  },

  coverImg: (hovered) => ({
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    display: 'block',
    transform: hovered ? 'scale(1.045)' : 'scale(1)',
    transition: 'transform .25s ease',
  }),

  coverOverlay: (hovered) => ({
    position: 'absolute',
    inset: 0,
    background: hovered
      ? 'linear-gradient(180deg, transparent 45%, rgba(0,0,0,.42))'
      : 'linear-gradient(180deg, transparent 62%, rgba(0,0,0,.30))',
    transition: 'background .2s ease',
  }),

  cardBody: {
    padding: '14px 14px 14px',
  },

  cardTitle: (game) => ({
    margin: '0 0 5px',
    fontSize: '1.25rem',
    lineHeight: 1.08,
    fontWeight: 900,
    color: game.theme,
    textShadow: 'none',
  }),

  cardSub: {
    margin: '0 0 13px',
    color: '#263238',
    fontSize: '.86rem',
    lineHeight: 1.35,
    fontWeight: 800,
    minHeight: 38,
  },

  playBtn: (game) => ({
    width: '100%',
    border: 'none',
    borderRadius: 999,
    padding: '10px 14px',
    background: `linear-gradient(180deg, ${game.theme}, ${game.shadow})`,
    color: '#fff',
    fontSize: '.98rem',
    fontWeight: 900,
    fontFamily: GAME_FONT,
    cursor: 'pointer',
    boxShadow: `0 4px 0 ${game.shadow}`,
  }),

  tag: (tag, color) => ({
    position: 'absolute',
    top: 13,
    right: 13,
    padding: '5px 11px',
    borderRadius: 999,
    fontSize: '.76rem',
    fontWeight: 900,
    background: tag === 'MỚI'
      ? 'linear-gradient(180deg, #ff4fc3, #c40075)'
      : 'linear-gradient(180deg, #ffdf3b, #ff8a00)',
    color: '#fff',
    border: '2px solid #fff',
    boxShadow: `0 3px 0 ${color}`,
    zIndex: 5,
    fontFamily: GAME_FONT,
  }),
};

function TagBadge({ tag, color }) {
  if (!tag) return null;

  return (
    <span style={S.tag(tag, color)}>
      {tag}
    </span>
  );
}

function GameCard({ game, practicePackInfo, practiceWordList }) {
  const history = useHistory();
  const [hovered, setHovered] = useState(false);

  const handleClick = () => {
    if (practiceWordList) {
      history.push(game.to, { wordList: practiceWordList });
    } else if (practicePackInfo) {
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
      style={S.card(game, hovered)}
    >
      <TagBadge tag={game.tag} color={game.theme} />

      <div style={{ ...S.coverBox, background: game.theme }}>
        <img src={game.cover} alt={game.title} style={S.coverImg(hovered)} />
        <div style={S.coverOverlay(hovered)} />
      </div>

      <div style={S.cardBody}>
        <h3 style={S.cardTitle(game)}>
          {game.title}
        </h3>

        <p style={S.cardSub}>
          {game.subTitle}
        </p>

        <button style={S.playBtn(game)}>
          Chơi ngay
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
  const practiceWordList = location.state?.practiceWordList || null;
  const practiceTitle = location.state?.practiceTitle || null;

  return (
    <div style={S.page}>
      <div style={S.hero}>
        <div style={S.heroBadge}>
          {GAME_LIST.length} trò chơi vui nhộn
        </div>

        <h1 style={S.heroTitle}>
          Kho Game Tiếng Anh
        </h1>

        <p style={S.heroSub}>
          Học từ vựng vui hơn với hình ảnh, âm thanh và thử thách!
        </p>
      </div>

      <div style={S.wave} />

      {practicePackInfo && (
        <div style={S.practiceWrap}>
          <div style={S.practiceBox}>
            <span style={{ fontSize: '1.2rem' }}>●</span>
            <div>
              <strong>Luyện tập sau học tập</strong>
              {practiceTitle && (
                <span style={{ marginLeft: 8, opacity: 0.9 }}>
                  — Chủ đề: {practiceTitle}
                </span>
              )}
            </div>
          </div>
        </div>
      )}

      <div style={S.grid}>
        {GAME_LIST.map((game) => (
          <GameCard key={game.to} game={game} practicePackInfo={practicePackInfo} practiceWordList={practiceWordList} />
        ))}
      </div>
    </div>
  );
}

export default PlayGamesPage;