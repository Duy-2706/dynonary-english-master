import gameApi from 'apis/gameApi';
import GameSetup from 'components/PlayGames/GameSetup';
import { playComplete, playCorrect, playWrong } from 'helper/gameSound';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useHistory, useLocation } from 'react-router-dom';

const GAME_FONT = '"Baloo 2", "Nunito", sans-serif';
const N = 15;

const CSS = `
  @keyframes climberBounce {
    0%, 100% { transform: translate(-50%, 0); }
    50% { transform: translate(-50%, -8px); }
  }

  @keyframes cloudMove {
    0% { transform: translateX(-12px); }
    100% { transform: translateX(12px); }
  }

  @keyframes mtPop {
    0% { transform: scale(.92); opacity: 0; }
    100% { transform: scale(1); opacity: 1; }
  }

  .mt-climber {
    animation: climberBounce 1.6s ease-in-out infinite;
  }

  .mt-cloud {
    animation: cloudMove 4s ease-in-out infinite alternate;
  }

  .mt-pop {
    animation: mtPop .28s ease;
  }
`;

const CHOICE_COLORS = ['#0a84ff', '#ffb400', '#28c76f', '#ff4fa3'];

const S = {
  page: {
    minHeight: '100vh',
    background: `
      radial-gradient(circle at 16% 18%, rgba(255,255,255,.35), transparent 14%),
      radial-gradient(circle at 82% 14%, rgba(255,255,255,.28), transparent 18%),
      linear-gradient(180deg, #0a84ff 0%, #31c5ff 46%, #def8ff 100%)
    `,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: '24px 16px 40px',
    boxSizing: 'border-box',
    fontFamily: GAME_FONT,
    overflowX: 'hidden',
  },

  topBar: {
    width: '100%',
    maxWidth: 860,
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
    gap: 12,
    flexWrap: 'wrap',
  },

  backBtn: {
    background: 'linear-gradient(180deg,#ffffff,#dff4ff)',
    color: '#00439d',
    border: '4px solid #fff',
    borderRadius: 999,
    padding: '10px 20px',
    fontSize: '1rem',
    fontWeight: 900,
    cursor: 'pointer',
    fontFamily: GAME_FONT,
    boxShadow: '0 6px 0 rgba(0,67,157,.22)',
  },

  title: {
    color: '#fff',
    fontWeight: 900,
    fontSize: 'clamp(2.35rem, 5vw, 4.4rem)',
    margin: '0 0 12px',
    textAlign: 'center',
    lineHeight: 0.95,
    textShadow: '0 6px 0 #00439d, 0 12px 24px rgba(0,0,0,.25)',
  },

  statBar: {
    display: 'flex',
    gap: 14,
    marginBottom: 20,
    flexWrap: 'wrap',
    justifyContent: 'center',
  },

  stat: {
    background: '#fff',
    color: '#00439d',
    padding: '8px 18px',
    borderRadius: 999,
    border: '3px solid #cceeff',
    fontWeight: 900,
    fontSize: '1.05rem',
    boxShadow: '0 5px 0 rgba(0,67,157,.35)',
  },

  stage: {
    position: 'relative',
    width: '100%',
    maxWidth: 860,
    height: 400,
    borderRadius: 40,
    border: '6px solid #fff',
    overflow: 'hidden',
    background: 'linear-gradient(180deg, #0f8cff 0%, #86dcff 56%, #0c7e36 100%)',
    boxShadow: '0 10px 0 #00439d, 0 22px 42px rgba(0,0,0,.28)',
    marginBottom: 24,
  },

  cloud: (left, top, width, opacity = 0.9) => ({
    position: 'absolute',
    left,
    top,
    width,
    height: width / 2.15,
    borderRadius: 999,
    background: `rgba(255,255,255,${opacity})`,
    boxShadow: `
      ${width * 0.18}px -${width * 0.08}px 0 rgba(255,255,255,${opacity}),
      ${width * 0.36}px 0 0 rgba(255,255,255,${opacity})
    `,
    zIndex: 2,
  }),

  mountainBackLeft: {
    position: 'absolute',
    left: -80,
    bottom: 0,
    width: 0,
    height: 0,
    borderLeft: '220px solid transparent',
    borderRight: '220px solid transparent',
    borderBottom: '250px solid #2e71b6',
    opacity: 0.88,
    zIndex: 1,
  },

  mountainBackRight: {
    position: 'absolute',
    right: -100,
    bottom: 0,
    width: 0,
    height: 0,
    borderLeft: '240px solid transparent',
    borderRight: '240px solid transparent',
    borderBottom: '275px solid #1c5a98',
    opacity: 0.9,
    zIndex: 1,
  },

  mountainMain: {
    position: 'absolute',
    left: '18%',
    bottom: 0,
    width: 0,
    height: 0,
    borderLeft: '280px solid transparent',
    borderRight: '280px solid transparent',
    borderBottom: '350px solid #255d98',
    zIndex: 3,
  },

  mountainFace1: {
    position: 'absolute',
    left: '36%',
    bottom: 0,
    width: 0,
    height: 0,
    borderLeft: '90px solid transparent',
    borderRight: '90px solid transparent',
    borderBottom: '290px solid #376fb0',
    zIndex: 4,
  },

  mountainFace2: {
    position: 'absolute',
    left: '48%',
    bottom: 0,
    width: 0,
    height: 0,
    borderLeft: '70px solid transparent',
    borderRight: '70px solid transparent',
    borderBottom: '240px solid #184777',
    zIndex: 4,
  },

  snowCap: {
    position: 'absolute',
    left: '45.2%',
    bottom: 258,
    width: 0,
    height: 0,
    borderLeft: '84px solid transparent',
    borderRight: '84px solid transparent',
    borderBottom: '96px solid #fff',
    zIndex: 5,
  },

  snowCap2: {
    position: 'absolute',
    left: '41.5%',
    bottom: 235,
    width: 0,
    height: 0,
    borderLeft: '42px solid transparent',
    borderRight: '42px solid transparent',
    borderBottom: '48px solid #eef6ff',
    zIndex: 5,
  },

  path: {
    position: 'absolute',
    left: '18%',
    bottom: 56,
    width: '58%',
    height: 230,
    borderLeft: '12px solid #ffcf2f',
    borderTop: '12px solid #ffcf2f',
    borderRadius: '100px 0 0 0',
    transform: 'skewY(-22deg)',
    boxShadow: '0 5px 0 #bd7800',
    zIndex: 6,
  },

  tree: (left, bottom, scale = 1) => ({
    position: 'absolute',
    left,
    bottom,
    width: 0,
    height: 0,
    borderLeft: `${18 * scale}px solid transparent`,
    borderRight: `${18 * scale}px solid transparent`,
    borderBottom: `${34 * scale}px solid #0c6b2c`,
    zIndex: 2,
  }),

  tree2: (left, bottom, scale = 1) => ({
    position: 'absolute',
    left,
    bottom,
    width: 0,
    height: 0,
    borderLeft: `${14 * scale}px solid transparent`,
    borderRight: `${14 * scale}px solid transparent`,
    borderBottom: `${26 * scale}px solid #0f8a38`,
    zIndex: 2,
  }),

  marker: (left, bottom) => ({
    position: 'absolute',
    left,
    bottom,
    width: 32,
    height: 32,
    borderRadius: '50%',
    background: 'linear-gradient(180deg,#ffe36f,#ff9900)',
    border: '4px solid #fff',
    boxShadow: '0 5px 0 rgba(0,0,0,.24), inset 0 2px 4px rgba(255,255,255,.35)',
    zIndex: 7,
  }),

  climber: (left, bottom) => ({
    position: 'absolute',
    left: `${left}%`,
    bottom,
    width: 58,
    height: 58,
    borderRadius: '50%',
    background: 'linear-gradient(180deg,#ffe36f,#ff9900)',
    border: '5px solid #fff',
    boxShadow: '0 7px 0 rgba(0,0,0,.25)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '1.8rem',
    transition: 'left .45s ease, bottom .45s ease',
    zIndex: 8,
  }),

  flagPole: {
    position: 'absolute',
    right: 88,
    top: 40,
    width: 8,
    height: 76,
    borderRadius: 999,
    background: 'linear-gradient(180deg,#f7f7f7,#b7c3d1)',
    zIndex: 8,
  },

  flag: {
    position: 'absolute',
    right: 48,
    top: 42,
    width: 52,
    height: 34,
    background: 'linear-gradient(180deg,#ff5c5c,#d81d1d)',
    borderRadius: '0 10px 10px 0',
    clipPath: 'polygon(0 0, 100% 0, 78% 50%, 100% 100%, 0 100%)',
    zIndex: 9,
    boxShadow: '0 4px 0 rgba(0,0,0,.18)',
  },

  stageLabel: {
    position: 'absolute',
    left: 24,
    bottom: 18,
    color: '#fff',
    fontSize: '1.15rem',
    fontWeight: 900,
    textShadow: '0 3px 0 rgba(0,0,0,.25)',
    zIndex: 9,
  },

  qaCard: {
    width: '100%',
    maxWidth: 860,
    background: '#fff',
    borderRadius: 34,
    padding: '28px',
    border: '5px solid #0a84ff',
    boxShadow: '0 8px 0 #00439d',
    boxSizing: 'border-box',
  },

  questionLabel: {
    color: '#0a84ff',
    fontWeight: 900,
    fontSize: '1rem',
    textTransform: 'uppercase',
    letterSpacing: 1,
    textAlign: 'center',
  },

  questionText: {
    color: '#073b75',
    fontSize: 'clamp(1.45rem, 3vw, 2.15rem)',
    fontWeight: 900,
    marginTop: 6,
    textAlign: 'center',
  },

  choices: {
    display: 'grid',
    gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
    gap: 16,
    marginTop: 24,
  },

  feedback: (ok) => ({
    marginTop: 20,
    padding: '14px 18px',
    borderRadius: 20,
    background: ok
      ? 'linear-gradient(180deg,#36e27d,#0ca84f)'
      : 'linear-gradient(180deg,#ff6b6b,#d63031)',
    color: '#fff',
    fontWeight: 900,
    fontSize: '1.12rem',
    textAlign: 'center',
    border: '4px solid #fff',
    boxShadow: '0 6px 0 rgba(0,0,0,.22)',
  }),

  endPage: {
    minHeight: '100vh',
    background: 'linear-gradient(180deg, #0a84ff 0%, #31c5ff 50%, #def8ff 100%)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
    fontFamily: GAME_FONT,
  },

  endCard: {
    background: '#fff',
    borderRadius: 36,
    padding: '46px 42px',
    textAlign: 'center',
    border: '6px solid #0a84ff',
    boxShadow: '0 10px 0 #00439d, 0 22px 45px rgba(0,0,0,.28)',
    maxWidth: 480,
    width: '100%',
  },

  endButtons: {
    display: 'flex',
    gap: 14,
    justifyContent: 'center',
    flexWrap: 'wrap',
    marginTop: 24,
  },

  mainBtn: {
    background: 'linear-gradient(180deg,#0a84ff,#00439d)',
    color: '#fff',
    border: '4px solid #fff',
    borderRadius: 999,
    padding: '14px 30px',
    fontSize: '1.15rem',
    fontWeight: 900,
    cursor: 'pointer',
    fontFamily: GAME_FONT,
    boxShadow: '0 7px 0 #00306f',
  },

  secondaryBtn: {
    background: 'linear-gradient(180deg,#ffffff,#dff4ff)',
    color: '#00439d',
    border: '4px solid #fff',
    borderRadius: 999,
    padding: '14px 30px',
    fontSize: '1.15rem',
    fontWeight: 900,
    cursor: 'pointer',
    fontFamily: GAME_FONT,
    boxShadow: '0 7px 0 rgba(0,67,157,.18)',
  },
};

function buildChoices(item) {
  if (!item) return [];
  return [...(item.wrongList || []).slice(0, 3).map((w) => w.word || w), item.word].sort(
    () => Math.random() - 0.5
  );
}

function MountainGame({ packInfo, wordList }) {
  const history = useHistory();
  const [pack, setPack] = useState([]);
  const [cur, setCur] = useState(0);
  const [choices, setChoices] = useState([]);
  const [steps, setSteps] = useState(0);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [selIdx, setSelIdx] = useState(null);
  const [status, setStatus] = useState('loading');
  const [feedback, setFeedback] = useState(null);
  const advRef = useRef(null);

  const init = useCallback(async () => {
    clearTimeout(advRef.current);

    setStatus('loading');
    setCur(0);
    setSteps(0);
    setScore(0);
    setStreak(0);
    setSelIdx(null);
    setFeedback(null);

    try {
      let p;

      if (wordList?.length) {
        p = wordList.slice(0, N);
      } else {
        const { type = '-1', level = '-1', specialty = '-1', topics = [] } = packInfo || {};
        const res = await gameApi.getWordPackCWG(type, level, specialty, topics, N);
        p = (res?.data?.wordPack || []).slice(0, N);
      }

      if (!p.length) {
        setStatus('error');
        return;
      }

      setPack(p);
      setChoices(buildChoices(p[0]));
      setStatus('playing');
    } catch {
      setStatus('error');
    }
  }, [packInfo, wordList]);

  useEffect(() => {
    init();

    return () => {
      clearTimeout(advRef.current);
    };
  }, [init]);

  const handleChoice = useCallback(
    (word, idx) => {
      if (status !== 'playing') return;

      const item = pack[cur];
      const ok = word === item.word;

      setSelIdx(idx);
      setStatus('answered');

      if (ok) {
        playCorrect();

        const nextStreak = streak + 1;
        const bonus = nextStreak > 0 && nextStreak % 3 === 0 ? 100 : 0;

        setStreak(nextStreak);
        setScore((s) => s + 100 + bonus);
        setSteps((p) => Math.min(p + 1, N));
        setFeedback({ ok: true, correct: item.word, bonus });
      } else {
        playWrong();
        setStreak(0);
        setSteps((p) => Math.max(0, p - 1));
        setFeedback({ ok: false, correct: item.word });
      }

      advRef.current = setTimeout(
        () => {
          const next = cur + 1;

          if (next >= pack.length) {
            playComplete();
            setStatus('done');
            return;
          }

          setCur(next);
          setChoices(buildChoices(pack[next]));
          setSelIdx(null);
          setFeedback(null);
          setStatus('playing');
        },
        ok ? 850 : 1150
      );
    },
    [status, pack, cur, streak]
  );

  const getState = (word, idx) => {
    if (status !== 'answered') return 'idle';
    if (word === pack[cur]?.word) return 'correct';
    if (idx === selIdx) return 'wrong';
    return 'dim';
  };

  const pct = steps / N;
  const climberLeft = 18 + pct * 58;
  const climberBottom = 48 + pct * 240;

  if (status === 'loading') {
    return (
      <div style={S.endPage}>
        <style>{CSS}</style>
        <div style={{ textAlign: 'center', color: '#fff', fontWeight: 900, fontSize: '1.4rem' }}>
          🏔️ Đang chuẩn bị đường leo...
        </div>
      </div>
    );
  }

  if (status === 'error') {
    return (
      <div style={S.endPage}>
        <style>{CSS}</style>
        <div style={S.endCard}>
          <div style={{ fontSize: '4rem' }}>😢</div>
          <h2 style={{ color: '#d63031', margin: '8px 0 20px', fontWeight: 900 }}>
            Không thể tải dữ liệu!
          </h2>
          <div style={S.endButtons}>
            <button onClick={init} style={S.mainBtn}>
              Thử lại
            </button>
            <button onClick={() => history.push('/games')} style={S.secondaryBtn}>
              Về kho game
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (status === 'done') {
    const max = pack.length * 100;
    const rate = score / max;

    return (
      <div style={S.endPage}>
        <style>{CSS}</style>
        <div style={S.endCard} className="mt-pop">
          <div style={{ fontSize: '4.4rem' }}>{rate >= 0.8 ? '🏆' : rate >= 0.5 ? '🌟' : '💪'}</div>
          <h2 style={{ color: '#00439d', fontSize: '2.3rem', fontWeight: 900, margin: '8px 0' }}>
            Hoàn thành!
          </h2>
          <p style={{ color: '#073b75', fontWeight: 800, marginBottom: 4 }}>
            Bạn leo tới {steps}/{N} bậc
          </p>
          <div style={{ color: '#0a84ff', fontSize: '3.6rem', fontWeight: 900 }}>{score}</div>
          <p style={{ color: '#073b75', fontWeight: 800, marginBottom: 8 }}>Tối đa {max} điểm</p>

          <div style={S.endButtons}>
            <button onClick={init} style={S.mainBtn}>
              Chơi lại 🏔️
            </button>
            <button onClick={() => history.push('/games')} style={S.secondaryBtn}>
              Về kho game
            </button>
          </div>
        </div>
      </div>
    );
  }

  const item = pack[cur];

  return (
    <div style={S.page}>
      <style>{CSS}</style>

      <div style={S.topBar}>
        <button style={S.backBtn} onClick={() => history.push('/games')}>
          ← Về kho game
        </button>
      </div>

      <h1 style={S.title}>Leo Núi Từ Vựng</h1>

      <div style={S.statBar}>
        <span style={S.stat}>Câu {cur + 1}/{pack.length}</span>
        <span style={S.stat}>⭐ {score}</span>
        <span
          style={{
            ...S.stat,
            background: streak >= 3 ? 'linear-gradient(180deg,#ffdf3b,#ff8a00)' : '#fff',
            color: streak >= 3 ? '#fff' : '#00439d',
          }}
        >
          🔥 {streak} liên tiếp{streak >= 3 ? ' +100!' : ''}
        </span>
      </div>

      <div style={S.stage}>
        <div className="mt-cloud" style={S.cloud('7%', 52, 96, 0.92)} />
        <div className="mt-cloud" style={S.cloud('72%', 72, 112, 0.82)} />

        <div style={S.mountainBackLeft} />
        <div style={S.mountainBackRight} />
        <div style={S.mountainMain} />
        <div style={S.mountainFace1} />
        <div style={S.mountainFace2} />
        <div style={S.snowCap} />
        <div style={S.snowCap2} />
        <div style={S.path} />

        <div style={S.tree('8%', 28, 1.2)} />
        <div style={S.tree2('10.3%', 28, 1.2)} />
        <div style={S.tree('15%', 24, 1)} />
        <div style={S.tree2('17%', 24, 1)} />
        <div style={S.tree('80%', 22, 1.15)} />
        <div style={S.tree2('82%', 22, 1.15)} />
        <div style={S.tree('87%', 18, 1)} />
        <div style={S.tree2('88.7%', 18, 1)} />

        <div style={S.marker('20%', 64)} />
        <div style={S.marker('32%', 110)} />
        <div style={S.marker('44%', 158)} />
        <div style={S.marker('57%', 204)} />
        <div style={S.marker('70%', 250)} />

        <div className="mt-climber" style={S.climber(climberLeft, climberBottom)}>
          🧗
        </div>

        <div style={S.flagPole} />
        <div style={S.flag} />

        <div style={S.stageLabel}>{Math.round(pct * 100)}% đường leo</div>
      </div>

      <div style={S.qaCard}>
        <div style={S.questionLabel}>Từ nào có nghĩa là</div>
        <div style={S.questionText}>"{item?.mean}"</div>

        <div style={S.choices}>
          {choices.map((c, i) => {
            const st = getState(c, i);
            const baseColor = CHOICE_COLORS[i % CHOICE_COLORS.length];

            const background =
              st === 'correct'
                ? 'linear-gradient(180deg,#36e27d,#0ca84f)'
                : st === 'wrong'
                ? 'linear-gradient(180deg,#ff6b6b,#d63031)'
                : st === 'dim'
                ? 'linear-gradient(180deg,#b0b0b0,#777)'
                : `linear-gradient(180deg, ${baseColor}, ${baseColor}cc)`;

            return (
              <button
                key={i}
                onClick={() => handleChoice(c, i)}
                disabled={status === 'answered'}
                style={{
                  background,
                  color: '#fff',
                  border: '4px solid #fff',
                  borderRadius: 24,
                  padding: '18px 14px',
                  fontSize: 'clamp(1.05rem, 2.5vw, 1.35rem)',
                  fontWeight: 900,
                  fontFamily: GAME_FONT,
                  cursor: st === 'idle' ? 'pointer' : 'default',
                  boxShadow: '0 7px 0 rgba(0,0,0,.22)',
                  textShadow: '0 2px 0 rgba(0,0,0,.25)',
                  transition: 'transform .15s ease, filter .15s ease',
                }}
              >
                {c}
              </button>
            );
          })}
        </div>

        {feedback && (
          <div style={S.feedback(feedback.ok)} className="mt-pop">
            {feedback.ok
              ? feedback.bonus
                ? `✅ Chính xác! +100 điểm 🔥 Streak +${feedback.bonus}!`
                : '✅ Chính xác! +100 điểm'
              : `❌ Sai rồi! Đáp án: "${feedback.correct}"`}
          </div>
        )}
      </div>
    </div>
  );
}

function MountainPage() {
  const location = useLocation();
  const [packInfo, setPackInfo] = useState(location.state?.packInfo || null);
  const [wordList, setWordList] = useState(location.state?.wordList || null);

  const handleStart = (info) => {
    if (info.wordList) setWordList(info.wordList);
    else setPackInfo(info);
  };

  if (!packInfo && !wordList) {
    return <GameSetup title="🏔️ Leo Núi Từ Vựng — Chọn chủ đề" onStart={handleStart} />;
  }

  return <MountainGame packInfo={packInfo} wordList={wordList} />;
}

export default MountainPage;