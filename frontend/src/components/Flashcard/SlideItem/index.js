import accountApi from 'apis/accountApi';
import Speaker from 'components/UI/Speaker';
import FavoriteIcon from '@material-ui/icons/Favorite';
import FavoriteBorderIcon from '@material-ui/icons/FavoriteBorder';
import PropTypes from 'prop-types';
import React, { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setAddFavorites } from 'redux/slices/userInfo.slice';
import { ensureImage } from '../imageCache';
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

function SlideItem({ mean, word, type, phonetic: phoneProp, example, picture: picProp }) {
  const [flipped, setFlipped] = useState(false);
  const [phonetic, setPhonetic] = useState(phoneProp || '');
  const [picture, setPicture] = useState(picProp || '');
  const [imgReady, setImgReady] = useState(!!picProp);
  const activeWordRef = useRef(null);

  const classes = useStyle();
  const dispatch = useDispatch();
  const { favoriteList, username, isAuth } = useSelector((s) => s.userInfo);
  const isFavorite = Array.isArray(favoriteList) && favoriteList.includes(word);

  const stopFlip = (e) => e.stopPropagation();

  useEffect(() => {
    setFlipped(false);
    setPhonetic(phoneProp || '');
    activeWordRef.current = word;

    if (picProp) {
      setPicture(picProp);
      setImgReady(true);
    } else {
      setImgReady(false);
      ensureImage(word, (src) => {
        if (activeWordRef.current !== word) return;
        setPicture(src);
        setImgReady(true);
      });
    }

    if (!phoneProp && word) {
      fetch(
        `https://api.dictionaryapi.dev/api/v2/entries/en/${encodeURIComponent(word.toLowerCase())}`,
      )
        .then((r) => { if (!r.ok) throw new Error(); return r.json(); })
        .then((data) => {
          if (!Array.isArray(data) || !data[0]) return;
          const phonetics = data[0].phonetics || [];
          const raw =
            data[0].phonetic ||
            phonetics.find((p) => p.text)?.text ||
            phonetics.find((p) => p.audio)?.text ||
            '';
            const text = raw.replace(/^\/|\/$/g, '');
          if (text && activeWordRef.current === word) setPhonetic(text);
        })
        .catch(() => {});
    }
  }, [word, phoneProp, picProp]);

  const handleToggleFavorite = async (e) => {
    e.stopPropagation();
    if (!isAuth) return;
    const isAdd = !isFavorite;
    try {
      await accountApi.putToggleWordFavorite(username, word, isAdd);
      dispatch(setAddFavorites({ word, isAdd }));
    } catch {}
  };

  return (
    <div className={classes.root}>
      <div className={classes.flipScene} onClick={() => setFlipped(!flipped)}>
        <div className={`${classes.flipCard} ${flipped ? classes.isFlipped : ''}`}>
          <div className={`${classes.cardFace} ${classes.cardFront}`}>
            <div className={classes.imageWrap}>
              {picture && (
                <img
                  src={picture}
                  alt={word}
                  className={`${classes.picture} ${imgReady ? classes.pictureVisible : ''}`}
                />
              )}
              {!imgReady && (
                <div className={classes.picturePlaceholder}>
                  <span>{(word || '?')[0].toUpperCase()}</span>
                </div>
              )}
            </div>

            <div className={classes.frontContent}>
              <p className={classes.frontLabel}>Flashcard</p>

              <h2 className={classes.word}>
                <span>{word}</span>
                <span onClick={stopFlip}>
                  <Speaker className="ml-4" text={word} />
                </span>
              </h2>

              {Boolean(type) && <p className={classes.type}>({type})</p>}
              {Boolean(phonetic) && <p className={classes.phonetic}>/{phonetic}/</p>}

              <p className={classes.hint}>Bấm vào thẻ để xem nghĩa</p>

              {isAuth && (
                <button
                  className={classes.favoriteBtn}
                  onClick={handleToggleFavorite}
                  title={isFavorite ? 'Bỏ yêu thích' : 'Thêm yêu thích'}
                >
                  {isFavorite
                    ? <FavoriteIcon style={{ color: '#e91e63', fontSize: 22 }} />
                    : <FavoriteBorderIcon style={{ color: '#bbb', fontSize: 22 }} />}
                </button>
              )}
            </div>
          </div>

          <div className={`${classes.cardFace} ${classes.cardBack}`}>
            <p className={classes.backLabel}>Nghĩa tiếng Việt</p>
            <h2 className={classes.mean}>{mean}</h2>
            {Boolean(phonetic) && <p className={classes.backPhonetic}>/{phonetic}/</p>}
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
