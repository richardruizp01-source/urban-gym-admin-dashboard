import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'sonner';
import Dashboard from './views/Dashboard'; 
import { MembersPage } from './views/MembersPage'; 
import { EmployeesPage } from './views/EmployeesPage'; 
import { Login } from './views/Login'; 
import { MachinesPage } from './views/MachinesPage'; 
import { SedesPage } from './views/SedesPage'; 
import ReservasPage from "./views/ReservasPage";
import SystemPage from './views/SystemPage';
import './App.css';

function App() {
  return (
    <Router>
      <div className="app-container">
        {/* 🚀 Toaster dentro del Router para evitar conflictos de renderizado */}
        <Toaster 
          position="top-right" 
          richColors 
          theme="dark" 
          duration={3000}
          closeButton
        />

        <Routes>
          {/* 1. ACCESO Y SEGURIDAD */}
          <Route path="/" element={<Login />} />
          <Route path="/login" element={<Login />} />
          
          {/* 2. GESTIÓN DE SOCIOS Y STAFF */}
          <Route path="/miembros" element={<MembersPage />} />
          <Route path="/empleados" element={<EmployeesPage />} />
          
          {/* 3. DASHBOARD (CENTRO DE MANDO) */}
          <Route path="/dashboard" element={<Dashboard />} />
          
          {/* 🚀 NUEVO: SECCIÓN DE RESERVAS (PRÓXIMAMENTE) */}
          <Route path="/reservas" element={<ReservasPage />} />

          {/* 4. INFRAESTRUCTURA Y ARSENAL (REVISADAS ✅) */}
          <Route path="/maquinas" element={<MachinesPage />} /> 
          <Route path="/sedes" element={<SedesPage />} />
          <Route path="/settings" element={<SystemPage />} />

          {/* 5. REDIRECCIÓN GLOBAL: Si la ruta no existe o falla, al Login */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;