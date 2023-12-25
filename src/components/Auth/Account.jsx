import { useState, useEffect, useContext } from 'react';
import { db } from '../../firebase/config.js';
import { ref, onValue, query, orderByChild, equalTo } from 'firebase/database';
import { AuthContext } from '../../context/AuthContext';
import { Navigate } from 'react-router-dom';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUserCircle } from '@fortawesome/free-solid-svg-icons';
import { faEnvelope } from '@fortawesome/free-solid-svg-icons';

export const Account = () => {
  const { user, googleSignOut } = useContext(AuthContext);
  const [turnos, setTurnos] = useState([]);

  if (!user || !user.logged) {
    return <Navigate to="/" />;
  }

  useEffect(() => {
    const turnosRef = ref(db, 'turnos');

    
    const turnosUsuarioQuery = query(
      turnosRef,
      orderByChild('usuarioEmail'),
      equalTo(user.email)
    );

    const unsubscribe = onValue(turnosUsuarioQuery, (snapshot) => {
      const turnosData = snapshot.val();

      if (turnosData) {
        const turnosArray = Object.entries(turnosData).map(([id, turno]) => ({
          id,
          ...turno,
        }));
        setTurnos(turnosArray);
      } else {
        setTurnos([]);
      }
    });

    return () => unsubscribe();
  }, [user.email]);

  return (
    <div>
      <h2>MY DATA</h2>
      <div>
        <p>MY DATA</p>
        <div>
          <FontAwesomeIcon className='data_icon' icon={faUserCircle} />
          <p className='data_txt'>{user.name}</p>
        </div>
        <div>
          <FontAwesomeIcon className='data_icon' icon={faEnvelope} />
          <p className='data_txt'>{user.email}</p>
        </div>

        <button onClick={googleSignOut && <Navigate to="/" />}>Cerrar Sesión</button>
      </div>

      <h2>Turnos Solicitados</h2>
      <ul>
        {turnos.map((turno) => (
          <li key={turno.id}>
            <strong>Fecha:</strong> {turno.fecha}, <strong>Hora:</strong> {turno.hora}, <strong>Usuario:</strong> {turno.usuarioEmail}
          </li>
        ))}
      </ul>
    </div>
  );
};
