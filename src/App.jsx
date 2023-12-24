import "./style/style.scss"
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"
import { AuthContextProvider } from "./context/AuthContext"
import { Login } from "./components/Auth/Login"
import { Account } from "./components/Auth/Account"
import { Admin } from "./components/Admin/Admin"

function App() {

  return (
    <AuthContextProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<h1>hola</h1>} />
          {/* <Route path="*" element={<Navigate to="/" />} /> */}
          <Route path="/login" element={<Login />} />
          <Route path="/account" element={<Account />} />
          <Route path="/admin" element={<Admin />} />
        </Routes>

      </BrowserRouter>

    </AuthContextProvider>
  )
}

export default App
