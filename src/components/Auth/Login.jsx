import { useContext } from 'react'
import { AuthContext } from '../../context/AuthContext';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGoogle } from "@fortawesome/free-brands-svg-icons"
import { Navigate } from 'react-router-dom';


export const Login = () => {
    const { googleLogin, user } = useContext(AuthContext)

    if (user.logged) {
        return <Navigate to="/account" />;
    }

    return (
        <div>
            <h2>LOGIN</h2>

            <button onClick={googleLogin}>
                <div>
                    <FontAwesomeIcon icon={faGoogle} />
                    <div>Sign in with Google</div>
                </div>
            </button>

        </div>
    )
}