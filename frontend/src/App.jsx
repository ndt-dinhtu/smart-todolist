// frontend/src/App.jsx
import { useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useAuthStore } from "./store/authStore";
import Login from "./pages/Login";
import Register from "./pages/Register"; // Import trang Đăng ký mới
import { LogOut, User as UserIcon, Calendar } from "lucide-react";

// Component bảo vệ Route
const ProtectedRoute = ({ children }) => {
  const token = useAuthStore((state) => state.token);
  return token ? children : <Navigate to="/login" />;
};

// Giao diện Dashboard hiển thị thông tin cá nhân
function Dashboard() {
  const { user, getMe, logout, isLoading } = useAuthStore();

  // Tự động gọi API lấy thông tin cá nhân của người dùng dựa trên token hiện tại
  useEffect(() => {
    getMe();
  }, [getMe]);

  if (isLoading && !user) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center text-white">
        <p className="animate-pulse">Đang tải dữ liệu cá nhân...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900 text-white">
      {/* Thanh Navbar trên cùng */}
      <nav className="bg-slate-800 border-b border-slate-700 px-6 py-4 flex justify-between items-center">
        <h1 className="text-xl font-bold text-indigo-400">
          Smart Todo Dashboard
        </h1>

        {user && (
          <div className="flex items-center gap-4">
            {/* Widget hiển thị thông tin cá nhân tóm tắt */}
            <div className="flex items-center gap-2 bg-slate-900/50 px-3 py-1.5 rounded-full border border-slate-700">
              <div className="w-8 h-8 rounded-full bg-indigo-500 flex items-center justify-center text-white font-bold uppercase">
                {user.name?.charAt(0)}
              </div>
              <span className="text-sm font-medium text-slate-200">
                {user.name}
              </span>
            </div>

            <button
              onClick={logout}
              className="flex items-center gap-1.5 bg-red-500/10 hover:bg-red-500 text-red-400 hover:text-white text-sm px-3 py-1.5 rounded-lg border border-red-500/20 transition-all cursor-pointer"
            >
              <LogOut size={16} />
              <span>Đăng xuất</span>
            </button>
          </div>
        )}
      </nav>

      {/* Nội dung chính bên dưới */}
      <main className="max-w-4xl mx-auto p-6 mt-8">
        <div className="bg-slate-800 rounded-2xl p-6 border border-slate-700 shadow-xl">
          <h2 className="text-xl font-semibold mb-6 flex items-center gap-2 border-b border-slate-700 pb-3">
            <UserIcon className="text-indigo-400" /> Thông Tin Tài Khoản Cá Nhân
          </h2>

          {user ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-1">
                <p className="text-xs text-slate-400 uppercase tracking-wider">
                  Họ và tên
                </p>
                <p className="text-lg font-medium text-white">{user.name}</p>
              </div>

              <div className="space-y-1">
                <p className="text-xs text-slate-400 uppercase tracking-wider">
                  Địa chỉ Email
                </p>
                <p className="text-lg font-medium text-white">{user.email}</p>
              </div>

              <div className="space-y-1">
                <p className="text-xs text-slate-400 uppercase tracking-wider">
                  Mã định danh (ID)
                </p>
                <p className="text-sm font-mono text-slate-400 bg-slate-900/60 p-2 rounded border border-slate-700/50 break-all">
                  {user._id || user.id}
                </p>
              </div>

              <div className="space-y-1">
                <p className="text-xs text-slate-400 uppercase tracking-wider">
                  Ngày tham gia hệ thống
                </p>
                <p className="text-sm text-slate-300 flex items-center gap-1.5 mt-1">
                  <Calendar size={16} className="text-slate-500" />
                  {user.createdAt
                    ? new Date(user.createdAt).toLocaleDateString("vi-VN")
                    : "Mới tham gia"}
                </p>
              </div>
            </div>
          ) : (
            <p className="text-slate-400">
              Không tìm thấy thông tin tài khoản.
            </p>
          )}
        </div>

        {/* Khu vực Todo list (Nơi chúng ta sẽ đổ dữ liệu task ở các bước tiếp theo) */}
        <div className="mt-8 text-center p-12 border-2 border-dashed border-slate-700 rounded-2xl">
          <p className="text-slate-500 text-lg">
            Khu vực danh sách công việc thông minh sẽ nằm ở đây!
          </p>
        </div>
      </main>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />{" "}
        {/* Định tuyến trang Đăng ký */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<Navigate to="/dashboard" />} />
      </Routes>
    </BrowserRouter>
  );
}
