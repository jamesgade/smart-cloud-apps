import React, { createContext, useContext, useState, ReactNode, Dispatch, SetStateAction } from 'react';

interface AuthModalContextType {
  isLoginOpen: boolean;
  isRegisterOpen: boolean;
  openLogin: () => void;
  closeLogin: () => void;
  openRegister: () => void;
  closeRegister: () => void;
  switchToRegister: () => void;
  switchToLogin: () => void;
  setIsLoginOpen: Dispatch<SetStateAction<boolean>>;
}

const AuthModalContext = createContext<AuthModalContextType | undefined>(undefined);

export const useAuthModal = () => {
  const context = useContext(AuthModalContext);
  if (!context) {
    throw new Error('useAuthModal must be used within an AuthModalProvider');
  }
  return context;
};

interface AuthModalProviderProps {
  children: ReactNode;
}

export const AuthModalProvider: React.FC<AuthModalProviderProps> = ({ children }) => {
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);

  const openLogin = () => {
    setIsLoginOpen(true);
    setIsRegisterOpen(false);
  };

  const closeLogin = () => {
    setIsLoginOpen(false);
  };

  const openRegister = () => {
    setIsRegisterOpen(true);
    setIsLoginOpen(false);
  };

  const closeRegister = () => {
    setIsRegisterOpen(false);
  };

  const switchToRegister = () => {
    setIsLoginOpen(false);
    setIsRegisterOpen(true);
  };

  const switchToLogin = () => {
    setIsRegisterOpen(false);
    setIsLoginOpen(true);
  };

  return (
    <AuthModalContext.Provider
      value={{
        isLoginOpen,
        isRegisterOpen,
        openLogin,
        closeLogin,
        openRegister,
        closeRegister,
        switchToRegister,
        switchToLogin,
        setIsLoginOpen
      }}
    >
      {children}
    </AuthModalContext.Provider>
  );
};
