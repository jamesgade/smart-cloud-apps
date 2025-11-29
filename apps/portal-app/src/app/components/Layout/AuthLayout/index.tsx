import React, { useEffect, useState } from 'react'
import Footer from '../../../modules/common/Footer'
import Header from '../../../modules/common/Header'
import { Outlet } from 'react-router'
import { AuthModalProvider, useAuthModal } from '../../../contexts/AuthModalContext'
import { Modal, Box } from '@mui/material'
import LoginForm from '../../AuthModals/LoginForm'
import RegisterForm from '../../AuthModals/RegisterForm'

interface AuthLayoutProps {
  children?: React.ReactNode;
}

const AuthLayoutContent: React.FC<AuthLayoutProps> = ({ children }) => {
  const { isLoginOpen, isRegisterOpen, closeLogin, closeRegister, openLogin } = useAuthModal();
  const [hasShownAutoLogin, setHasShownAutoLogin] = useState(false);

  useEffect(() => {
    if (!hasShownAutoLogin) {
      const timer = setTimeout(() => {
        // Only open automatic login popup if no modal is currently open
        if (!isLoginOpen && !isRegisterOpen) {
          openLogin();
        }
        setHasShownAutoLogin(true);
      }, 15000); // 15 seconds

      return () => clearTimeout(timer);
    }
  }, [openLogin, hasShownAutoLogin]);

  return (
    <>
      <Header />
      {children || <Outlet />}
      <Footer />

      <Modal
        open={isLoginOpen}
        onClose={closeLogin}
        aria-labelledby="login-modal"
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Box sx={{ outline: 'none' }}>
          <LoginForm />
        </Box>
      </Modal>

      <Modal
        open={isRegisterOpen}
        onClose={closeRegister}
        aria-labelledby="register-modal"
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Box sx={{ outline: 'none' }}>
          <RegisterForm />
        </Box>
      </Modal>
    </>
  )
}

const AuthLayout: React.FC<AuthLayoutProps> = ({ children }) => {
  return (
    <AuthModalProvider>
      <AuthLayoutContent children={children} />
    </AuthModalProvider>
  )
}

export default AuthLayout