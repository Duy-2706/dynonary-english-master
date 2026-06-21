import React, { useEffect, useRef, useState } from 'react';
import CircularProgress from '@material-ui/core/CircularProgress';
import Tooltip from '@material-ui/core/Tooltip';
import CarouselIcon from '@material-ui/icons/ViewCarousel';
import CollectionsIcon from '@material-ui/icons/ViewQuilt';
import VisibilityIcon from '@material-ui/icons/Visibility';
import VisibilityOffIcon from '@material-ui/icons/VisibilityOff';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import vocabSetApi from 'apis/vocabSetApi';
import GalleryList from 'components/Flashcard/GalleryList';
import SlideShow from 'components/Flashcard/SlideShow';
import StudyResult from 'components/Flashcard/StudyResult';
import useTitle from 'hooks/useTitle';
import useScrollTop from 'hooks/useScrollTop';
import { useHistory, useParams } from 'react-router-dom';

function VocabSetLearnPage() {
  const { id } = useParams();
  const history = useHistory();
  useScrollTop();

  const [vocabSet, setVocabSet] = useState(null);
  const [loading, setLoading] = useState(true);
  const [screen, setScreen] = useState('study');
  const [mode, setMode] = useState(1);
  const [isShowMean, setIsShowMean] = useState(false);
  const [knownWords, setKnownWords] = useState([]);
  const [unknownWords, setUnknownWords] = useState([]);
  const [reviewList, setReviewList] = useState(null);
  const currentSlide = useRef(0);

  useTitle(vocabSet ? `Học: ${vocabSet.title}` : 'Flashcard');

  useEffect(() => {
    if (!id) return;
    vocabSetApi.getVocabSet(id)
      .then((res) => setVocabSet(res.data?.set || null))
      .catch(() => setVocabSet(null))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div style={{ minHeight: '60vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <CircularProgress />
      </div>
    );
  }

  if (!vocabSet) {
    return (
      <div className="container my-10">
        <p>Không tìm thấy bộ từ vựng.</p>
      </div>
    );
  }

  const allWords = (() => {
    const base = (vocabSet.words || []).filter((w) => w.word);
    return base.map((w, i) => {
      const others = base.filter((_, j) => j !== i);
      const wrong = [...others].sort(() => Math.random() - 0.5).slice(0, 3);
      return {
        ...w,
        mean: w.meaning || '',
        picture: w.thumbnail || '',
        wrongList: wrong.map((o) => ({ word: o.word, phonetic: o.phonetic || '' })),
      };
    });
  })();
  const activeList = reviewList || allWords;
  const total = activeList.length;
  const tooFewForGames = allWords.length < 4;

  const handleFinish = () => setScreen('result');

  const handleRestart = () => {
    setKnownWords([]);
    setUnknownWords([]);
    setReviewList(null);
    currentSlide.current = 0;
    setScreen('study');
  };

  const handleReviewWrong = () => {
    setReviewList(unknownWords);
    setKnownWords([]);
    setUnknownWords([]);
    currentSlide.current = 0;
    setScreen('study');
  };

  if (screen === 'result') {
    return (
      <StudyResult
        knownWords={knownWords}
        unknownWords={unknownWords}
        onRestart={handleRestart}
        onReviewWrong={handleReviewWrong}
        topicTitle={vocabSet.title}
        packInfo={null}
        coinsEarned={0}
        wordList={tooFewForGames ? null : allWords}
        tooFewForGames={tooFewForGames}
        wordCount={allWords.length}
      />
    );
  }

  return (
    <div className="container my-10">
      <div className="flex-center-between" style={{ marginBottom: 8 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <button
            onClick={() => history.goBack()}
            style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', color: '#888', padding: 4 }}>
            <ArrowBackIcon style={{ fontSize: 22 }} />
          </button>
          <div>
            <h1 className="dyno-title" style={{ margin: 0 }}>Flashcard</h1>
            <p style={{ color: '#888', marginTop: 4, fontSize: '0.95rem' }}>
              Bộ từ: <strong>{vocabSet.title}</strong>
              {` · Khối ${vocabSet.gradeLevel} · ${vocabSet.unit} · ${total} từ`}
            </p>
          </div>
        </div>

        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          <Tooltip title="Chế độ bộ sưu tập" placement="bottom">
            <CollectionsIcon
              onClick={() => setMode(0)}
              style={{ cursor: 'pointer', fontSize: 28, color: mode === 0 ? '#19c7a8' : '#bbb' }}
            />
          </Tooltip>
          <Tooltip title="Chế độ thẻ đơn" placement="bottom">
            <CarouselIcon
              onClick={() => setMode(1)}
              style={{ cursor: 'pointer', fontSize: 28, color: mode === 1 ? '#19c7a8' : '#bbb' }}
            />
          </Tooltip>
          <Tooltip title={isShowMean ? 'Ẩn nghĩa' : 'Xem nghĩa'} placement="bottom">
            {isShowMean
              ? <VisibilityOffIcon onClick={() => setIsShowMean(false)} style={{ cursor: 'pointer', fontSize: 28, color: '#bbb' }} />
              : <VisibilityIcon onClick={() => setIsShowMean(true)} style={{ cursor: 'pointer', fontSize: 28, color: '#bbb' }} />}
          </Tooltip>
        </div>
      </div>

      <div className="dyno-break" />

      {mode === 0 ? (
        <GalleryList
          list={activeList}
          onPrev={() => {}}
          onNext={() => {}}
          total={1}
          current={1}
          showMean={isShowMean}
        />
      ) : (
        <SlideShow
          list={activeList}
          total={total}
          onGetNewList={() => {}}
          onGetOldList={() => {}}
          showMean={isShowMean}
          currentSlide={currentSlide.current}
          onSaveCurrentSlide={(v) => { currentSlide.current = v; }}
          totalCurrentSlide={0}
          onKnown={(w) => setKnownWords((p) => [...p, w])}
          onUnknown={(w) => setUnknownWords((p) => [...p, w])}
          onFinish={handleFinish}
        />
      )}
    </div>
  );
}

export default VocabSetLearnPage;