import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './hooks/useAuth';
import { Home } from './pages/Home';
import { AdminLogin } from './pages/AdminLogin';
import { AdminLayout } from './pages/admin/AdminLayout';
import { Dashboard } from './pages/admin/Dashboard';
import { HomepageManager } from './pages/admin/HomepageManager';
import { GalleryManager } from './pages/admin/GalleryManager';
import { TimelineManager } from './pages/admin/TimelineManager';
import { LettersManager } from './pages/admin/LettersManager';
import { ReasonsManager } from './pages/admin/ReasonsManager';
import { MusicManager } from './pages/admin/MusicManager';
import { SurpriseManager } from './pages/admin/SurpriseManager';
import { GuestbookManager } from './pages/admin/GuestbookManager';
import { ShareManager } from './pages/admin/ShareManager';
import { Settings } from './pages/admin/Settings';
import { RosePetalsBackground } from './components/RosePetalsBackground';
import { Heart } from 'lucide-react';

// Protected Route Component for Admin Dashboard
const ProtectedAdminRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAdmin, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FFFDF9] flex flex-col items-center justify-center p-4">
        <Heart className="w-10 h-10 text-[#B75F7D] fill-[#F8DCE5] animate-pulse mb-3" />
        <span className="font-cursive text-3xl text-[#B75F7D]">Forever Together</span>
        <span className="text-xs text-[#70515A]/70 mt-1">Verifying permissions...</span>
      </div>
    );
  }

  if (!isAdmin) {
    return <Navigate to="/admin/login" replace />;
  }

  return <>{children}</>;
};

export default function App() {
  return (
    <BrowserRouter>
      {/* Global Ambient Romantic Rose Petals Layer */}
      <RosePetalsBackground count={24} />

      <Routes>
        {/* Public Anniversary Website Experience */}
        <Route path="/" element={<Home />} />

        {/* Admin Authentication */}
        <Route path="/admin/login" element={<AdminLogin />} />

        {/* Secure Admin Dashboard Suite */}
        <Route
          path="/admin"
          element={
            <ProtectedAdminRoute>
              <AdminLayout />
            </ProtectedAdminRoute>
          }
        >
          <Route index element={<Dashboard />} />
          <Route path="homepage" element={<HomepageManager />} />
          <Route path="gallery" element={<GalleryManager />} />
          <Route path="timeline" element={<TimelineManager />} />
          <Route path="letters" element={<LettersManager />} />
          <Route path="reasons" element={<ReasonsManager />} />
          <Route path="music" element={<MusicManager />} />
          <Route path="surprise" element={<SurpriseManager />} />
          <Route path="guestbook" element={<GuestbookManager />} />
          <Route path="share" element={<ShareManager />} />
          <Route path="settings" element={<Settings />} />
        </Route>

        {/* Catch-all redirect to Home */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
