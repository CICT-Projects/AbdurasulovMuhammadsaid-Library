import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';

const API_BASE_URL = 'http://localhost:5148/api';

export default function AuthorDetail() {
  const { id } = useParams();
  const [author, setAuthor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchAuthor = async () => {
      try {
        setLoading(true);
        const res = await fetch(`${API_BASE_URL}/authors/${id}`);
        if (!res.ok) throw new Error('Автор не найден или ошибка сервера');
        const data = await res.json();
        setAuthor(data);
        setError('');
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchAuthor();
  }, [id]);

  if (loading) return <p>Загрузка...</p>;
  if (error) return (
    <div>
      <p className="error">{error}</p>
      <Link to="/authors">← Назад к списку авторов</Link>
    </div>
  );

  return (
    <div className="detail-container">
      <h1>Автор: {author.name}</h1>
      <p>Страна: {author.country}</p>

      {author.books && author.books.length > 0 ? (
        <div>
          <h3>Книги:</h3>
          <ul>
            {author.books.map((b) => (
              <li key={b.id}>
                <Link to={`/books/${b.id}`}>{b.title}</Link>
              </li>
            ))}
          </ul>
        </div>
      ) : (
        <p>У этого автора нет книг в списке.</p>
      )}

      <Link to="/authors">← Назад к списку авторов</Link>
    </div>
  );
}

