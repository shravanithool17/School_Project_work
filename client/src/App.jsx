import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Suspense } from 'react';
import './i18n/i18n';
import './index.css';
import './App.css';

// Layout Components
import Navbar from './components/Navbar';
import Footer from './components/Footer';

// Public Pages
import Home from './pages/public/Home';
import About from './pages/public/About';
import Faculty from './pages/public/Faculty';
import Events from './pages/public/Events';
import Gallery from './pages/public/Gallery';
import Admission from './pages/public/Admission';
import Contact from './pages/public/Contact';

// User Pages
import SignUp from './pages/user/SignUp';
import SignIn from './pages/user/SignIn';
import Profile from './pages/user/Profile';

// Admin Pages
import AdminLogin from './pages/admin/Login';
import AdminDashboard from './pages/admin/Dashboard';
import FacultyManagement from './pages/admin/FacultyManagement';
import EventsManagement from './pages/admin/EventsManagement';
import GalleryManagement from './pages/admin/GalleryManagement';
import AdmissionsViewer from './pages/admin/AdmissionsViewer';
import ContactMessages from './pages/admin/ContactMessages';
import AnnouncementsManagement from './pages/admin/AnnouncementsManagement';

// Loading Component
const PageLoading = () => (
  <div className="page-loading">
    <div className="loading-spinner"></div>
    <p>Loading...</p>
  </div>
);

// Main Layout - public pages
const MainLayout = ({ children }) => (
  <div className="app-layout">
    <Navbar />
    <main className="main-content">
      <div className="content-wrapper">
        {children}
      </div>
    </main>
    <Footer />
  </div>
);

// ✅ FIXED: Auth Layout - no extra wrapper box, no Footer
const AuthLayout = ({ children }) => (
  <div className="auth-layout">
    <Navbar />
    <main className="auth-content">
      {children}
    </main>
  </div>
);

// Admin Layout
const AdminLayout = ({ children }) => (
  <div className="admin-layout">
    <Navbar />
    <main className="admin-content">
      <div className="admin-wrapper">
        {children}
      </div>
    </main>
    <Footer />
  </div>
);

function App() {
  return (
    <BrowserRouter>
      <Suspense fallback={<PageLoading />}>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<MainLayout><Home /></MainLayout>} />
          <Route path="/about" element={<MainLayout><About /></MainLayout>} />
          <Route path="/faculty" element={<MainLayout><Faculty /></MainLayout>} />
          <Route path="/events" element={<MainLayout><Events /></MainLayout>} />
          <Route path="/gallery" element={<MainLayout><Gallery /></MainLayout>} />
          <Route path="/admission" element={<MainLayout><Admission /></MainLayout>} />
          <Route path="/contact" element={<MainLayout><Contact /></MainLayout>} />

          {/* Auth Routes - no footer, no wrapper */}
          <Route path="/signup" element={<AuthLayout><SignUp /></AuthLayout>} />
          <Route path="/login" element={<AuthLayout><SignIn /></AuthLayout>} />

          {/* Profile - uses main layout */}
          <Route path="/profile" element={<MainLayout><Profile /></MainLayout>} />

          {/* Admin Routes */}
          <Route path="/admin/login" element={<AuthLayout><AdminLogin /></AuthLayout>} />
          <Route path="/admin/dashboard" element={<AdminLayout><AdminDashboard /></AdminLayout>} />
          <Route path="/admin/faculty" element={<AdminLayout><FacultyManagement /></AdminLayout>} />
          <Route path="/admin/events" element={<AdminLayout><EventsManagement /></AdminLayout>} />
          <Route path="/admin/gallery" element={<AdminLayout><GalleryManagement /></AdminLayout>} />
          <Route path="/admin/admissions" element={<AdminLayout><AdmissionsViewer /></AdminLayout>} />
          <Route path="/admin/messages" element={<AdminLayout><ContactMessages /></AdminLayout>} />
          <Route path="/admin/announcements" element={<AdminLayout><AnnouncementsManagement /></AdminLayout>} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}

export default App;