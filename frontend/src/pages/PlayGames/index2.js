








import Grid from '@material-ui/core/Grid';
import brainIcon from 'assets/icons/games/brain.png';
import correctWordIcon from 'assets/icons/games/correct-word.png';
import grammarlyIcon from 'assets/icons/games/grammarly.png';
import jigsawIcon from 'assets/icons/games/jigsaw.png';
import millionaireIcon from 'assets/icons/games/millionaire.png';
import wordMatchingIcon from 'assets/icons/games/word-match.png';
import FeatureBox from 'components/FeatureBox';
import { ROUTES } from 'constant';
import useScrollTop from 'hooks/useScrollTop';
import useTitle from 'hooks/useTitle';
import React from 'react';

const { GAMES } = ROUTES;

const GAME_LIST = [
  {
    title: 'Hãy chọn từ đúng',
    subTitle:
      'Ôn tập từ vựng bằng cách chọn 1 đáp án đúng nhất trong 4 câu trả lời có nghĩa khớp với từ được cho.',
    imgUrl: correctWordIcon,
    to: GAMES.CORRECT_WORD,
  },
  {
    title: 'Ghép từ',
    subTitle:
      'Ghép các ký tự đã cho thành một chữ có nghĩa đúng với từ đã cho.',
    imgUrl: wordMatchingIcon,
    to: GAMES.WORD_MATCHING,
  },
  {
    title: 'Tay nhanh hơn não',
    subTitle:
      'Chọn một hình ảnh đúng với từ đã cho trong thời gian nhanh nhất nhé.',
    imgUrl: brainIcon,
    to: GAMES.FAST_GAME,
  },
  /* {
    title: 'Hãy chọn từ đúng (nâng cao)',
    subTitle: 'Chọn tất cả các từ đồng nghĩa (trái nghĩa) với từ đã cho.',
    imgUrl: correctWordAdvIcon,
    to: GAMES.CORRECT_WORD_ADV,
  }, */

  /*  {
    title: 'Ai là triệu phú',
    subTitle:
      'Trải nghiệm game show truyền hình "Ai là triệu phú" phiên bản tiếng Anh ngay với Dynonary',
    imgUrl: millionaireIcon,
    to: GAMES.MILLIONAIRE,
  },
  {
    title: 'Nối từ',
    subTitle:
      'Cùng bắt trend nối từ đã từ rầm rộ trên mạng xã hội với Dyno nhé. Đặc biệt, bạn có thể chơi cùng bạn bè nhé 😮',
    imgUrl: jigsawIcon,
    to: GAMES.JIGSAW,
  },
  {
    title: 'Điền vào chỗ trống',
    subTitle:
      'Luyện tập ngữ pháp với câu trắc nghiệm điền vào chỗ trống sao cho phù hợp nhé.',
    imgUrl: grammarlyIcon,
    to: GAMES.GRAMMARLY,
  }, */
  /*   {
    title: 'Game VIP',
    subTitle:
      'Tận hưởng một game cực kỳ tuyệt vời của Dyno nhé, nâng cấp tài khoản VIP để chơi.',
    imgUrl: vipIcon,
    to: GAMES.VIP,
  }, */
];

function PlayGamesPage() {
  useTitle('Game');
  useScrollTop();

  return (
    <div className="container my-10">
      <Grid container spacing={3}>
        {GAME_LIST.map((box, index) => (
          <Grid item xs={12} md={6} lg={4} key={index}>
            <FeatureBox
              imgUrl={box.imgUrl}
              title={box.title}
              to={box.to}
              subTitle={box.subTitle}
            />
          </Grid>
        ))}
      </Grid>
    </div>
  );
}

export default PlayGamesPage;
