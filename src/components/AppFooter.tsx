import { Link } from 'react-router-dom';

const PublicFooter: React.FC = () => (
  <footer className="has-background-light p-4">
    <div className="content has-text-centered">
      <nav>
        <Link to="/about" className="mx-2">
          About
        </Link>
        <Link to="/contact" className="mx-2">
          Contact
        </Link>
        <Link to="/privacy" className="mx-2">
          Privacy
        </Link>
        <Link to="/terms" className="mx-2">
          T&amp;C
        </Link>
        <Link to="/legal" className="mx-2">
          Legal
        </Link>
      </nav>
      <div style={{ fontSize: '0.9em', color: '#888' }}>
        &copy; {new Date().getFullYear()} PNAR World. All rights reserved.
      </div>
    </div>
  </footer>
);

export default PublicFooter;
