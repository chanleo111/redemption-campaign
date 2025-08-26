import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ConfigProvider } from 'antd';
import { useTranslation } from 'react-i18next';

import Layout from './components/layout/Layout';
import Login from './pages/login/Login';
import Register from './pages/register/Register';
import Dashboard from './pages/dashboard/Dashboard';
import Coupons from './pages/coupons/Coupons';
import LuckyDraw from './pages/luckydraw/LuckyDraw';
import Redemptions from './pages/redemptions/Redemptions';
import { AuthProvider, useAuth } from './components/AuthContext';
import AdminPage from './pages/admin/AdminPage';

import './App.css';

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? children : <Navigate to="/login" />;
};

const AdminRoute = ({ children }) => {
  const { isAuthenticated, isAdmin } = useAuth();
  if (!isAuthenticated) return <Navigate to="/login" />;
  return isAdmin ? children : <Navigate to="/" />;
};

// 简单的翻译函数作为临时替代
const t = (key) => {
  const translations = {
    'login.title': 'Login',
    'login.phonePlaceholder': 'Phone Number',
    'login.passwordPlaceholder': 'Password',
    'login.submit': 'Login',
    'login.registerLink': 'Register New Account',
    'login.success': 'Login successful!',
    'login.error': 'Login failed',
    'login.phoneRequired': 'Please input your phone number!',
    'login.phoneInvalid': 'Phone number must be 8 digits!',
    'login.passwordRequired': 'Please input your password!',
    
    'register.title': 'Register',
    'register.phoneLabel': 'Phone Number',
    'register.emailLabel': 'Email',
    'register.passwordLabel': 'Password',
    'register.confirmPasswordLabel': 'Confirm Password',
    'register.smsCodeLabel': 'SMS Verification Code',
    'register.emailCodeLabel': 'Email Verification Code',
    'register.sendCode': 'Send Code',
    'register.submit': 'Register',
    'register.success': 'Registration successful!',
    'register.methodSMS': 'SMS Verification',
    'register.methodEmail': 'Email Verification',
    'register.phoneRequired': 'Please input your phone number!',
    'register.phoneInvalid': 'Phone number must be 8 digits!',
    'register.emailRequired': 'Please input your email!',
    'register.emailInvalid': 'Email format is invalid!',
    'register.passwordRequired': 'Please input your password!',
    'register.confirmPasswordRequired': 'Please confirm your password!',
    'register.passwordsNotMatch': 'The two passwords do not match!',
    'register.smsCodeRequired': 'Please input SMS verification code!',
    'register.emailCodeRequired': 'Please input email verification code!',
    'register.smsSent': 'SMS verification code sent!',
    'register.emailSent': 'Email verification code sent!',
    'register.smsError': 'Failed to send SMS code',
    'register.emailError': 'Failed to send email code',
    
    'menu.dashboard': 'Dashboard',
    'menu.coupons': 'Coupons',
    'menu.luckyDraw': 'Lucky Draw',
    'menu.redemptions': 'Redemptions',
    'menu.profile': 'Profile',
    'menu.logout': 'Logout'
  };
  return translations[key] || key;
};

function App() {
  const { t } = useTranslation();
  return (
    <ConfigProvider>
      <AuthProvider>
        <Router>
          <div className="App">
            <Routes>
              <Route path="/login" element={<Login t={t} />} />
              <Route path="/register" element={<Register t={t} />} />
              <Route path="/" element={
                <ProtectedRoute>
                  <Layout t={t}>
                    <Dashboard />
                  </Layout>
                </ProtectedRoute>
              } />
              <Route path="/coupons" element={
                <ProtectedRoute>
                  <Layout t={t}>
                    <Coupons />
                  </Layout>
                </ProtectedRoute>
              } />
              <Route path="/lucky-draw" element={
                <ProtectedRoute>
                  <Layout t={t}>
                    <LuckyDraw />
                  </Layout>
                </ProtectedRoute>
              } />
              <Route path="/redemptions" element={
                <ProtectedRoute>
                  <Layout t={t}>
                    <Redemptions />
                  </Layout>
                </ProtectedRoute>
              } />
              <Route path="/admin" element={
                <AdminRoute>
                  <Layout t={t}>
                    <AdminPage />
                  </Layout>
                </AdminRoute>
              } />
            </Routes>
          </div>
        </Router>
      </AuthProvider>
    </ConfigProvider>
  );
}

export default App;