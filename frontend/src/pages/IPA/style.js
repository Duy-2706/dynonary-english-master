import { makeStyles } from '@material-ui/core/styles';

export default makeStyles(() => ({
  root: {
    paddingTop: '4rem',
    paddingBottom: '8rem',
  },

  section: {
    marginBottom: '8rem',
  },

  imageWrap: {
    marginTop: '3rem',
    marginBottom: '5rem',
    textAlign: 'center',
  },

  image: {
    width: '100%',
    borderRadius: '28px',
    boxShadow: '0 20px 50px rgba(16,47,78,0.12)',
  },

  source: {
    display: 'inline-block',
    marginTop: '1.2rem',
    color: '#ffa883',
    fontWeight: 700,
    fontSize: '1.6rem',
  },
}));