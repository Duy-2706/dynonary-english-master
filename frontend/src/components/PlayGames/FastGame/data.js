import gameApi from 'apis/gameApi';
import GlobalLoading from 'components/UI/GlobalLoading';
import WordPack from 'components/UI/WordPack';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import PlayIcon from '@material-ui/icons/PlayCircleFilledWhite';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory, useLocation } from 'react-router-dom';
import { setMessage } from 'redux/slices/message.slice';
import FastGame from '.';

function FastGameData() {
  const [state, setState] = useState(0);
  const [wordPack, setWordPack] = useState([]);
  const dispatch = useDispatch();
  const history = useHistory();
  const location = useLocation();
  const { packInfo, isChosen } = useSelector((state) => state.wordPack);

  // Nếu đã chọn chủ đề từ Flashcard → tự động load luôn
  useEffect(() => {
    const locWordList = location.state?.wordList;
    if (locWordList?.length) {
      const built = locWordList.filter((w) => w.word).map((w) => ({
        word: w.word, mean: w.meaning || w.mean || '', picture: '',
      }));
      if (built.length > 0) { setWordPack(built); setState(2); return; }
    }
    
    if (isChosen && packInfo) {
      getWordPackage(packInfo);
    }
  }, []);

  const getWordPackage = async ({ type, topics, level, specialty }) => {
    try {
      setState(1);
      const apiRes = await gameApi.getWordPackFG(type, level, specialty, topics);
      if (apiRes.status === 200) {
        const { wordPack = [] } = apiRes.data;
        if (wordPack.length === 0) {
          dispatch(setMessage({
            type: 'warning',
            message: 'Danh sách từ không đủ. Vui lòng chọn lại!',
            duration: 3000,
          }));
          setState(0);
          return;
        }
        setWordPack(wordPack);
        setState(2);
      } else {
        setState(0);
      }
    } catch (error) {
      dispatch(setMessage({ type: 'error', message: 'Lấy gói từ vựng thất bại!' }));
      setState(0);
    }
  };

  return (
    <>
      {state === 0 ? (
        <WordPack
          open={true}
          topicMultiples={true}
          title="Chọn chủ đề để chơi"
          okBtnText="Bắt đầu"
          cancelBtnText="Quay lại"
          cancelBtnProps={{ startIcon: <ArrowBackIcon /> }}
          okBtnProps={{ startIcon: <PlayIcon /> }}
          onCancel={() => history.goBack()}
          onChoose={getWordPackage}
        />
      ) : state === 1 ? (
        <GlobalLoading title="Đang tải gói từ vựng ..." />
      ) : (
        <FastGame list={wordPack} />
      )}
    </>
  );
}

export default FastGameData;