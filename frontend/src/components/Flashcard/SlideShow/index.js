import Tooltip from '@material-ui/core/Tooltip';
import Button from '@material-ui/core/Button';
import LinearProgress from '@material-ui/core/LinearProgress';
import Skeleton from '@material-ui/lab/Skeleton';
import CheckIcon from '@material-ui/icons/Check';
import CloseIcon from '@material-ui/icons/Close';
import PropTypes from 'prop-types';
import React, { useEffect, useState } from 'react';
import SlideItem from '../SlideItem';
import useStyle from './style';
import { prefetchImage } from '../imageCache';

const perPage = 7;

function SlideShow({
  list, total, onGetNewList, onGetOldList,
  showMean, currentSlide, onSaveCurrentSlide,
  totalCurrentSlide, onKnown, onUnknown, onFinish,
}) {
  const classes = useStyle();
  const [current, setCurrent] = useState(currentSlide);
  const count = totalCurrentSlide + current;
  const isLast = count + 1 >= total;
  const percent = total > 0 ? Math.round(((count + 1) / total) * 100) : 0;

  useEffect(() => {
    if (!list || list.length === 0) return;
    for (let i = 1; i <= 3; i++) {
      const next = list[current + i];
      if (next && next.word && !next.picture) prefetchImage(next.word);
    }
  }, [current, list]);

  const onPrev = () => {
    if (current !== 0) {
      onSaveCurrentSlide(current - 1);
      setCurrent(current - 1);
    } else {
      onSaveCurrentSlide(perPage - 1);
      setCurrent(perPage - 1);
      onGetOldList();
    }
  };

  const onNext = () => {
    if (current < list.length - 1) {
      onSaveCurrentSlide(current + 1);
      setCurrent(current + 1);
    } else {
      onGetNewList();
      onSaveCurrentSlide(0);
      setCurrent(0);
    }
  };

  const handleKnown = () => {
    if (onKnown) onKnown(list[current]);
    if (isLast) { if (onFinish) onFinish(); }
    else onNext();
  };

  const handleUnknown = () => {
    if (onUnknown) onUnknown(list[current]);
    if (isLast) { if (onFinish) onFinish(); }
    else onNext();
  };

  if (!list || list.length === 0) {
    return (
      <Skeleton variant="rect" className={`${classes.skeleton} w-100`}
        animation="wave" style={{ height: '400px' }} />
    );
  }

  return (
    <div className={classes.wrapper}>
      {/* Thanh tiến độ */}
      <div className={classes.progressWrap}>
        <LinearProgress
          variant="determinate"
          value={percent}
          className={classes.progressBar}
        />
        <span className={classes.progressText}>
          {count + 1} / {total} ({percent}%)
        </span>
      </div>

      {/* Card */}
      <div className={classes.cardWrap}>
        <SlideItem
          {...list[current]}
          example={list[current]?.examples?.[0]}
          showMean={showMean}
        />

        {/* Mũi tên */}
        {count > 0 && (
          <Tooltip title="Từ trước">
            <span className="nav-arrow prev" onClick={onPrev} />
          </Tooltip>
        )}
        {!isLast && !onKnown && (
          <Tooltip title="Từ tiếp theo">
            <span className="nav-arrow next" onClick={onNext} />
          </Tooltip>
        )}
      </div>

      {/* Nút Biết / Chưa biết */}
      {onKnown && onUnknown && (
        <div className={classes.actionRow}>
          <Button
            variant="outlined"
            className={classes.btnUnknown}
            startIcon={<CloseIcon />}
            onClick={handleUnknown}>
            Chưa biết
          </Button>
          <Button
            variant="contained"
            className={classes.btnKnown}
            startIcon={<CheckIcon />}
            onClick={handleKnown}>
            Đã biết
          </Button>
        </div>
      )}
    </div>
  );
}

SlideShow.propTypes = {
  list: PropTypes.array,
  onGetNewList: PropTypes.func,
  onGetOldList: PropTypes.func,
  onSaveCurrentSlide: PropTypes.func,
  showMean: PropTypes.bool,
  total: PropTypes.number,
  currentSlide: PropTypes.number,
  totalCurrentSlide: PropTypes.number,
  onKnown: PropTypes.func,
  onUnknown: PropTypes.func,
  onFinish: PropTypes.func,
};

SlideShow.defaultProps = {
  list: [],
  total: 0,
  currentSlide: 0,
};

export default SlideShow;