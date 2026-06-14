// frontend/src/pages/Register.jsx
import React, { useState } from 'react';
import { useAuthStore } from '../store/authStore';
import { useNavigate, Link } from 'react-router-dom';
import { Lock, Mail, User, Loader2 } from 'lucide-react';

export default function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { register, isLoading, error } = useAuthStore();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const success = await register(name, email, password);
    if (success) {
      alert('Đăng ký thành công! Hãy đăng nhập nhé.');
      navigate('/login'); // Đăng ký xong đá về trang Login để đăng nhập
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
      <div className="bg-slate-800 p-8 rounded-2xl shadow-xl w-full max-w-md border border-slate-700">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Tạo Tài Khoản</h1>
          <p className="text-slate-400">Đăng ký để cùng bạn bè quản lý công việc</p>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500 text-red-500 p-3 rounded-lg text-sm mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Họ và tên</label>
            <div className="relative">
              <User className="absolute left-3 top-3.5 h-5 w-5 text-slate-500" />
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-lg pl-10 pr-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                placeholder="Nguyễn Văn A"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Email</label>
            <div className="relative">
              <Mail className="absolute left-3 top-3.5 h-5 w-5 text-slate-500" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-lg pl-10 pr-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                placeholder="name@example.com"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Mật khẩu</label>
            <div className="relative">
              <Lock className="absolute left-3 top-3.5 h-5 w-5 text-slate-500" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-lg pl-10 pr-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                placeholder="••••••••"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-3 rounded-lg transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {isLoading ? <Loader2 className="animate-spin h-5 w-5" /> : 'Đăng Ký Tài Khoản'}
          </button>
        </form>

        <p className="text-center text-slate-400 text-sm mt-6">
          Đã có tài khoản?{' '}
          <Link to="/login" className="text-indigo-400 hover:underline">Đăng nhập ngay</Link>
        </p>
      </div>
    </div>
  );
}