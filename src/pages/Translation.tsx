import { useState, useEffect, useMemo } from "react";
import { FaEdit, FaTrash, FaPlus, FaSearch } from "react-icons/fa";
import { useAppSelector } from "../redux/hooks";
import { useApi, useForm } from "../hooks";
import { dictionaryService, type CreateDictionaryEntry } from "../api/services";
import type { DictionaryEntry, PaginationParams } from "../models";
import { PAGINATION, PARTS_OF_SPEECH } from "../constants";
import { debounce } from "../utils";

interface DictionaryFormData extends CreateDictionaryEntry {}

const Translation: React.FC = () => {
  const [activeTab, setActiveTab] = useState<"list" | "add">("list");
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState<PaginationParams>({
    page: PAGINATION.DEFAULT_PAGE,
    per_page: PAGINATION.DEFAULT_PER_PAGE,
  });

  const accessToken = useAppSelector(
    (state) =>
      state.authUser.accessToken || sessionStorage.getItem("accessToken") || ""
  );

  // API hooks
  const dictionaryApi = useApi(dictionaryService.getEntries);
  const createApi = useApi(dictionaryService.createEntry);
  const deleteApi = useApi(dictionaryService.deleteEntry);

  // Form for adding new entries
  const { values, formState, handleChange, handleSubmit, reset } =
    useForm<DictionaryFormData>({
      initialValues: {
        pnar_word: "",
        english_word: "",
        part_of_speech: "",
        definition: "",
        example_pnar: "",
        example_english: "",
        difficulty_level: 1,
        usage_frequency: 0,
        cultural_context: "",
        related_words: "",
        pronunciation: "",
        etymology: "",
      },
      validate: (values) => {
        const errors: Record<string, string> = {};
        if (!values.pnar_word.trim())
          errors.pnar_word = "Pnar word is required";
        if (!values.english_word.trim())
          errors.english_word = "English word is required";
        return errors;
      },
      onSubmit: async (values) => {
        const result = await createApi.execute(values, accessToken);
        if (result) {
          reset();
          setActiveTab("list");
          // Refresh the dictionary list
          fetchDictionary();
        }
      },
    });

  // Helper function for difficulty level styling
  const getDifficultyLevelClass = (level?: number): string => {
    switch (level) {
      case 1:
        return "is-success";
      case 2:
        return "is-warning";
      case 3:
        return "is-danger";
      default:
        return "is-dark";
    }
  };

  // Debounced search
  const debouncedSearch = useMemo(
    () =>
      debounce((term: string) => {
        setFilters((prev) => ({ ...prev, page: 1 }));
        fetchDictionary(term);
      }, 500),
    [accessToken]
  );

  const fetchDictionary = async (search?: string) => {
    await dictionaryApi.execute(
      { ...filters, search: search ?? searchTerm },
      accessToken
    );
  };

  const handleDelete = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this entry?")) {
      const result = await deleteApi.execute(id, accessToken);
      if (result) {
        fetchDictionary();
      }
    }
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);
    debouncedSearch(value);
  };

  const handlePageChange = (newPage: number) => {
    setFilters((prev) => ({ ...prev, page: newPage }));
  };

  useEffect(() => {
    if (accessToken) {
      fetchDictionary();
    }
  }, [filters, accessToken]);

  const { data: dictionaryData, loading, error } = dictionaryApi;
  const entries = dictionaryData?.data || [];
  const pagination = dictionaryData?.pagination;

  return (
    <section className="section" style={{ maxWidth: 800, margin: "0 auto" }}>
      <div className="container">
        <h1 className="title is-2 has-text-centered mb-6">
          Pnar Dictionary Management
        </h1>

        <div className="box">
          {/* Tab Navigation */}
          <div className="tabs is-toggle is-fullwidth mb-5">
            <ul>
              <li className={activeTab === "list" ? "is-active" : ""}>
                <button
                  className="button is-fullwidth is-borderless"
                  onClick={() => setActiveTab("list")}
                  type="button"
                >
                  <span className="icon is-small">
                    <FaSearch />
                  </span>
                  <span>Dictionary List</span>
                </button>
              </li>
              <li className={activeTab === "add" ? "is-active" : ""}>
                <button
                  className="button is-fullwidth is-borderless"
                  onClick={() => setActiveTab("add")}
                  type="button"
                >
                  <span className="icon is-small">
                    <FaPlus />
                  </span>
                  <span>Add Translation</span>
                </button>
              </li>
            </ul>
          </div>

          {/* Error Display */}
          {(error || createApi.error || deleteApi.error) && (
            <div className="notification is-danger">
              {error || createApi.error || deleteApi.error}
            </div>
          )}

          {/* Dictionary List Tab */}
          {activeTab === "list" && (
            <div>
              {/* Search */}
              <div className="field mb-4">
                <div className="control has-icons-left">
                  <input
                    className="input"
                    type="text"
                    placeholder="Search dictionary entries..."
                    value={searchTerm}
                    onChange={handleSearchChange}
                  />
                  <span className="icon is-left">
                    <FaSearch />
                  </span>
                </div>
              </div>

              {/* Loading State */}
              {loading && (
                <div className="notification is-info">
                  <progress className="progress is-primary" max="100">
                    Loading...
                  </progress>
                </div>
              )}

              {/* Dictionary Table */}
              {!loading && entries.length > 0 && (
                <>
                  <div className="table-container">
                    <table className="table is-fullwidth is-striped is-hoverable">
                      <thead>
                        <tr>
                          <th>Pnar Word</th>
                          <th>English Word</th>
                          <th>Part of Speech</th>
                          <th>Definition</th>
                          <th>Difficulty</th>
                          <th>Verified</th>
                          <th>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {entries.map((entry: DictionaryEntry) => (
                          <tr key={entry.id}>
                            <td className="has-text-weight-semibold">
                              {entry.pnar_word}
                            </td>
                            <td>{entry.english_word}</td>
                            <td>
                              <span className="tag is-light">
                                {entry.part_of_speech || "N/A"}
                              </span>
                            </td>
                            <td>{entry.definition || "N/A"}</td>
                            <td>
                              <span
                                className={`tag ${getDifficultyLevelClass(
                                  entry.difficulty_level
                                )}`}
                              >
                                Level {entry.difficulty_level || 1}
                              </span>
                            </td>
                            <td>
                              <span
                                className={`tag ${
                                  entry.verified ? "is-success" : "is-warning"
                                }`}
                              >
                                {entry.verified ? "Verified" : "Pending"}
                              </span>
                            </td>
                            <td>
                              <div className="buttons are-small">
                                <button
                                  className="button is-info"
                                  title="Edit entry"
                                >
                                  <FaEdit />
                                </button>
                                <button
                                  className="button is-danger"
                                  onClick={() => handleDelete(entry.id)}
                                  disabled={deleteApi.loading}
                                  title="Delete entry"
                                >
                                  <FaTrash />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {/* Pagination */}
                  {pagination && pagination.pages > 1 && (
                    <nav
                      className="pagination is-centered mt-5"
                      role="navigation"
                    >
                      <button
                        className="pagination-previous button"
                        onClick={() => handlePageChange(pagination.page - 1)}
                        disabled={pagination.page === 1}
                      >
                        Previous
                      </button>
                      <button
                        className="pagination-next button"
                        onClick={() => handlePageChange(pagination.page + 1)}
                        disabled={pagination.page === pagination.pages}
                      >
                        Next
                      </button>
                      <ul className="pagination-list">
                        {Array.from(
                          { length: Math.min(pagination.pages, 5) },
                          (_, i) => {
                            const pageNum =
                              i + Math.max(1, pagination.page - 2);
                            return (
                              <li key={pageNum}>
                                <button
                                  className={`pagination-link button ${
                                    pagination.page === pageNum
                                      ? "is-current"
                                      : ""
                                  }`}
                                  onClick={() => handlePageChange(pageNum)}
                                >
                                  {pageNum}
                                </button>
                              </li>
                            );
                          }
                        )}
                      </ul>
                    </nav>
                  )}
                </>
              )}

              {/* Empty State */}
              {!loading && entries.length === 0 && (
                <div className="notification is-info">
                  <div className="has-text-centered">
                    <p className="title is-5">No entries found</p>
                    <p className="subtitle is-6">
                      {searchTerm
                        ? "Try a different search term"
                        : "Start by adding some dictionary entries"}
                    </p>
                  </div>
                </div>
              )}
            </div>
          )}
          {/* Add Translation Tab */}
          {activeTab === "add" && (
            <form onSubmit={handleSubmit}>
              <h3 className="subtitle is-4 mb-4">Add New Dictionary Entry</h3>

              <div className="columns is-multiline">
                {/* Required Fields */}
                <div className="column is-half">
                  <div className="field">
                    <label className="label" htmlFor="pnar_word">
                      Pnar Word <span className="has-text-danger">*</span>
                    </label>
                    <div className="control">
                      <input
                        id="pnar_word"
                        className={`input ${
                          formState.errors.pnar_word ? "is-danger" : ""
                        }`}
                        type="text"
                        placeholder="Enter Pnar word"
                        value={values.pnar_word}
                        onChange={(e) =>
                          handleChange("pnar_word", e.target.value)
                        }
                      />
                    </div>
                    {formState.errors.pnar_word && (
                      <p className="help is-danger">
                        {formState.errors.pnar_word}
                      </p>
                    )}
                  </div>
                </div>

                <div className="column is-half">
                  <div className="field">
                    <label className="label" htmlFor="english_word">
                      English Word <span className="has-text-danger">*</span>
                    </label>
                    <div className="control">
                      <input
                        id="english_word"
                        className={`input ${
                          formState.errors.english_word ? "is-danger" : ""
                        }`}
                        type="text"
                        placeholder="Enter English translation"
                        value={values.english_word}
                        onChange={(e) =>
                          handleChange("english_word", e.target.value)
                        }
                      />
                    </div>
                    {formState.errors.english_word && (
                      <p className="help is-danger">
                        {formState.errors.english_word}
                      </p>
                    )}
                  </div>
                </div>

                {/* Optional Fields */}
                <div className="column is-half">
                  <div className="field">
                    <label className="label" htmlFor="part_of_speech">
                      Part of Speech
                    </label>
                    <div className="control">
                      <div className="select is-fullwidth">
                        <select
                          id="part_of_speech"
                          value={values.part_of_speech}
                          onChange={(e) =>
                            handleChange("part_of_speech", e.target.value)
                          }
                        >
                          <option value="">Select part of speech</option>
                          {PARTS_OF_SPEECH.map((pos) => (
                            <option key={pos} value={pos}>
                              {pos.charAt(0).toUpperCase() + pos.slice(1)}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="column is-half">
                  <div className="field">
                    <label className="label" htmlFor="difficulty_level">
                      Difficulty Level
                    </label>
                    <div className="control">
                      <div className="select is-fullwidth">
                        <select
                          id="difficulty_level"
                          value={values.difficulty_level}
                          onChange={(e) =>
                            handleChange(
                              "difficulty_level",
                              Number(e.target.value)
                            )
                          }
                        >
                          <option value={1}>Beginner (1)</option>
                          <option value={2}>Intermediate (2)</option>
                          <option value={3}>Advanced (3)</option>
                          <option value={4}>Expert (4)</option>
                        </select>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="column is-full">
                  <div className="field">
                    <label className="label" htmlFor="definition">
                      Definition
                    </label>
                    <div className="control">
                      <textarea
                        id="definition"
                        className="textarea"
                        placeholder="Enter definition"
                        value={values.definition}
                        onChange={(e) =>
                          handleChange("definition", e.target.value)
                        }
                        rows={3}
                      />
                    </div>
                  </div>
                </div>

                <div className="column is-half">
                  <div className="field">
                    <label className="label" htmlFor="example_pnar">
                      Example (Pnar)
                    </label>
                    <div className="control">
                      <textarea
                        id="example_pnar"
                        className="textarea"
                        placeholder="Example in Pnar"
                        value={values.example_pnar}
                        onChange={(e) =>
                          handleChange("example_pnar", e.target.value)
                        }
                        rows={2}
                      />
                    </div>
                  </div>
                </div>

                <div className="column is-half">
                  <div className="field">
                    <label className="label" htmlFor="example_english">
                      Example (English)
                    </label>
                    <div className="control">
                      <textarea
                        id="example_english"
                        className="textarea"
                        placeholder="Example in English"
                        value={values.example_english}
                        onChange={(e) =>
                          handleChange("example_english", e.target.value)
                        }
                        rows={2}
                      />
                    </div>
                  </div>
                </div>

                <div className="column is-half">
                  <div className="field">
                    <label className="label" htmlFor="pronunciation">
                      Pronunciation
                    </label>
                    <div className="control">
                      <input
                        id="pronunciation"
                        className="input"
                        type="text"
                        placeholder="Phonetic pronunciation"
                        value={values.pronunciation}
                        onChange={(e) =>
                          handleChange("pronunciation", e.target.value)
                        }
                      />
                    </div>
                  </div>
                </div>

                <div className="column is-half">
                  <div className="field">
                    <label className="label" htmlFor="usage_frequency">
                      Usage Frequency
                    </label>
                    <div className="control">
                      <input
                        id="usage_frequency"
                        className="input"
                        type="number"
                        min="0"
                        max="100"
                        placeholder="0-100"
                        value={values.usage_frequency}
                        onChange={(e) =>
                          handleChange(
                            "usage_frequency",
                            Number(e.target.value)
                          )
                        }
                      />
                    </div>
                  </div>
                </div>

                <div className="column is-half">
                  <div className="field">
                    <label className="label" htmlFor="cultural_context">
                      Cultural Context
                    </label>
                    <div className="control">
                      <input
                        id="cultural_context"
                        className="input"
                        type="text"
                        placeholder="Cultural or regional context"
                        value={values.cultural_context}
                        onChange={(e) =>
                          handleChange("cultural_context", e.target.value)
                        }
                      />
                    </div>
                  </div>
                </div>

                <div className="column is-half">
                  <div className="field">
                    <label className="label" htmlFor="related_words">
                      Related Words
                    </label>
                    <div className="control">
                      <input
                        id="related_words"
                        className="input"
                        type="text"
                        placeholder="Comma-separated related words"
                        value={values.related_words}
                        onChange={(e) =>
                          handleChange("related_words", e.target.value)
                        }
                      />
                    </div>
                  </div>
                </div>

                <div className="column is-full">
                  <div className="field">
                    <label className="label" htmlFor="etymology">
                      Etymology
                    </label>
                    <div className="control">
                      <textarea
                        id="etymology"
                        className="textarea"
                        placeholder="Word origin and history"
                        value={values.etymology}
                        onChange={(e) =>
                          handleChange("etymology", e.target.value)
                        }
                        rows={2}
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="field is-grouped mt-5">
                <div className="control">
                  <button
                    className={`button is-primary ${
                      formState.isSubmitting ? "is-loading" : ""
                    }`}
                    type="submit"
                    disabled={formState.isSubmitting}
                  >
                    <span className="icon is-small">
                      <FaPlus />
                    </span>
                    <span>Add Entry</span>
                  </button>
                </div>
                <div className="control">
                  <button
                    className="button is-light"
                    type="button"
                    onClick={reset}
                    disabled={formState.isSubmitting}
                  >
                    Reset Form
                  </button>
                </div>
              </div>
            </form>
          )}
        </div>
      </div>
    </section>
  );
};

export default Translation;
