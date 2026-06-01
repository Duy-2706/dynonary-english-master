import academyIcon from 'assets/icons/topics/academy.png';
import animalIcon from 'assets/icons/topics/animal.png';
import bodyIcon from 'assets/icons/topics/body.png';
import colorIcon from 'assets/icons/topics/color.png';
import cultureIcon from 'assets/icons/topics/culture.png';
import entertainmentIcon from 'assets/icons/topics/entertainment.png';
import excitingIcon from 'assets/icons/topics/exciting.png';
import flagIcon from 'assets/icons/topics/flag.png';
import foodIcon from 'assets/icons/topics/food.png';
import healthIcon from 'assets/icons/topics/health.png';
import hobbyIcon from 'assets/icons/topics/hobby.png';
import jobIcon from 'assets/icons/topics/job.png';
import othersIcon from 'assets/icons/topics/others.png';
import skillIcon from 'assets/icons/topics/skill.png';
import socialIcon from 'assets/icons/topics/social.png';
import spiritualityIcon from 'assets/icons/topics/spirituality.png';
import sportIcon from 'assets/icons/topics/sport.png';
import technologyIcon from 'assets/icons/topics/technology.png';
import travelIcon from 'assets/icons/topics/travel.png';
import treeIcon from 'assets/icons/topics/tree.png';
import toeicIcon from 'assets/icons/topics/toeic.png';
import ieltsIcon from 'assets/icons/topics/ielts.png';
import natureIcon from 'assets/icons/topics/nature.png';
import familyIcon from 'assets/icons/topics/family.png';
import clothesIcon from 'assets/icons/topics/clothes.png';

export const TOEIC_KEY = 'toeic';

export const TOPICS = [
  { key: 'animals',        title: 'Động vật',    icon: animalIcon },
  { key: 'body',           title: 'Con người',   icon: bodyIcon },
  { key: 'city',           title: 'Thành phố',   icon: flagIcon },
  { key: 'clothes',        title: 'Trang phục',  icon: clothesIcon },
  { key: 'colors',         title: 'Màu sắc',     icon: colorIcon },
  { key: 'common',         title: 'Đời sống',    icon: socialIcon },
  { key: 'education',      title: 'Giáo dục',    icon: academyIcon },
  { key: 'emotions',       title: 'Cảm xúc',     icon: spiritualityIcon },
  { key: 'family',         title: 'Gia đình',    icon: familyIcon },
  { key: 'food',           title: 'Ẩm thực',     icon: foodIcon },
  { key: 'furniture',      title: 'Đồ dùng',     icon: cultureIcon },
  { key: 'health',         title: 'Sức khoẻ',    icon: healthIcon },
  { key: 'hobbies',        title: 'Sở thích',    icon: hobbyIcon },
  { key: 'house',          title: 'Ngôi nhà',    icon: treeIcon },
  { key: 'music',          title: 'Âm nhạc',     icon: entertainmentIcon },
  { key: 'nature',         title: 'Thiên nhiên', icon: natureIcon },
  { key: 'numbers',        title: 'Số đếm',      icon: skillIcon },
  { key: 'shopping',       title: 'Mua sắm',     icon: othersIcon },
  { key: 'sports',         title: 'Thể thao',    icon: sportIcon },
  { key: 'technology',     title: 'Công nghệ',   icon: technologyIcon },
  { key: 'time',           title: 'Thời gian',   icon: excitingIcon },
  { key: 'transportation', title: 'Giao thông',  icon: travelIcon },
  { key: 'travel',         title: 'Du lịch',     icon: travelIcon },
  { key: 'weather',        title: 'Thời tiết',   icon: ieltsIcon },
  { key: 'work',           title: 'Công việc',   icon: jobIcon },
];

export const TOPIC_OPTIONS = TOPICS.map((topic) => ({
  value: topic.key,
  label: topic.title,
}));