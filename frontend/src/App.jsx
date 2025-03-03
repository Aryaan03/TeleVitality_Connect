import React, { useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navigation from './components/Navigation';
import HomePage from './pages/HomePage';
import Contact from './pages/Contact';
import ProtectedRoute from './components/ProtectedRoute';
import ForgotPassword from './pages/ForgotPassword';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DoctorRegisterPage from './pages/DoctorRegisterPage';
import DoctorProfilePage from './pages/DoctorProfilePage';
import DoctorAppointmentsPage from './pages/DoctorAppointmentsPage';
import OptionsModal from './components/OptionsModal';
import DoctorLoginPage from './pages/DoctorLoginPage';
import ProfilePage from './pages/ProfilePage';
import ProfileDisplay from './pages/ProfileDisplay';
import MakeAppointmentPage from './pages/MakeAppointmentPage';
import DoctorProfileDisplay from './pages/DoctorProfileDisplay';

function App() {
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);
  const [isPatientRegisterOpen, setIsPatientRegisterOpen] = useState(false);
  const [isDoctorRegisterOpen, setIsDoctorRegisterOpen] = useState(false);
  const [isPatientLoginOpen, setIsPatientLoginOpen] = useState(false);
  const [isDoctorLoginOpen, setIsDoctorLoginOpen] = useState(false);

  const handleLoginOpen = () => setIsLoginOpen(true);
  const handleLoginClose = () => setIsLoginOpen(false);

  const handleRegisterOpen = () => setIsRegisterOpen(true);
  const handleRegisterClose = () => setIsRegisterOpen(false);
  const handleDoctorRegisterClose = () => setIsDoctorRegisterOpen(false);
  const handlePatientRegisterClose = () => setIsPatientRegisterOpen(false);

  const handlePatientLoginClose = () => setIsPatientLoginOpen(false);
  const handleDoctorLoginClose = () => setIsDoctorLoginOpen(false);

  return (
    <BrowserRouter>
      <Navigation 
        onLoginClick={handleLoginOpen} 
        onRegisterClick={handleRegisterOpen} 
      />
      <Routes>
        <Route path="/" element={<HomePage onGetStartedClick={handleRegisterOpen} onLoginClick={handleLoginOpen}/>} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />

        {/* Profile Routes */}
        <Route path="/profile" element={
          <ProtectedRoute>
            <ProfileDisplay />
          </ProtectedRoute>
        }/>
        <Route path="/profile/edit" element={
          <ProtectedRoute>
            <ProfilePage />
          </ProtectedRoute>
        }/>

        {/* Appointments Route */}
        <Route path="/appointments" element={
          <ProtectedRoute>
            <MakeAppointmentPage />
          </ProtectedRoute>
        } />

        {/* Doctor-specific routes */}
        <Route path="/doctor/profile" element={<DoctorProfileDisplay />} />
        <Route path="/doctor/edit-profile" element={<DoctorProfilePage />} />
        <Route path="/doctor-appointments" element={
          <ProtectedRoute>
            <DoctorAppointmentsPage />
          </ProtectedRoute>
        } />
      </Routes>

      {/* Modals */}
      {isRegisterOpen && (
        <OptionsModal 
          open={isRegisterOpen} 
          handleClose={handleRegisterClose} 
          action="Register"
          openPatientDialogue={() => setIsPatientRegisterOpen(true)}
          openDoctorDialogue={() => setIsDoctorRegisterOpen(true)}
        />
      )}

      {isLoginOpen && (
        <OptionsModal 
          open={isLoginOpen} 
          handleClose={handleLoginClose} 
          action="Login"
          openPatientDialogue={() => setIsPatientLoginOpen(true)}
          openDoctorDialogue={() => setIsDoctorLoginOpen(true)}
        />
      )}

      {isPatientRegisterOpen && (
        <RegisterPage 
          open={isPatientRegisterOpen} 
          handleClose={handlePatientRegisterClose} 
          openLogin={() => setIsPatientLoginOpen(true)}
        />
      )}

      {isDoctorRegisterOpen && (
        <DoctorRegisterPage 
          open={isDoctorRegisterOpen} 
          handleClose={handleDoctorRegisterClose} 
          openLogin={() => setIsDoctorLoginOpen(true)}
        />
      )}

      {isPatientLoginOpen && (
        <LoginPage 
          open={isPatientLoginOpen} 
          handleClose={handlePatientLoginClose} 
        />
      )}

      {isDoctorLoginOpen && (
        <DoctorLoginPage 
          open={isDoctorLoginOpen} 
          handleClose={handleDoctorLoginClose} 
        />
      )}
    </BrowserRouter>
  );
}

export default App;