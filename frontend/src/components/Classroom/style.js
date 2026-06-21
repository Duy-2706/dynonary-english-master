import { makeStyles } from '@material-ui/core/styles';

const GAME_FONT = '"Baloo 2", "Nunito", sans-serif';

const useStyle = makeStyles(() => ({
  card: {
    width: '100%',
    maxWidth: 360,
    minHeight: 360,
    display: 'flex',
    flexDirection: 'column',
    borderRadius: 26,
    overflow: 'hidden',
    background: '#ffffff',
    border: '4px solid #19c7a8',
    boxShadow: '0 8px 0 #07947f, 0 18px 34px rgba(15,23,42,.12)',
    fontFamily: GAME_FONT,
    transition: 'transform .18s ease, box-shadow .18s ease',
    '&:hover': {
      transform: 'translateY(-4px)',
      boxShadow: '0 11px 0 #07947f, 0 24px 42px rgba(15,23,42,.16)',
    },
  },

  cardTop: {
    height: 88,
    background: 'linear-gradient(135deg,#19c7a8,#087565)',
    color: '#fff',
    padding: '18px 20px',
    display: 'flex',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    position: 'relative',
    overflow: 'hidden',
  },

  cardDecor: {
    position: 'absolute',
    right: 18,
    top: 10,
    opacity: 0.16,
    color: '#ffffff',
    transform: 'rotate(-12deg)',
  },

  levelBadge: {
    position: 'relative',
    zIndex: 2,
    background: '#ffffff',
    color: '#07947f',
    border: '3px solid #d6f3ed',
    borderRadius: 999,
    padding: '7px 14px',
    fontSize: '.9rem',
    fontWeight: 900,
    boxShadow: '0 5px 0 rgba(0,0,0,.13)',
  },

  activeChip: {
    position: 'relative',
    zIndex: 2,
    height: 'auto !important',
    borderRadius: '999px !important',
    background: '#d4f5eb !important',
    color: '#057a55 !important',
    border: '3px solid #a8e8db !important',
    fontFamily: `${GAME_FONT} !important`,
    fontWeight: '900 !important',
    fontSize: '.86rem !important',
    padding: '4px 2px !important',
  },

  inactiveChip: {
    position: 'relative',
    zIndex: 2,
    height: 'auto !important',
    borderRadius: '999px !important',
    background: '#f8fafc !important',
    color: '#64748b !important',
    border: '3px solid #e2e8f0 !important',
    fontFamily: `${GAME_FONT} !important`,
    fontWeight: '900 !important',
    fontSize: '.86rem !important',
    padding: '4px 2px !important',
  },

  cardBody: {
    padding: '22px 22px 14px',
    flex: 1,
  },

  cardTitle: {
    margin: '0 0 10px',
    color: '#06434b',
    fontSize: '1.42rem',
    lineHeight: 1.16,
    fontWeight: 900,
    letterSpacing: '-0.02em',
  },

  cardDesc: {
    margin: '0 0 16px',
    color: '#07545c',
    fontSize: '.98rem',
    lineHeight: 1.48,
    fontWeight: 750,
    minHeight: 44,
  },

  codeBox: {
    background: '#eefdf9',
    border: '3px solid #d6f3ed',
    borderRadius: 18,
    padding: '10px 14px',
    marginBottom: 14,
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 10,
    color: '#06434b',
    boxShadow: '0 4px 0 rgba(7,148,127,.08)',
    '& span': {
      color: '#64748b',
      fontSize: '.88rem',
      fontWeight: 850,
    },
    '& b': {
      fontSize: '1.02rem',
      fontWeight: 900,
      color: '#07947f',
    },
  },

  metaRow: {
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    color: '#07545c',
    fontSize: '.98rem',
    fontWeight: 850,
  },

  metaIcon: {
    color: '#07947f',
    fontSize: '1.1rem !important',
  },

  cardActions: {
    padding: '0 18px 20px',
    display: 'flex',
    gap: 8,
    flexWrap: 'wrap',
    alignItems: 'center',
  },

  manageBtn: {
    background: 'linear-gradient(180deg,#19c7a8,#07947f) !important',
    color: '#fff !important',
    border: '3px solid #fff !important',
    borderRadius: '999px !important',
    padding: '7px 13px !important',
    fontFamily: `${GAME_FONT} !important`,
    fontWeight: '900 !important',
    fontSize: '.9rem !important',
    textTransform: 'none !important',
    boxShadow: '0 5px 0 rgba(7,148,127,.28) !important',
  },

  editBtn: {
    background: 'linear-gradient(180deg,#ffffff,#eefdf9) !important',
    color: '#056d5e !important',
    border: '3px solid #19c7a8 !important',
    borderRadius: '999px !important',
    padding: '7px 13px !important',
    fontFamily: `${GAME_FONT} !important`,
    fontWeight: '900 !important',
    fontSize: '.9rem !important',
    textTransform: 'none !important',
    boxShadow: '0 5px 0 rgba(7,148,127,.14) !important',
  },

  deleteBtn: {
    background: '#fff1f1 !important',
    color: '#e53935 !important',
    border: '3px solid #ffb7b7 !important',
    borderRadius: '999px !important',
    padding: '7px 13px !important',
    fontFamily: `${GAME_FONT} !important`,
    fontWeight: '900 !important',
    fontSize: '.9rem !important',
    textTransform: 'none !important',
    boxShadow: '0 5px 0 rgba(141,22,22,.10) !important',
  },
}));

export default useStyle;