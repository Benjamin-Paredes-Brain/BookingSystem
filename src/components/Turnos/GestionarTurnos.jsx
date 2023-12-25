import { useState, useEffect, useContext } from 'react';
import { db } from '../../firebase/config.js';
import { ref, onValue } from "firebase/database"
import { AuthContext } from "../../context/AuthContext"
import { Navigate } from 'react-router-dom';
import moment from 'moment';

export const GestionarTurnos = () => {
    const { user } = useContext(AuthContext)
    const [turnos, setTurnos] = useState([]);
    const [filtro, setFiltro] = useState('todos');
    const [semanaSeleccionada, setSemanaSeleccionada] = useState(moment().isoWeek());
    const [mesSeleccionado, setMesSeleccionado] = useState(moment().month() + 1);
    const [semanasConTurnos, setSemanasConTurnos] = useState([]);

    if (!user || !user.logged || !user.isAdmin) {
        return <Navigate to="/" />;
    }

    useEffect(() => {
        const turnosRef = ref(db, 'turnos');

        const unsubscribe = onValue(turnosRef, (snapshot) => {
            const turnosData = snapshot.val();
            if (turnosData) {
                const turnosArray = Object.entries(turnosData).map(([id, turno]) => ({
                    id,
                    ...turno,
                }));
                setTurnos(turnosArray);

                const semanas = turnosArray.map(turno => moment(turno.fecha).isoWeek());
                setSemanasConTurnos(Array.from(new Set(semanas)));
            } else {
                setTurnos([]);
                setSemanasConTurnos([]);
            }
        });

        return () => unsubscribe();
    }, []);

    const filtrarTurnos = () => {
        switch (filtro) {
            case 'dia':
                const hoy = moment().format('YYYY-MM-DD');
                return turnos.filter(turno => moment(turno.fecha).isSame(hoy, 'day'));
            case 'semana':
                const inicioSemanaSeleccionada = moment().isoWeek(semanaSeleccionada).startOf('week').format('YYYY-MM-DD');
                const finSemanaSeleccionada = moment().isoWeek(semanaSeleccionada).endOf('week').format('YYYY-MM-DD');
                return turnos
                    .filter(turno => moment(turno.fecha).isBetween(inicioSemanaSeleccionada, finSemanaSeleccionada, 'day', '[]'))
                    .sort((a, b) => moment(`${a.fecha} ${a.hora}`, 'YYYY-MM-DD HH:mm').valueOf() - moment(`${b.fecha} ${b.hora}`, 'YYYY-MM-DD HH:mm').valueOf());
            case 'mes':
                const inicioMesSeleccionado = moment().month(mesSeleccionado - 1).startOf('month').format('YYYY-MM-DD');
                const finMesSeleccionado = moment().month(mesSeleccionado - 1).endOf('month').format('YYYY-MM-DD');
                return turnos
                    .filter(turno => moment(turno.fecha).isBetween(inicioMesSeleccionado, finMesSeleccionado, 'day', '[]'))
                    .sort((a, b) => moment(`${a.fecha} ${a.hora}`, 'YYYY-MM-DD HH:mm').valueOf() - moment(`${b.fecha} ${b.hora}`, 'YYYY-MM-DD HH:mm').valueOf());
            default:
                return turnos.sort((a, b) => moment(`${a.fecha} ${a.hora}`, 'YYYY-MM-DD HH:mm').valueOf() - moment(`${b.fecha} ${b.hora}`, 'YYYY-MM-DD HH:mm').valueOf());
        }
    };

    const generarOpcionesSemana = () => {
        return semanasConTurnos.map(semana => {
            const inicioSemana = moment().isoWeek(semana).startOf('week').format('YYYY-MM-DD');
            const finSemana = moment().isoWeek(semana).endOf('week').format('YYYY-MM-DD');
            return <option key={semana} value={semana}>{`${inicioSemana} - ${finSemana}`}</option>;
        });
    };

    const generarOpcionesMes = () => {
        const opciones = [];
        for (let i = 1; i <= 12; i++) {
            opciones.push(<option key={i} value={i}>{moment().month(i - 1).format('MMMM')}</option>);
        }
        return opciones;
    };

    return (
        <div>
            <h2>Turnos Solicitados</h2>
            <div>
                <label>Filtrar por:</label>
                <select onChange={(e) => setFiltro(e.target.value)}>
                    <option value="todos">Todos</option>
                    <option value="dia">Día</option>
                    <option value="semana">Semana</option>
                    <option value="mes">Mes</option>
                </select>

                {filtro === 'semana' && semanasConTurnos.length > 0 &&
                    <select onChange={(e) => setSemanaSeleccionada(e.target.value)}>
                        {generarOpcionesSemana()}
                    </select>
                }

                {filtro === 'mes' &&
                    <select onChange={(e) => setMesSeleccionado(e.target.value)}>
                        {generarOpcionesMes()}
                    </select>
                }
            </div>
            <ul>
                {filtrarTurnos().map((turno) => (
                    <li key={turno.id}>
                        <strong>Fecha:</strong> {turno.fecha}, <strong>Hora:</strong> {turno.hora}, <strong>Usuario:</strong> {turno.usuarioEmail}
                    </li>
                ))}
            </ul>
        </div>
    );
};
