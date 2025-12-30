import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const API_BASE_URL = 'http://localhost:5148/api';

export default function Books() {
  const [books, setBooks] = useState([]);
  const [title, setTitle] = useState('');
  const [year, setYear] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [editingId, setEditingId] = useState(null);

  // Загрузка списка книг
  useEffect(() => {
    fetchBooks();
  }, []);

  const fetchBooks = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/books`);
      if (!response.ok) throw new Error('Ошибка загрузки книг');
      const data = await response.json();
      setBooks(data);
      setError('');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };


  const handleAddOrUpdateBook = async (e) => {
    e.preventDefault();
    
    if (!title.trim() || !year) {
      setError('Заполните все поля');
      return;
    }

    try {
      const bookData = { 
        title, 
        year: parseInt(year)
      };

      if (editingId) {
        // Обновление
        const response = await fetch(`${API_BASE_URL}/books/${editingId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id: editingId, ...bookData })
        });
        if (!response.ok) throw new Error('Ошибка обновления книги');
      } else {
        // Создание
        const response = await fetch(`${API_BASE_URL}/books`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(bookData)
        });
        if (!response.ok) throw new Error('Ошибка добавления книги');
      }
      
      setTitle('');
      setYear('');
      setEditingId(null);
      setError('');
      await fetchBooks();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleEditBook = (book) => {
    setEditingId(book.id);
    setTitle(book.title);
    setYear(book.year);
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setTitle('');
    setYear('');
  };

  const handleDeleteBook = async (id) => {
    try {
      const response = await fetch(`${API_BASE_URL}/books/${id}`, {
        method: 'DELETE'
      });

      if (!response.ok) throw new Error('Ошибка удаления книги');
      await fetchBooks();
    } catch (err) {
      setError(err.message);
    }
  };


  return (
    <div className="books-container">
      <h1>📚 Книги</h1>

      {error && <div className="error">{error}</div>}

      <form onSubmit={handleAddOrUpdateBook} className="form">
        <div className="form-group">
          <label htmlFor="title">Название:</label>
          <input
            id="title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Введите название книги"
          />
        </div>
        <div className="form-group">
          <label htmlFor="year">Год:</label>
          <input
            id="year"
            type="number"
            value={year}
            onChange={(e) => setYear(e.target.value)}
            placeholder="Введите год издания"
          />
        </div>
        <div className="form-actions">
          <button type="submit">
            {editingId ? 'Обновить книгу' : 'Добавить книгу'}
          </button>
          {editingId && (
            <button type="button" onClick={handleCancelEdit} className="cancel-btn">
              Отменить
            </button>
          )}
        </div>
      </form>

      {loading ? (
        <p>Загрузка...</p>
      ) : (
        <div className="list">
          {books.length === 0 ? (
            <p>Нет книг</p>
          ) : (
            <ul>
              {books.map((book) => (
                <li key={book.id} className={editingId === book.id ? 'editing' : ''}>
                  <span>
                    <strong><Link to={`/books/${book.id}`}>{book.title}</Link></strong> ({book.year})
                  </span>
                  <div className="book-actions">
                    <button
                      onClick={() => handleEditBook(book)}
                      className="edit-btn"
                    >
                      ✏️ Редактировать
                    </button>
                    <button
                      onClick={() => handleDeleteBook(book.id)}
                      className="delete-btn"
                    >
                      🗑️ Удалить
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}
