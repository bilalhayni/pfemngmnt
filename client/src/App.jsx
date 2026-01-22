import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context';
import { PrivateRoute, PrivateRouteProf, PrivateRouteAdmin, PrivateRouteStudent, PrivateRouteAuth } from './routes';

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

// Admin Pages
import {
  AdminDashboard,
  PendingStudents,
  ActivatedStudents,
  ListProfessors,
  ListChefDepartement,
  CreateAccount,
  CreateFiliere
} from './pages/admin';

// Student Pages
import {
  StudentDashboard,
  ListAllPfe,
  MyApplications,
  MyPfe,
  PfeDetails,
  StudentProfile
} from './pages/student';

// Professor Pages
import {
  ProfessorDashboard,
  MyPfes as ProfessorMyPfes,
  CreatePfe,
  StudentRequests,
  MyStudents,
  ProfessorProfile
} from './pages/professor';

// Page Not Found
import PageNotFound from './pages/PageNotFound';

function App() {
  return (
    <AuthProvider>
      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={<LoginForm />} />
        <Route path="/signup" element={<SignUpForm />} />

        {/* Unified Home Route (all authenticated users) */}
        <Route element={<PrivateRouteAuth />}>
          <Route path="/home" element={<Dashboard />} />
        </Route>

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
          <Route path="home" element={<ProfessorDashboard />} />
          <Route path="pfe" element={<ProfessorMyPfes />} />
          <Route path="pfe/new" element={<CreatePfe />} />
          <Route path="pfe/edit/:id" element={<CreatePfe />} />
          <Route path="demandes" element={<StudentRequests />} />
          <Route path="students" element={<MyStudents />} />
          <Route path="profile" element={<ProfessorProfile />} />
        </Route>

        {/* Admin Routes (role === 3) */}
        <Route path="/admin" element={<PrivateRouteAdmin />}>
          <Route path="home" element={<AdminDashboard />} />
          <Route path="pending-students" element={<PendingStudents />} />
          <Route path="activated-students" element={<ActivatedStudents />} />
          <Route path="professors" element={<ListProfessors />} />
          <Route path="chef-departement" element={<ListChefDepartement />} />
          <Route path="create-account" element={<CreateAccount />} />
          <Route path="create-filiere" element={<CreateFiliere />} />
        </Route>

        {/* Student Routes (role === 2) */}
        <Route path="/student" element={<PrivateRouteStudent />}>
          <Route path="home" element={<StudentDashboard />} />
          <Route path="pfe" element={<ListAllPfe />} />
          <Route path="pfe/:id" element={<PfeDetails />} />
          <Route path="applications" element={<MyApplications />} />
          <Route path="mypfe" element={<MyPfe />} />
          <Route path="profile" element={<StudentProfile />} />
        </Route>

        {/* 404 Page */}
        <Route path="*" element={<PageNotFound />} />
      </Routes>
    </AuthProvider>
  );
}

export default App;
