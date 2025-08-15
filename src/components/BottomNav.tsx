import { NavLink } from 'react-router-dom';

const BottomNav: React.FC = () => (
  <nav className="navbar is-fixed-bottom">
    <div
      className="navbar-menu is-active is-flex is-justify-content-space-around"
      style={{ width: '100%' }}
    >
      <NavLink
        to="/dashboard"
        className={({ isActive }) =>
          `navbar-item${isActive ? ' has-text-primary' : ''}`
        }
      >
        Home
      </NavLink>
      <NavLink
        to="/translation"
        className={({ isActive }) =>
          `navbar-item${isActive ? ' has-text-primary' : ''}`
        }
      >
        Translation
      </NavLink>
      <NavLink
        to="/users"
        className={({ isActive }) =>
          `navbar-item${isActive ? ' has-text-primary' : ''}`
        }
      >
        Users
      </NavLink>
      <NavLink
        to="/profile"
        className={({ isActive }) =>
          `navbar-item${isActive ? ' has-text-primary' : ''}`
        }
      >
        Profile
      </NavLink>
    </div>
  </nav>
);

export default BottomNav;
