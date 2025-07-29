import { useEffect, useState } from 'react';
import API from '../utils/api';

interface Props {
  token: string;
  setToken: (token: string | null) => void;
}

export default function NotesDashboard({ token, setToken }: Props) {
  const [notes, setNotes] = useState([]);
  const [content, setContent] = useState('');

  const fetchNotes = async () => {
    const res = await API.get('/notes', {
      headers: { Authorization: `Bearer ${token}` },
    });
    setNotes(res.data);
  };

  const addNote = async () => {
    await API.post('/notes', { content }, {
      headers: { Authorization: `Bearer ${token}` },
    });
    setContent('');
    fetchNotes();
  };

  const deleteNote = async (id: string) => {
    await API.delete(`/notes/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    fetchNotes();
  };

  useEffect(() => {
    fetchNotes();
  }, []);

  return (
    <div className="min-h-screen p-4 bg-white">
      <h1 className="text-2xl font-bold mb-4">Your Notes</h1>

      <div className="flex gap-2 mb-4">
        <input
          className="border p-2 w-full"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Write a note..."
        />
        <button onClick={addNote} className="bg-green-500 text-white px-4 py-2 rounded">
          Add
        </button>
      </div>

      <ul>
        {notes.map((note: any) => (
          <li key={note._id} className="flex justify-between p-2 border-b">
            {note.content}
            <button onClick={() => deleteNote(note._id)} className="text-red-600">Delete</button>
          </li>
        ))}
      </ul>

      <button
        onClick={() => {
          localStorage.removeItem('token');
          setToken(null);
        }}
        className="mt-6 text-sm text-blue-600 underline"
      >
        Logout
      </button>
    </div>
  );
}
