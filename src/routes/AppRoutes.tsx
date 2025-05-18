import React, { lazy, Suspense } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import PrivateRoute from './PrivateRoute';
import { UserRole } from '@/types/auth';
import MainLayout from '../layouts/MainLayout';

const Login = lazy(() => import('../pages/Login'));
const Register = lazy(() => import('../pages/Register'));

const AppRoutes = () => {
  const { isAuthenticated, user } = useAuth();

  return (
    <Suspense fallback={<div className="flex items-center justify-center min-h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-700"></div>
    </div>}>
      <Routes>
        {/* Rutas públicas */}
        <Route path="/" element={<Navigate to={isAuthenticated ? '/home' : '/login'} replace />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Rutas privadas */}
        <Route element={<PrivateRoute />}>
          <Route path="/home" element={
            isAuthenticated ? (
              <MainLayout>
                <div className="flex flex-col space-y-4">
                  <h1 className="text-2xl font-semibold">Bienvenido, {user?.name}</h1>
                  <p className="text-gray-600">Esta es tu página de inicio</p>
                </div>
              </MainLayout>
            ) : (
              <Navigate to="/login" replace />
            )
          } />
          
          {/* Rutas específicas por rol */}
          <Route path="/usuario" element={user?.role === 'CLIENTE' ? <MainLayout><div>Dashboard Cliente</div></MainLayout> : <Navigate to="/home" replace />} />
          <Route path="/agente" element={user?.role === 'AGENTE' ? <MainLayout><div>Dashboard Agente</div></MainLayout> : <Navigate to="/home" replace />} />
          <Route path="/agencia" element={user?.role === 'AGENCIA' ? <MainLayout><div>Dashboard Agencia</div></MainLayout> : <Navigate to="/home" replace />} />
          <Route path="/admin" element={user?.role === 'ADMIN' ? <MainLayout><div>Dashboard Admin</div></MainLayout> : <Navigate to="/home" replace />} />
        </Route>

        {/* Ruta catch-all */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Suspense>
  );
};

export default AppRoutes;
