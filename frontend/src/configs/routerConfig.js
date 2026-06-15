import Logout from 'components/Logout';
import { ROUTES } from 'constant';
import HomePage from 'pages/Home';
import React from 'react';
import { Route } from 'react-router';
const RegisterPage = React.lazy(() => import('pages/Register'));
const LoginPage = React.lazy(() => import('pages/Login'));
const IPAPage = React.lazy(() => import('pages/IPA/IPA'));
const ContributionPage = React.lazy(() => import('pages/Contribution'));
const PlayGamesPage = React.lazy(() => import('pages/PlayGames'));
const FlashcardPage = React.lazy(() => import('pages/Flashcard'));
const DynoDictionaryPage = React.lazy(() => import('pages/DynoDictionary'));
const CommunicationPhrasePage = React.lazy(() =>
  import('pages/CommunicationPhrase'),
);
const CorrectWordPage = React.lazy(() => import('pages/PlayGames/CorrectWord'));
const WordMatchGamePage = React.lazy(() => import('pages/PlayGames/WordMatch'));
const FastGamePage = React.lazy(() => import('pages/PlayGames/FastGame'));
const GrammarPage = React.lazy(() => import('pages/Grammar'));
const FavoriteDictionaryPage = React.lazy(() =>
  import('pages/FavoriteDictionary'),
);
const IrregularVerbPage = React.lazy(() => import('pages/IrregularVerb'));
const ForgotPasswordPage = React.lazy(() => import('pages/ForgotPassword'));
const UserAccountPage = React.lazy(() => import('pages/UserAccount'));
const LeaderBoardPage = React.lazy(() => import('pages/LeaderBoard'));
const ClassroomPage = React.lazy(() => import('pages/Classroom'));
const ClassroomDetailPage = React.lazy(() => import('pages/Teacher/ClassroomDetail'));

const CoursePage = React.lazy(() => import('pages/Course'));
const CourseDetailPage = React.lazy(() => import('pages/Course/CourseDetailPage'));
const CourseLearnPage = React.lazy(() => import('pages/Course/CourseLearnPage'));
const TeacherCoursesPage = React.lazy(() => import('pages/Course/TeacherCoursesPage'));
const TeacherCourseDetailPage = React.lazy(() => import('pages/Course/TeacherCourseDetailPage'));
const MyCoursesPage = React.lazy(() => import('pages/Course/MyCoursesPage'));

const WordOrderPage = React.lazy(() => import('pages/PlayGames/WordOrder'));
const FillLettersPage = React.lazy(() => import('pages/PlayGames/FillLetters'));
const MemoryMatchPage = React.lazy(() => import('pages/PlayGames/MemoryMatch'));
const BasketballPage = React.lazy(() => import('pages/PlayGames/BasketballQuiz'));
const MountainPage = React.lazy(() => import('pages/PlayGames/MountainClimb'));
const ListenChoosePage = React.lazy(() => import('pages/PlayGames/ListenChoose'));
const MultiplayerPage = React.lazy(() => import('pages/PlayGames/Multiplayer'));
const TeacherGrammarPage = React.lazy(() => import('pages/Teacher/Grammar'));
const AdminUsersPage = React.lazy(() => import('pages/Admin/Users'));
const StatsPage = React.lazy(() => import('pages/Stats'));
const TeacherGameRoomsPage = React.lazy(() => import('pages/Teacher/GameRooms'));

// routes for app
const routes = [
  {
    path: ROUTES.HOME,
    exact: true,
    isProtect: false,
    component: () => <HomePage />,
  },
  {
    path: ROUTES.LOGIN,
    exact: true,
    isProtect: false,
    component: () => <LoginPage />,
  },
  {
    path: ROUTES.REGISTER,
    exact: true,
    isProtect: false,
    component: () => <RegisterPage />,
  },
  {
    path: ROUTES.IPA,
    exact: true,
    isProtect: false,
    component: () => <IPAPage />,
  },
  {
    path: ROUTES.CONTRIBUTION,
    exact: true,
    isProtect: false,
    component: () => <ContributionPage />,
  },
  {
    path: ROUTES.LOGOUT,
    exact: true,
    isProtect: false,
    component: () => <Logout />,
  },
  {
    path: ROUTES.GAMES.HOME,
    exact: true,
    isProtect: false,
    component: () => <PlayGamesPage />,
  },
  {
    path: ROUTES.GAMES.CORRECT_WORD,
    exact: true,
    isProtect: false,
    component: () => <CorrectWordPage />,
  },
  {
    path: ROUTES.GAMES.WORD_MATCHING,
    exact: true,
    isProtect: false,
    component: () => <WordMatchGamePage />,
  },
  {
    path: ROUTES.FLASHCARD,
    exact: true,
    isProtect: false,
    component: () => <FlashcardPage />,
  },
  {
    path: ROUTES.DYNO_DICTIONARY,
    exact: false,
    isProtect: false,
    component: () => <DynoDictionaryPage isTOEIC={false} />,
  },
  {
    path: ROUTES.TOEIC_DICTIONARY,
    exact: false,
    isProtect: false,
    component: () => <DynoDictionaryPage isTOEIC={true} />,
  },
  {
    path: ROUTES.COMMUNICATION_PHRASE,
    exact: true,
    isProtect: false,
    component: () => <CommunicationPhrasePage />,
  },
  {
    path: ROUTES.GRAMMAR,
    exact: false,
    isProtect: false,
    component: () => <GrammarPage />,
  },
  {
    path: ROUTES.FAVORITE,
    exact: false,
    isProtect: true,
    component: () => <FavoriteDictionaryPage />,
  },
  {
    path: ROUTES.IRREGULAR,
    exact: false,
    isProtect: false,
    component: () => <IrregularVerbPage />,
  },
  {
    path: ROUTES.FORGOT_PASSWORD,
    exact: false,
    isProtect: false,
    component: () => <ForgotPasswordPage />,
  },
  {
    path: ROUTES.USER_ACCOUNT,
    exact: false,
    isProtect: true,
    component: () => <UserAccountPage />,
  },
  {
    path: ROUTES.LEADERBOARD,
    exact: false,
    isProtect: true,
    component: () => <LeaderBoardPage />,
  },
  {
    path: ROUTES.GAMES.FAST_GAME,
    exact: false,
    isProtect: false,
    component: () => <FastGamePage />,
  },
  {
    path: '/classrooms/:id',
    exact: true,
    isProtect: true,
    component: () => <ClassroomDetailPage />,
  },
  {
    path: ROUTES.CLASSROOM,
    exact: false,
    isProtect: true,
    component: () => <ClassroomPage />,
  },
  {
    path: '/courses/:id/learn/:lessonId',
    exact: true,
    isProtect: true,
    component: () => <CourseLearnPage />,
  },
  {
    path: '/courses/:id/detail',
    exact: true,
    isProtect: false,
    component: () => <CourseDetailPage />,
  },
  {
   path: ROUTES.COURSES,
    exact: true,
    isProtect: false,
    component: () => <CoursePage />,
  },
  {
    path: ROUTES.MY_COURSES,
    exact: true,
    isProtect: true,
    component: () => <MyCoursesPage />,
  },
  {
    path: '/teacher/courses/:id',
    exact: true,
    isProtect: true,
    component: () => <TeacherCourseDetailPage />,
  },
  {
    path: '/teacher/courses',
    exact: true,
    isProtect: true,
    component: () => <TeacherCoursesPage />,
  },
  {
    path: ROUTES.GAMES.WORD_ORDER,
    exact: true,
    isProtect: false,
    component: () => <WordOrderPage />,
  },
  {
    path: ROUTES.GAMES.FILL_LETTERS,
    exact: true,
    isProtect: false,
    component: () => <FillLettersPage />,
  },
  {
    path: ROUTES.GAMES.MEMORY_MATCH,
    exact: true,
    isProtect: false,
    component: () => <MemoryMatchPage />,
  },
  {
    path: ROUTES.GAMES.BASKETBALL,
    exact: true,
    isProtect: false,
    component: () => <BasketballPage />,
  },
  {
    path: ROUTES.GAMES.MOUNTAIN,
    exact: true,
    isProtect: false,
    component: () => <MountainPage />,
  },
  {
    path: ROUTES.GAMES.LISTEN_CHOOSE,
    exact: true,
    isProtect: false,
    component: () => <ListenChoosePage />,
  },
  {
    path: ROUTES.GAMES.MULTIPLAYER,
    exact: true,
    isProtect: false,
    component: () => <MultiplayerPage />,
  },
   {
    path: ROUTES.TEACHER.GRAMMAR,
    exact: false,
    isProtect: true,
    component: () => <TeacherGrammarPage />,
  },
  {
    path: ROUTES.TEACHER.GAME_ROOMS,
    exact: false,
    isProtect: true,
    component: () => <TeacherGameRoomsPage />,
  },
  {
    path: ROUTES.ADMIN.USERS,
    exact: false,
    isProtect: true,
    component: () => <AdminUsersPage />,
  },
  {
    path: ROUTES.STATS,
    exact: false,
    isProtect: true,
    component: () => <StatsPage />,
  },
];

const renderRoutes = (routes, isAuth = false) => {
  return routes.map((route, index) => {
    const { path, exact, component, isProtect } = route;
    const loginComponent = () => <LoginPage />;
    const componentRender = !isProtect
      ? component
      : isAuth
      ? component
      : loginComponent;

    return (
      <Route
        path={path}
        exact={exact}
        key={index}
        component={componentRender}
      />
    );
  });
};

export default {
  routes,
  renderRoutes,
};
