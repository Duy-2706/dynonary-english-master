import { makeStyles } from '@material-ui/core/styles';

export default makeStyles((theme) => ({
  wrapper: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: 16,
    width: '100%',
  },

  skeleton: {
    borderRadius: 28,
  },

  progressWrap: {
    width: '100%',
    display: 'flex',
    alignItems: 'center',
    gap: 12,
    marginBottom: 4,
  },

  progressBar: {
    flex: 1,
    height: 10,
    borderRadius: 5,
  },

  progressText: {
    fontSize: '0.85rem',
    color: theme.palette.text.secondary,
    whiteSpace: 'nowrap',
    fontWeight: 600,
  },

  cardWrap: {
    position: 'relative',
    width: '100%',
  },

  actionRow: {
    display: 'flex',
    justifyContent: 'center',
    gap: 20,
    marginTop: 8,
    width: '100%',
  },

  btnKnown: {
    backgroundColor: '#4caf50',
    color: '#fff',
    fontWeight: 700,
    fontSize: '1rem',
    padding: '12px 36px',
    borderRadius: 30,
    minWidth: 150,
    '&:hover': {
      backgroundColor: '#388e3c',
    },
  },

  btnUnknown: {
    borderColor: '#e91e63',
    borderWidth: 2,
    color: '#e91e63',
    fontWeight: 700,
    fontSize: '1rem',
    padding: '12px 36px',
    borderRadius: 30,
    minWidth: 150,
    '&:hover': {
      backgroundColor: '#fce4ec',
      borderColor: '#e91e63',
    },
  },
}));