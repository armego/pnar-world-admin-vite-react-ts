import { Suspense, useCallback } from "react";
import {
  Routes,
  Route,
  Navigate,
  useNavigate,
  useLocation,
} from "react-router-dom";
import { ROUTES } from "./routes";
import { AppFooter, AppHeader, BottomNav } from "./components";
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
} from "./pages";
import { useAppDispatch, useAppSelector } from "./redux/hooks";
import { resetAuthInfo } from "./redux/slice/authSlice";
import { STORAGE_KEYS } from "./constants";
import "./App.css";

// Loading component
const LoadingSpinner = () => (
  <div className="section">
    <div className="container has-text-centered">
      <progress className="progress is-primary" max="100">
        Loading...
      </progress>
    </div>
  </div>
);

const App: React.FC = () => {
  const { accessToken } = useAppSelector((state) => state.authUser);
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useAppDispatch();

  const handleHeaderBtnClick = useCallback(() => {
    if (accessToken) {
      // Clear all auth-related storage
      sessionStorage.removeItem(STORAGE_KEYS.ACCESS_TOKEN);
      sessionStorage.removeItem(STORAGE_KEYS.REFRESH_TOKEN);
      sessionStorage.removeItem(STORAGE_KEYS.EXPIRES_IN);

      // Reset Redux state
      dispatch(resetAuthInfo());
    }
    navigate(ROUTES.LOGIN);
  }, [accessToken, dispatch, navigate]);

  const isAuthenticated = Boolean(accessToken);
  const showHeader = location.pathname !== ROUTES.LOGIN;

  return (
    <div className="app">
      <AppHeader
        isAuthenticated={isAuthenticated}
        isVisible={showHeader}
        onBtnClick={handleHeaderBtnClick}
      />

      <main className="main-content">
        <Suspense fallback={<LoadingSpinner />}>
          <Routes>
            {/* Public routes */}
            <Route path={ROUTES.LOGIN} element={<Login />} />
            <Route path={ROUTES.ABOUT} element={<About />} />
            <Route path={ROUTES.CONTACT} element={<Contact />} />
            <Route path={ROUTES.PRIVACY} element={<Privacy />} />
            <Route path={ROUTES.TERMS} element={<Terms />} />
            <Route path={ROUTES.COPYRIGHT} element={<Copyright />} />
            <Route path={ROUTES.LEGAL} element={<Legal />} />

            {/* Protected routes */}
            {isAuthenticated ? (
              <>
                <Route path={ROUTES.DASHBOARD} element={<Dashboard />} />
                <Route path={ROUTES.PROFILE} element={<Profile />} />
                <Route path={ROUTES.TRANSLATION} element={<Translation />} />
                <Route path={ROUTES.USERS} element={<Users />} />
              </>
            ) : (
              // Redirect unauthenticated users to login
              <Route
                path="*"
                element={<Navigate to={ROUTES.LOGIN} replace />}
              />
            )}

            {/* Fallback route */}
            <Route
              path="*"
              element={
                <Navigate
                  to={isAuthenticated ? ROUTES.DASHBOARD : ROUTES.LOGIN}
                  replace
                />
              }
            />
          </Routes>
        </Suspense>
      </main>

      {/* Footer/Navigation */}
      {isAuthenticated ? <BottomNav /> : showHeader && <AppFooter />}
    </div>
  );
};

export default App;
