import React from 'react';
import { TOPICS } from 'constant/topics';
import useStyle from './style';

function TopicPicker({ onSelect }) {
  const classes = useStyle();

  return (
    <div className={`container my-10 ${classes.wrapper}`}>
      <h1 className={classes.title}>Chọn chủ đề để học</h1>
      <p className={classes.subTitle}>
        Nhấn vào một chủ đề bên dưới để bắt đầu học từ vựng
      </p>

      <div className={classes.grid}>
        {TOPICS.map((topic) => (
          <div
            key={topic.key}
            className={classes.card}
            onClick={() => onSelect(topic)}>
            <img
              src={topic.icon}
              alt={topic.title}
              className={classes.icon}
            />
            <span className={classes.topicTitle}>{topic.title}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default TopicPicker;