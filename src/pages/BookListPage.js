import { useState, useEffect } from 'react';

const API_BASE = process.env.REACT_APP_API_BASE_URL || 'http://localhost:8088/api';
const API_SEARCH_URL = `${API_BASE.replace(/\/$/, '')}/search`;

function BookListPage() {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;
    async function fetchBooks() {
      try {
        setLoading(true);
        setError(null);
        const res = await fetch(API_SEARCH_URL);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();
        if (!cancelled) setBooks(Array.isArray(data) ? data : []);
      } catch (e) {
        if (!cancelled) setError(e.message || '도서 목록을 불러오지 못했습니다.');
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    fetchBooks();
    return () => { cancelled = true; };
  }, []);

  if (loading) {
    return (
      <div className="book-list-page">
        <div className="book-list-header">
          <h1>도서 검색</h1>
        </div>
        <div className="book-list-loading">목록을 불러오는 중…</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="book-list-page">
        <div className="book-list-header">
          <h1>도서 검색</h1>
        </div>
        <div className="book-list-error">
          <p>{error}</p>
          <p className="book-list-error-hint">API 서버({API_BASE})가 실행 중인지 확인해 주세요.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="book-list-page">
      <div className="book-list-header">
        <h1>도서 검색</h1>
        <p className="book-list-count">총 {books.length}권</p>
      </div>
      <ul className="book-list">
        {books.map((book) => (
          <li key={book.id} className="book-card">
            <div className="book-card-main">
              <h2 className="book-title">{book.title}</h2>
              <p className="book-author">{book.author}</p>
              <p className="book-meta">
                {book.publisher}
                {book.publishedDate && ` · ${book.publishedDate}`}
              </p>
            </div>
            {book.description && (
              <p className="book-description">{book.description}</p>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default BookListPage;
