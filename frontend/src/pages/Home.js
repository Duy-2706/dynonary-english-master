import Grid from '@material-ui/core/Grid';
import communicateIcon from 'assets/icons/communicate.png';
import dictionaryIcon from 'assets/icons/dictionary.png';
import editIcon from 'assets/icons/edit.png';
import favoriteIcon from 'assets/icons/favorite.png';
import flashcardIcon from 'assets/icons/flashcard.png';
import gameIcon from 'assets/icons/game.png';
import grammarIcon from 'assets/icons/grammar.png';
import ipaIcon from 'assets/icons/ipa.png';
import medalIcon from 'assets/icons/medal.png';
import toeicIcon from 'assets/icons/toeic.png';
import verbIcon from 'assets/icons/verb.png';
import classroomIcon from 'assets/icons/lop_hoc.png';


import bauTroi from 'assets/images/home/bau_troi.jpg';
import cauTruotKhongNen from 'assets/images/home/cau_truot_khong_nen.png';
import coVua from 'assets/images/home/co_vua.png';
import dieuHau from 'assets/images/home/dieu_hau.png';
import heoSieuNhan from 'assets/images/home/heo_sieu_nhan.png';
import khinhKhiCauKhongNen from 'assets/images/home/khinh_khi_cau_khong_nen.png';
import khungLongXanh from 'assets/images/home/khung_long_xanh.png';
import nhaTrenDoi from 'assets/images/home/nha_tren_doi.jpg';
import nhaTrenDoiKhongNen from 'assets/images/home/nha_tren_doi_khong_nen.png';
import saMac from 'assets/images/home/sa_mac.jpg';
import khuVuonCoTich from 'assets/images/home/khu_vuon_co_tich.jpg';
import khungLongHong from 'assets/images/home/khung_long_hong.png';
import monkeyGroup from 'assets/images/home/anh_dan_khi_khong_nen.png';



import FeatureBox from 'components/FeatureBox';
import { ROUTES } from 'constant';
import useScrollTop from 'hooks/useScrollTop';
import useTitle from 'hooks/useTitle';
import React from 'react';

const FEATURE_LIST = [
  {
    title: 'Bảng phiên âm IPA',
    subTitle: 'Luyện nghe, phát âm chuẩn với 44 âm trong bảng phiên âm quốc tế.',
    imgUrl: ipaIcon,
    to: ROUTES.IPA,
    theme: 'blue',
  },
  {
    title: '1000+ câu giao tiếp',
    subTitle: 'Luyện nghe và nói các mẫu câu tiếng Anh giao tiếp hằng ngày.',
    imgUrl: communicateIcon,
    to: ROUTES.COMMUNICATION_PHRASE,
    theme: 'orange',
  },
  {
    title: 'Flashcard từ vựng',
    subTitle: 'Ghi nhớ từ vựng nhanh hơn bằng thẻ học tương tác.',
    imgUrl: flashcardIcon,
    to: ROUTES.FLASHCARD,
    theme: 'cyan',
  },
  {
    title: 'Từ điển',
    subTitle: 'Tra cứu từ vựng theo cấp độ, loại từ và chủ đề học tập.',
    imgUrl: dictionaryIcon,
    to: ROUTES.DYNO_DICTIONARY,
    theme: 'purple',
  },
  {
    title: 'Từ vựng TOEIC',
    subTitle: 'Tổng hợp các từ vựng thường gặp trong bài thi TOEIC.',
    imgUrl: toeicIcon,
    to: ROUTES.TOEIC_DICTIONARY,
    theme: 'green',
  },
  {
    title: 'Từ vựng yêu thích',
    subTitle: 'Lưu lại những từ quan trọng để ôn tập dễ dàng hơn.',
    imgUrl: favoriteIcon,
    to: ROUTES.FAVORITE,
    theme: 'pink',
  },
  {
    title: 'Động từ bất quy tắc',
    subTitle: 'Hệ thống các động từ bất quy tắc phổ biến trong tiếng Anh.',
    imgUrl: verbIcon,
    to: ROUTES.IRREGULAR,
    theme: 'orange',
  },
  {
    title: 'Ngữ pháp',
    subTitle: 'Tổng hợp cấu trúc câu và điểm ngữ pháp cần thiết.',
    imgUrl: grammarIcon,
    to: ROUTES.GRAMMAR,
    theme: 'green',
  },
  {
    title: 'Play Games',
    subTitle: 'Ôn luyện kiến thức qua trò chơi để học vui và nhớ lâu hơn.',
    imgUrl: gameIcon,
    to: ROUTES.GAMES.HOME,
    theme: 'blue',
  },
  {
    title: 'Bảng xếp hạng',
    subTitle: 'Theo dõi thành tích học tập của bạn và những người khác.',
    imgUrl: medalIcon,
    to: ROUTES.LEADERBOARD,
    theme: 'cyan',
  },
  {
    title: 'Đóng góp nội dung',
    subTitle: 'Thêm từ mới, câu mới hoặc đề xuất chỉnh sửa nội dung.',
    imgUrl: editIcon,
    to: ROUTES.CONTRIBUTION,
    theme: 'pink',
  },
  {
    title: 'Quản lý lớp học',
    subTitle:
      'Tạo lớp học riêng, quản lý học viên và xây dựng không gian học tập',
    imgUrl: classroomIcon,
    to: ROUTES.CLASSROOM,
  },
];

function HomePage() {
  useTitle('Edwards - Learning is a never-ending journey');
  useScrollTop();

  return (
    <div className="container home-page">
    <section className="home-hero">
      <img className="home-hero-bg" src={bauTroi} alt="" />

      <div className="home-hero-content">
        <p className="home-eyebrow">EDWARDS ENGLISH</p>

        <h1>Học tiếng Anh mỗi ngày qua trò chơi và hình ảnh.</h1>

        <p className="home-description">
          Edwards giúp trẻ luyện phát âm, ghi nhớ từ vựng và sử dụng tiếng Anh
          tự nhiên hơn thông qua flashcard, câu giao tiếp và các hoạt động tương tác.
        </p>

        <div className="home-actions">
          <a className="home-btn home-btn-primary" href={ROUTES.FLASHCARD}>
            Bắt đầu học
          </a>
          <a className="home-btn home-btn-secondary" href={ROUTES.GAMES.HOME}>
            Khám phá trò chơi
          </a>
        </div>
      </div>

      <div className="home-visual">
        <img className="home-monkey-group" src={monkeyGroup} alt="" />
        <img className="home-eagle" src={dieuHau} alt="" />
      </div>
    </section>

      <section className="home-showcase">
        <div className="home-showcase-card">
          <img src={nhaTrenDoi} alt="Learning world" />
          <div>
            <p>Không gian học tập</p>
            <h3>Sinh động như một chuyến phiêu lưu</h3>
          </div>
        </div>

        <div className="home-showcase-card">
          <img src={khuVuonCoTich} alt="Games" />
          <div>
            <p>Game & thử thách</p>
            <h3>Học mà chơi, chơi mà nhớ lâu</h3>
          </div>
        </div>

        <div className="home-showcase-card">
          <img src={saMac} alt="Vocabulary" />
          <div>
            <p>Từ vựng mỗi ngày</p>
            <h3>Ôn tập bằng flashcard và trò chơi</h3>
          </div>
        </div>
      </section>

      <div className="home-section-heading">
        <p>Learning modules</p>
        <h2>Khám phá nội dung học tập</h2>
      </div>

      <Grid container spacing={4}>
        {FEATURE_LIST.map((box, index) => (
          <Grid item xs={12} md={6} lg={4} key={index}>
            <FeatureBox
              imgUrl={box.imgUrl}
              title={box.title}
              to={box.to}
              subTitle={box.subTitle}
              theme={box.theme}
            />
          </Grid>
        ))}
      </Grid>
    </div>
  );
}

export default HomePage;