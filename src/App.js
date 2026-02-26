import { Navigate, Route, Routes } from "react-router-dom";
import { MainLayout, ProtectedRoute } from "./components";
import {
  AdminConferencesPage,
  AdminUsersPage,
  ConferenceDetailPage,
  HomePage,
  LoginPage,
  NotFoundPage,
  RegisterPage,
} from "./pages";

function App() {
  return (
    <MainLayout>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/conference/:id" element={<ConferenceDetailPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        <Route
          path="/admin/conferences"
          element={
            <ProtectedRoute requireAdmin>
              <AdminConferencesPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/users"
          element={
            <ProtectedRoute requireAdmin>
              <AdminUsersPage />
            </ProtectedRoute>
          }
        />

        <Route path="/home" element={<Navigate to="/" replace />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </MainLayout>
  );
}

export default App;
