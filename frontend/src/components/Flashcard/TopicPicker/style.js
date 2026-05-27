import { makeStyles } from '@material-ui/core/styles';

const useStyle = makeStyles((theme) => ({
  wrapper: {
    padding: '20px 0',
  },
  title: {
    fontSize: '1.8rem',
    fontWeight: 700,
    marginBottom: 8,
    color: theme.palette.text.primary,
  },
  subTitle: {
    fontSize: '1rem',
    color: theme.palette.text.secondary,
    marginBottom: 24,
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))',
    gap: 16,
  },
  card: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '20px 10px',
    borderRadius: 12,
    cursor: 'pointer',
    border: `2px solid ${theme.palette.divider}`,
    backgroundColor: theme.palette.background.paper,
    transition: 'all 0.2s',
    '&:hover': {
      borderColor: theme.palette.primary.main,
      backgroundColor: theme.palette.primary.main + '11',
      transform: 'translateY(-3px)',
      boxShadow: '0 6px 20px rgba(0,0,0,0.1)',
    },
  },
  icon: {
    width: 56,
    height: 56,
    marginBottom: 10,
    objectFit: 'contain',
  },
  topicTitle: {
    fontSize: '0.9rem',
    fontWeight: 600,
    textAlign: 'center',
    color: theme.palette.text.primary,
  },
  wordCount: {
    fontSize: '0.75rem',
    color: theme.palette.text.secondary,
    marginTop: 4,
  },
}));

export default useStyle;