import { useState } from 'react';
import { Head, router } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import Tabla from '@/Components/Tabla';
import Swal from 'sweetalert2';
import { Search, ClipboardList, XCircle, RefreshCw, Lock } from 'lucide-react';
import ModalAnalisis from '@/Components/Eventos/ModalAnalisis';
import ModalCambiarTipo from '@/Components/Eventos/ModalCambiarTipo';

const BADGE_ESTADO = {
    en_proceso: 'bg-yellow-500 text-white',
    analizado: 'bg-blue-500 text-white',
    procesado: 'bg-green-500 text-white',
    cancelado: 'bg-red-500 text-white',
    en_mejora: 'bg-teal-500 text-white',
};

const LABEL_ESTADO = {
    en_proceso: 'En Proceso',
    analizado: 'Analizado',
    procesado: 'Procesado',
    cancelado: 'Cancelado',
    en_mejora: 'En Mejora',
};


export default function Index({ eventos, categorias }) {
    const [eventoSeleccionado, setEventoSeleccionado] = useState(null);
    const [busqueda, setBusqueda] = useState('');
    const [modalAnalisis, setModalAnalisis] = useState(false);
    const [modalTipo, setModalTipo] = useState(false);
    const [busquedaEvento, setBusquedaEvento] = useState('');
    const [busquedaReportante, setBusquedaReportante] = useState('');
    const [busquedaPaciente, setBusquedaPaciente] = useState('');
    const [cargando, setCargando] = useState(false);

    // ── Acciones ──
    const abrirAnalisis = () => {
        if (!eventoSeleccionado) return alertSeleccionar();
        setModalAnalisis(true);
    };

    const cerrarAnalisis = () => {
        if (!eventoSeleccionado) return alertSeleccionar();
        Swal.fire({
            title: '¿Cerrar análisis?',
            text: 'El evento pasará a estado Procesado.',
            icon: 'question',
            showCancelButton: true,
            confirmButtonColor: '#14b8a6',
            cancelButtonColor: '#6b7280',
            confirmButtonText: 'Sí, cerrar',
            cancelButtonText: 'Cancelar',
        }).then(result => {
            if (result.isConfirmed) {
                setCargando(true);
                router.patch(route('eventos.cerrar', eventoSeleccionado.id_eventoAdverso), {}, {
                    onSuccess: () => {
                        setCargando(false);
                        setEventoSeleccionado(null);
                        Swal.fire({ icon: 'success', title: 'Evento cerrado correctamente.' });
                    },
                    onFinish: () => setCargando(false),
                });
            }
        });
    };

    const cancelarEvento = () => {
        if (!eventoSeleccionado) return alertSeleccionar();
        Swal.fire({
            title: '¿Cancelar evento?',
            text: 'El evento pasará a estado Cancelado.',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#ef4444',
            cancelButtonColor: '#6b7280',
            confirmButtonText: 'Sí, cancelar',
            cancelButtonText: 'No',
        }).then(result => {
            if (result.isConfirmed) {
                setCargando(true);
                router.patch(route('eventos.cancelar', eventoSeleccionado.id_eventoAdverso), {}, {
                    onSuccess: () => {
                        setCargando(false);
                        setEventoSeleccionado(null);
                        Swal.fire({ icon: 'success', title: 'Evento cancelado correctamente.' });
                    },
                    onFinish: () => setCargando(false),
                });
            }
        });
    };

    const abrirCambiarTipo = () => {
        if (!eventoSeleccionado) return alertSeleccionar();
        setModalTipo(true);
    };

    const alertSeleccionar = () => {
        Swal.fire({
            icon: 'info',
            title: 'Selecciona un evento',
            text: 'Debes seleccionar un evento de la tabla para realizar esta acción.',
        });
    };

    // ── Columnas de la tabla ──
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
                <div className="text-xs space-y-0.5">
                    <p><span className="font-semibold">Doc:</span> {fila.reportante?.cedula ?? '—'}</p>
                    <p><span className="font-semibold">Nombre:</span> {fila.reportante?.nombres} {fila.reportante?.apellidos}</p>
                    <p><span className="font-semibold">Cargo:</span> {fila.reportante?.cargo ?? '—'}</p>
                    <p><span className="font-semibold">Empresa:</span> {fila.reportante?.empresa ?? '—'}</p>
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

    // Filtra por búsqueda
    const eventosFiltrados = {
        ...eventos,
        data: eventos.data.filter(e =>
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
        <AuthenticatedLayout header={<h2 className="text-xl font-semibold text-white uppercase">Gestión de Eventos Adversos</h2>}>
            <Head title="Eventos Adversos" />

            <div className="max-w-7xl mx-auto py-8 px-6">

                {/* ── Barra de acciones ── */}
                <div className="flex flex-wrap gap-2 mb-4">
                    <button
                        onClick={abrirAnalisis}
                        disabled={!eventoSeleccionado}
                        className="flex items-center gap-2 px-4 py-2 text-xs font-semibold text-white bg-teal-500 rounded-lg hover:bg-teal-600 transition disabled:opacity-40 disabled:cursor-not-allowed"
                    >
                        <ClipboardList className="w-4 h-4" />
                        Análisis de evento
                    </button>

                    <button
                        onClick={cerrarAnalisis}
                        disabled={!eventoSeleccionado}
                        className="flex items-center gap-2 px-4 py-2 text-xs font-semibold text-white bg-green-500 rounded-lg hover:bg-green-600 transition disabled:opacity-40 disabled:cursor-not-allowed"
                    >
                        <Lock className="w-4 h-4" />
                        Cerrar análisis
                    </button>

                    <button
                        onClick={abrirCambiarTipo}
                        disabled={!eventoSeleccionado}
                        className="flex items-center gap-2 px-4 py-2 text-xs font-semibold text-white bg-blue-500 rounded-lg hover:bg-blue-600 transition disabled:opacity-40 disabled:cursor-not-allowed"
                    >
                        <RefreshCw className="w-4 h-4" />
                        Cambiar tipo de evento
                    </button>

                    <button
                        onClick={cancelarEvento}
                        disabled={!eventoSeleccionado}
                        className="flex items-center gap-2 px-4 py-2 text-xs font-semibold text-white bg-red-500 rounded-lg hover:bg-red-600 transition disabled:opacity-40 disabled:cursor-not-allowed"
                    >
                        <XCircle className="w-4 h-4" />
                        Cancelar evento
                    </button>
                </div>

                {/* ── Buscador ── */}
                <div className="mb-4 grid grid-cols-1 md:grid-cols-3 gap-3">
                    <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden focus-within:border-teal-500">
                        <input
                            type="text"
                            value={busquedaEvento}
                            onChange={e => setBusquedaEvento(e.target.value)}
                            placeholder="Buscar evento..."
                            className="flex-1 px-4 py-2.5 text-sm focus:outline-none"
                        />
                        <div className="bg-cyan-500 px-3 py-2.5">
                            <Search className="w-4 h-4 text-white" />
                        </div>
                    </div>

                    <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden focus-within:border-teal-500">
                        <input
                            type="text"
                            value={busquedaReportante}
                            onChange={e => setBusquedaReportante(e.target.value)}
                            placeholder="Buscar reportante..."
                            className="flex-1 px-4 py-2.5 text-sm focus:outline-none"
                        />
                        <div className="bg-cyan-500 px-3 py-2.5">
                            <Search className="w-4 h-4 text-white" />
                        </div>
                    </div>

                    <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden focus-within:border-teal-500">
                        <input
                            type="text"
                            value={busquedaPaciente}
                            onChange={e => setBusquedaPaciente(e.target.value)}
                            placeholder="Buscar paciente..."
                            className="flex-1 px-4 py-2.5 text-sm focus:outline-none"
                        />
                        <div className="bg-cyan-500 px-3 py-2.5">
                            <Search className="w-4 h-4 text-white" />
                        </div>
                    </div>
                </div>

                {/* ── Tabla ── */}
                <Tabla
                    columnas={columnas}
                    datos={eventosFiltrados}
                    mensajeVacio="No hay eventos adversos registrados."
                    onRowClick={(fila) => setEventoSeleccionado(
                        eventoSeleccionado?.id_eventoAdverso === fila.id_eventoAdverso ? null : fila
                    )}
                    filaSeleccionada={eventoSeleccionado?.id_eventoAdverso}
                />

                {eventoSeleccionado && (
                    <p className="mt-2 text-xs text-teal-600">
                        ✓ Evento #{eventoSeleccionado.id_eventoAdverso} seleccionado — haz clic de nuevo para deseleccionar
                    </p>
                )}
            </div>

            {/* ── Modal Análisis ── */}
            {modalAnalisis && (
                <ModalAnalisis
                    evento={eventoSeleccionado}
                    onClose={() => setModalAnalisis(false)}
                />
            )}

            {/* ── Modal Cambiar Tipo ── */}
            {modalTipo && (
                <ModalCambiarTipo
                    evento={eventoSeleccionado}
                    categorias={categorias}
                    onClose={() => setModalTipo(false)}
                />
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


        </AuthenticatedLayout>
    );
}