import { useContext } from 'react'
import { AuthContext } from "../../context/AuthContext"
import { Navigate } from "react-router-dom"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUserCircle } from '@fortawesome/free-solid-svg-icons';
import { faEnvelope } from '@fortawesome/free-solid-svg-icons';

export const Account = () => {
    const { user, googleSignOut } = useContext(AuthContext)

    if (!user || !user.logged) {
        return <Navigate to="/" />;
    }

    return (
        <div>
            <h2>MY ACCOUNT</h2>
            <div>
                <p>MY DATA</p>
                <div><FontAwesomeIcon className='data_icon' icon={faUserCircle} /><p className='data_txt'>{user.name}</p></div>
                <div><FontAwesomeIcon  className='data_icon'icon={faEnvelope} /><p className='data_txt'>{user.email}</p></div>

                <button onClick={googleSignOut}>Cerrar Sesión</button>            
            </div>
        </div>
    )

}