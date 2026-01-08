import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Toaster } from 'sonner'; // ADD THIS
import { AuthProvider } from './context/AuthContext';
import { routes } from './routes/routes';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {routes.map((route, index) => (
            <Route 
              key={index} 
              path={route.path} 
              element={route.element} 
            />
          ))}
        </Routes>
        {/* ADD TOASTER FOR NOTIFICATIONS */}
        <Toaster position="top-right" richColors />
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;