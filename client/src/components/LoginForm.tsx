import { useState } from 'react';
import API from '../utils/api';

interface Props {
  setToken: (token: string) => void;
}

export default function LoginForm({ setToken }: Props) {
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [sent, setSent] = useState(false);

  const sendOtp = async () => {
    await API.post('/auth/send-otp', { email });
    setSent(true);
  };

  const verifyOtp = async () => {
    const res = await API.post('/auth/verify-otp', { email, otp });
    localStorage.setItem('token', res.data.token);
    setToken(res.data.token);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-4 bg-gray-100 p-4">
      <h1 className="text-2xl font-bold">Login with OTP</h1>
      <input
        className="border p-2 rounded w-64"
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      {sent && (
        <input
          className="border p-2 rounded w-64"
          type="text"
          placeholder="OTP"
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
        />
      )}
      <button
        className="bg-blue-600 text-white px-4 py-2 rounded"
        onClick={sent ? verifyOtp : sendOtp}
      >
        {sent ? 'Verify OTP' : 'Send OTP'}
      </button>

      <a
        href="http://localhost:5000/api/auth/google"
        className="text-blue-500 underline mt-4"
      >
        Or Login with Google
      </a>
    </div>
  );
}
