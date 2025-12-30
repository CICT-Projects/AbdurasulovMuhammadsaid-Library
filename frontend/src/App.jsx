import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import Books from './Books';
import Authors from './Authors';
import './App.css';

function App() {
  return (
    <BrowserRouter>
      <div className="app">
        <nav className="navbar">
          <h1 className="app-title">📖 Library</h1>
          <div className="nav-links">
            <Link to="/books">Книги</Link>
            <Link to="/authors">Авторы</Link>
          </div>
        </nav>

        <main className="content">
          <Routes>
            <Route path="/books" element={<Books />} />
            <Route path="/authors" element={<Authors />} />
            <Route path="/" element={<Books />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}

export default App;
