import gameApi from 'apis/gameApi';
import GlobalLoading from 'components/UI/GlobalLoading';
import WordPack from 'components/UI/WordPack';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import PlayIcon from '@material-ui/icons/PlayCircleFilledWhite';
import InputCustom from 'components/UI/InputCustom';
import React, { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { setMessage } from 'redux/slices/message.slice';
import CorrectWord from '.';

const MAX_LEN_WORD_PACK = 500;

function CorrectWordData() {
  const [state, setState] = useState(0);
  const [wordPack, setWordPack] = useState([]);
  const dispatch = useDispatch();
  const history = useHistory();
  const nQuestion = useRef(50);
  const { packInfo, isChosen } = useSelector((state) => state.wordPack);

  // Nếu đã chọn chủ đề từ Flashcard → tự động load luôn
  useEffect(() => {
    if (isChosen && packInfo) {
      getWordPackage(packInfo);
    }
  }, []);

  const getWordPackage = async ({ type, topics, level, specialty }) => {
    try {
      setState(1);
      const n =
        nQuestion.current < 0 || nQuestion.current > MAX_LEN_WORD_PACK
          ? 100
          : nQuestion.current;

      const apiRes = await gameApi.getWordPackCWG(type, level, specialty, topics, n);
      if (apiRes.status === 200) {
        const { wordPack = [] } = apiRes.data;
        if (wordPack.length === 0) {
          dispatch(setMessage({
            type: 'warning',
            message: 'Gói từ vựng không đủ. Vui lòng thử lại!',
            duration: 3000,
          }));
          setState(0);
          return;
        }
        setWordPack(wordPack);
        setState(2);
        return;
      }
      setState(0);
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
          onChoose={getWordPackage}
          onCancel={() => history.goBack()}
          topicMultiples={true}
          title="Lựa chọn gói từ vựng"
          okBtnText="Bắt đầu"
          cancelBtnText="Quay lại"
          cancelBtnProps={{ startIcon: <ArrowBackIcon /> }}
          okBtnProps={{ startIcon: <PlayIcon /> }}>
          <InputCustom
            type="number"
            inputProps={{ min: 5, max: MAX_LEN_WORD_PACK, defaultValue: 50 }}
            placeholder="Nhập số câu"
            label="Số câu"
            className="w-100"
            onChange={(e) => (nQuestion.current = e.target.value)}
          />
        </WordPack>
      ) : state === 1 ? (
        <GlobalLoading title="Đang tải gói câu hỏi ..." />
      ) : (
        <CorrectWord list={wordPack} />
      )}
    </>
  );
}

export default CorrectWordData;