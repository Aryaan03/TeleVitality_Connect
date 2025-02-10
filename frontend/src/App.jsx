import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { useState } from 'react';
import Navigation from './components/Navigation';
import HomePage from './pages/HomePage';
import Dashboard from './pages/Dashboard';
import Contact from './pages/Contact';
import ProtectedRoute from './components/ProtectedRoute';
import ForgotPassword from './pages/ForgotPassword';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ProfilePage from './pages/ProfilePage';

function App() {
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);

  const handleLoginOpen = () => setIsLoginOpen(true);
  const handleLoginClose = () => setIsLoginOpen(false);
  const handleRegisterOpen = () => setIsRegisterOpen(true);
  const handleRegisterClose = () => setIsRegisterOpen(false);

  return (
    <BrowserRouter>
      <Navigation 
        onLoginClick={handleLoginOpen} 
        onRegisterClick={handleRegisterOpen} 
      />
      <Routes>
        <Route path="/" element={<HomePage onGetStartedClick={handleRegisterOpen} onLoginClick={handleLoginOpen}/>} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route 
          path="/profile" 
          element={
            <ProtectedRoute>
              <ProfilePage/>
            </ProtectedRoute>
          } 
        />
        <Route path="/contact" element={<Contact />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
      </Routes>

      {/* Login Modal */}
      {isLoginOpen && <LoginPage open={isLoginOpen} handleClose={handleLoginClose} />}

      {/* Register Modal */}
      {isRegisterOpen && <RegisterPage open={isRegisterOpen} handleClose={handleRegisterClose} />}
    </BrowserRouter>
  );
}

export default App;
