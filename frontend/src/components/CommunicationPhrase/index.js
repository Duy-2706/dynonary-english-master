import Button from '@material-ui/core/Button';
import DynoDictionarySkeleton from 'components/DynoDictionary/Skeleton';
import PropTypes from 'prop-types';
import React from 'react';
import CommunicationPhraseItem from './Item';
import SentenceTopicSettingModal from './SettingModal';
import useStyle from './style';

function CommunicationPhrase({
  isFirstLoad,
  loading,
  list,
  page,
  totalPage,
  onPrevPage,
  onNextPage,
  onSelectTopic,
}) {
  const classes = useStyle();

  return (
    <div className={`${classes.root} dyno-container`}>
      <div className="flex-center-between">
        <h1 className="dyno-title">1000+ Cụm từ giao tiếp</h1>
        <SentenceTopicSettingModal onSelectTopic={onSelectTopic} />
      </div>
      <div className="dyno-break"></div>

      <div className={classes.contentWrap}>
        <div className={`${classes.listWrap} w-100`}>
          <ul id="dictionaryId" className={`${classes.list} flex-col w-100`}>
            {isFirstLoad || loading ? (
              <DynoDictionarySkeleton className={classes.skeleton} />
            ) : (
              <>
                {list && list.length > 0 ? (
                  <>
                    {list.map((item, index) => (
                      <li className={classes.listItem} key={`${item.sentence}-${index}`}>
                        <CommunicationPhraseItem {...item} />
                      </li>
                    ))}
                  </>
                ) : (
                  <h3 className="notfound-title h-100 flex-center t-center">
                    Không tìm thấy cụm từ nào trong từ điển
                  </h3>
                )}
              </>
            )}
          </ul>

          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              gap: 12,
              padding: '18px 0 10px',
            }}>
            <Button
              variant="outlined"
              color="primary"
              size="small"
              disabled={page <= 1 || loading}
              onClick={onPrevPage}
              style={{
                minWidth: 100,
                borderRadius: 20,
                textTransform: 'none',
                fontSize: 14,
              }}>
              Trang trước
            </Button>

            <span
              style={{
                minWidth: 90,
                textAlign: 'center',
                fontSize: 15,
                fontWeight: 600,
                color: '#008f5a',
              }}>
              {page} / {totalPage || 1}
            </span>

            <Button
              variant="contained"
              color="primary"
              size="small"
              disabled={page >= totalPage || loading}
              onClick={onNextPage}
              style={{
                minWidth: 100,
                borderRadius: 20,
                textTransform: 'none',
                fontSize: 14,
              }}>
              Trang sau
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

CommunicationPhrase.propTypes = {
  isFirstLoad: PropTypes.bool,
  list: PropTypes.array,
  loading: PropTypes.bool,
  page: PropTypes.number,
  totalPage: PropTypes.number,
  onPrevPage: PropTypes.func,
  onNextPage: PropTypes.func,
  onSelectTopic: PropTypes.func,
};

CommunicationPhrase.defaultProps = {
  loading: false,
  isFirstLoad: false,
  list: [],
  page: 1,
  totalPage: 1,
  onPrevPage: function () {},
  onNextPage: function () {},
  onSelectTopic: function () {},
};

export default CommunicationPhrase;