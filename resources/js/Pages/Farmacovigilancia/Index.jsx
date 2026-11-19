import { COLORS } from '@/theme';
import { useState } from 'react';
import { Head, router } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import Tabla from '@/Components/Tabla';
import Swal from 'sweetalert2';
import { Search, ClipboardList, XCircle, RefreshCw, Lock, Filter, MapPin } from 'lucide-react';
import ModalAnalisisFarmacovigilancia from '@/Components/Eventos/ModalAnalisisFarmacovigilancia';
import ModalCambiarTipo from '@/Components/Eventos/ModalCambiarTipo';
import ModalCambiarArea from '@/Components/Eventos/ModalCambiarArea';
import ModalCancelarEvento from '@/Components/Eventos/ModalCancelarEvento';
import { HiOutlineSpeakerphone, HiOutlineStop, HiOutlineEye } from 'react-icons/hi';
import * as XLSX from 'xlsx';
import { FaFileExcel } from 'react-icons/fa';

const BADGE_ESTADO = {
    en_proceso: 'bg-yellow-500 text-white',
    procesado: 'bg-green-500 text-white',
};

const LABEL_ESTADO = {
    en_proceso: 'En Proceso',
    procesado: 'Procesado',
};

// ── Campo de búsqueda con el estilo de marca ──
function Buscador({ value, onChange, placeholder }) {
    return (
        <div className="flex items-center border-2 border-primary-300 rounded-lg overflow-hidden focus-within:border-primary-500">
            <input
                type="text"
                value={value}
                onChange={e => onChange(e.target.value)}
                placeholder={placeholder}
                className="flex-1 px-4 py-3 text-sm focus:outline-none"
            />
            <div className="bg-secondary-500 px-3 py-2.5">
                <Search className="w-4 h-4 text-white" />
            </div>
        </div>
    );
}

export default function Index({ eventos, categorias, jefes, areas }) {
    const [eventoSeleccionado, setEventoSeleccionado] = useState(null);
    const [modalAnalisis, setModalAnalisis] = useState(false);
    const [modalTipo, setModalTipo] = useState(false);
    const [modalArea, setModalArea] = useState(false);
    const [modalCancelar, setModalCancelar] = useState(false);
    const [cargando, setCargando] = useState(false);
    const [busquedaEvento, setBusquedaEvento] = useState('');
    const [busquedaReportante, setBusquedaReportante] = useState('');
    const [busquedaPaciente, setBusquedaPaciente] = useState('');
    const [busquedaMedicamento, setBusquedaMedicamento] = useState('');
    const [filtroEstado, setFiltroEstado] = useState('');

    // ── Acciones ──
    const alertSeleccionar = () => {
        Swal.fire({
            icon: 'info',
            title: 'Selecciona un evento',
            text: 'Debes seleccionar un evento de la tabla para realizar esta acción.',
        });
    };

    const conSeleccion = (accion) => () => {
        if (!eventoSeleccionado) return alertSeleccionar();
        accion();
    };

    const cerrarAnalisis = () => {
        Swal.fire({
            title: '¿Cerrar análisis?',
            text: 'El evento pasará a estado Procesado.',
            icon: 'question',
            showCancelButton: true,
            confirmButtonColor: COLORS.primary,
            cancelButtonColor: '#6b7280',
            confirmButtonText: 'Sí, cerrar',
            cancelButtonText: 'Cancelar',
        }).then(result => {
            if (result.isConfirmed) {
                setCargando(true);
                router.patch(route('eventos.cerrar', eventoSeleccionado.id_eventoAdverso), {}, {
                    onSuccess: () => {
                        setEventoSeleccionado(null);
                        Swal.fire({ icon: 'success', title: 'Evento cerrado correctamente.' });
                    },
                    onFinish: () => setCargando(false),
                });
            }
        });
    };

    // ── Columnas de la tabla ──
    const columnas = [
        {
            label: 'Evento',
            key: 'id_eventoAdverso',
            render: (fila) => <span className="font-bold text-primary-600">#{fila.id_eventoAdverso}</span>,
        },
        {
            label: 'Fecha',
            key: 'fecha_evento',
            render: (fila) => <span className="text-xs">{fila.fecha_evento?.split('T')[0] ?? '—'}</span>,
        },
        {
            label: 'Creación',
            key: 'created_at',
            render: (fila) => <span className="text-xs">{fila.created_at?.replace('T', ' ').slice(0, 16) ?? '—'}</span>,
        },
        {
            label: 'Área',
            key: 'area',
            render: (fila) => <span className="text-xs">{fila.area?.nombre ?? '—'}</span>,
        },
        {
            label: 'Medicamentos',
            key: 'medicamentos',
            render: (fila) => (
                <div className="text-xs space-y-1 max-w-xs">
                    {(fila.medicamentos ?? []).length === 0 && <p>—</p>}
                    {(fila.medicamentos ?? []).map(m => (
                        <p key={m.id_medicamento}>
                            <span className="font-semibold">{m.nombre}:</span> {m.descripcion}
                        </p>
                    ))}
                </div>
            ),
        },
        {
            label: 'Reportante',
            key: 'reportante',
            render: (fila) => (
                <div className="flex gap-3 items-start">
                    <div className="text-xs space-y-0.5">
                        <p><span className="font-semibold">Doc:</span> {fila.reportante?.cedula ?? '—'}</p>
                        <p><span className="font-semibold">Nombre:</span> {fila.reportante?.nombres} {fila.reportante?.apellidos}</p>
                        <p><span className="font-semibold">Cargo:</span> {fila.reportante?.cargo ?? '—'}</p>
                    </div>
                    {/* Iconos apilados */}
                    <div className="flex flex-col">
                        <button
                            onClick={(e) => { e.stopPropagation(); setEventoSeleccionado(fila); setModalAnalisis(true); }}
                            title="Análisis"
                            className="w-8 h-8 rounded-t-full bg-primary-500 hover:bg-primary-600 text-white flex items-center justify-center transition"
                        >
                            <HiOutlineEye className="w-5 h-5" />
                        </button>
                        <button
                            onClick={(e) => { e.stopPropagation(); setEventoSeleccionado(fila); setModalArea(true); }}
                            title="Cambiar área"
                            className="w-8 h-8 bg-orange-500 hover:bg-orange-600 text-white flex items-center justify-center transition"
                        >
                            <MapPin className="w-4 h-4" />
                        </button>
                        <button
                            onClick={(e) => { e.stopPropagation(); setEventoSeleccionado(fila); setModalTipo(true); }}
                            title="Cambiar tipo"
                            className="w-8 h-8 rounded-b-full bg-secondary-600 hover:bg-secondary-700 text-white flex items-center justify-center transition"
                        >
                            <RefreshCw className="w-4 h-4" />
                        </button>
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

    // ── Filtros (sobre la página actual) ──
    const incluye = (texto, busqueda) => String(texto ?? '').toLowerCase().includes(busqueda.toLowerCase());

    const eventosFiltrados = {
        ...eventos,
        data: eventos.data.filter(e =>
            (filtroEstado === '' || e.estado === filtroEstado) &&
            (busquedaEvento === '' || String(e.id_eventoAdverso).includes(busquedaEvento)) &&
            (busquedaReportante === '' ||
                incluye(e.reportante?.nombres, busquedaReportante) ||
                incluye(e.reportante?.cedula, busquedaReportante)) &&
            (busquedaPaciente === '' ||
                incluye(e.paciente?.nombres, busquedaPaciente) ||
                incluye(e.paciente?.cedula, busquedaPaciente)) &&
            (busquedaMedicamento === '' ||
                (e.medicamentos ?? []).some(m => incluye(m.nombre, busquedaMedicamento)))
        ),
    };

    const exportarExcel = async () => {
        const response = await fetch(route('farmacovigilancia.exportar'));
        const datos = await response.json();

        const ws = XLSX.utils.json_to_sheet(datos);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, 'Farmacovigilancia');
        XLSX.writeFile(wb, 'Farmacovigilancia.xlsx');
    };

    const leer = (descripcion) => {
        if (!('speechSynthesis' in window)) return;
        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(descripcion);
        utterance.lang = 'es-CO';
        utterance.rate = 0.95;
        const voces = window.speechSynthesis.getVoices();
        const voz =
            voces.find(v => v.lang === 'es-CO' && v.localService) ||
            voces.find(v => v.lang.startsWith('es') && v.localService) ||
            voces.find(v => v.lang.startsWith('es'));
        if (voz) utterance.voice = voz;
        window.speechSynthesis.speak(utterance);
    };

    const detener = () => {
        if ('speechSynthesis' in window) window.speechSynthesis.cancel();
    };

    const claseBoton = 'w-9 h-9 text-white flex items-center justify-center transition disabled:opacity-40 disabled:cursor-not-allowed';

    return (
        <AuthenticatedLayout header={<h2 className="text-xl font-semibold text-white uppercase">Gestión de Farmacovigilancia</h2>}>
            <Head title="Farmacovigilancia" />

            <div className="max-w-7xl mx-auto py-8 px-6">

                {/* ── Barra de acciones ── */}
                <div className="flex flex-row mb-4">
                    <button onClick={conSeleccion(() => setModalAnalisis(true))} disabled={!eventoSeleccionado}
                        title="Añadir análisis de evento" className={`${claseBoton} bg-primary-500 hover:bg-primary-600`}>
                        <ClipboardList className="w-4 h-4" />
                    </button>
                    <button onClick={conSeleccion(cerrarAnalisis)} disabled={!eventoSeleccionado}
                        title="Cerrar análisis" className={`${claseBoton} bg-green-500 hover:bg-green-600`}>
                        <Lock className="w-4 h-4" />
                    </button>
                    <button onClick={conSeleccion(() => setModalArea(true))} disabled={!eventoSeleccionado}
                        title="Cambiar área" className={`${claseBoton} bg-orange-500 hover:bg-orange-600`}>
                        <MapPin className="w-4 h-4" />
                    </button>
                    <button onClick={conSeleccion(() => setModalTipo(true))} disabled={!eventoSeleccionado}
                        title="Cambiar tipo de evento" className={`${claseBoton} bg-secondary-600 hover:bg-secondary-700`}>
                        <RefreshCw className="w-4 h-4" />
                    </button>
                    <button onClick={conSeleccion(() => setModalCancelar(true))} disabled={!eventoSeleccionado}
                        title="Cancelar evento" className={`${claseBoton} bg-red-500 hover:bg-red-600`}>
                        <XCircle className="w-4 h-4" />
                    </button>
                    <button onClick={exportarExcel}
                        title="Exportar a Excel" className={`${claseBoton} bg-green-600 hover:bg-green-700`}>
                        <FaFileExcel className="w-4 h-4" />
                    </button>
                </div>

                {/* ── Buscadores ── */}
                <div className="mb-4 grid grid-cols-1 md:grid-cols-5 gap-3">
                    <Buscador value={busquedaEvento} onChange={setBusquedaEvento} placeholder="Buscar evento..." />
                    <Buscador value={busquedaReportante} onChange={setBusquedaReportante} placeholder="Buscar reportante..." />
                    <Buscador value={busquedaPaciente} onChange={setBusquedaPaciente} placeholder="Buscar paciente..." />
                    <Buscador value={busquedaMedicamento} onChange={setBusquedaMedicamento} placeholder="Buscar medicamento..." />
                    <div className="flex items-center border-2 border-primary-300 rounded-lg overflow-hidden focus-within:border-primary-500">
                        <select
                            value={filtroEstado}
                            onChange={e => setFiltroEstado(e.target.value)}
                            className="flex-1 px-4 py-3 text-sm focus:outline-none bg-white"
                        >
                            <option value="">Todos los estados</option>
                            <option value="en_proceso">En Proceso</option>
                            <option value="procesado">Procesado</option>
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
                    mensajeVacio="No hay eventos de farmacovigilancia (IAAS) registrados."
                    onRowClick={(fila) => setEventoSeleccionado(
                        eventoSeleccionado?.id_eventoAdverso === fila.id_eventoAdverso ? null : fila
                    )}
                    filaSeleccionada={eventoSeleccionado?.id_eventoAdverso}
                    renderExpansion={(fila) => (
                        <div className="flex items-start gap-4">
                            <div className="flex-1 space-y-1">
                                {(fila.medicamentos ?? []).length > 0 && (
                                    <div className="text-sm">
                                        <span className="font-bold">Medicamentos: </span>
                                        <ul className="list-disc ml-5 text-gray-700">
                                            {fila.medicamentos.map(m => (
                                                <li key={m.id_medicamento}><span className="font-semibold">{m.nombre}:</span> {m.descripcion}</li>
                                            ))}
                                        </ul>
                                    </div>
                                )}
                                <p className="text-sm">
                                    <span className="font-bold">Descripción: </span>
                                    <span className="text-gray-700">{fila.descripcion}</span>
                                </p>
                            </div>
                            <div className="flex gap-2 flex-shrink-0">
                                <button
                                    onClick={() => leer(fila.descripcion)}
                                    className="flex items-center gap-1 px-3 py-1.5 text-xs font-semibold text-white bg-sky-400 rounded-full hover:bg-sky-600 transition"
                                >
                                    <HiOutlineSpeakerphone className="w-4 h-4" /> Leer
                                </button>
                                <button
                                    onClick={detener}
                                    className="flex items-center gap-1 px-3 py-1.5 text-xs font-semibold text-white bg-zinc-500 rounded-full hover:bg-zinc-600 transition"
                                >
                                    <HiOutlineStop className="w-4 h-4" /> Detener
                                </button>
                            </div>
                        </div>
                    )}
                />

                {eventoSeleccionado && (
                    <p className="mt-2 text-xs text-primary-600">
                        ✓ Evento #{eventoSeleccionado.id_eventoAdverso} seleccionado — haz clic de nuevo para deseleccionar
                    </p>
                )}
            </div>

            {/* ── Modales ── */}
            {modalAnalisis && (
                <ModalAnalisisFarmacovigilancia evento={eventoSeleccionado} jefes={jefes} onClose={() => setModalAnalisis(false)} />
            )}
            {modalTipo && (
                <ModalCambiarTipo evento={eventoSeleccionado} categorias={categorias} onClose={() => setModalTipo(false)} />
            )}
            {modalCancelar && (
                <ModalCancelarEvento evento={eventoSeleccionado} jefes={jefes} onClose={() => setModalCancelar(false)} />
            )}
            {modalArea && (
                <ModalCambiarArea evento={eventoSeleccionado} areas={areas} onClose={() => setModalArea(false)} />
            )}

            {/* Loading overlay */}
            {cargando && (
                <div className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-100/85">
                    <div className="relative w-[150px] h-[73px]">
                        <svg viewBox="0 0 150 73" height="73px" width="150px" xmlns="http://www.w3.org/2000/svg">
                            <polyline
                                points="0,45.486 38.514,45.486 44.595,33.324 50.676,45.486 57.771,45.486 62.838,55.622 71.959,9 80.067,63.729 84.122,45.486 97.297,45.486 103.379,40.419 110.473,45.486 150,45.486"
                                strokeMiterlimit="10"
                                strokeWidth="3"
                                stroke={COLORS.secondary}
                                fill="none"
                            />
                        </svg>
                        <div className="absolute inset-0 bg-slate-100 animate-[heartRateIn_2.5s_linear_infinite]"
                            style={{ left: 0, right: 'auto' }} />
                        <div className="absolute top-0 h-full bg-slate-100 animate-[heartRateOut_2.5s_linear_infinite]"
                            style={{ width: '120%', left: '-120%' }} />
                    </div>
                </div>
            )}
        </AuthenticatedLayout>
    );
}
