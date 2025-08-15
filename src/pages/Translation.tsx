import { useState } from 'react';

const initialDictionary: { pnar: string; english: string }[] = [
  { pnar: 'salaam', english: 'hello' },
  { pnar: 'kitab', english: 'book' },
  { pnar: 'dost', english: 'friend' },
  // Add more word mappings here
];

const Translation: React.FC = () => {
  const [sortBy, setSortBy] = useState<'pnar' | 'english'>('pnar');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [pnarWord, setPnarWord] = useState('');
  const [englishWord, setEnglishWord] = useState('');
  const [error, setError] = useState('');
  const [dictionary, setDictionary] = useState(initialDictionary);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const pageSize = 5;
  const [editIndex, setEditIndex] = useState<number | null>(null);
  const [editPnar, setEditPnar] = useState('');
  const [editEnglish, setEditEnglish] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    const found = dictionary.find(
      (entry) =>
        entry.pnar.trim().toLowerCase() === pnarWord.trim().toLowerCase()
    );
    if (found) {
      setEnglishWord(found.english);
    } else {
      setEnglishWord('');
      setError('No translation found for this word.');
    }
  };

  const filtered = dictionary.filter(
    (entry) =>
      entry.pnar.toLowerCase().includes(search.toLowerCase()) ||
      entry.english.toLowerCase().includes(search.toLowerCase())
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
    setEditPnar(dictionary[idx].pnar);
    setEditEnglish(dictionary[idx].english);
  };
  const handleEditSave = (idx: number) => {
    const updated = [...dictionary];
    updated[idx] = { pnar: editPnar, english: editEnglish };
    setDictionary(updated);
    setEditIndex(null);
  };
  const handleDelete = (idx: number) => {
    setDictionary(dictionary.filter((_, i) => i !== idx));
    setEditIndex(null);
  };

  return (
    <section className="section" style={{ maxWidth: 600, margin: '0 auto' }}>
      <h2 className="title">Pnar to English Translation</h2>
      <form
        onSubmit={handleSubmit}
        className="box"
        style={{ width: '100%', maxWidth: 600, margin: '0 auto' }}
      >
        <div
          className="columns is-vcentered is-mobile"
          style={{ marginBottom: 0 }}
        >
          <div className="column">
            <div className="field mb-0">
              <label className="label" htmlFor="pnar-word">
                Pnar Word
              </label>
              <div className="control">
                <input
                  id="pnar-word"
                  className="input"
                  type="text"
                  value={pnarWord}
                  onChange={(e) => setPnarWord(e.target.value)}
                  placeholder="Enter a Pnar word"
                  required
                />
              </div>
            </div>
          </div>
          <div className="column">
            <div className="field mb-0">
              <label className="label" htmlFor="english-word">
                English Word
              </label>
              <div className="control">
                <input
                  id="english-word"
                  className="input"
                  type="text"
                  value={englishWord}
                  onChange={(e) => setEnglishWord(e.target.value)}
                  placeholder="English translation will appear here"
                  readOnly={false}
                />
              </div>
            </div>
          </div>
          <div className="column is-narrow">
            <div className="field mb-0" style={{ marginTop: 32 }}>
              <div className="control">
                <button className="button is-primary" type="submit">
                  Translate
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
            placeholder="Search dictionary..."
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
                  setSortBy('pnar');
                  setSortOrder(
                    sortBy === 'pnar' && sortOrder === 'asc' ? 'desc' : 'asc'
                  );
                }}
              >
                Pnar {sortBy === 'pnar' && (sortOrder === 'asc' ? '▲' : '▼')}
              </th>
              <th
                style={{ cursor: 'pointer' }}
                onClick={() => {
                  setSortBy('english');
                  setSortOrder(
                    sortBy === 'english' && sortOrder === 'asc' ? 'desc' : 'asc'
                  );
                }}
              >
                English{' '}
                {sortBy === 'english' && (sortOrder === 'asc' ? '▲' : '▼')}
              </th>
              <th>Edit</th>
              <th>Delete</th>
            </tr>
          </thead>
          <tbody>
            {paginated.map((entry, idx) => (
              <tr key={idx}>
                {editIndex === dictionary.indexOf(entry) ? (
                  <>
                    <td>
                      <input
                        className="input"
                        value={editPnar}
                        onChange={(e) => setEditPnar(e.target.value)}
                      />
                    </td>
                    <td>
                      <input
                        className="input"
                        value={editEnglish}
                        onChange={(e) => setEditEnglish(e.target.value)}
                      />
                    </td>
                    <td>
                      <button
                        className="button is-success is-small"
                        onClick={() =>
                          handleEditSave(dictionary.indexOf(entry))
                        }
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
                    <td>{entry.pnar}</td>
                    <td>{entry.english}</td>
                    <td>
                      <button
                        className="button is-info is-small"
                        onClick={() => handleEdit(dictionary.indexOf(entry))}
                      >
                        Edit
                      </button>
                    </td>
                    <td>
                      <button
                        className="button is-danger is-small"
                        onClick={() => handleDelete(dictionary.indexOf(entry))}
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

export default Translation;
