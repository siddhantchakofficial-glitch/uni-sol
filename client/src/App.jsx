import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { SiteProvider } from './context/SiteContext';
import { AuthProvider } from './context/AuthContext';
import { LanguageProvider } from './context/LanguageContext';
import AppRoutes from './routes/AppRoutes';

export function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <LanguageProvider>
          <SiteProvider>
            <AppRoutes />
          </SiteProvider>
        </LanguageProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
