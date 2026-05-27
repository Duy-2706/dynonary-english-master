import PropTypes from 'prop-types';
import React from 'react';
import { Link } from 'react-router-dom';
import useStyle from './style';

function FeatureBox({ to, imgUrl, title, subTitle, theme }) {
  const classes = useStyle({ theme });

  return (
    <Link to={to} className={classes.root}>
      <div className={classes.iconWrap}>
        <img className={classes.icon} src={imgUrl} alt={title} />
      </div>

      <div className={classes.content}>
        <h2 className={classes.title}>{title}</h2>
        <p className={classes.subTitle}>{subTitle}</p>
      </div>
    </Link>
  );
}

FeatureBox.propTypes = {
  imgUrl: PropTypes.string,
  title: PropTypes.string,
  to: PropTypes.string,
  subTitle: PropTypes.string,
  theme: PropTypes.string,
};

FeatureBox.defaultProps = {
  imgUrl: '',
  title: '',
  to: '',
  subTitle: '',
  theme: 'blue',
};

export default FeatureBox;