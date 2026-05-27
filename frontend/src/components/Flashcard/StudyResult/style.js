import { makeStyles } from '@material-ui/core/styles';

export default makeStyles((theme) => ({
  wrapper: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: '40px 20px',
    textAlign: 'center',
  },
  title: {
    fontSize: '2rem',
    fontWeight: 700,
    marginBottom: 4,
  },
  topicLabel: {
    color: theme.palette.text.secondary,
    fontSize: '1rem',
    marginBottom: 4,
  },
  encouragement: {
    fontSize: '1.1rem',
    color: theme.palette.text.secondary,
  },
  percentText: {
    fontSize: '2rem !important',
    fontWeight: '700 !important',
  },
  percentSub: {
    fontSize: '0.8rem !important',
    color: theme.palette.text.secondary,
  },
  statsRow: {
    display: 'flex',
    gap: 16,
    marginBottom: 32,
    justifyContent: 'center',
    flexWrap: 'wrap',
  },
  statBox: {
    padding: '16px 24px',
    borderRadius: 12,
    minWidth: 100,
    border: '2px solid',
  },
  statKnown: {
    backgroundColor: '#e8f5e9',
    borderColor: '#4caf50',
  },
  statUnknown: {
    backgroundColor: '#fce4ec',
    borderColor: '#e91e63',
  },
  statTotal: {
    backgroundColor: '#e3f2fd',
    borderColor: '#1976d2',
  },
  statNumber: {
    fontSize: '2rem',
    fontWeight: 700,
  },
  statLabel: {
    fontSize: '0.85rem',
    color: theme.palette.text.secondary,
    marginTop: 4,
  },
  btnRow: {
    display: 'flex',
    gap: 12,
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
}));