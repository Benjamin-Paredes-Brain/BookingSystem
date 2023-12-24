import { useContext } from "react"
import { AuthContext } from "../../context/AuthContext"
import { Navigate } from "react-router-dom"

export const Admin = () => {
    const { user } = useContext(AuthContext)

    if (!user || !user.logged || !user.isAdmin) {
        return <Navigate to="/" />;
    }

    return (
        <p>Only admin can read this</p>
    )
}