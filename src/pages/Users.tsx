import { useState } from 'react';

type User = { email: string; password: string };

const initialUsers: User[] = [
  { email: 'user1@example.com', password: 'password1' },
  { email: 'user2@example.com', password: 'password2' },
];

const Users: React.FC = () => {
  const [users, setUsers] = useState<User[]>(initialUsers);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const pageSize = 5;
  const [editIndex, setEditIndex] = useState<number | null>(null);
  const [editEmail, setEditEmail] = useState('');
  const [editPassword, setEditPassword] = useState('');
  const [sortBy, setSortBy] = useState<'email' | 'password'>('email');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

  const handleAddUser = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!email || !password) {
      setError('Email and password are required');
      return;
    }
    if (users.some((u) => u.email === email)) {
      setError('Email already exists');
      return;
    }
    setUsers([...users, { email, password }]);
    setEmail('');
    setPassword('');
  };

  const filtered = users.filter(
    (u) =>
      u.email.toLowerCase().includes(search.toLowerCase()) ||
      u.password.toLowerCase().includes(search.toLowerCase())
  );
  const sorted = [...filtered].sort((a, b) => {
    const fieldA = a[sortBy].toLowerCase();
    const fieldB = b[sortBy].toLowerCase();
    if (fieldA < fieldB) return sortOrder === 'asc' ? -1 : 1;
    if (fieldA > fieldB) return sortOrder === 'asc' ? 1 : -1;
    return 0;
  });
  const totalPages = Math.ceil(sorted.length / pageSize);
  const paginated = sorted.slice((page - 1) * pageSize, page * pageSize);

  const handleEdit = (idx: number) => {
    setEditIndex(idx);
    setEditEmail(users[idx].email);
    setEditPassword(users[idx].password);
  };
  const handleEditSave = (idx: number) => {
    const updated = [...users];
    updated[idx] = { email: editEmail, password: editPassword };
    setUsers(updated);
    setEditIndex(null);
  };
  const handleDelete = (idx: number) => {
    setUsers(users.filter((_, i) => i !== idx));
    setEditIndex(null);
  };

  return (
    <section className="section" style={{ maxWidth: 700, margin: '0 auto' }}>
      <h2 className="title">Users Management</h2>
      <form
        onSubmit={handleAddUser}
        className="box"
        style={{ width: '100%', maxWidth: 600, margin: '0 auto' }}
      >
        <div
          className="columns is-vcentered is-mobile"
          style={{ marginBottom: 0 }}
        >
          <div className="column">
            <div className="field mb-0">
              <label className="label" htmlFor="user-email">
                Email
              </label>
              <div className="control">
                <input
                  id="user-email"
                  className="input"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter user email"
                  required
                />
              </div>
            </div>
          </div>
          <div className="column">
            <div className="field mb-0">
              <label className="label" htmlFor="user-password">
                Password
              </label>
              <div className="control">
                <input
                  id="user-password"
                  className="input"
                  type="text"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter password"
                  required
                />
              </div>
            </div>
          </div>
          <div className="column is-narrow">
            <div className="field mb-0" style={{ marginTop: 32 }}>
              <div className="control">
                <button className="button is-primary" type="submit">
                  Add User
                </button>
              </div>
            </div>
          </div>
        </div>
        {error && <div className="notification is-danger mt-3">{error}</div>}
      </form>

      <div className="box">
        <div className="field mb-3">
          <input
            className="input"
            type="text"
            placeholder="Search users..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
          />
        </div>
        <table className="table is-fullwidth is-striped">
          <thead>
            <tr>
              <th
                style={{ cursor: 'pointer' }}
                onClick={() => {
                  setSortBy('email');
                  setSortOrder(
                    sortBy === 'email' && sortOrder === 'asc' ? 'desc' : 'asc'
                  );
                }}
              >
                Email {sortBy === 'email' && (sortOrder === 'asc' ? '▲' : '▼')}
              </th>
              <th
                style={{ cursor: 'pointer' }}
                onClick={() => {
                  setSortBy('password');
                  setSortOrder(
                    sortBy === 'password' && sortOrder === 'asc'
                      ? 'desc'
                      : 'asc'
                  );
                }}
              >
                Password{' '}
                {sortBy === 'password' && (sortOrder === 'asc' ? '▲' : '▼')}
              </th>
              <th>Edit</th>
              <th>Delete</th>
            </tr>
          </thead>
          <tbody>
            {paginated.map((user, idx) => (
              <tr key={user.email}>
                {editIndex === users.indexOf(user) ? (
                  <>
                    <td>
                      <input
                        className="input"
                        value={editEmail}
                        onChange={(e) => setEditEmail(e.target.value)}
                      />
                    </td>
                    <td>
                      <input
                        className="input"
                        value={editPassword}
                        onChange={(e) => setEditPassword(e.target.value)}
                      />
                    </td>
                    <td>
                      <button
                        className="button is-success is-small"
                        onClick={() => handleEditSave(users.indexOf(user))}
                      >
                        Save
                      </button>
                    </td>
                    <td>
                      <button
                        className="button is-light is-small"
                        onClick={() => setEditIndex(null)}
                      >
                        Cancel
                      </button>
                    </td>
                  </>
                ) : (
                  <>
                    <td>{user.email}</td>
                    <td>{user.password}</td>
                    <td>
                      <button
                        className="button is-info is-small"
                        onClick={() => handleEdit(users.indexOf(user))}
                      >
                        Edit
                      </button>
                    </td>
                    <td>
                      <button
                        className="button is-danger is-small"
                        onClick={() => handleDelete(users.indexOf(user))}
                      >
                        Delete
                      </button>
                    </td>
                  </>
                )}
              </tr>
            ))}
          </tbody>
        </table>
        <nav
          className="pagination is-centered"
          role="navigation"
          aria-label="pagination"
        >
          <button
            className="pagination-previous button"
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
          >
            Previous
          </button>
          <button
            className="pagination-next button"
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
          >
            Next
          </button>
          <ul className="pagination-list">
            {Array.from({ length: totalPages }, (_, i) => (
              <li key={i}>
                <button
                  className={`pagination-link button${
                    page === i + 1 ? ' is-current' : ''
                  }`}
                  onClick={() => setPage(i + 1)}
                >
                  {i + 1}
                </button>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </section>
  );
};

export default Users;
