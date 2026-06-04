import Button from '@material-ui/core/Button';
import CircularProgress from '@material-ui/core/CircularProgress';
import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';
import ReplayIcon from '@material-ui/icons/Replay';
import SportsEsportsIcon from '@material-ui/icons/SportsEsports';
import React from 'react';
import { useHistory } from 'react-router-dom';
import { ROUTES } from 'constant';
import useStyle from './style';

function StudyResult({ knownWords, unknownWords, onRestart, onReviewWrong, topicTitle, packInfo, coinsEarned = 0 }) {
  const classes = useStyle();
  const history = useHistory();

  const total = knownWords.length + unknownWords.length;
  const percent = total > 0 ? Math.round((knownWords.length / total) * 100) : 0;

  const getEncouragement = () => {
    if (percent === 100) return '🏆 Xuất sắc! Bạn nhớ hết tất cả!';
    if (percent >= 80) return '🎉 Rất tốt! Bạn gần nhớ hết rồi!';
    if (percent >= 50) return '💪 Khá tốt! Hãy ôn lại những từ chưa nhớ nhé!';
    return '📚 Cần cố gắng thêm! Hãy học lại nhé!';
  };

  return (
    <div className={`container ${classes.wrapper}`}>
      <h1 className={classes.title}>Kết quả học tập</h1>

      {topicTitle && (
        <p className={classes.topicLabel}>
          Chủ đề: <strong>{topicTitle}</strong>
        </p>
      )}

      <p className={classes.encouragement}>{getEncouragement()}</p>

      <Box position="relative" display="inline-flex" my={3}>
        <CircularProgress variant="determinate" value={percent} size={140} thickness={5}
          style={{ color: percent >= 70 ? '#4caf50' : '#e91e63' }} />
        <Box top={0} left={0} bottom={0} right={0} position="absolute" display="flex" flexDirection="column" alignItems="center" justifyContent="center">
          <Typography className={classes.percentText}>{percent}%</Typography>
          <Typography className={classes.percentSub}>đã nhớ</Typography>
        </Box>
      </Box>

      <div className={classes.statsRow}>
        <div className={`${classes.statBox} ${classes.statKnown}`}>
          <div className={classes.statNumber} style={{ color: '#4caf50' }}>{knownWords.length}</div>
          <div className={classes.statLabel}>✅ Đã nhớ</div>
        </div>
        <div className={`${classes.statBox} ${classes.statUnknown}`}>
          <div className={classes.statNumber} style={{ color: '#e91e63' }}>{unknownWords.length}</div>
          <div className={classes.statLabel}>❌ Chưa nhớ</div>
        </div>
        <div className={`${classes.statBox} ${classes.statTotal}`}>
          <div className={classes.statNumber} style={{ color: '#1976d2' }}>{total}</div>
          <div className={classes.statLabel}>📚 Tổng từ</div>
        </div>
      </div>

            {/* Xu thưởng */}
      {coinsEarned > 0 && (
        <div style={{ background: 'rgba(247,183,49,0.12)', border: '1px solid #f7b731', borderRadius: 12, padding: '12px 20px', textAlign: 'center', margin: '0 0 16px', fontWeight: 800, color: '#f7b731', fontSize: '1rem' }}>
          🪙 Bạn nhận được <span style={{ fontSize: '1.25rem' }}>{coinsEarned} xu</span> cho buổi học này!
        </div>
      )}

      <div className={classes.btnRow}>
        <Button variant="outlined" className="_btn _btn-stand" startIcon={<ReplayIcon />} onClick={onRestart}>
          Học lại từ đầu
        </Button>

        {unknownWords.length > 0 && (
          <Button variant="outlined" style={{ borderColor: '#e91e63', color: '#e91e63' }} className="_btn"
            startIcon={<ReplayIcon />} onClick={onReviewWrong}>
            Ôn từ chưa nhớ ({unknownWords.length})
          </Button>
        )}

        <Button variant="contained" className="_btn _btn-primary" startIcon={<SportsEsportsIcon />}
          onClick={() => history.push(ROUTES.GAMES.HOME, { practicePackInfo: packInfo, practiceTitle: topicTitle })}>
          Luyện tập ngay
        </Button>
      </div>
    </div>
  );
}

export default StudyResult;