import { makeStyles } from '@material-ui/core/styles';

const themeColorMap = {
  blue: {
    bg: 'rgba(111, 199, 225, 0.15)',
    shadow: 'rgba(111, 199, 225, 0.18)',
  },
  cyan: {
    bg: 'rgba(111, 199, 225, 0.18)',
    shadow: 'rgba(111, 199, 225, 0.2)',
  },
  orange: {
    bg: 'rgba(255, 168, 131, 0.2)',
    shadow: 'rgba(255, 168, 131, 0.2)',
  },
  pink: {
    bg: 'rgba(255, 168, 131, 0.16)',
    shadow: 'rgba(255, 168, 131, 0.2)',
  },
  green: {
    bg: 'rgba(91, 204, 154, 0.15)',
    shadow: 'rgba(91, 204, 154, 0.18)',
  },
  purple: {
    bg: 'rgba(160, 130, 255, 0.12)',
    shadow: 'rgba(160, 130, 255, 0.16)',
  },
};

export default makeStyles((theme) => ({
  root: {
    height: '100%',
    minHeight: '18.5rem',
    padding: '2.5rem',
    display: 'flex',
    alignItems: 'center',
    gap: '2rem',
    borderRadius: '32px',
    background: 'rgba(255, 255, 255, 0.82)',
    border: '1px solid rgba(255, 255, 255, 0.92)',
    boxShadow: '0 18px 45px rgba(16, 47, 78, 0.08)',
    transition: 'all 0.28s ease',
    position: 'relative',
    overflow: 'hidden',

    '&:before': {
      content: '""',
      position: 'absolute',
      right: '-4rem',
      top: '-4rem',
      width: '11rem',
      height: '11rem',
      borderRadius: '50%',
      background: (props) =>
        themeColorMap[props.theme]?.bg || themeColorMap.blue.bg,
    },

    '&:hover': {
      transform: 'translateY(-6px)',
      boxShadow: (props) =>
        `0 24px 55px ${
          themeColorMap[props.theme]?.shadow || themeColorMap.blue.shadow
        }`,
      background: '#fffaf4',
    },

    [theme.breakpoints.down('sm')]: {
      minHeight: '14rem',
      padding: '2rem',
      borderRadius: '26px',
    },
  },

  iconWrap: {
    width: '8rem',
    height: '8rem',
    minWidth: '8rem',
    borderRadius: '26px',
    background: (props) =>
      themeColorMap[props.theme]?.bg || themeColorMap.blue.bg,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    zIndex: 2,

    [theme.breakpoints.down('sm')]: {
      width: '6.2rem',
      height: '6.2rem',
      minWidth: '6.2rem',
      borderRadius: '20px',
    },
  },

  icon: {
    width: '5.4rem',
    height: '5.4rem',
    objectFit: 'contain',
    filter: 'drop-shadow(0 8px 10px rgba(16,47,78,0.12))',

    [theme.breakpoints.down('sm')]: {
      width: '4.4rem',
      height: '4.4rem',
    },
  },

  content: {
    position: 'relative',
    zIndex: 2,
  },

  title: {
    color: '#102f4e',
    fontFamily: 'var(--font)',
    fontWeight: 850,
    fontSize: '2.15rem',
    lineHeight: 1.3,
    letterSpacing: '-0.45px',
    marginBottom: '0.8rem',

    [theme.breakpoints.down('sm')]: {
      fontSize: '1.85rem',
    },
  },

  subTitle: {
    display: 'block',
    color: '#6b7280',
    fontFamily: 'var(--font)',
    fontSize: '1.45rem',
    lineHeight: 1.65,
    fontWeight: 500,

    [theme.breakpoints.down('sm')]: {
      fontSize: '1.32rem',
    },
  },
}));