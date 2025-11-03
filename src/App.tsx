// --- 1. IMPORTS ---

import MainApp from './MainApp';
import { AuthProvider } from './contexts/AuthContext';
import { Toaster } from 'react-hot-toast';

// ... (your other imports) ...

/**
 * The final App, wrapped in the AuthProvider
 */
export default function App() {
  return (
    <AuthProvider>
      <MainApp />
      <Toaster position="top-center" />
    </AuthProvider>
  );
};