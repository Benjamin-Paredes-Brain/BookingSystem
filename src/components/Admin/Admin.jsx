import { useContext } from "react"
import { AuthContext } from "../../context/AuthContext"
import { Link, Navigate } from "react-router-dom"

export const Admin = () => {
    const { user } = useContext(AuthContext)

    if (!user || !user.logged || !user.isAdmin) {
        return <Navigate to="/" />;
    }

    return (
        <div>
            <Link to="/admin/gestionarTurnos">Gestionar Turnos</Link>
        </div>
    )
}