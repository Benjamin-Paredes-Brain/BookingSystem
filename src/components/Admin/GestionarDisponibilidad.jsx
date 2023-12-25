import { useState, useEffect, useContext } from 'react';
import DatePicker from 'react-datepicker';
import TimePicker from 'react-time-picker';
import { db } from '../../firebase/config';
import { ref, set, get } from 'firebase/database';
import { AuthContext } from "../../context/AuthContext"
import { Navigate } from 'react-router-dom';

export const GestionarDisponibilidad = () => {
    const { user } = useContext(AuthContext)
    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);
    const [startHour, setStartHour] = useState('09:00');
    const [endHour, setEndHour] = useState('17:00');
    const [disponibilidad, setDisponibilidad] = useState({});
    const [reloadDisponibilidad, setReloadDisponibilidad] = useState(false);

    if (!user || !user.logged || !user.isAdmin) {
        return <Navigate to="/" />;
    }

    useEffect(() => {
        
        const cargarDisponibilidad = async () => {
            const disponibilidadRef = ref(db, 'disponibilidad');
            const disponibilidadSnapshot = await get(disponibilidadRef);

            if (disponibilidadSnapshot.exists()) {
                setDisponibilidad(disponibilidadSnapshot.val());
            }
        };

        cargarDisponibilidad();
    }, [reloadDisponibilidad]);

    const agregarDisponibilidad = async () => {
        if (!startDate || !endDate || !startHour || !endHour) {
            alert('Por favor, complete todas las selecciones.');
            return;
        }

        
        const rangoFechas = [];
        let currentDate = new Date(startDate);
        const finalDate = new Date(endDate);

        while (currentDate <= finalDate) {
            rangoFechas.push(new Date(currentDate));
            currentDate.setDate(currentDate.getDate() + 1);
        }

        
        const rangoHoras = obtenerRangoHoras(startHour, endHour);

        
        for (const fechaSeleccionada of rangoFechas) {
            const fechaFormateada = fechaSeleccionada.toISOString().split('T')[0];
            const disponibilidadFecha = disponibilidad[fechaFormateada] || { horas: [] };

            
            for (const hora of rangoHoras) {
                const horaSeleccionada = new Date(`${fechaFormateada}T${hora}`);
                const tiempoAntelacionMinima = 30 * 60 * 1000; 

                
                if (horaSeleccionada.getTime() - new Date().getTime() < tiempoAntelacionMinima) {
                    alert('No se puede agregar disponibilidad a horas pasadas o tan cerca de la hora pactada. Debe haber un rango de al menos 30 minutos.');
                    return;
                }

                if (!disponibilidadFecha.horas.includes(hora)) {
                    disponibilidadFecha.horas.push(hora);
                }
            }

            
            const disponibilidadRef = ref(db, `disponibilidad/${fechaFormateada}`);
            await set(disponibilidadRef, disponibilidadFecha);
        }

        
        setStartDate(null);
        setEndDate(null);
        setStartHour('09:00');
        setEndHour('17:00');

        
        setReloadDisponibilidad((prevState) => !prevState);

        alert('Disponibilidad agregada correctamente.');
    };

    
    const obtenerRangoHoras = (horaInicio, horaFinal) => {
        const rangoHoras = [];
        let horaActual = new Date(`2000-01-01T${horaInicio}`);
        const horaFin = new Date(`2000-01-01T${horaFinal}`);

        while (horaActual <= horaFin) {
            rangoHoras.push(horaActual.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
            horaActual.setHours(horaActual.getHours() + 1);
        }

        return rangoHoras;
    };

    return (
        <div>
            <h2>Gestionar Disponibilidad</h2>
            <label>Rango de Fechas:</label>
            <div>
                <DatePicker selected={startDate} onChange={(date) => setStartDate(date)} dateFormat="yyyy-MM-dd" placeholderText="Fecha de inicio" />
                <span> hasta </span>
                <DatePicker selected={endDate} onChange={(date) => setEndDate(date)} dateFormat="yyyy-MM-dd" placeholderText="Fecha de fin" />
            </div>

            <label>Rango de Horas:</label>
            <div>
                <TimePicker onChange={(time) => setStartHour(time)} value={startHour} clearIcon={null} disableClock={true} />
                <span> a </span>
                <TimePicker onChange={(time) => setEndHour(time)} value={endHour} clearIcon={null} disableClock={true} />
            </div>

            <button onClick={agregarDisponibilidad}>Agregar Disponibilidad</button>
        </div>
    );
};
