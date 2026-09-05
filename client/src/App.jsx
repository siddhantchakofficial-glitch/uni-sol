import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { SiteProvider } from './context/SiteContext';
import { AuthProvider } from './context/AuthContext';
import AppRoutes from './routes/AppRoutes';

export function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <SiteProvider>
          <AppRoutes />
        </SiteProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
