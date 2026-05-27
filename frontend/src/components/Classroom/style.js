import { makeStyles } from '@material-ui/core/styles';

export default makeStyles((theme) => ({
  hero: {
    position: 'relative',
    overflow: 'hidden',
    margin: '3.2rem 0 3.6rem',
    padding: '4.5rem',
    borderRadius: '38px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: '3rem',
    background:
      'linear-gradient(135deg, rgba(255,250,244,0.98), rgba(231,248,253,0.92))',
    boxShadow: '0 22px 58px rgba(16, 47, 78, 0.09)',
    border: '1px solid rgba(255,255,255,0.9)',

    [theme.breakpoints.down('sm')]: {
      padding: '3rem',
      borderRadius: '28px',
      flexDirection: 'column',
      alignItems: 'flex-start',
    },
  },

  eyebrow: {
    color: '#f28b6c',
    fontSize: '1.25rem',
    fontWeight: 900,
    letterSpacing: '2px',
    marginBottom: '1rem',
  },

  title: {
    color: '#102f4e',
    fontSize: '4rem',
    lineHeight: 1.15,
    fontWeight: 900,
    letterSpacing: '-1px',
    marginBottom: '1.4rem',

    [theme.breakpoints.down('sm')]: {
      fontSize: '3rem',
    },
  },

  description: {
    maxWidth: '58rem',
    color: '#69737d',
    fontSize: '1.65rem',
    lineHeight: 1.8,
    fontWeight: 500,
    marginBottom: '2.4rem',
  },

  createBtn: {
    minWidth: '15rem',
  },

  heroIconWrap: {
    width: '15rem',
    height: '15rem',
    minWidth: '15rem',
    borderRadius: '36px',
    background:
      'linear-gradient(135deg, rgba(255,168,131,0.22), rgba(111,199,225,0.2))',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',

    [theme.breakpoints.down('sm')]: {
      width: '10rem',
      height: '10rem',
      minWidth: '10rem',
    },
  },

  heroIcon: {
    fontSize: '7rem !important',
    color: '#102f4e',

    [theme.breakpoints.down('sm')]: {
      fontSize: '5rem !important',
    },
  },

  skeleton: {
    height: '24rem',
    borderRadius: '30px',
  },

  card: {
    height: '100%',
    minHeight: '27rem',
    padding: '2.6rem',
    borderRadius: '30px',
    background: 'rgba(255,255,255,0.86)',
    border: '1px solid rgba(255,255,255,0.9)',
    boxShadow: '0 16px 42px rgba(16,47,78,0.08)',
    transition: 'all 0.25s',

    '&:hover': {
      transform: 'translateY(-5px)',
      boxShadow: '0 22px 50px rgba(16,47,78,0.13)',
      background: '#fffaf4',
    },
  },

  cardTop: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: '1.8rem',
  },

  levelBadge: {
    width: '5.4rem',
    height: '5.4rem',
    borderRadius: '18px',
    background:
      'linear-gradient(135deg, rgba(255,168,131,0.28), rgba(111,199,225,0.2))',
    color: '#102f4e',
    fontWeight: 900,
    fontSize: '1.8rem',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },

  activeChip: {
    backgroundColor: 'rgba(91,204,154,0.18) !important',
    color: '#21875b !important',
    fontWeight: '800 !important',
  },

  inactiveChip: {
    backgroundColor: 'rgba(255,168,131,0.18) !important',
    color: '#d86d4b !important',
    fontWeight: '800 !important',
  },

  cardTitle: {
    color: '#102f4e',
    fontSize: '2.4rem',
    lineHeight: 1.3,
    fontWeight: 900,
    letterSpacing: '-0.5px',
    marginBottom: '1rem',
  },

  cardDesc: {
    minHeight: '5rem',
    color: '#69737d',
    fontSize: '1.5rem',
    lineHeight: 1.65,
    fontWeight: 500,
    marginBottom: '1.8rem',
  },

  codeBox: {
    padding: '1.2rem 1.4rem',
    borderRadius: '18px',
    background: 'rgba(111,199,225,0.12)',
    border: '1px dashed rgba(16,47,78,0.16)',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '1.4rem',

    '& span': {
      color: '#69737d',
      fontSize: '1.35rem',
      fontWeight: 700,
    },

    '& b': {
      color: '#102f4e',
      fontSize: '1.8rem',
      letterSpacing: '1px',
    },
  },

  metaRow: {
    display: 'flex',
    alignItems: 'center',
    color: '#69737d',
    fontSize: '1.45rem',
    fontWeight: 700,
    marginBottom: '2rem',
  },

  metaIcon: {
    color: '#f28b6c',
    marginRight: '0.8rem',
  },

  cardActions: {
    display: 'flex',
    gap: '1rem',
  },

  editBtn: {
    borderRadius: '999px !important',
    padding: '0.8rem 1.6rem !important',
    color: '#102f4e !important',
    background: 'rgba(111,199,225,0.14) !important',
    fontWeight: '800 !important',
    textTransform: 'none !important',
  },

  deleteBtn: {
    borderRadius: '999px !important',
    padding: '0.8rem 1.6rem !important',
    color: '#d6493c !important',
    background: 'rgba(214,73,60,0.09) !important',
    fontWeight: '800 !important',
    textTransform: 'none !important',
  },

  emptyBox: {
    minHeight: '34rem',
    borderRadius: '34px',
    background: 'rgba(255,255,255,0.82)',
    border: '1px solid rgba(255,255,255,0.9)',
    boxShadow: '0 18px 45px rgba(16,47,78,0.08)',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '4rem',
    textAlign: 'center',

    '& h2': {
      color: '#102f4e',
      fontSize: '2.8rem',
      fontWeight: 900,
      marginBottom: '1rem',
    },

    '& p': {
      color: '#69737d',
      fontSize: '1.6rem',
      marginBottom: '2rem',
    },
  },

  emptyIcon: {
    fontSize: '7rem !important',
    color: '#6fc7e1',
    marginBottom: '1.6rem',
  },

  modalPaper: {
    borderRadius: '30px !important',
    background: '#fffaf4 !important',
  },

  modalTitle: {
    '& h2': {
      color: '#102f4e',
      fontSize: '2.8rem',
      fontWeight: 900,
    },
  },

  modalContent: {
    borderColor: 'rgba(16,47,78,0.08) !important',
  },

  modalActions: {
    padding: '1.6rem 2.4rem !important',
  },
}));