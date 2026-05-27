import { makeStyles } from '@material-ui/core/styles';

const imgSize = '4.8rem';
const iconSize = '2.4rem';

export default makeStyles((theme) => ({
  navWrapper: {
    paddingBottom: 'var(--nav-height)',
  },

  nav: {
    backgroundColor: 'rgba(255, 250, 244, 0.92)',
    height: 'var(--nav-height)',
    boxShadow: '0 8px 26px rgba(16, 47, 78, 0.08)',
    backdropFilter: 'blur(12px)',
    borderBottom: '1px solid rgba(16, 47, 78, 0.06)',

    position: 'fixed',
    top: 0,
    left: 0,
    zIndex: 999,
  },

  inner: {
    justifyContent: 'space-between',
  },

  brand: {
    display: 'flex',
    alignItems: 'center',
    gap: '1rem',
  },

  logo: {
    width: `${imgSize} !important`,
    height: `${imgSize} !important`,
    objectFit: 'contain',
  },

  brandText: {
    fontSize: '2.7rem',
    fontWeight: 900,
    letterSpacing: '0.8px',
    color: '#102f4e',
    lineHeight: 1,

    '& span': {
      color: '#ffa883',
    },

    [theme.breakpoints.down('xs')]: {
      display: 'none',
    },
  },

  imgSize: {
    height: imgSize,
    width: imgSize,
  },

  iconSize: {
    fontSize: `${iconSize} !important`,
    color: 'var(--label-color)',
  },

  control: {
    marginLeft: 'auto',
    gap: '1.4rem',
  },

  searchWrap: {
    '& > *': {
      borderRadius: '999px !important',
    },

    '& input': {
      fontSize: '1.55rem',
      color: 'var(--text-color)',
    },
  },

  avt: {
    border: '3px solid #ffffff',
    boxShadow: '0 8px 18px rgba(16, 47, 78, 0.16)',
    transition: 'all 0.25s',

    '&:hover, &:active': {
      transform: 'translateY(-1px) scale(1.03)',
      opacity: 0.95,
    },
  },

  searchIcon: {
    fontSize: iconSize,
    color: 'var(--label-color)',
  },

  loginBtn: {
    height: '3.9rem',
    minWidth: '12rem',
  },

  loginLabel: {
    fontSize: '1.4rem',
  },
}));