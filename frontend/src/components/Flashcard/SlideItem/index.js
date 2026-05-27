import Speaker from 'components/UI/Speaker';
import PropTypes from 'prop-types';
import React, { useEffect, useState } from 'react';
import useStyle from './style';

function SliceExample({ word, example }) {
  if (!example) return null;

  const index = example.toLowerCase().indexOf(word.toLowerCase());

  return (
    <>
      {index === -1 ? (
        example
      ) : (
        <>
          {example.slice(0, index)}
          <b>{word}</b>
          {example.slice(index + word.length)}
        </>
      )}
    </>
  );
}

function SlideItem({ mean, word, type, phonetic, example, picture }) {
  const classes = useStyle({ picture });
  const [flipped, setFlipped] = useState(false);
  const stopFlip = (event) => {
    event.stopPropagation();
  };

  useEffect(() => {
    setFlipped(false);
  }, [word]);

  return (
    <div className={classes.root}>
      <div className={classes.flipScene} onClick={() => setFlipped(!flipped)}>
        <div className={`${classes.flipCard} ${flipped ? classes.isFlipped : ''}`}>
          <div className={`${classes.cardFace} ${classes.cardFront}`}>
            <div className={classes.picture} />

            <div className={classes.frontContent}>
              <p className={classes.frontLabel}>Flashcard</p>

              <h2 className={classes.word}>
                <span>{word}</span>
                <span onClick={stopFlip}>
                  <Speaker className="ml-4" text={word} />
                </span>
              </h2>

              {Boolean(type) && <p className={classes.type}>({type})</p>}

              {Boolean(phonetic) && (
                <p className={classes.phonetic}>/{phonetic}/</p>
              )}

              <p className={classes.hint}>Bấm vào thẻ để xem nghĩa</p>
            </div>
          </div>

          <div className={`${classes.cardFace} ${classes.cardBack}`}>
            <p className={classes.backLabel}>Nghĩa tiếng Việt</p>

            <h2 className={classes.mean}>{mean}</h2>

            {Boolean(phonetic) && (
              <p className={classes.backPhonetic}>/{phonetic}/</p>
            )}

            {Boolean(type) && <p className={classes.backType}>Loại từ: {type}</p>}

            <div className={classes.speakerWrap} onClick={stopFlip}>
              <Speaker text={word} />
            </div>

            {example && example !== '' && (
              <p className={classes.example}>
                <SliceExample word={word} example={example} />
              </p>
            )}

            <p className={classes.backHint}>Bấm lần nữa để quay lại</p>
          </div>
        </div>
      </div>
    </div>
  );
}

SlideItem.propTypes = {
  example: PropTypes.string,
  mean: PropTypes.string,
  phonetic: PropTypes.string,
  picture: PropTypes.string,
  type: PropTypes.string,
  word: PropTypes.string,
};

SliceExample.propTypes = {
  example: PropTypes.string,
  word: PropTypes.string,
};

export default SlideItem;