import { lazy, Suspense } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import Layout from './components/Layout';
import Loader from './components/Loader';
import ProtectedRoute from './components/ProtectedRoute';
import EditPost from './pages/EditPost';
import Home from './pages/Home';
import Login from './pages/Login';
import NewPost from './pages/NewPost';
import Notifications from './pages/Notifications';
import Post from './pages/Post';
import PreviewPost from './pages/PreviewPost';
import Profile from './pages/Profile';
import Signup from './pages/Signup';

// The charting library is large, so only load it when the dashboard is opened.
const Analytics = lazy(() => import('./pages/Analytics'));

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<Navigate to="/home" replace />} />
        <Route path="home" element={<Home />} />
        <Route path="login" element={<Login />} />
        <Route path="signup" element={<Signup />} />
        <Route path="post/:id" element={<Post />} />
        <Route element={<ProtectedRoute />}>
          <Route path="edit/:id" element={<EditPost />} />
          <Route path="newpost" element={<NewPost />} />
          <Route path="previewpost" element={<PreviewPost />} />
          <Route path="profile" element={<Profile />} />
          <Route path="notifications" element={<Notifications />} />
          <Route
            path="analytics"
            element={
              <Suspense fallback={<Loader />}>
                <Analytics />
              </Suspense>
            }
          />
        </Route>
        <Route path="*" element={<Navigate to="/home" replace />} />
      </Route>
    </Routes>
  );
}
