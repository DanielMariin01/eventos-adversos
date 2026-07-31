import { useState } from 'react';
import { Head, router } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import Tabla from '@/Components/Tabla';
import Swal from 'sweetalert2';
import { Search, PlusCircle, Eye, FileText, ClipboardList } from 'lucide-react';
import ModalCrearMejora from '@/Components/Mejoras/ModalCrearMejora';
import ModalVerAnalisis from '@/Components/Mejoras/ModalVerAnalisis';
import ModalVerPlan from '@/Components/Mejoras/ModalVerPlan';
import ModalRevisiones from '@/Components/Mejoras/ModalRevisiones';

const BADGE_ESTADO = {
    analizado: 'bg-blue-500 text-white',
    en_mejora: 'bg-teal-500 text-white',
};

const LABEL_ESTADO = {
    analizado: 'Analizado',
    en_mejora: 'En Mejora',
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

    // ── Filtro ──
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
        <AuthenticatedLayout header={<h2 className="text-xl font-semibold text-white uppercase">Planes de Mejora</h2>}>
            <Head title="Planes de Mejora" />

            {/* Loading */}
            {cargando && (
                <div className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-100/70">
                    <div className="relative w-[150px] h-[73px]">
                        <svg viewBox="0 0 150 73" height="73px" width="150px" xmlns="http://www.w3.org/2000/svg">
                            <polyline
                                points="0,45.486 38.514,45.486 44.595,33.324 50.676,45.486 57.771,45.486 62.838,55.622 71.959,9 80.067,63.729 84.122,45.486 97.297,45.486 103.379,40.419 110.473,45.486 150,45.486"
                                strokeMiterlimit="10" strokeWidth="3" stroke="#009B9E" fill="none"
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
                        onClick={abrirCrearMejora}
                        disabled={!eventoSeleccionado}
                        className="flex items-center gap-2 px-4 py-2 text-xs font-semibold text-white bg-teal-500 rounded-md hover:bg-teal-600 transition disabled:opacity-40 disabled:cursor-not-allowed"
                    >
                        <PlusCircle className="w-5 h-5" />
                        Crear/Editar mejora
                    </button>

                    <button
                        onClick={abrirVerAnalisis}
                        disabled={!eventoSeleccionado}
                        className="flex items-center gap-2 px-4 py-2 text-xs font-semibold text-white bg-purple-500 rounded-lg hover:bg-purple-600 transition disabled:opacity-40 disabled:cursor-not-allowed"
                    >
                        <ClipboardList className="w-5 h-5" />
                        Ver análisis
                    </button>

                    <button
                        onClick={abrirVerPlan}
                        disabled={!eventoSeleccionado}
                        className="flex items-center gap-2 px-4 py-2 text-xs font-semibold text-white bg-blue-500 rounded-lg hover:bg-blue-600 transition disabled:opacity-40 disabled:cursor-not-allowed"
                    >
                        <FileText className="w-5 h-5" />
                        Ver plan de mejora
                    </button>

                    <button
                        onClick={abrirRevisiones}
                        disabled={!eventoSeleccionado}
                        className="flex items-center gap-2 px-4 py-2 text-xs font-semibold text-white bg-lime-500 rounded-lg hover:bg-lime-600 transition disabled:opacity-40 disabled:cursor-not-allowed"
                    >
                        <Eye className="w-5 h-5" />
                        Ver revisiones
                    </button>
                </div>

                {/* ── Buscadores ── */}
                <div className="mb-4 grid grid-cols-1 md:grid-cols-3 gap-3">
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