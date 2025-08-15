interface AppHeaderProps {
  isAuthenticated: boolean;
  isVisible: boolean;
  onBtnClick: () => void;
}

const AppHeader: React.FC<AppHeaderProps> = ({
  isAuthenticated,
  isVisible,
  onBtnClick,
}) => (
  <header className="navbar is-light has-shadow">
    <div className="container is-fluid">
      <div className="is-flex is-align-items-center" style={{ width: '100%' }}>
        <span className="navbar-item has-text-weight-bold is-size-5">
          Pnar World
        </span>
        <div style={{ flex: 1 }}></div>
        {isVisible && (
          <button className="button is-light" onClick={onBtnClick}>
            {isAuthenticated ? 'Logout' : 'Login'}
          </button>
        )}
      </div>
    </div>
  </header>
);

export default AppHeader;
