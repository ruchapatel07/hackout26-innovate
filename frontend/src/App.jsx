import React from 'react';
import { useAuth, AuthProvider } from './context/AuthContext';
import { ToastProvider } from './context/ToastContext';
import { NotificationProvider } from './context/NotificationContext';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { ToastContainer } from './components/ToastContainer';
<<<<<<< HEAD
=======
import { VoiceAssistant } from './components/VoiceAssistant';
>>>>>>> 90445d9 (Update Carbon Connect full stack application)
import { Home } from './pages/Home';
import { About } from './pages/About';
import { HowItWorks } from './pages/HowItWorks';
import { MarketplacePage } from './pages/MarketplacePage';
import { Signup } from './pages/Signup';
import { Login } from './pages/Login';
import { DashboardLayout } from './pages/Dashboard/DashboardLayout';

export const AppContent = () => {
  const { activePage } = useAuth();

  if (activePage === 'dashboard') {
    return (
      <>
        <DashboardLayout />
        <ToastContainer />
<<<<<<< HEAD
=======
        <VoiceAssistant />
>>>>>>> 90445d9 (Update Carbon Connect full stack application)
      </>
    );
  }

  return (
    <>
      <Navbar />
      <main>
        {activePage === 'home' && <Home />}
        {activePage === 'about' && <About />}
        {(activePage === 'how-it-works' || activePage === 'howItWorks') && <HowItWorks />}
        {activePage === 'marketplace' && <MarketplacePage />}
        {activePage === 'signup' && <Signup />}
        {activePage === 'login' && <Login />}
      </main>
      <Footer />
      <ToastContainer />
<<<<<<< HEAD
=======
      <VoiceAssistant />
>>>>>>> 90445d9 (Update Carbon Connect full stack application)
    </>
  );
};

export default function App() {
  return (
    <ToastProvider>
      <NotificationProvider>
        <AuthProvider>
          <AppContent />
        </AuthProvider>
      </NotificationProvider>
    </ToastProvider>
  );
}
