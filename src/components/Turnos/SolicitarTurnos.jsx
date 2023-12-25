import { useState, useContext, useEffect } from 'react';
import { AuthContext } from '../../context/AuthContext';
import { ref, push, set, get } from 'firebase/database';
import { db } from '../../firebase/config';

export const SolicitarTurnos = () => {
  const { user } = useContext(AuthContext);
  const [fecha, setFecha] = useState('');
  const [hora, setHora] = useState('');
  const [disponibilidad, setDisponibilidad] = useState({});
  const [fechasDisponibles, setFechasDisponibles] = useState([]);
  const [horasDisponibles, setHorasDisponibles] = useState([]);

  useEffect(() => {
    
    const cargarDisponibilidad = async () => {
      const disponibilidadRef = ref(db, 'disponibilidad');
      const disponibilidadSnapshot = await get(disponibilidadRef);

      if (disponibilidadSnapshot.exists()) {
        const disponibilidadData = disponibilidadSnapshot.val();
        setDisponibilidad(disponibilidadData);

        
        const fechas = Object.keys(disponibilidadData);
        setFechasDisponibles(fechas);
      }
    };

    cargarDisponibilidad();
  }, []);

  const handleFechaChange = (selectedFecha) => {
    setFecha(selectedFecha);

    
    if (disponibilidad[selectedFecha]) {
      setHorasDisponibles(disponibilidad[selectedFecha].horas);
    } else {
      setHorasDisponibles([]);
    }

    
    setHora('');
  };

  const solicitarTurno = async () => {
    try {
      if (!user || !user.logged || !user.email) {
        console.error('Error al solicitar turno: Usuario no autenticado o sin correo electrónico');
        return;
      }
  
      if (!fecha || !hora) {
        alert('Por favor, seleccione fecha y hora antes de solicitar el turno.');
        return;
      }
  
      
      const horaSeleccionadaDisponible = horasDisponibles.includes(hora);
  
      if (!horaSeleccionadaDisponible) {
        alert('La hora seleccionada no está disponible. Por favor, elija otra hora.');
        return;
      }
  
      
      const fechaHoraSeleccionada = new Date(`${fecha}T${hora}`);
      const fechaHoraActual = new Date();
      const tiempoAntelacionMinima = 30 * 60 * 1000; 
  
      if (fechaHoraSeleccionada.getTime() - fechaHoraActual.getTime() < tiempoAntelacionMinima) {
        alert('Debe solicitar el turno con al menos 30 minutos de antelación.');
        return;
      }
  
      
      const disponibilidadFecha = disponibilidad[fecha] || { horas: [] };
      const horasActualizadas = disponibilidadFecha.horas.filter((h) => h !== hora);
      disponibilidad[fecha] = { horas: horasActualizadas };
  
      const disponibilidadRef = ref(db, 'disponibilidad');
      await set(disponibilidadRef, disponibilidad);
  

      const turnosRef = ref(db, 'turnos');
      const nuevoTurnoRef = push(turnosRef);
  
      await set(nuevoTurnoRef, {
        fecha,
        hora,
        usuarioEmail: user.email,
      });
  
      alert('Turno solicitado correctamente');

      setFecha('');
      setHora('');
      setHorasDisponibles([]);
    } catch (error) {
      console.error('Error al solicitar turno:', error.message);
    }
  };
  

  return (
    <div>
      <label>Fecha:</label>
      <select value={fecha} onChange={(e) => handleFechaChange(e.target.value)}>
        <option value="">Seleccionar Fecha</option>
        {fechasDisponibles.map((fechaDisponible) => (
          <option key={fechaDisponible} value={fechaDisponible}>
            {fechaDisponible}
          </option>
        ))}
      </select>

      {fecha && (
        <>
          <label>Hora:</label>
          <select value={hora} onChange={(e) => setHora(e.target.value)}>
            <option value="">Seleccionar Hora</option>
            {horasDisponibles.map((horaDisponible) => (
              <option key={horaDisponible} value={horaDisponible}>
                {horaDisponible}
              </option>
            ))}
          </select>

          <button onClick={solicitarTurno}>Solicitar Turno</button>
        </>
      )}
    </div>
  );
};
