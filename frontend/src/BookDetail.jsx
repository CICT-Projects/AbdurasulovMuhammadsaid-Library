import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';

const API_BASE_URL = 'http://localhost:5148/api';

export default function BookDetail() {
  const { id } = useParams();
  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchBook = async () => {
      try {
        setLoading(true);
        const res = await fetch(`${API_BASE_URL}/books/${id}`);
        if (!res.ok) throw new Error('Книга не найдена или ошибка сервера');
        const data = await res.json();
        setBook(data);
        setError('');
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchBook();
  }, [id]);

  if (loading) return <p>Загрузка...</p>;
  if (error) return (
    <div>
      <p className="error">{error}</p>
      <Link to="/books">← Назад к списку книг</Link>
    </div>
  );

  return (
    <div className="detail-container">
      <h1>{book.title}</h1>
      <p>Год: {book.year}</p>

      <Link to="/books">← Назад к списку книг</Link>
    </div>
  );
}

