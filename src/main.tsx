import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import App from './App';
import { AuthProvider } from './context/AuthContext';
import { DraftPostProvider } from './context/DraftPostContext';
import './index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <DraftPostProvider>
          <App />
          {/* Same behaviour as the ngx-toastr config in the Angular app. */}
          <ToastContainer position="top-right" autoClose={2000} limit={3} newestOnTop />
        </DraftPostProvider>
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>,
);
