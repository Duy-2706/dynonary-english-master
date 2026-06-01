import commonApi from 'apis/commonApi';
import flashcardApi from 'apis/flashcardApi';
import { equalArray } from 'helper';
import React, { useEffect, useRef, useState } from 'react';
import { useDispatch } from 'react-redux';
import { setMessage } from 'redux/slices/message.slice';
import { setWordPack } from 'redux/slices/wordPack.slice';
import {
  startSession,
  markKnown,
  markUnknown,
  finishSession,
  resetSession,
} from 'redux/slices/studySession.slice';
import Flashcard from '.';
import TopicPicker from './TopicPicker';
import StudyResult from './StudyResult';

const perPage = 7;

// màn hình: 'pick' | 'study' | 'result'
function FlashcardData() {
  const dispatch = useDispatch();
  const [screen, setScreen] = useState('pick');
  const [selectedTopic, setSelectedTopic] = useState(null);

  const list = useRef([]);
  const [currentList, setCurrentList] = useState([]);
  const [total, setTotal] = useState(-1);
  const [pageInfo, setPageInfo] = useState({ page: 1, packInfo: null });

  // lưu từ đúng/sai local để hiển thị kết quả
  const [knownWords, setKnownWords] = useState([]);
  const [unknownWords, setUnknownWords] = useState([]);

  // khi chọn chủ đề
  const handleTopicSelect = (topic) => {
    const packInfo = {
      type: '-1',
      level: '-1',
      specialty: '-1',
      topics: [topic.key],
    };

    setSelectedTopic(topic);
    dispatch(setWordPack(packInfo));
    dispatch(startSession({ topic, wordList: [] }));

    list.current = [];
    setKnownWords([]);
    setUnknownWords([]);
    setPageInfo({ page: 1, packInfo });
    setTotal(-1);
    setScreen('study');
  };

  // get total
  useEffect(() => {
    if (screen !== 'study') return;
    if (total !== -1) return;
    if (!pageInfo.packInfo) return;

    let isSubscribe = true;
    (async function () {
      try {
        const apiRes = await commonApi.getWordPackTotal(pageInfo.packInfo);
        if (apiRes.status === 200 && isSubscribe) {
          const { total = 0 } = apiRes.data;
          if (total === 0) {
            dispatch(
              setMessage({
                type: 'warning',
                message: 'Chủ đề này chưa có từ vựng, vui lòng chọn chủ đề khác.',
                duration: 3000,
              }),
            );
            setScreen('pick');
          }
          setTotal(total);
        }
      } catch (error) {
        setTotal(0);
      }
    })();

    return () => (isSubscribe = false);
  }, [total, screen, pageInfo.packInfo]);

  // get word list
  useEffect(() => {
    if (screen !== 'study') return;
    if (!pageInfo.packInfo) return;
    if (pageInfo.page < list.current.length / perPage) return;

    let isSubscribe = true;
    (async function () {
      try {
        const apiRes = await flashcardApi.getWordPack(
          pageInfo.page,
          perPage,
          pageInfo.packInfo,
        );
        if (apiRes.status === 200 && isSubscribe) {
          const { packList = [] } = apiRes.data;
          setCurrentList(packList);
          list.current = [...list.current, ...packList];
        }
      } catch (error) {}
    })();

    return () => (isSubscribe = false);
  }, [pageInfo, screen]);

  const handleNextClick = () => {
    const { page } = pageInfo;
    if (page < total) {
      if (pageInfo.page < list.current.length / perPage) {
        setCurrentList(
          list.current.slice(page * perPage, (page + 1) * perPage),
        );
      }
      setPageInfo({ ...pageInfo, page: page + 1 });
    }
  };

  const handlePrevClick = () => {
    const { page } = pageInfo;
    if (page > 1) {
      setCurrentList(
        list.current.slice((page - 2) * perPage, (page - 1) * perPage),
      );
      setPageInfo({ ...pageInfo, page: page - 1 });
    }
  };

  const handleKnown = (word) => {
    dispatch(markKnown(word));
    setKnownWords((prev) => [...prev, word]);
  };

  const handleUnknown = (word) => {
    dispatch(markUnknown(word));
    setUnknownWords((prev) => [...prev, word]);
  };

  const handleFinish = () => {
    dispatch(finishSession());
    setScreen('result');
  };

  const handleRestart = () => {
    dispatch(resetSession());
    list.current = [];
    setKnownWords([]);
    setUnknownWords([]);
    setPageInfo({ page: 1, packInfo: pageInfo.packInfo });
    setTotal(-1);
    setScreen('study');
  };

  const handleReviewWrong = () => {
    // học lại chỉ những từ chưa biết
    dispatch(resetSession());
    list.current = unknownWords;
    setKnownWords([]);
    setUnknownWords([]);
    setCurrentList(unknownWords.slice(0, perPage));
    setTotal(unknownWords.length);
    setPageInfo({ page: 1, packInfo: pageInfo.packInfo });
    setScreen('study');
  };

  const handleWordPackChange = (newPackInfo) => {
    const { packInfo } = pageInfo;
    let isSame = equalArray(newPackInfo.topics, packInfo?.topics || []);
    for (let k in packInfo) {
      if (k !== 'topics' && packInfo[k] !== newPackInfo[k]) {
        isSame = false;
        break;
      }
    }
    dispatch(setWordPack(newPackInfo));
    if (isSame) return;
    list.current = [];
    setKnownWords([]);
    setUnknownWords([]);
    setPageInfo({ page: 1, packInfo: newPackInfo });
    setTotal(-1);
  };

  // Màn chọn chủ đề
  if (screen === 'pick') {
    return <TopicPicker onSelect={handleTopicSelect} />;
  }

  // Màn kết quả
  if (screen === 'result') {
    return (
      <StudyResult
        knownWords={knownWords}
        unknownWords={unknownWords}
        onRestart={handleRestart}
        onReviewWrong={handleReviewWrong}
        topicTitle={selectedTopic?.title}
        packInfo={pageInfo.packInfo}
      />
    );
  }

  // Màn học
  return (
    <Flashcard
      list={currentList}
      total={total}
      currentPage={pageInfo.page}
      onNextPage={handleNextClick}
      onPrevPage={handlePrevClick}
      onWordPackChange={handleWordPackChange}
      onKnown={handleKnown}
      onUnknown={handleUnknown}
      onFinish={handleFinish}
      topicTitle={selectedTopic?.title}
    />
  );
}

export default FlashcardData;