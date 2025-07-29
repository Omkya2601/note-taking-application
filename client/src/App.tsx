import { useState, useEffect } from 'react';
import LoginForm from './components/LoginForm';
import NotesDashboard from './components/NotesDashboard';

function App() {
  const [token, setToken] = useState<string | null>(localStorage.getItem('token'));

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const urlToken = params.get('token');
    if (urlToken) {
      localStorage.setItem('token', urlToken);
      setToken(urlToken);
      window.history.replaceState({}, '', '/');
    }
  }, []);

  return token ? <NotesDashboard token={token} setToken={setToken} /> : <LoginForm setToken={setToken} />;
}

export default App;
