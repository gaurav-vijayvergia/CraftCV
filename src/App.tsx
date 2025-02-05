import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore } from './store/auth';
import Layout from './components/Layout';
import Login from './components/auth/Login';
import Signup from './components/auth/Signup';
import UploadCV from './components/cv/UploadCV';
import CVListing from './components/cv/CVListing';
import OrganizationSettings from './components/settings/OrganizationSettings';
import TemplateList from "./features/templates/routes/TemplateList.tsx";
import TemplateDesigner from "./features/templates/routes/TemplateDesigner.tsx";

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  return isAuthenticated ? <>{children}</> : <Navigate to="/login" />;
};

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Layout />
            </ProtectedRoute>
          }
        >
          <Route path="upload-cv" element={<UploadCV />} />
          <Route path="cv-listing" element={<CVListing />} />
          <Route path="/templates" element={<TemplateList />} />
          <Route path="/templates/new" element={<TemplateDesigner />} />
          <Route path="settings" element={<OrganizationSettings />} />
          <Route index element={<Navigate to="/upload-cv" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;