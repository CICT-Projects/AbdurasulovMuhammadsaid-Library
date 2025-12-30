﻿﻿import { useState, useEffect } from 'react';

const API_BASE_URL = 'http://localhost:5148/api';

export default function Authors() {
  const [authors, setAuthors] = useState([]);
  const [name, setName] = useState('');
  const [country, setCountry] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [editingId, setEditingId] = useState(null);

  // Загрузка списка авторов
  useEffect(() => {
    fetchAuthors();
  }, []);

  const fetchAuthors = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/authors`);
      if (!response.ok) throw new Error('Ошибка загрузки авторов');
      const data = await response.json();
      setAuthors(data);
      setError('');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleAddOrUpdateAuthor = async (e) => {
    e.preventDefault();
    
    if (!name.trim() || !country.trim()) {
      setError('Заполните все поля');
      return;
    }

    try {
      const authorData = { name, country };

      if (editingId) {
        // Обновление
        const response = await fetch(`${API_BASE_URL}/authors/${editingId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id: editingId, ...authorData })
        });
        if (!response.ok) throw new Error('Ошибка обновления автора');
      } else {
        // Создание
        const response = await fetch(`${API_BASE_URL}/authors`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(authorData)
        });
        if (!response.ok) throw new Error('Ошибка добавления автора');
      }
      
      setName('');
      setCountry('');
      setEditingId(null);
      setError('');
      await fetchAuthors();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleEditAuthor = (author) => {
    setEditingId(author.id);
    setName(author.name);
    setCountry(author.country);
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setName('');
    setCountry('');
  };

  const handleDeleteAuthor = async (id) => {
    try {
      const response = await fetch(`${API_BASE_URL}/authors/${id}`, {
        method: 'DELETE'
      });

      if (!response.ok) throw new Error('Ошибка удаления автора');
      await fetchAuthors();
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="authors-container">
      <h1>✍️ Авторы</h1>

      {error && <div className="error">{error}</div>}

      <form onSubmit={handleAddOrUpdateAuthor} className="form">
        <div className="form-group">
          <label htmlFor="name">Имя:</label>
          <input
            id="name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Введите имя автора"
          />
        </div>
        <div className="form-group">
          <label htmlFor="country">Страна:</label>
          <input
            id="country"
            type="text"
            value={country}
            onChange={(e) => setCountry(e.target.value)}
            placeholder="Введите страну"
          />
        </div>
        <div className="form-actions">
          <button type="submit">
            {editingId ? 'Обновить автора' : 'Добавить автора'}
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
          {authors.length === 0 ? (
            <p>Нет авторов</p>
          ) : (
            <ul>
              {authors.map((author) => (
                <li key={author.id} className={editingId === author.id ? 'editing' : ''}>
                  <span>
                    <strong>{author.name}</strong> из {author.country}
                  </span>
                  <div className="author-actions">
                    <button
                      onClick={() => handleEditAuthor(author)}
                      className="edit-btn"
                    >
                      ✏️ Редактировать
                    </button>
                    <button
                      onClick={() => handleDeleteAuthor(author.id)}
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

