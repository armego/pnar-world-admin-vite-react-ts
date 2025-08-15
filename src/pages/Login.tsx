import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ENDPOINT } from '../api/endpoint';
import { consumeApi } from '../api';
import { ROUTES } from '../routes';
import { useAppDispatch } from '../redux/hooks';
import { setAuthInfo } from '../redux/slice/authSlice';
import { STORAGE_KEYS } from '../constants';

const Login: React.FC = () => {
  const [payload, setPayload] = useState({
    email: 'user@example.com',
    password: 'securepassword123',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    if (Object.values(payload).some((x) => !x)) {
      setError('Email and password are required');
      setLoading(false);
      return;
    }
    try {
      const {data} = await consumeApi(ENDPOINT.LOGIN, 'POST', payload);
      if (!data) {
        setError('Login failed');
        return;
      }
      // Save token or user info as needed
      sessionStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, data.access_token);
      dispatch(
        setAuthInfo({
          user: data.user,
          accessToken: data.access_token,
          refreshToken: data.refresh_token,
          expiresIn: data.expires_in
        })
      );
      setLoading(false);
      navigate(ROUTES.DASHBOARD);
    } catch (err) {
      setLoading(false);
      setError('Network error. Please try again.' + err);
    }
  };

  return (
    <section
      className="section is-flex is-flex-direction-column is-justify-content-center is-align-items-center"
      data-login-page
    >
      <div className="box" style={{ minWidth: 320 }}>
        <h1 className="title has-text-centered">Login</h1>
        <form onSubmit={handleSubmit}>
          <div className="field">
            <label className="label" htmlFor="email">
              Email
            </label>
            <div className="control">
              <input
                id="email"
                className="input"
                type="email"
                value={payload.email}
                onChange={(e) =>
                  setPayload({ ...payload, email: e.target.value })
                }
                required
              />
            </div>
          </div>
          <div className="field">
            <label className="label" htmlFor="password">
              Password
            </label>
            <div className="control">
              <input
                id="password"
                className="input"
                type="password"
                value={payload.password}
                onChange={(e) =>
                  setPayload({ ...payload, password: e.target.value })
                }
                required
              />
            </div>
          </div>
          {error && <p className="has-text-danger">{error}</p>}
          <div className="field mt-4">
            <button
              className={`button is-primary is-fullwidth ${
                loading ? 'is-loading' : ''
              }`}
              type="submit"
              disabled={!payload.email || !payload.password}
            >
              Login
            </button>
          </div>
        </form>
      </div>
    </section>
  );
};

export default Login;
