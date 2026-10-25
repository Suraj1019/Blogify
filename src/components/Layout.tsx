import { Outlet } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';

export default function Layout() {
  return (
    <div className="flex min-h-screen flex-col bg-page">
      <Header />
      <main className="container-page flex-1 py-6 sm:py-8">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
