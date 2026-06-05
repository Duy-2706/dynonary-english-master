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
    50% { transform: translate(-50%, -7px); }
  }

  @keyframes cloudMove {
    0% { transform: translateX(-10px); }
    100% { transform: translateX(10px); }
  }

  @keyframes mtPop {
    0% { transform: scale(.94); opacity: 0; }
    100% { transform: scale(1); opacity: 1; }
  }

  .mt-climber {
    animation: climberBounce 1.6s ease-in-out infinite;
  }

  .mt-cloud {
    animation: cloudMove 4s ease-in-out infinite alternate;
  }

  .mt-pop {
    animation: mtPop .25s ease;
  }

  @media (max-width: 900px) {
    .mountain-main-layout {
      grid-template-columns: 1fr !important;
    }

    .mountain-stage {
      height: 360px !important;
    }
  }

  @media (max-width: 600px) {
    .mountain-page {
      padding: 14px 12px 30px !important;
    }

    .mountain-stage {
      height: 320px !important;
      border-radius: 28px !important;
    }

    .mountain-choices {
      grid-template-columns: 1fr !important;
    }
  }
`;

const S = {
  page: {
    minHeight: '100vh',
    background: `
      radial-gradient(circle at 16% 18%, rgba(255,255,255,.28), transparent 14%),
      radial-gradient(circle at 82% 14%, rgba(255,255,255,.22), transparent 18%),
      linear-gradient(180deg, #0a84ff 0%, #31c5ff 46%, #def8ff 100%)
    `,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: '14px 16px 32px',
    boxSizing: 'border-box',
    fontFamily: GAME_FONT,
    overflowX: 'hidden',
  },

  topBar: {
    width: '100%',
    maxWidth: 1180,
    display: 'flex',
    justifyContent: 'flex-start',
    alignItems: 'center',
    marginBottom: 8,
  },

  backBtn: {
    background: 'linear-gradient(180deg,#ffffff,#dff4ff)',
    color: '#00439d',
    border: '3px solid #fff',
    borderRadius: 999,
    padding: '8px 18px',
    fontSize: '.92rem',
    fontWeight: 900,
    cursor: 'pointer',
    fontFamily: GAME_FONT,
    boxShadow: '0 5px 0 rgba(0,67,157,.22)',
  },

  title: {
    color: '#fff',
    fontWeight: 900,
    fontSize: 'clamp(1.85rem, 4vw, 3.35rem)',
    margin: '0 0 8px',
    textAlign: 'center',
    lineHeight: 0.95,
    textShadow: '0 2px 0 rgba(0,67,157,.35)',
  },

  statBar: {
    display: 'flex',
    gap: 10,
    marginBottom: 12,
    flexWrap: 'wrap',
    justifyContent: 'center',
  },

  stat: {
    background: '#fff',
    color: '#00439d',
    padding: '6px 14px',
    borderRadius: 999,
    border: '3px solid #cceeff',
    fontWeight: 900,
    fontSize: '.92rem',
    boxShadow: '0 4px 0 rgba(0,67,157,.28)',
  },

  mainLayout: {
    width: '100%',
    maxWidth: 1180,
    display: 'grid',
    gridTemplateColumns: 'minmax(0, 1.35fr) minmax(330px, .65fr)',
    gap: 18,
    alignItems: 'stretch',
  },

  stage: {
    position: 'relative',
    width: '100%',
    height: 430,
    borderRadius: 38,
    border: '6px solid #fff',
    overflow: 'hidden',
    background: 'linear-gradient(180deg, #0f8cff 0%, #86dcff 56%, #0c7e36 100%)',
    boxShadow: '0 9px 0 #00439d, 0 20px 38px rgba(0,0,0,.25)',
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
    left: -90,
    bottom: 0,
    width: 0,
    height: 0,
    borderLeft: '250px solid transparent',
    borderRight: '250px solid transparent',
    borderBottom: '280px solid #2e71b6',
    opacity: 0.88,
    zIndex: 1,
  },

  mountainBackRight: {
    position: 'absolute',
    right: -120,
    bottom: 0,
    width: 0,
    height: 0,
    borderLeft: '270px solid transparent',
    borderRight: '270px solid transparent',
    borderBottom: '305px solid #1c5a98',
    opacity: 0.9,
    zIndex: 1,
  },

  mountainMain: {
    position: 'absolute',
    left: '20%',
    bottom: 0,
    width: 0,
    height: 0,
    borderLeft: '310px solid transparent',
    borderRight: '310px solid transparent',
    borderBottom: '380px solid #255d98',
    zIndex: 3,
  },

  mountainFace1: {
    position: 'absolute',
    left: '39%',
    bottom: 0,
    width: 0,
    height: 0,
    borderLeft: '95px solid transparent',
    borderRight: '95px solid transparent',
    borderBottom: '315px solid #376fb0',
    zIndex: 4,
  },

  mountainFace2: {
    position: 'absolute',
    left: '50%',
    bottom: 0,
    width: 0,
    height: 0,
    borderLeft: '78px solid transparent',
    borderRight: '78px solid transparent',
    borderBottom: '260px solid #184777',
    zIndex: 4,
  },

  snowCap: {
    position: 'absolute',
    left: '47%',
    bottom: 280,
    width: 0,
    height: 0,
    borderLeft: '92px solid transparent',
    borderRight: '92px solid transparent',
    borderBottom: '104px solid #fff',
    zIndex: 5,
  },

  snowCap2: {
    position: 'absolute',
    left: '43.5%',
    bottom: 252,
    width: 0,
    height: 0,
    borderLeft: '46px solid transparent',
    borderRight: '46px solid transparent',
    borderBottom: '54px solid #eef6ff',
    zIndex: 5,
  },

  path: {
    position: 'absolute',
    left: '18%',
    bottom: 58,
    width: '60%',
    height: 255,
    borderLeft: '11px solid #ffcf2f',
    borderTop: '11px solid #ffcf2f',
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
    width: 29,
    height: 29,
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
    width: 54,
    height: 54,
    borderRadius: '50%',
    background: 'linear-gradient(180deg,#ffe36f,#ff9900)',
    border: '5px solid #fff',
    boxShadow: '0 7px 0 rgba(0,0,0,.25)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '1.6rem',
    transition: 'left .45s ease, bottom .45s ease',
    zIndex: 8,
  }),

  flagPole: {
    position: 'absolute',
    right: 88,
    top: 42,
    width: 7,
    height: 72,
    borderRadius: 999,
    background: 'linear-gradient(180deg,#f7f7f7,#b7c3d1)',
    zIndex: 8,
  },

  flag: {
    position: 'absolute',
    right: 48,
    top: 44,
    width: 50,
    height: 32,
    background: 'linear-gradient(180deg,#ff5c5c,#d81d1d)',
    borderRadius: '0 10px 10px 0',
    clipPath: 'polygon(0 0, 100% 0, 78% 50%, 100% 100%, 0 100%)',
    zIndex: 9,
    boxShadow: '0 4px 0 rgba(0,0,0,.18)',
  },

  stageLabel: {
    position: 'absolute',
    left: 22,
    bottom: 16,
    color: '#fff',
    fontSize: '.98rem',
    fontWeight: 900,
    textShadow: '0 2px 0 rgba(0,0,0,.25)',
    zIndex: 9,
  },

  qaCard: {
    width: '100%',
    background: '#fff',
    borderRadius: 28,
    padding: '20px',
    border: '5px solid #0a84ff',
    boxShadow: '0 7px 0 #00439d',
    boxSizing: 'border-box',
    alignSelf: 'stretch',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
  },

  questionLabel: {
    color: '#0a84ff',
    fontWeight: 900,
    fontSize: '.82rem',
    textTransform: 'uppercase',
    letterSpacing: 1,
    textAlign: 'center',
  },

  questionText: {
    color: '#062f5f',
    fontSize: 'clamp(1.25rem, 2.3vw, 1.75rem)',
    fontWeight: 900,
    marginTop: 5,
    textAlign: 'center',
    lineHeight: 1.15,
    textShadow: 'none',
  },

  choices: {
    display: 'grid',
    gridTemplateColumns: '1fr',
    gap: 10,
    marginTop: 18,
  },

  choiceBtn: (background, st, textColor = '#073b75') => ({
    background,
    color: textColor,
    border: '4px solid #ffffff',
    borderRadius: 18,
    padding: '12px 12px',
    fontSize: '1.05rem',
    fontWeight: 900,
    fontFamily: GAME_FONT,
    cursor: st === 'idle' ? 'pointer' : 'default',
    boxShadow: '0 5px 0 rgba(0,67,157,.18)',
    textShadow: 'none',
    transition: 'transform .15s ease, filter .15s ease',
    lineHeight: 1.15,
  }),

  feedback: (ok) => ({
    marginTop: 14,
    padding: '11px 14px',
    borderRadius: 18,
    background: ok
      ? 'linear-gradient(180deg,#36e27d,#0ca84f)'
      : 'linear-gradient(180deg,#ff6b6b,#d63031)',
    color: '#fff',
    fontWeight: 900,
    fontSize: '.98rem',
    textAlign: 'center',
    border: '3px solid #fff',
    boxShadow: '0 5px 0 rgba(0,0,0,.22)',
    lineHeight: 1.25,
    textShadow: 'none',
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
    borderRadius: 30,
    padding: '36px 32px',
    textAlign: 'center',
    border: '5px solid #0a84ff',
    boxShadow: '0 8px 0 #00439d, 0 20px 40px rgba(0,0,0,.25)',
    maxWidth: 430,
    width: '100%',
  },

  endButtons: {
    display: 'flex',
    gap: 12,
    justifyContent: 'center',
    flexWrap: 'wrap',
    marginTop: 22,
  },

  mainBtn: {
    background: 'linear-gradient(180deg,#0a84ff,#00439d)',
    color: '#fff',
    border: '3px solid #fff',
    borderRadius: 999,
    padding: '12px 24px',
    fontSize: '1rem',
    fontWeight: 900,
    cursor: 'pointer',
    fontFamily: GAME_FONT,
    boxShadow: '0 6px 0 #00306f',
    textShadow: 'none',
  },

  secondaryBtn: {
    background: 'linear-gradient(180deg,#ffffff,#dff4ff)',
    color: '#00439d',
    border: '3px solid #fff',
    borderRadius: 999,
    padding: '12px 24px',
    fontSize: '1rem',
    fontWeight: 900,
    cursor: 'pointer',
    fontFamily: GAME_FONT,
    boxShadow: '0 6px 0 rgba(0,67,157,.18)',
    textShadow: 'none',
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
  const climberLeft = 18 + pct * 60;
  const climberBottom = 50 + pct * 265;

  if (status === 'loading') {
    return (
      <div style={S.endPage}>
        <style>{CSS}</style>

        <div
          style={{
            textAlign: 'center',
            color: '#fff',
            fontWeight: 900,
            fontSize: '1.2rem',
            textShadow: 'none',
          }}
        >
          Đang chuẩn bị đường leo...
        </div>
      </div>
    );
  }

  if (status === 'error') {
    return (
      <div style={S.endPage}>
        <style>{CSS}</style>

        <div style={S.endCard}>
          <h2
            style={{
              color: '#d63031',
              margin: '0 0 18px',
              fontWeight: 900,
              fontSize: '1.7rem',
              textShadow: 'none',
            }}
          >
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

    return (
      <div style={S.endPage}>
        <style>{CSS}</style>

        <div style={S.endCard} className="mt-pop">
          <h2
            style={{
              color: '#00439d',
              fontSize: '2rem',
              fontWeight: 900,
              margin: '0 0 10px',
              textShadow: 'none',
            }}
          >
            Hoàn thành!
          </h2>

          <p
            style={{
              color: '#073b75',
              fontWeight: 800,
              marginBottom: 4,
              fontSize: '.98rem',
              textShadow: 'none',
            }}
          >
            Bạn leo tới {steps}/{N} bậc
          </p>

          <div
            style={{
              color: '#0a84ff',
              fontSize: '3rem',
              fontWeight: 900,
              textShadow: 'none',
            }}
          >
            {score}
          </div>

          <p
            style={{
              color: '#073b75',
              fontWeight: 800,
              marginBottom: 8,
              fontSize: '.95rem',
              textShadow: 'none',
            }}
          >
            Tối đa {max} điểm
          </p>

          <div style={S.endButtons}>
            <button onClick={init} style={S.mainBtn}>
              Chơi lại
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
    <div style={S.page} className="mountain-page">
      <style>{CSS}</style>

      <div style={S.topBar}>
        <button style={S.backBtn} onClick={() => history.push('/games')}>
          Về kho game
        </button>
      </div>

      <h1 style={S.title}>
        Leo Núi Từ Vựng
      </h1>

      <div style={S.statBar}>
        <span style={S.stat}>Câu {cur + 1}/{pack.length}</span>
        <span style={S.stat}>{score} điểm</span>
        <span
          style={{
            ...S.stat,
            background: streak >= 3 ? 'linear-gradient(180deg,#ffdf3b,#ff8a00)' : '#fff',
            color: streak >= 3 ? '#fff' : '#00439d',
          }}
        >
          {streak} liên tiếp{streak >= 3 ? ' +100' : ''}
        </span>
      </div>

      <div style={S.mainLayout} className="mountain-main-layout">
        <div style={S.stage} className="mountain-stage">
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
          <div style={S.marker('32%', 116)} />
          <div style={S.marker('44%', 168)} />
          <div style={S.marker('57%', 220)} />
          <div style={S.marker('70%', 272)} />

          <div className="mt-climber" style={S.climber(climberLeft, climberBottom)}>
            🧗
          </div>

          <div style={S.flagPole} />
          <div style={S.flag} />

          <div style={S.stageLabel}>{Math.round(pct * 100)}% đường leo</div>
        </div>

        <div style={S.qaCard}>
          <div style={S.questionLabel}>Từ nào có nghĩa là</div>

          <div style={S.questionText}>
            “{item?.mean}”
          </div>

          <div style={S.choices} className="mountain-choices">
            {choices.map((c, i) => {
              const st = getState(c, i);

              const background =
                st === 'correct'
                  ? 'linear-gradient(180deg,#d8ffe8,#8df0b3)'
                  : st === 'wrong'
                  ? 'linear-gradient(180deg,#ffe1e1,#ffaaaa)'
                  : st === 'dim'
                  ? 'linear-gradient(180deg,#eef2f6,#d5dde6)'
                  : i === 0
                  ? 'linear-gradient(180deg,#e5f2ff,#b8dcff)'
                  : i === 1
                  ? 'linear-gradient(180deg,#fff4cc,#ffe08a)'
                  : i === 2
                  ? 'linear-gradient(180deg,#ddffe9,#aaf2c4)'
                  : 'linear-gradient(180deg,#ffe5f3,#ffc1df)';

              const textColor =
                st === 'correct'
                  ? '#075c2c'
                  : st === 'wrong'
                  ? '#8a1111'
                  : st === 'dim'
                  ? '#64748b'
                  : '#073b75';

              return (
                <button
                  key={i}
                  onClick={() => handleChoice(c, i)}
                  disabled={status === 'answered'}
                  style={S.choiceBtn(background, st, textColor)}
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
                  ? `Chính xác! +100 điểm. Thưởng liên tiếp +${feedback.bonus}!`
                  : 'Chính xác! +100 điểm'
                : `Sai rồi! Đáp án: "${feedback.correct}"`}
            </div>
          )}
        </div>
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
    return <GameSetup title="Leo Núi Từ Vựng — Chọn chủ đề" onStart={handleStart} />;
  }

  return <MountainGame packInfo={packInfo} wordList={wordList} />;
}

export default MountainPage;