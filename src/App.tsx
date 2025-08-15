import {
  Routes,
  Route,
  Navigate,
  useNavigate,
  useLocation,
} from 'react-router-dom';
import { ROUTES } from './routes';
import { AppFooter, AppHeader, BottomNav } from './components';
import {
  About,
  Contact,
  Copyright,
  Dashboard,
  Legal,
  Login,
  Privacy,
  Profile,
  Terms,
  Translation,
  Users,
} from './pages';
import { useAppDispatch, useAppSelector } from './redux/hooks';
import './App.css';
import { resetAuthInfo } from './redux/slice/authSlice';

const App: React.FC = () => {
  const { accessToken } = useAppSelector((state) => state.authUser);
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useAppDispatch();

  function handleHeaderBtnClick() {
    if (accessToken) {
      // Call logout API
      sessionStorage.clear();
      dispatch(resetAuthInfo());
    }
    navigate('/'); // Redirect to login page
  }

  return (
    <>
      <AppHeader
        isAuthenticated={accessToken !== ''}
        isVisible={location.pathname !== '/'}
        onBtnClick={handleHeaderBtnClick}
      />
      <Routes>
        <Route path={ROUTES.LOGIN} element={<Login />} />
        <Route path={ROUTES.ABOUT} element={<About />} />
        <Route path={ROUTES.CONTACT} element={<Contact />} />
        <Route path={ROUTES.PRIVACY} element={<Privacy />} />
        <Route path={ROUTES.TERMS} element={<Terms />} />
        <Route path={ROUTES.COPYRIGHT} element={<Copyright />} />
        <Route path={ROUTES.LEGAL} element={<Legal />} />
        {accessToken && (
          <>
            <Route path={ROUTES.DASHBOARD} element={<Dashboard />} />
            <Route path={ROUTES.PROFILE} element={<Profile />} />
            <Route path={ROUTES.TRANSLATION} element={<Translation />} />
            <Route path={ROUTES.USERS} element={<Users />} />
          </>
        )}
        <Route path="*" element={<Navigate to={ROUTES.LOGIN} replace />} />
      </Routes>
      {accessToken ? <BottomNav /> : <AppFooter />}
    </>
  );
};

export default App;
