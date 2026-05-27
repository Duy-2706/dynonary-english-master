import { makeStyles } from '@material-ui/core/styles';
import { cloudinaryImgOptimize } from 'helper';

export default makeStyles((theme) => ({
  root: {
    width: '100%',
    display: 'flex',
    justifyContent: 'center',
    paddingTop: 12,
  },

  flipScene: {
    width: 'min(820px, 92vw)',
    height: 430,
    perspective: 1400,
    cursor: 'pointer',

    [theme.breakpoints.down('sm')]: {
      height: 520,
    },
  },

  flipCard: {
    position: 'relative',
    width: '100%',
    height: '100%',
    transformStyle: 'preserve-3d',
    transition: 'transform 0.55s ease',
  },

  isFlipped: {
    transform: 'rotateY(180deg)',
  },

  cardFace: {
    position: 'absolute',
    inset: 0,
    backfaceVisibility: 'hidden',
    WebkitBackfaceVisibility: 'hidden',
    overflow: 'hidden',
    borderRadius: 28,
    background: '#fff',
    boxShadow: '0 16px 42px rgba(0,0,0,0.10)',
    border: '1px solid rgba(0,0,0,0.06)',
  },

  cardFront: {
    display: 'grid',
    gridTemplateColumns: '42% 58%',

    [theme.breakpoints.down('sm')]: {
      gridTemplateColumns: '1fr',
      gridTemplateRows: '45% 55%',
    },
  },

  picture: {
    width: '100%',
    height: '100%',
    backgroundImage: (props) =>
      `url("${cloudinaryImgOptimize(props.picture, -1, 640)}")`,
    backgroundRepeat: 'no-repeat',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundColor: '#f4f8f5',
  },

  frontContent: {
    padding: '3.2rem 2.8rem',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    textAlign: 'center',
    fontFamily: 'inherit',
  },

  frontLabel: {
    fontSize: 13,
    color: '#9a9a9a',
    textTransform: 'uppercase',
    letterSpacing: 1.5,
    marginBottom: 16,
  },

  word: {
    fontSize: 42,
    fontWeight: 800,
    color: 'var(--text-color)',
    textTransform: 'capitalize',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    margin: 0,
    lineHeight: 1.15,

    [theme.breakpoints.down('sm')]: {
      fontSize: 34,
    },
  },

  type: {
    fontSize: 18,
    color: 'var(--label-color)',
    margin: '14px 0 0',
  },

  phonetic: {
    fontSize: 20,
    color: 'var(--phonetic-color)',
    margin: '12px 0 0',
    letterSpacing: 0.5,
  },

  hint: {
    marginTop: 26,
    fontSize: 14,
    color: '#8a8a8a',
  },

  cardBack: {
    transform: 'rotateY(180deg)',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    padding: '3.2rem',
    textAlign: 'center',
    background:
      'radial-gradient(circle at top left, rgba(0,171,107,0.14), transparent 36%), #ffffff',
    fontFamily: 'inherit',
  },

  backLabel: {
    fontSize: 13,
    color: '#9a9a9a',
    textTransform: 'uppercase',
    letterSpacing: 1.5,
    marginBottom: 12,
  },

  mean: {
    fontSize: 38,
    color: 'var(--primary-color)',
    fontWeight: 800,
    textTransform: 'capitalize',
    margin: '0 0 16px',
    lineHeight: 1.2,

    [theme.breakpoints.down('sm')]: {
      fontSize: 30,
    },
  },

  backPhonetic: {
    fontSize: 20,
    color: 'var(--phonetic-color)',
    margin: '0 0 8px',
  },

  backType: {
    fontSize: 16,
    color: 'var(--label-color)',
    margin: '0 0 12px',
  },

  speakerWrap: {
    margin: '4px 0 12px',
  },

  example: {
    maxWidth: 620,
    fontSize: 18,
    lineHeight: 1.55,
    color: 'var(--text-color)',
    margin: '12px 0 0',

    '& b': {
      color: 'var(--primary-color)',
    },
  },

  backHint: {
    marginTop: 20,
    fontSize: 13,
    color: '#9a9a9a',
  },
}));