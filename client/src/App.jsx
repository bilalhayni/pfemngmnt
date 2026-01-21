import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context';
import { PrivateRoute, PrivateRouteProf, PrivateRouteAdmin, PrivateRouteStudent } from './routes';

// Forms
import { LoginForm, SignUpForm } from './components/forms';

// Chef Département Pages
import {
  Dashboard,
  Professeurs,
  Etudiants,
  MesPfes,
  TousLesPfes,
  PfesEtudiants,
  Demandes,
  Domaines
} from './pages';

// Page Not Found
import PageNotFound from './pages/PageNotFound';

function App() {
  return (
    <AuthProvider>
      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={<LoginForm />} />
        <Route path="/signup" element={<SignUpForm />} />

        {/* Chef Département Routes (role === 1) */}
        <Route element={<PrivateRoute />}>
          <Route path="/" element={<Dashboard />} />
          <Route path="/professeurs" element={<Professeurs />} />
          <Route path="/etudiants" element={<Etudiants />} />
          <Route path="/mes-pfes" element={<MesPfes />} />
          <Route path="/tous-les-pfes" element={<TousLesPfes />} />
          <Route path="/pfes-etudiants" element={<PfesEtudiants />} />
          <Route path="/demandes" element={<Demandes />} />
          <Route path="/domaines" element={<Domaines />} />
          <Route path="/profile" element={<Dashboard />} />
          <Route path="/settings" element={<Dashboard />} />
        </Route>

        {/* Professor Routes (role === 0) */}
        <Route path="/prof" element={<PrivateRouteProf />}>
          <Route path="home" element={<Dashboard />} />
          <Route path="pfe" element={<MesPfes />} />
          <Route path="profile" element={<Dashboard />} />
          <Route path="student" element={<Etudiants />} />
          <Route path="demandes" element={<Demandes />} />
          <Route path="domaine" element={<Domaines />} />
        </Route>

        {/* Admin Routes (role === 3) */}
        <Route path="/admin" element={<PrivateRouteAdmin />}>
          <Route path="home" element={<Dashboard />} />
          <Route path="prof" element={<Professeurs />} />
          <Route path="student" element={<Etudiants />} />
          <Route path="chefDep" element={<Professeurs />} />
        </Route>

        {/* Student Routes (role === 2) */}
        <Route path="/student" element={<PrivateRouteStudent />}>
          <Route path="home" element={<Dashboard />} />
          <Route path="profile" element={<Dashboard />} />
          <Route path="pfe" element={<TousLesPfes />} />
          <Route path="mypfe" element={<MesPfes />} />
        </Route>

        {/* 404 Page */}
        <Route path="*" element={<PageNotFound />} />
      </Routes>
    </AuthProvider>
  );
}

export default App;
