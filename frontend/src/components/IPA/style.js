import { makeStyles } from '@material-ui/core/styles';

export default makeStyles((theme) => ({
  groupCollapse: {
    background: 'rgba(255,255,255,0.72)',
    backdropFilter: 'blur(10px)',
    borderRadius: '28px !important',
    boxShadow: '0 10px 30px rgba(0,0,0,0.06)',
    border: '1px solid rgba(255,168,131,0.18)',
    margin: '2.4rem 0 !important',
    overflow: 'hidden',

    '&:before': {
      display: 'none',
    },
  },

  arrowIcon: {
    color: '#8E8E93',
    fontSize: '3rem',
  },

  gcTitle: {
    color: '#102F4E',
    fontWeight: 800,
    fontSize: '1.7rem',
    fontFamily: 'var(--font)',

    '& b': {
      color: '#FFA883',
      fontWeight: 700,
      marginLeft: '1rem',
    },

    [theme.breakpoints.down('sm')]: {
      fontSize: '2.2rem',
    },
  },

  gcDetails: {
    padding: '2rem 3rem 3rem',
  },

  word: {
    display: 'inline-block',
    fontSize: '2.6rem',
    color: '#FFA883',
    fontWeight: 800,
    margin: '0 1.2rem 1rem 0',
    fontFamily: 'var(--font)',
  },

  gcDesc: {
    fontSize: '1.65rem',
    lineHeight: 1.8,
    color: '#4B5563',
    margin: '1.6rem 0',
    fontWeight: 500,

    [theme.breakpoints.down('sm')]: {
      fontSize: '1.7rem',
    },
  },

  example: {
    color: '#102F4E',
    fontSize: '1.6rem',
    fontWeight: 600,

    '& b': {
      fontSize: '1.7rem',
      textDecoration: 'none',
      color: '#102F4E',
      display: 'block',
      marginBottom: '1rem',
    },

    '& .phonetic': {
      color: '#FFA883',
      fontWeight: 700,
    },

    [theme.breakpoints.down('sm')]: {
      fontSize: '1.7rem',
    },
  },

  mouthShapeImg: {
    width: '6rem',
    height: '6rem',
    objectFit: 'cover',
    borderRadius: '24px',
    marginLeft: '2rem',
    boxShadow: '0 10px 25px rgba(0,0,0,0.08)',

    [theme.breakpoints.down('sm')]: {
      width: '11rem',
      height: '11rem',
      marginLeft: '0',
      marginTop: '2rem',
    },
  },
}));