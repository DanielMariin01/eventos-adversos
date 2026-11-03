import { COLORS } from '@/theme';
import { useState } from 'react';
import { Head, useForm } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import Tabla from '@/Components/Tabla';
import Swal from 'sweetalert2';
import { Search, Upload, ClipboardList, FileText, Eye, Filter, AlertTriangle, Clock } from 'lucide-react';
import { HiOutlineEye, HiOutlineClipboardList, HiOutlineUpload, HiOutlineSpeakerphone, HiOutlineStop, HiOutlineBell } from 'react-icons/hi';
import ModalVerAnalisis from '@/Components/Mejoras/ModalVerAnalisis';
import ModalVerPlan from '@/Components/Mejoras/ModalVerPlan';
import ModalRevisiones from '@/Components/Mejoras/ModalRevisiones';
import ModalSubirEvidencia from '@/Components/Eventos/ModalSubirEvidencia';
import ModalVerCancelacion from '@/Components/Eventos/ModalVerCancelacion';


const BADGE_ESTADO = {
    en_proceso: 'bg-yellow-500 text-white',
    analizado: 'bg-blue-500 text-white',
    procesado: 'bg-green-500 text-white',
    cancelado: 'bg-red-900 text-white',
    en_mejora: 'bg-primary-500 text-white',
    radicado: 'bg-purple-500 text-white',
    cerrado: 'bg-gray-700 text-white',
};

const LABEL_ESTADO = {
    en_proceso: 'En Proceso',
    analizado: 'Analizado',
    procesado: 'Procesado',
    cancelado: 'Cancelado',
    en_mejora: 'En Mejora',
    radicado: 'Radicado',
    cerrado: 'Cerrado',
};

export default function MisEventos({ eventos, proximosVencer, vencidos }) {

    const [eventoSeleccionado, setEventoSeleccionado] = useState(null);
    const [busquedaEvento, setBusquedaEvento] = useState('');
    const [busquedaReportante, setBusquedaReportante] = useState('');
    const [busquedaPaciente, setBusquedaPaciente] = useState('');
    const [modalAnalisis, setModalAnalisis] = useState(false);
    const [modalPlan, setModalPlan] = useState(false);
    const [modalRevisiones, setModalRevisiones] = useState(false);
    const [modalEvidencia, setModalEvidencia] = useState(false);
    const [cargando, setCargando] = useState(false);
    const [filtroEstado, setFiltroEstado] = useState('');
    const [modalCancelacion, setModalCancelacion] = useState(false);

    const alertSeleccionar = () => {
        Swal.fire({
            icon: 'info',
            title: 'Selecciona un evento',
            text: 'Debes seleccionar un evento de la tabla para realizar esta acción.',
        });
    };

    const abrirVerAnalisis = () => {
        if (!eventoSeleccionado) return alertSeleccionar();
        setModalAnalisis(true);
    };

    const abrirVerPlan = () => {
        if (!eventoSeleccionado) return alertSeleccionar();
        if (!eventoSeleccionado.plan_mejora) {
            return Swal.fire({ icon: 'info', title: 'Sin plan de mejora', text: 'Este evento aún no tiene un plan de mejora.' });
        }
        setModalPlan(true);
    };

    const abrirRevisiones = () => {
        if (!eventoSeleccionado) return alertSeleccionar();
        setModalRevisiones(true);
    };

    const abrirSubirEvidencia = () => {
        if (!eventoSeleccionado) return alertSeleccionar();
        setModalEvidencia(true);
    };

    // ── Columnas ──
    const columnas = [
        {
            label: 'Evento',
            key: 'id_eventoAdverso',
            render: (fila) => (
                <span className="font-bold text-primary-600">#{fila.id_eventoAdverso}</span>
            ),
        },
        {
            label: 'Fecha',
            key: 'fecha_evento',
            render: (fila) => (
                <span className="text-xs">{fila.fecha_evento?.split('T')[0] ?? '—'}</span>
            ),
        },
        {
            label: 'Creación',
            key: 'created_at',
            render: (fila) => (
                <span className="text-xs">{fila.created_at?.replace('T', ' ').slice(0, 16) ?? '—'}</span>
            ),
        },
        {
            label: 'Detalle',
            key: 'detalle',
            render: (fila) => (
                <div className="text-xs space-y-0.5">
                    <p><span className="font-semibold">Área:</span> {fila.area?.nombre ?? '—'}</p>
                    <p><span className="font-semibold">Tipo:</span> {fila.categoria?.nombre ?? '—'}</p>
                </div>
            ),
        },
        {
            label: 'Reportante',
            key: 'reportante',
            render: (fila) => (
                <div className="flex gap-3 items-start">
                    {/* Iconos apilados */}
                    <div className="flex flex-col">
                        {fila.estado === 'cancelado' ? (
                            // Solo mostrar icono de cancelación
                            <button
                                onClick={(e) => { e.stopPropagation(); setEventoSeleccionado(fila); setModalCancelacion(true); }}
                                title="Ver cancelación"
                                className="w-8 h-8 rounded-full bg-secondary-500 hover:bg-secondary-600 text-white flex items-center justify-center transition"
                            >
                                <HiOutlineEye className="w-4 h-4" />
                            </button>
                        ) : (
                            // Mostrar iconos normales
                            <>
                                <button
                                    onClick={(e) => { e.stopPropagation(); setEventoSeleccionado(fila); setModalAnalisis(true); }}
                                    title="Ver análisis"
                                    className="w-8 h-8 rounded-t-full bg-secondary-500 hover:bg-secondary-600 text-white flex items-center justify-center transition"
                                >
                                    <HiOutlineEye className="w-4 h-4" />
                                </button>
                                <button
                                    onClick={(e) => { e.stopPropagation(); setEventoSeleccionado(fila); setModalPlan(true); }}
                                    title="Ver plan de mejora"
                                    className={`w-8 h-8 bg-blue-500 hover:bg-blue-600 text-white flex items-center justify-center transition ${fila.estado === 'cerrado' ? 'rounded-b-full' : ''
                                        }`}
                                >
                                    <HiOutlineClipboardList className="w-4 h-4" />
                                </button>
                                {fila.estado !== 'cerrado' && (
                                    <button
                                        onClick={(e) => { e.stopPropagation(); setEventoSeleccionado(fila); setModalEvidencia(true); }}
                                        title="Subir evidencia"
                                        className="w-8 h-8 rounded-b-full bg-primary-500 hover:bg-primary-600 text-white flex items-center justify-center transition"
                                    >
                                        <HiOutlineUpload className="w-4 h-4" />
                                    </button>
                                )}
                            </>
                        )}
                    </div>

                    {/* Datos del reportante */}
                    <div className="text-xs space-y-0.5">
                        <p><span className="font-semibold">Doc:</span> {fila.reportante?.cedula ?? '—'}</p>
                        <p><span className="font-semibold">Nombre:</span> {fila.reportante?.nombres} {fila.reportante?.apellidos}</p>
                        <p><span className="font-semibold">Cargo:</span> {fila.reportante?.cargo ?? '—'}</p>
                    </div>
                </div>
            ),
        },
        {
            label: 'Paciente',
            key: 'paciente',
            render: (fila) => (
                <div className="text-xs space-y-0.5">
                    <p><span className="font-semibold">Doc:</span> {fila.paciente?.cedula ?? '—'}</p>
                    <p><span className="font-semibold">Nombre:</span> {fila.paciente?.nombres} {fila.paciente?.apellidos}</p>
                    <p><span className="font-semibold">Edad:</span> {fila.paciente?.edad ?? '—'} {fila.paciente?.edad_unidad ?? ''}</p>
                </div>
            ),
        },
        {
            label: 'Estado',
            key: 'estado',
            render: (fila) => (
                <span className={`px-2 py-1.5 rounded-md text-xs font-bold uppercase ${BADGE_ESTADO[fila.estado] ?? 'bg-gray-100 text-gray-600'}`}>
                    {LABEL_ESTADO[fila.estado] ?? fila.estado}
                </span>
            ),
        },
    ];

    // ── Filtro ──
    const eventosFiltrados = {
        ...eventos,
        data: eventos.data.filter(e =>
            (filtroEstado === '' || e.estado === filtroEstado) &&
            (busquedaEvento === '' || String(e.id_eventoAdverso).includes(busquedaEvento)) &&
            (busquedaReportante === '' ||
                e.reportante?.nombres?.toLowerCase().includes(busquedaReportante.toLowerCase()) ||
                e.reportante?.cedula?.includes(busquedaReportante)) &&
            (busquedaPaciente === '' ||
                e.paciente?.nombres?.toLowerCase().includes(busquedaPaciente.toLowerCase()) ||
                e.paciente?.cedula?.includes(busquedaPaciente))
        ),
    };

    return (
        <AuthenticatedLayout header={<h2 className="text-xl font-semibold text-white uppercase">Mis Eventos Asignados</h2>}>
            <Head title="Mis Eventos" />

            {/* Loading */}
            {cargando && (
                <div className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-100/70">
                    <div className="relative w-[150px] h-[73px]">
                        <svg viewBox="0 0 150 73" height="73px" width="150px" xmlns="http://www.w3.org/2000/svg">
                            <polyline
                                points="0,45.486 38.514,45.486 44.595,33.324 50.676,45.486 57.771,45.486 62.838,55.622 71.959,9 80.067,63.729 84.122,45.486 97.297,45.486 103.379,40.419 110.473,45.486 150,45.486"
                                strokeMiterlimit="10" strokeWidth="3" stroke={COLORS.secondary} fill="none"
                            />
                        </svg>
                        <div className="absolute inset-0 bg-slate-100 animate-[heartRateIn_0.8s_linear_infinite]" style={{ left: 0, right: 'auto' }} />
                        <div className="absolute top-0 h-full bg-slate-100 animate-[heartRateOut_0.8s_linear_infinite]" style={{ width: '120%', left: '-120%' }} />
                    </div>
                </div>
            )}

            <div className="max-w-7xl mx-auto py-8 px-6">

                {/* ── Acciones ── */}
                <div className="flex flex-wrap gap-2 mb-4">
                    <button
                        onClick={abrirSubirEvidencia}
                        disabled={!eventoSeleccionado || eventoSeleccionado?.estado === 'cerrado' || eventoSeleccionado?.estado === 'cancelado'}
                        className="flex items-center gap-2 px-4 py-2 text-xs font-semibold text-white bg-primary-500 rounded-lg hover:bg-primary-600 transition disabled:opacity-40 disabled:cursor-not-allowed"
                    >
                        <Upload className="w-4 h-4" />
                        Subir evidencia
                    </button>

                    <button
                        onClick={abrirVerAnalisis}
                        disabled={!eventoSeleccionado}
                        className="flex items-center gap-2 px-4 py-2 text-xs font-semibold text-white bg-secondary-500 rounded-lg hover:bg-secondary-700 transition disabled:opacity-40 disabled:cursor-not-allowed"
                    >
                        <ClipboardList className="w-4 h-4" />
                        Ver análisis
                    </button>

                    <button
                        onClick={abrirVerPlan}
                        disabled={!eventoSeleccionado}
                        className="flex items-center gap-2 px-4 py-2 text-xs font-semibold text-white bg-blue-500 rounded-lg hover:bg-blue-600 transition disabled:opacity-40 disabled:cursor-not-allowed"
                    >
                        <FileText className="w-4 h-4" />
                        Ver plan de mejora
                    </button>

                    <button
                        onClick={abrirRevisiones}
                        disabled={!eventoSeleccionado}
                        className="flex items-center gap-2 px-4 py-2 text-xs font-semibold text-white bg-gray-500 rounded-lg hover:bg-gray-600 transition disabled:opacity-40 disabled:cursor-not-allowed"
                    >
                        <Eye className="w-4 h-4" />
                        Ver revisiones
                    </button>
                </div>
                {/* ── Alertas ── */}
                {proximosVencer.length > 0 && (
                    <div className="flex items-center bg-blue-500 text-white text-sm font-bold px-4 py-3 rounded-lg mb-4" role="alert">
                        <HiOutlineBell className="w-6 h-6 mr-2 flex-shrink-0" />
                        <p>
                            Por favor revisa los siguientes eventos: {' '}
                            {proximosVencer.map((e, i) => (
                                <span key={e.id_eventoAdverso} className="underline">
                                  Evento #{e.id_eventoAdverso}{i < proximosVencer.length - 1 ? ', ' : '.'}
                                </span>
                            ))}
                        </p>
                    </div>
                )}

                {vencidos.length > 0 && (
                    <div className="flex items-center bg-blue-500 text-white text-sm font-bold px-4 py-3 rounded-lg mb-4" role="alert">
                        <HiOutlineBell className="w-5 h-5 mr-2 flex-shrink-0" />
                        <p>
                            ¡Urgente! Por favor sube la evidencia de los siguientes eventos: {' '}
                            {vencidos.map((e, i) => (
                                <span key={e.id_eventoAdverso} className="underline">
                                    Evento # {e.id_eventoAdverso}{i < vencidos.length - 1 ? ', ' : '.'}
                                </span>
                            ))}
                        </p>
                    </div>
                )}
                {/* ── Buscadores ── */}
                <div className="mb-4 grid grid-cols-1 md:grid-cols-4 gap-3">
                    <div className="flex items-center border-2 border-primary-300 rounded-lg overflow-hidden focus-within:border-primary-500">
                        <input type="text" value={busquedaEvento} onChange={e => setBusquedaEvento(e.target.value)} placeholder="Buscar evento..." className="flex-1 px-4 py-3 text-sm focus:outline-none" />
                        <div className="bg-secondary-500 px-3 py-2.5"><Search className="w-4 h-4 text-white" /></div>
                    </div>
                    <div className="flex items-center border-2 border-primary-300 rounded-lg overflow-hidden focus-within:border-primary-500">
                        <input type="text" value={busquedaReportante} onChange={e => setBusquedaReportante(e.target.value)} placeholder="Buscar reportante..." className="flex-1 px-4 py-3 text-sm focus:outline-none" />
                        <div className="bg-secondary-500 px-3 py-2.5"><Search className="w-4 h-4 text-white" /></div>
                    </div>
                    <div className="flex items-center border-2 border-primary-300 rounded-lg overflow-hidden focus-within:border-primary-500">
                        <input type="text" value={busquedaPaciente} onChange={e => setBusquedaPaciente(e.target.value)} placeholder="Buscar paciente..." className="flex-1 px-4 py-3 text-sm focus:outline-none" />
                        <div className="bg-secondary-500 px-3 py-2.5"><Search className="w-4 h-4 text-white" /></div>
                    </div>
                    <div className="flex items-center border-2 border-primary-300 rounded-lg overflow-hidden focus-within:border-primary-500">
                        <select
                            value={filtroEstado}
                            onChange={e => setFiltroEstado(e.target.value)}
                            className="flex-1 px-4 py-3 text-sm focus:outline-none bg-white"
                        >
                            <option value="">Todos los estados</option>
                            <option value="en_mejora">En Mejora</option>
                            <option value="radicado">Radicado</option>
                            <option value="cerrado">Cerrado</option>
                            <option value="cancelado">Cancelado</option>
                        </select>
                        <div className="bg-secondary-500 px-3 py-2.5 flex-shrink-0">
                            <Filter className="w-4 h-4 text-white" />
                        </div>
                    </div>
                </div>

                {/* ── Tabla ── */}
                <Tabla
                    columnas={columnas}
                    datos={eventosFiltrados}
                    mensajeVacio="No tienes eventos asignados."
                    onRowClick={(fila) => setEventoSeleccionado(
                        eventoSeleccionado?.id_eventoAdverso === fila.id_eventoAdverso ? null : fila
                    )}
                    filaSeleccionada={eventoSeleccionado?.id_eventoAdverso}
                    renderExpansion={(fila) => {
                        const leer = () => {
                            if ('speechSynthesis' in window) {
                                window.speechSynthesis.cancel();
                                const utterance = new SpeechSynthesisUtterance(fila.descripcion);
                                utterance.lang = 'es-CO';
                                utterance.rate = 1.2;
                                utterance.pitch = 1.1;
                                const voces = window.speechSynthesis.getVoices();
                                const vozEspanol = voces.find(v => v.lang.startsWith('es') && v.localService === true) || voces.find(v => v.lang.startsWith('es'));
                                if (vozEspanol) utterance.voice = vozEspanol;
                                window.speechSynthesis.speak(utterance);
                            }
                        };
                        const detener = () => {
                            if ('speechSynthesis' in window) window.speechSynthesis.cancel();
                        };
                        return (
                            <div className="flex items-start gap-4">
                                <div className="flex-1">
                                    <span className="font-bold text-sm">Descripción: </span>
                                    <span className="text-sm text-gray-700">{fila.descripcion}</span>
                                </div>
                                <div className="flex gap-2 flex-shrink-0">
                                    <button onClick={leer} className="flex items-center gap-1 px-3 py-1.5 text-xs font-semibold text-white bg-primary-500 rounded-lg hover:bg-primary-600 transition">
                                        <HiOutlineSpeakerphone className="w-4 h-4" /> Leer
                                    </button>
                                    <button onClick={detener} className="flex items-center gap-1 px-3 py-1.5 text-xs font-semibold text-white bg-zinc-500 rounded-lg hover:bg-zinc-600 transition">
                                        <HiOutlineStop className="w-4 h-4" /> Detener
                                    </button>
                                </div>
                            </div>
                        );
                    }}
                />

                {eventoSeleccionado && (
                    <p className="mt-2 text-xs text-primary-600">
                        ✓ Evento #{eventoSeleccionado.id_eventoAdverso} seleccionado
                    </p>
                )}
            </div>

            {/* ── Modales ── */}
            {modalAnalisis && (
                <ModalVerAnalisis evento={eventoSeleccionado} onClose={() => setModalAnalisis(false)} />
            )}
            {modalPlan && (
                <ModalVerPlan evento={eventoSeleccionado} onClose={() => setModalPlan(false)} />
            )}
            {modalRevisiones && (
                <ModalRevisiones evento={eventoSeleccionado} onClose={() => setModalRevisiones(false)} />
            )}
            {modalEvidencia && (
                <ModalSubirEvidencia
                    evento={eventoSeleccionado}
                    onClose={() => setModalEvidencia(false)}
                    setCargando={setCargando}
                />
            )}
            {modalCancelacion && (
                <ModalVerCancelacion
                    evento={eventoSeleccionado}
                    onClose={() => setModalCancelacion(false)}
                />
            )}

        </AuthenticatedLayout>
    );
}