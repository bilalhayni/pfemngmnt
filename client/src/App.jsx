import React, { Suspense, lazy } from 'react';
import { Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context';
import { PrivateRoute, PrivateRouteProf, PrivateRouteAdmin, PrivateRouteStudent, PrivateRouteAuth } from './routes';
import { ErrorBoundary, Loading } from './components/common';

// Eager load authentication forms (needed immediately)
import { LoginForm, SignUpForm } from './components/forms';

// Lazy load pages for code splitting (loaded on demand)
// Chef Département Pages
const Dashboard = lazy(() => import('./pages/Dashboard'));
const Professeurs = lazy(() => import('./pages/Professeurs'));
const Etudiants = lazy(() => import('./pages/Etudiants'));
const MesPfes = lazy(() => import('./pages/MesPfes'));
const TousLesPfes = lazy(() => import('./pages/TousLesPfes'));
const PfesEtudiants = lazy(() => import('./pages/PfesEtudiants'));
const Demandes = lazy(() => import('./pages/Demandes'));
const Domaines = lazy(() => import('./pages/Domaines'));

// Admin Pages
const AdminDashboard = lazy(() => import('./pages/admin/AdminDashboard'));
const PendingStudents = lazy(() => import('./pages/admin/PendingStudents'));
const ActivatedStudents = lazy(() => import('./pages/admin/ActivatedStudents'));
const ListProfessors = lazy(() => import('./pages/admin/ListProfessors'));
const ListChefDepartement = lazy(() => import('./pages/admin/ListChefDepartement'));
const CreateAccount = lazy(() => import('./pages/admin/CreateAccount'));
const CreateFiliere = lazy(() => import('./pages/admin/CreateFiliere'));

// Student Pages
const StudentDashboard = lazy(() => import('./pages/student/StudentDashboard'));
const ListAllPfe = lazy(() => import('./pages/student/ListAllPfe'));
const MyApplications = lazy(() => import('./pages/student/MyApplications'));
const MyPfe = lazy(() => import('./pages/student/MyPfe'));
const PfeDetails = lazy(() => import('./pages/student/PfeDetails'));
const StudentProfile = lazy(() => import('./pages/student/StudentProfile'));

// Professor Pages
const ProfessorDashboard = lazy(() => import('./pages/professor/ProfessorDashboard'));
const ProfessorMyPfes = lazy(() => import('./pages/professor/MyPfes'));
const CreatePfe = lazy(() => import('./pages/professor/CreatePfe'));
const StudentRequests = lazy(() => import('./pages/professor/StudentRequests'));
const MyStudents = lazy(() => import('./pages/professor/MyStudents'));
const ProfessorProfile = lazy(() => import('./pages/professor/ProfessorProfile'));

// Page Not Found
const PageNotFound = lazy(() => import('./pages/PageNotFound'));

function App() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <Suspense fallback={<Loading fullPage message="Chargement de l'application..." />}>
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
        </Suspense>
      </AuthProvider>
    </ErrorBoundary>
  );
}

export default App;
