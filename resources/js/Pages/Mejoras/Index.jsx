import { useState } from 'react';
import { Head, router } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import Tabla from '@/Components/Tabla';
import Swal from 'sweetalert2';
import { Search, PlusCircle, Eye, FileText, ClipboardList, Filter, CheckCircle } from 'lucide-react';
import ModalCrearMejora from '@/Components/Mejoras/ModalCrearMejora';
import ModalVerAnalisis from '@/Components/Mejoras/ModalVerAnalisis';
import ModalVerPlan from '@/Components/Mejoras/ModalVerPlan';
import ModalRevisiones from '@/Components/Mejoras/ModalRevisiones';
import { HiOutlineEye, HiOutlineClipboardList, HiOutlinePencil, HiOutlineDocumentText, HiOutlineCheckCircle } from 'react-icons/hi';
import * as XLSX from 'xlsx';
import { FaFileExcel } from 'react-icons/fa';
import { HiOutlineSpeakerphone, HiOutlineStop } from 'react-icons/hi';

const BADGE_ESTADO = {
    analizado: 'bg-blue-500 text-white',
    en_mejora: 'bg-teal-500 text-white',
    radicado: 'bg-purple-500 text-white',
    procesado: 'bg-green-500 text-white',
    cerrado: 'bg-gray-700 text-white',
};

const LABEL_ESTADO = {
    analizado: 'Analizado',
    en_mejora: 'En Mejora',
    radicado: 'Radicado',
    procesado: 'Procesado',
    cerrado: 'Cerrado',
};

export default function Index({ eventos, jefes }) {

    const [eventoSeleccionado, setEventoSeleccionado] = useState(null);
    const [busquedaEvento, setBusquedaEvento] = useState('');
    const [busquedaReportante, setBusquedaReportante] = useState('');
    const [busquedaPaciente, setBusquedaPaciente] = useState('');
    const [modalCrear, setModalCrear] = useState(false);
    const [modalAnalisis, setModalAnalisis] = useState(false);
    const [modalPlan, setModalPlan] = useState(false);
    const [modalRevisiones, setModalRevisiones] = useState(false);
    const [cargando, setCargando] = useState(false);
    const [filtroEstado, setFiltroEstado] = useState('');

    const alertSeleccionar = () => {
        Swal.fire({
            icon: 'info',
            title: 'Selecciona un evento',
            text: 'Debes seleccionar un evento de la tabla para realizar esta acción.',
        });
    };

    const abrirCrearMejora = () => {
        if (!eventoSeleccionado) return alertSeleccionar();
        setModalCrear(true);
    };

    const abrirVerAnalisis = () => {
        if (!eventoSeleccionado) return alertSeleccionar();
        setModalAnalisis(true);
    };

    const abrirVerPlan = () => {
        if (!eventoSeleccionado) return alertSeleccionar();
        if (!eventoSeleccionado.plan_mejora) {
            return Swal.fire({ icon: 'info', title: 'Sin plan de mejora', text: 'Este evento aún no tiene un plan de mejora creado.' });
        }
        setModalPlan(true);
    };

    const abrirRevisiones = () => {
        if (!eventoSeleccionado) return alertSeleccionar();
        setModalRevisiones(true);
    };

    // ── Columnas ──
    const columnas = [
        {
            label: 'Evento',
            key: 'id_eventoAdverso',
            render: (fila) => (
                <span className="font-bold text-teal-600">#{fila.id_eventoAdverso}</span>
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


                    {/* Datos del reportante */}
                    <div className="text-xs space-y-0.5">
                        <p><span className="font-semibold">Doc:</span> {fila.reportante?.cedula ?? '—'}</p>
                        <p><span className="font-semibold">Nombre:</span> {fila.reportante?.nombres} {fila.reportante?.apellidos}</p>
                        <p><span className="font-semibold">Cargo:</span> {fila.reportante?.cargo ?? '—'}</p>
                        <p><span className="font-semibold">Empresa:</span> {fila.reportante?.empresa ?? '—'}</p>
                    </div>
                    {/* Iconos apilados */}
                    <div className="flex flex-col">
                        <button
                            onClick={(e) => { e.stopPropagation(); setEventoSeleccionado(fila); setModalAnalisis(true); }}
                            title="Ver análisis"
                            className="w-8 h-8 rounded-t-full bg-teal-500 hover:bg-teal-600 text-white flex items-center justify-center transition"
                        >
                            <HiOutlineEye className="w-4 h-4" />
                        </button>
                        <button
                            onClick={(e) => { e.stopPropagation(); setEventoSeleccionado(fila); setModalPlan(true); }}
                            title="Ver plan de mejora"
                            className="w-8 h-8 bg-blue-500 hover:bg-blue-600 text-white flex items-center justify-center transition"
                        >
                            <HiOutlineClipboardList className="w-4 h-4" />
                        </button>
                        <button
                            onClick={(e) => { e.stopPropagation(); setEventoSeleccionado(fila); setModalCrear(true); }}
                            title="Crear/Editar mejora"
                            className="w-8 h-8 bg-teal-700  hover:bg-teal-800 text-white flex items-center justify-center transition"
                        >
                            <HiOutlinePencil className="w-4 h-4" />
                        </button>
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                setEventoSeleccionado(fila);
                                setTimeout(() => cerrarCaso(), 0);
                            }}
                            title="Cerrar caso"
                            className="w-8 h-8 rounded-b-full bg-gray-700 hover:bg-gray-800 text-white flex items-center justify-center transition"
                        >
                            <HiOutlineCheckCircle className="w-4 h-4" />
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
                    <p><span className="font-semibold">Entidad:</span> {fila.paciente?.entidad ?? '—'}</p>
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
    const cerrarCaso = () => {
        if (!eventoSeleccionado) return alertSeleccionar();
        if (eventoSeleccionado.estado !== 'radicado') {
            return Swal.fire({ icon: 'info', title: 'No permitido', text: 'Solo se pueden cerrar eventos con estado Radicado.' });
        }
        Swal.fire({
            title: '¿Cerrar caso?',
            text: 'El evento pasará a estado Cerrado.',
            icon: 'question',
            showCancelButton: true,
            confirmButtonColor: '#14b8a6',
            cancelButtonColor: '#6b7280',
            confirmButtonText: 'Sí, cerrar',
            cancelButtonText: 'Cancelar',
        }).then(result => {
            if (result.isConfirmed) {
                setCargando(true);
                router.patch(route('mejoras.cerrar', eventoSeleccionado.id_eventoAdverso), {}, {
                    onSuccess: () => {
                        setCargando(false);
                        setEventoSeleccionado(null);
                        Swal.fire({ icon: 'success', title: 'Caso cerrado correctamente.' });
                    },
                    onFinish: () => setCargando(false),
                });
            }
        });
    };

    const exportarExcel = async () => {
        const response = await fetch(route('mejoras.exportar'));
        const datos = await response.json();

        const ws = XLSX.utils.json_to_sheet(datos);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, 'Planes de Mejora');
        XLSX.writeFile(wb, 'Planes_Mejora.xlsx');
    };

    return (
        <AuthenticatedLayout header={<h2 className="text-xl font-semibold text-white uppercase">Planes de Mejora</h2>}>
            <Head title="Planes de Mejora" />

            {/* Loading */}
            {cargando && (
                <div className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-100/85">
                    <div className="relative w-[150px] h-[73px]">
                        <svg viewBox="0 0 150 73" height="73px" width="150px" xmlns="http://www.w3.org/2000/svg">
                            <polyline
                                points="0,45.486 38.514,45.486 44.595,33.324 50.676,45.486 57.771,45.486 62.838,55.622 71.959,9 80.067,63.729 84.122,45.486 97.297,45.486 103.379,40.419 110.473,45.486 150,45.486"
                                strokeMiterlimit="10"
                                strokeWidth="3"
                                stroke="#009B9E"
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

            <div className="max-w-7xl mx-auto py-8 px-6">

                {/* ── Acciones ── */}
                <div className="flex flex-row mb-4">
                    <button
                        onClick={abrirCrearMejora}
                        disabled={!eventoSeleccionado}
                        title="Crear/Editar mejora"
                        className="w-9 h-9 rounded-l-xs bg-teal-500 hover:bg-teal-600 text-white flex items-center justify-center transition disabled:opacity-40 disabled:cursor-not-allowed"
                    >
                        <PlusCircle className="w-4 h-4" />
                    </button>

                    <button
                        onClick={abrirVerAnalisis}
                        disabled={!eventoSeleccionado}
                        title="Ver análisis"
                        className="w-9 h-9 bg-purple-500 hover:bg-purple-600 text-white flex items-center justify-center transition disabled:opacity-40 disabled:cursor-not-allowed"
                    >
                        <ClipboardList className="w-4 h-4" />
                    </button>

                    <button
                        onClick={abrirVerPlan}
                        disabled={!eventoSeleccionado}
                        title="Ver plan de mejora"
                        className="w-9 h-9 bg-blue-500 hover:bg-blue-600 text-white flex items-center justify-center transition disabled:opacity-40 disabled:cursor-not-allowed"
                    >
                        <FileText className="w-4 h-4" />
                    </button>

                    <button
                        onClick={abrirRevisiones}
                        disabled={!eventoSeleccionado}
                        title="Ver revisiones"
                        className="w-9 h-9 bg-lime-500 hover:bg-lime-600 text-white flex items-center justify-center transition disabled:opacity-40 disabled:cursor-not-allowed"
                    >
                        <Eye className="w-4 h-4" />
                    </button>

                    <button
                        onClick={cerrarCaso}
                        disabled={!eventoSeleccionado}
                        title="Cerrar caso"
                        className="w-9 h-9 bg-gray-700 hover:bg-gray-800 text-white flex items-center justify-center transition disabled:opacity-40 disabled:cursor-not-allowed"
                    >
                        <CheckCircle className="w-4 h-4" />
                    </button>

                    <button
                        onClick={exportarExcel}
                        title="Exportar Excel"
                        className="w-9 h-9 rounded-r-xs bg-green-600 hover:bg-green-700 text-white flex items-center justify-center transition"
                    >
                        <FaFileExcel className="w-4 h-4" />
                    </button>
                </div>

                {/* ── Buscadores ── */}
                <div className="mb-4 grid grid-cols-1 md:grid-cols-4 gap-3">
                    <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden focus-within:border-teal-500">
                        <input type="text" value={busquedaEvento} onChange={e => setBusquedaEvento(e.target.value)} placeholder="Buscar evento..." className="flex-1 px-4 py-2.5 text-sm focus:outline-none" />
                        <div className="bg-cyan-500 px-3 py-2.5"><Search className="w-4 h-4 text-white" /></div>
                    </div>
                    <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden focus-within:border-teal-500">
                        <input type="text" value={busquedaReportante} onChange={e => setBusquedaReportante(e.target.value)} placeholder="Buscar reportante..." className="flex-1 px-4 py-2.5 text-sm focus:outline-none" />
                        <div className="bg-cyan-500 px-3 py-2.5"><Search className="w-4 h-4 text-white" /></div>
                    </div>
                    <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden focus-within:border-teal-500">
                        <input type="text" value={busquedaPaciente} onChange={e => setBusquedaPaciente(e.target.value)} placeholder="Buscar paciente..." className="flex-1 px-4 py-2.5 text-sm focus:outline-none" />
                        <div className="bg-cyan-500 px-3 py-2.5"><Search className="w-4 h-4 text-white" /></div>
                    </div>
                    <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden focus-within:border-teal-500">
                        <select
                            value={filtroEstado}
                            onChange={e => setFiltroEstado(e.target.value)}
                            className="flex-1 px-4 py-2.5 text-sm focus:outline-none bg-white"
                        >
                            <option value="">Todos los estados</option>
                            <option value="analizado">Analizado</option>
                            <option value="en_mejora">En Mejora</option>
                            <option value="radicado">Radicado</option>
                            <option value="cerrado">Cerrado</option>
                        </select>
                        <div className="bg-cyan-500 px-3 py-2.5 flex-shrink-0">
                            <Filter className="w-4 h-4 text-white" />
                        </div>
                    </div>
                </div>

                {/* ── Tabla ── */}
                <Tabla
                    columnas={columnas}
                    datos={eventosFiltrados}
                    mensajeVacio="No hay eventos en plan de mejora."
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
                                utterance.rate = 0.95;
                                utterance.pitch = 1;
                                const voces = window.speechSynthesis.getVoices();
                                const vozEspanol =
                                    voces.find(v => v.lang === 'es-CO' && v.localService) ||
                                    voces.find(v => v.lang.startsWith('es') && v.localService) ||
                                    voces.find(v => v.lang.startsWith('es'));
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
                                    <button onClick={leer} className="flex items-center gap-1 px-3 py-1.5 text-xs font-semibold text-white bg-sky-400 rounded-full hover:bg-sky-600 transition">
                                        <HiOutlineSpeakerphone className="w-4 h-4" /> Leer
                                    </button>
                                    <button onClick={detener} className="flex items-center gap-1 px-3 py-1.5 text-xs font-semibold text-white bg-zinc-500 rounded-full hover:bg-zinc-600 transition">
                                        <HiOutlineStop className="w-4 h-4" /> Detener
                                    </button>
                                </div>
                            </div>
                        );
                    }}
                />

                {eventoSeleccionado && (
                    <p className="mt-2 text-xs text-teal-600">
                        ✓ Evento #{eventoSeleccionado.id_eventoAdverso} seleccionado
                    </p>
                )}
            </div>

            {/* ── Modales ── */}
            {modalCrear && (
                <ModalCrearMejora
                    evento={eventoSeleccionado}
                    jefes={jefes}
                    onClose={() => setModalCrear(false)}
                />
            )}

            {modalAnalisis && (
                <ModalVerAnalisis
                    evento={eventoSeleccionado}
                    onClose={() => setModalAnalisis(false)}
                />
            )}

            {modalPlan && (
                <ModalVerPlan
                    evento={eventoSeleccionado}
                    onClose={() => setModalPlan(false)}
                />
            )}

            {modalRevisiones && (
                <ModalRevisiones
                    evento={eventoSeleccionado}
                    onClose={() => setModalRevisiones(false)}
                />
            )}

        </AuthenticatedLayout>
    );
}