import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface FormData {
  fullName: string;
  email: string;
  phoneNumber: string;
  vehicleType: string;
  evModel: string;
  city: string;
}

interface IntroFormContextType {
  formData: FormData;
  hasCompletedIntro: boolean;
  isDarkMode: boolean;
  setFormData: (data: FormData) => void;
  setHasCompletedIntro: (completed: boolean) => void;
  setIsDarkMode: (darkMode: boolean) => void;
  resetIntroForm: () => void;
}

const IntroFormContext = createContext<IntroFormContextType | undefined>(undefined);

export const useIntroForm = () => {
  const context = useContext(IntroFormContext);
  if (context === undefined) {
    throw new Error('useIntroForm must be used within an IntroFormProvider');
  }
  return context;
};

interface IntroFormProviderProps {
  children: ReactNode;
}

export const IntroFormProvider: React.FC<IntroFormProviderProps> = ({ children }) => {
  const [formData, setFormData] = useState<FormData>({
    fullName: '',
    email: '',
    phoneNumber: '',
    vehicleType: '',
    evModel: '',
    city: ''
  });
  
  const [hasCompletedIntro, setHasCompletedIntro] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    // Load data from localStorage on mount
    const savedFormData = localStorage.getItem('introFormData');
    const savedDarkMode = localStorage.getItem('darkMode');
    const savedCompleted = localStorage.getItem('hasCompletedIntro');

    if (savedFormData) {
      try {
        setFormData(JSON.parse(savedFormData));
      } catch (error) {
        console.error('Error parsing saved form data:', error);
      }
    }

    if (savedDarkMode) {
      try {
        setIsDarkMode(JSON.parse(savedDarkMode));
      } catch (error) {
        console.error('Error parsing saved dark mode:', error);
      }
    }

    if (savedCompleted) {
      try {
        setHasCompletedIntro(JSON.parse(savedCompleted));
      } catch (error) {
        console.error('Error parsing saved completion status:', error);
      }
    }
  }, []);

  const handleSetFormData = (data: FormData) => {
    setFormData(data);
    localStorage.setItem('introFormData', JSON.stringify(data));
  };

  const handleSetHasCompletedIntro = (completed: boolean) => {
    setHasCompletedIntro(completed);
    localStorage.setItem('hasCompletedIntro', JSON.stringify(completed));
  };

  const handleSetIsDarkMode = (darkMode: boolean) => {
    setIsDarkMode(darkMode);
    localStorage.setItem('darkMode', JSON.stringify(darkMode));
  };

  const resetIntroForm = () => {
    setFormData({
      fullName: '',
      email: '',
      phoneNumber: '',
      vehicleType: '',
      evModel: '',
      city: ''
    });
    setHasCompletedIntro(false);
    localStorage.removeItem('introFormData');
    localStorage.removeItem('hasCompletedIntro');
  };

  const value: IntroFormContextType = {
    formData,
    hasCompletedIntro,
    isDarkMode,
    setFormData: handleSetFormData,
    setHasCompletedIntro: handleSetHasCompletedIntro,
    setIsDarkMode: handleSetIsDarkMode,
    resetIntroForm
  };

  return (
    <IntroFormContext.Provider value={value}>
      {children}
    </IntroFormContext.Provider>
  );
};
