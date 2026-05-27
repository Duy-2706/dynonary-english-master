import sentenceApi from 'apis/sentenceApi';
import { equalArray } from 'helper';
import React, { useEffect, useState } from 'react';
import CommunicationPhrase from '.';

const perPage = 20;

function CommunicationPhraseData() {
  const [page, setPage] = useState(1);
  const [totalPage, setTotalPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [list, setList] = useState([]);
  const [isFirstLoad, setIsFirstLoad] = useState(true);
  const [topicList, setTopicList] = useState([]);

  const onSelectTopic = (topics) => {
    if (!topics || !Array.isArray(topics) || equalArray(topics, topicList)) {
      return;
    }

    setPage(1);
    setList([]);
    setTopicList([...topics]);
  };

  const goPrevPage = () => {
    if (page > 1) setPage(page - 1);
  };

  const goNextPage = () => {
    if (page < totalPage) setPage(page + 1);
  };

  useEffect(() => {
    let isSub = true;

    (async function () {
      try {
        const apiRes = await sentenceApi.getTotalSentences(topicList);

        if (apiRes.status === 200 && isSub) {
          const { total = 0 } = apiRes.data;
          setTotalPage(Math.max(1, Math.ceil(total / perPage)));
        }
      } catch (error) {}
    })();

    return () => (isSub = false);
  }, [topicList]);

  useEffect(() => {
    let isSub = true;

    (async function () {
      try {
        setLoading(true);

        const apiRes = await sentenceApi.getSentenceList(
          page,
          perPage,
          topicList,
        );

        if (apiRes.status === 200 && isSub) {
          const { sentenceList = [] } = apiRes.data;
          setList(sentenceList);
        }
      } catch (error) {
      } finally {
        if (isSub) {
          setLoading(false);
          isFirstLoad && setIsFirstLoad(false);
        }
      }
    })();

    return () => (isSub = false);
  }, [page, topicList]);

  return (
    <CommunicationPhrase
      list={list}
      isFirstLoad={isFirstLoad}
      loading={loading}
      page={page}
      totalPage={totalPage}
      onPrevPage={goPrevPage}
      onNextPage={goNextPage}
      onSelectTopic={(v) => onSelectTopic(v)}
    />
  );
}

export default CommunicationPhraseData;