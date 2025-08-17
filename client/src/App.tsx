import React, { useEffect } from 'react';
import { Provider } from 'react-redux';
import { BrowserRouter as Router } from 'react-router-dom';
import store from './store';
import AppRoutes from './routes';
import { useAppDispatch } from './hooks/useAppDispatch';
import { initializeAuth } from './features/auth/authSlice';

// Component để khởi tạo auth state
const AuthInitializer: React.FC = () => {
  const dispatch = useAppDispatch();
  
  useEffect(() => {
    dispatch(initializeAuth());
  }, [dispatch]);
  
  return <AppRoutes />;
};

const App: React.FC = () => {
  return (
    <Provider store={store}>
      <Router>
        <AuthInitializer />
      </Router>
    </Provider>
  );
};

export default App;
