import "./style/style.scss"
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"
import { AuthContextProvider } from "./context/AuthContext"
import { Login } from "./components/Auth/Login"
import { Account } from "./components/Auth/Account"
import { Admin } from "./components/Admin/Admin"
import { SolicitarTurnos } from "./components/Turnos/SolicitarTurnos"
import { GestionarTurnos } from "./components/Turnos/GestionarTurnos"
import { GestionarDisponibilidad } from "./components/Admin/GestionarDisponibilidad"

function App() {

  return (
    <AuthContextProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<h1>hola</h1>} />
          <Route path="*" element={<Navigate to="/" />} />

          <Route path="/login" element={<Login />} />
          <Route path="/account" element={<Account />} />

          <Route path="/admin" element={<Admin />} />

          <Route path="/solicitarTurnos" element={<SolicitarTurnos />} />
          <Route path="/admin/gestionarTurnos" element={<GestionarTurnos />} />
          <Route path="/admin/gestionarDisponibilidad" element={<GestionarDisponibilidad />} />
        </Routes>

      </BrowserRouter>

    </AuthContextProvider>
  )
}

export default App
