import { COLORS } from '@/theme';
import { Head } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import GraficaCard from '@/Components/GraficaCard';
import { useState } from 'react';
import { router } from '@inertiajs/react';
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
    PieChart, Pie, Cell, LineChart, Line, Legend
} from 'recharts';

import { AlertTriangle, CheckCircle, Clock, XCircle, TrendingUp, TrendingDown, FileText } from 'lucide-react';

const COLORES = [
    COLORS.primary, // teal
    '#3b82f6', // blue
    '#f59e0b', // amber
    '#ef4444', // red
    '#8b5cf6', // violet
    '#10b981', // emerald
    '#f97316', // orange
    '#06b6d4', // cyan
    '#ec4899', // pink
    '#84cc16', // lime
    '#6366f1', // indigo
    COLORS.secondary, // secundario
];

const COLORES_ESTADO = {
    en_proceso: '#f59e0b',
    analizado: '#3b82f6',
    en_mejora: COLORS.primary,
    radicado: '#a855f7',
    procesado: '#22c55e',
    cancelado: '#ef4444',
    cerrado: '#374151',
};

const LABEL_ESTADO = {
    en_proceso: 'En Proceso',
    analizado: 'Analizado',
    en_mejora: 'En Mejora',
    radicado: 'Radicado',
    procesado: 'Procesado',
    cancelado: 'Cancelado',
    cerrado: 'Cerrado',
};

function TarjetaIndicador({ titulo, valor, icono: Icono, color, subtitulo }) {
    return (
        <div className="bg-white rounded-card border border-gray-200 shadow-card p-5 flex items-center gap-4">
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${color}`}>
                <Icono className="w-6 h-6 text-white" />
            </div>
            <div>
                <p className="text-2xl font-bold text-gray-900">{valor}</p>
                <p className="text-sm font-medium text-gray-600">{titulo}</p>
                {subtitulo && <p className="text-xs text-gray-400 mt-0.5">{subtitulo}</p>}
            </div>
        </div>
    );
}

const TooltipPersonalizado = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
        return (
            <div className="bg-white border border-gray-200 rounded-lg shadow-lg px-4 py-3 text-sm">
                <p className="font-semibold text-gray-800 mb-1">{label}</p>
                {payload.map((p, i) => (
                    <p key={i} style={{ color: p.color }}>
                        {p.name}: <span className="font-bold">{p.value}</span>
                    </p>
                ))}
            </div>
        );
    }
    return null;
};

export default function Dashboard({ estadisticas }) {
    const {
        totalEventos,
        mesActual,
        mesAnterior,
        totalesPorEstado,
        porCategoria,
        porArea,
        porMes,
        planesPorEstado,
        planesVencidos,
        porClasificacionMes,
        clasificaciones,
        aniosDisponibles,
        anioSeleccionado,
        periodoSeleccionado,
        trimestreSeleccionado,
        semestreSeleccionado,
        porcentajeRevisados,
        porcentajeTramitados,
        porcentajeCancelados,
        detalleRevisados,
        detalleTramitados,
        detalleCancelados,
        detallePlanesVencidos,
        tiempos
    } = estadisticas;


    const tendencia = mesActual - mesAnterior;
    const [periodo, setPeriodo] = useState(periodoSeleccionado);
    const [anio, setAnio] = useState(anioSeleccionado);
    const [trimestre, setTrimestre] = useState(trimestreSeleccionado);
    const [semestre, setSemestre] = useState(semestreSeleccionado);
    const [areaClasificacion, setAreaClasificacion] = useState('');
    const [categoriaClasificacion, setCategoriaClasificacion] = useState('');
    const [mesClasificacion, setMesClasificacion] = useState('');
    const [expandido, setExpandido] = useState(null);
    const [expandidoEstado, setExpandidoEstado] = useState(null);
    const [verPlanesVencidos, setVerPlanesVencidos] = useState(false);
    const [categoriaGlobal, setCategoriaGlobal] = useState('');
    const [mesGlobal, setMesGlobal] = useState('');
    const [entidadGlobal, setEntidadGlobal] = useState(estadisticas.entidadGlobalSeleccionada ?? '');



    const aplicarFiltros = (nuevoAnio, nuevoPeriodo, nuevoTrimestre, nuevoSemestre, nuevaCategoriaEstado, nuevaCategoriaGlobal, nuevoMesGlobal, nuevoEntidadGlobal) => {
        router.get(route('dashboard'), {
            anio: nuevoAnio ?? anio,
            periodo: nuevoPeriodo ?? periodo,
            trimestre: nuevoTrimestre ?? trimestre,
            semestre: nuevoSemestre ?? semestre,
            categoria_estado: nuevaCategoriaEstado ?? categoriaEstado,
            categoria_global: nuevaCategoriaGlobal ?? categoriaGlobal,
            mes_global: nuevoMesGlobal ?? mesGlobal,
            entidad_global: nuevoEntidadGlobal ?? entidadGlobal,
        }, { preserveState: false });
    };

    const datosEstados = Object.entries(totalesPorEstado ?? {}).map(([estado, total]) => ({
        name: LABEL_ESTADO[estado] ?? estado,
        value: total,
        color: COLORES_ESTADO[estado] ?? '#94a3b8',
    }));

    const datosPlanes = Object.entries(planesPorEstado ?? {}).map(([estado, total]) => ({
        name: estado === 'en_proceso' ? 'En Proceso' : estado === 'ejecutado' ? 'Ejecutado' : 'Radicado',
        total: total,
    }));
    const [categoriaSeleccionada, setCategoriaSeleccionada] = useState('');
    const [areaSeleccionada, setAreaSeleccionada] = useState('');

    const [mesCategoriaSeleccionado, setMesCategoriaSeleccionado] = useState('');
    const [mesAreaSeleccionado, setMesAreaSeleccionado] = useState('');
    const [categoriaAreaSeleccionada, setCategoriaAreaSeleccionada] = useState('');
    const [areaMesSeleccionada, setAreaMesSeleccionada] = useState('');
    const [categoriaMesSeleccionada, setCategoriaMesSeleccionada] = useState('');
    const [mesSeleccionado, setMesSeleccionado] = useState('');
    const [categoriaEstado, setCategoriaEstado] = useState(estadisticas.categoriaEstadoSeleccionada ?? '');
    const [categoriaEventoClasificacion, setCategoriaEventoClasificacion] = useState('');
    const [areaRelacionGrafica, setAreaRelacionGrafica] = useState('');
    const [mesRelacionGrafica, setMesRelacionGrafica] = useState('');
    const [categoriaRelacionGrafica, setCategoriaRelacionGrafica] = useState('');
    const [relacionGrafica, setRelacionGrafica] = useState('');
    const [verDetalleEvidencia, setVerDetalleEvidencia] = useState(false);
    const [vistaEvidencia, setVistaEvidencia] = useState('area'); // 'area' o 'jefe'

    // Datos por categoría y mes
    const meses = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];

    const datosCategoriasMes = () => {
        let filtrado = estadisticas.porCategoriaMes ?? [];

        if (categoriaSeleccionada) {
            filtrado = filtrado.filter(e => e.fk_categoria == categoriaSeleccionada);
        }
        if (mesCategoriaSeleccionado) {
            filtrado = filtrado.filter(e => e.mes == mesCategoriaSeleccionado);
        }

        const porMesAgrupado = {};
        filtrado.forEach(e => {
            const key = `${meses[e.mes - 1]} ${e.anio}`;
            if (!porMesAgrupado[key]) porMesAgrupado[key] = { mes: key };
            const cat = estadisticas.categorias.find(c => c.id_categoria === e.fk_categoria);
            porMesAgrupado[key][cat?.nombre ?? e.fk_categoria] = e.total;
        });
        return Object.values(porMesAgrupado);
    };
    const datosAreasMes = () => {
        let filtrado = estadisticas.porAreaMes ?? [];

        if (areaSeleccionada) {
            filtrado = filtrado.filter(e => e.fk_area == areaSeleccionada);
        }
        if (mesAreaSeleccionado) {
            filtrado = filtrado.filter(e => e.mes == mesAreaSeleccionado);
        }
        if (categoriaAreaSeleccionada) {
            filtrado = filtrado.filter(e => e.fk_categoria == categoriaAreaSeleccionada);
        }

        const porMesAgrupado = {};
        filtrado.forEach(e => {
            const key = `${meses[e.mes - 1]} ${e.anio}`;
            if (!porMesAgrupado[key]) porMesAgrupado[key] = { mes: key };
            const area = estadisticas.areas.find(a => a.id_area === e.fk_area);
            const nombreArea = area?.nombre ?? `Área ${e.fk_area}`;
            porMesAgrupado[key][nombreArea] = (porMesAgrupado[key][nombreArea] ?? 0) + e.total;
        });
        return Object.values(porMesAgrupado);
    };

    const categoriasUnicas = [...new Set(estadisticas.porCategoriaMes?.map(e => e.fk_categoria) ?? [])];
    const areasUnicas = [...new Set(estadisticas.porAreaMes?.map(e => e.fk_area) ?? [])];

    const datosPorMes = () => {
        let filtrado = estadisticas.porMes ?? [];

        if (areaMesSeleccionada) {
            filtrado = filtrado.filter(e => e.fk_area == areaMesSeleccionada);
        }
        if (categoriaMesSeleccionada) {
            filtrado = filtrado.filter(e => e.fk_categoria == categoriaMesSeleccionada);
        }
        if (mesSeleccionado) {
            filtrado = filtrado.filter(e => e.mes == mesSeleccionado);
        }

        const porMesAgrupado = {};
        filtrado.forEach(e => {
            const key = `${meses[e.mes - 1]} ${e.anio}`;
            if (!porMesAgrupado[key]) porMesAgrupado[key] = { mes: key, total: 0 };
            porMesAgrupado[key].total += e.total;
        });
        return Object.values(porMesAgrupado);
    };


    const datosClasificacionFiltrados = () => {
        let filtrado = estadisticas.porClasificacionRaw ?? [];

        if (areaClasificacion) {
            filtrado = filtrado.filter(e => e.fk_area == areaClasificacion);
        }
        if (categoriaClasificacion) {
            filtrado = filtrado.filter(e => e.clasificacion === categoriaClasificacion);
        }
        if (mesClasificacion) {
            filtrado = filtrado.filter(e => e.mes == mesClasificacion);
        }
        if (categoriaEventoClasificacion) {
            filtrado = filtrado.filter(e => e.fk_categoria == categoriaEventoClasificacion);
        }

        const clasificacionesUnicas = [...new Set(filtrado.map(e => e.clasificacion))];
        const mesesUnicos = [...new Set(filtrado.map(e => e.mes))].sort((a, b) => a - b);

        const resultado = mesesUnicos.map(mes => {
            const fila = { mes: meses[mes - 1] };
            clasificacionesUnicas.forEach(cls => {
                fila[cls] = filtrado
                    .filter(e => e.mes === mes && e.clasificacion === cls)
                    .reduce((sum, e) => sum + e.total, 0);
            });
            return fila;
        });

        return { datos: resultado, clasificaciones: clasificacionesUnicas };
    };

    const [egresos, setEgresos] = useState('');
    const [areaRelacion, setAreaRelacion] = useState('');
    const [mesRelacion, setMesRelacion] = useState('');
    const [categoriaRelacion, setCategoriaRelacion] = useState('');
    const [relacionSeleccionada, setRelacionSeleccionada] = useState('');

    const datosTasaIncidencia = () => {
        let filtrado = estadisticas.porRelacionMes ?? [];

        if (areaRelacion) filtrado = filtrado.filter(e => e.fk_area == areaRelacion);
        if (mesRelacion) filtrado = filtrado.filter(e => e.mes == mesRelacion);
        if (categoriaRelacion) filtrado = filtrado.filter(e => e.fk_categoria == categoriaRelacion);
        if (relacionSeleccionada) filtrado = filtrado.filter(e => e.relacionado_con === relacionSeleccionada);

        const mesesUnicos = [...new Set(filtrado.map(e => e.mes))].sort((a, b) => a - b);

        return mesesUnicos.map(mes => {
            const total = filtrado
                .filter(e => e.mes === mes)
                .reduce((sum, e) => sum + e.total, 0);
            const tasa = egresos && Number(egresos) > 0
                ? parseFloat((total / Number(egresos)).toFixed(2))
                : total;
            return { mes: meses[mes - 1], total, tasa };
        });
    };


    const datosTablaRelacion = () => {
        let filtrado = estadisticas.porRelacion ?? [];

        if (areaRelacionGrafica) filtrado = filtrado.filter(e => e.fk_area == areaRelacionGrafica);
        if (mesRelacionGrafica) filtrado = filtrado.filter(e => e.mes == mesRelacionGrafica);
        if (categoriaRelacionGrafica) filtrado = filtrado.filter(e => e.fk_categoria == categoriaRelacionGrafica);
        if (relacionGrafica) filtrado = filtrado.filter(e => e.relacionado_con === relacionGrafica);

        const mesesUnicos = [...new Set(filtrado.map(e => e.mes))].sort((a, b) => a - b);

        // Agrupar por relación + área sin duplicados
        const claves = [...new Set(filtrado.map(e => `${e.relacionado_con}||${e.fk_area}`))].sort();

        const tabla = claves.map(clave => {
            const [relacion, fkArea] = clave.split('||');
            const area = estadisticas.areas?.find(a => String(a.id_area) === String(fkArea));
            const fila = { nombre: relacion, area: area?.nombre ?? '—' };
            mesesUnicos.forEach(mes => {
                fila[meses[mes - 1]] = filtrado
                    .filter(e => e.relacionado_con === relacion && String(e.fk_area) === String(fkArea) && e.mes === mes)
                    .reduce((sum, e) => sum + e.total, 0) || '';
            });
            return fila;
        });


        return { tabla, mesesUnicos };
    };

    return (
        <AuthenticatedLayout header={<h2 className="text-xl font-semibold text-white uppercase">Dashboard</h2>}>
            <Head title="Dashboard" />


            <div className="max-w-7xl mx-auto py-8 px-6 space-y-6">

                {/* ── Tarjetas de indicadores ── */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <TarjetaIndicador titulo="Total Eventos" valor={totalEventos} icono={FileText} color="bg-primary-500" />
                    <TarjetaIndicador
                        titulo="Eventos este mes"
                        valor={mesActual}
                        icono={tendencia >= 0 ? TrendingUp : TrendingDown}
                        color={tendencia >= 0 ? 'bg-blue-500' : 'bg-orange-500'}
                        subtitulo={`${tendencia >= 0 ? '+' : ''}${tendencia} vs mes anterior`}
                    />
                    <TarjetaIndicador titulo="En Proceso" valor={totalesPorEstado?.en_proceso ?? 0} icono={Clock} color="bg-yellow-500" />
                    {/* ── Tarjetas de indicadores plan vencido── */}
                    <div className="bg-white rounded-card border border-gray-200 shadow-card overflow-hidden">
                        <button
                            onClick={() => setVerPlanesVencidos(!verPlanesVencidos)}
                            className="w-full p-5 flex items-center gap-4 hover:bg-gray-50 transition"
                        >
                            <div className="w-12 h-12 rounded-xl bg-red-500 flex items-center justify-center flex-shrink-0">
                                <AlertTriangle className="w-6 h-6 text-white" />
                            </div>
                            <div className="text-left flex-1">
                                <p className="text-2xl font-bold text-gray-900">{planesVencidos}</p>
                                <p className="text-sm font-medium text-gray-600">Planes Vencidos</p>
                                <p className="text-xs text-gray-400">Sin evidencia subida</p>
                            </div>
                            <span className="text-gray-400 text-lg">{verPlanesVencidos ? '▲' : '▼'}</span>
                        </button>

                        {verPlanesVencidos && (
                            <div className="border-t border-gray-100 p-4 bg-red-50">
                                {detallePlanesVencidos?.length === 0 ? (
                                    <p className="text-xs text-gray-400 text-center">No hay planes vencidos</p>
                                ) : (
                                    <div className="space-y-2">
                                        {detallePlanesVencidos?.map((p, i) => (
                                            <div key={i} className="bg-white rounded-lg p-3 border border-red-200 flex items-center justify-between">
                                                <div>
                                                    <p className="text-xs font-bold text-gray-800">Evento #{p.id_evento}</p>
                                                    <p className="text-xs text-gray-500">{p.jefe}</p>
                                                </div>
                                                <div className="text-right">
                                                    <p className="text-xs text-red-600 font-bold">{p.dias_vencido} días vencido</p>
                                                    <p className="text-xs text-gray-400">Límite: {p.fecha_ejecucion}</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <TarjetaIndicador titulo="Analizado" valor={totalesPorEstado?.analizado ?? 0} icono={FileText} color="bg-blue-500" />
                    <TarjetaIndicador titulo="En Mejora" valor={totalesPorEstado?.en_mejora ?? 0} icono={CheckCircle} color="bg-primary-600" />
                    <TarjetaIndicador titulo="Radicado" valor={totalesPorEstado?.radicado ?? 0} icono={CheckCircle} color="bg-purple-500" />
                    <TarjetaIndicador titulo="Cancelados" valor={totalesPorEstado?.cancelado ?? 0} icono={XCircle} color="bg-red-400" />
                </div>
                {/* ── Título filtros ── */}
                <div className="flex items-center gap-3">
                    <h2 className="text-lg font-bold text-gray-700 uppercase tracking-wider">Filtros</h2>
                    <div className="flex-1 h-px bg-gray-200"></div>
                </div>
                {/* ── Filtros globales ── */}
                <div className="flex flex-wrap gap-3 mb-4 bg-white p-4 rounded-card border border-gray-200 shadow-card">
                    <div className="flex items-center gap-2">
                        <label className="text-sm font-semibold text-gray-600">Año:</label>
                        <select
                            value={anio}
                            onChange={e => { setAnio(e.target.value); aplicarFiltros(e.target.value, null, null, null); }}
                            className="border-2 border-primary-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-primary-500"
                        >
                            {aniosDisponibles?.map(a => (
                                <option key={a} value={a}>{a}</option>
                            ))}
                        </select>
                    </div>

                    <div className="flex items-center gap-2">
                        <label className="text-sm font-semibold text-gray-600">Período:</label>
                        <select
                            value={periodo}
                            onChange={e => { setPeriodo(e.target.value); aplicarFiltros(null, e.target.value, null, null); }}
                            className="border-2 border-primary-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-primary-500"
                        >
                            <option value="anual">Anual</option>
                            <option value="semestral">Semestral</option>
                            <option value="trimestral">Trimestral</option>
                        </select>
                    </div>

                    {periodo === 'trimestral' && (
                        <div className="flex items-center gap-2">
                            <label className="text-sm font-semibold text-gray-600">Trimestre:</label>
                            <select
                                value={trimestre}
                                onChange={e => { setTrimestre(e.target.value); aplicarFiltros(null, null, e.target.value, null); }}
                                className="border-2 border-primary-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-primary-500"
                            >
                                <option value={1}>T1 (Ene - Mar)</option>
                                <option value={2}>T2 (Abr - Jun)</option>
                                <option value={3}>T3 (Jul - Sep)</option>
                                <option value={4}>T4 (Oct - Dic)</option>
                            </select>
                        </div>
                    )}

                    {periodo === 'semestral' && (
                        <div className="flex items-center gap-2">
                            <label className="text-sm font-semibold text-gray-600">Semestre:</label>
                            <select
                                value={semestre}
                                onChange={e => { setSemestre(e.target.value); aplicarFiltros(null, null, null, e.target.value); }}
                                className="border-2 border-primary-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-primary-500"
                            >
                                <option value={1}>S1 (Ene - Jun)</option>
                                <option value={2}>S2 (Jul - Dic)</option>
                            </select>
                        </div>
                    )}

                    <div className="flex items-center gap-2">
                        <label className="text-sm font-semibold text-gray-600">Categoría:</label>
                        <select
                            value={categoriaGlobal}
                            onChange={e => { setCategoriaGlobal(e.target.value); aplicarFiltros(null, null, null, null, null, e.target.value, null); }}
                            className="border-2 border-primary-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-primary-500"
                        >
                            <option value="">Todas</option>
                            {estadisticas.categorias?.map(c => (
                                <option key={c.id_categoria} value={c.id_categoria}>{c.nombre}</option>
                            ))}
                        </select>
                    </div>

                    <div className="flex items-center gap-2">
                        <label className="text-sm font-semibold text-gray-600">Mes:</label>
                        <select
                            value={mesGlobal}
                            onChange={e => { setMesGlobal(e.target.value); aplicarFiltros(null, null, null, null, null, null, e.target.value); }}
                            className="border-2 border-primary-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-primary-500"
                        >
                            <option value="">Todos</option>
                            {meses.map((m, i) => (
                                <option key={i + 1} value={i + 1}>{m}</option>
                            ))}
                        </select>
                    </div>
                    <div className="flex items-center gap-2">
                        <label className="text-sm font-semibold text-gray-600">EPS:</label>
                        <select
                            value={entidadGlobal}
                            onChange={e => { setEntidadGlobal(e.target.value); aplicarFiltros(null, null, null, null, null, null, null, e.target.value); }}
                            className="border-2 border-primary-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-primary-500"
                        >
                            <option value="">Todas</option>
                            {estadisticas.entidadesDisponibles?.map(e => (
                                <option key={e} value={e}>{e}</option>
                            ))}
                        </select>
                    </div>
                </div>
                {/* ── Título tiempos promedio ── */}
                <div className="flex items-center gap-3">
                    <h2 className="text-lg font-bold text-gray-700 uppercase tracking-wider">Tiempos de Análisis</h2>
                    <div className="flex-1 h-px bg-gray-200"></div>
                </div>

                {/* ── Tiempos promedio ── */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="bg-white rounded-card border border-gray-200 shadow-card p-5">
                        <div className="flex items-center gap-3 mb-3">
                            <div className="w-10 h-10 rounded-xl bg-blue-500 flex items-center justify-center">
                                <Clock className="w-5 h-5 text-white" />
                            </div>
                            <p className="text-sm font-semibold text-gray-600">Tiempo de Análisis</p>
                        </div>
                        <p className="text-3xl font-bold text-gray-900">{tiempos?.analisis ?? 0} <span className="text-sm font-normal text-gray-400">días</span></p>
                        <p className="text-xs text-gray-400 mt-1">Días promedio que tarda el equipo de calidad en revisar y clasificar un evento adverso desde que fue reportado</p>
                    </div>

                    <div className="bg-white rounded-card border border-gray-200 shadow-card p-5">
                        <div className="flex items-center gap-3 mb-3">
                            <div className="w-10 h-10 rounded-xl bg-primary-500 flex items-center justify-center">
                                <Clock className="w-5 h-5 text-white" />
                            </div>
                            <p className="text-sm font-semibold text-gray-600">Tiempo Plan de Mejora</p>
                        </div>
                        <p className="text-3xl font-bold text-gray-900">{tiempos?.plan ?? 0} <span className="text-sm font-normal text-gray-400">días</span></p>
                        <p className="text-xs text-gray-400 mt-1">Días promedio que tarda el equipo de calidad en crear el plan de mejora después de haber clasificado el evento</p>
                    </div>

                    <div className="bg-white rounded-card border border-gray-200 shadow-card overflow-hidden">
                        <button
                            onClick={() => setVerDetalleEvidencia(!verDetalleEvidencia)}
                            className="w-full p-5 flex items-center gap-3 hover:bg-gray-50 transition"
                        >
                            <div className="w-10 h-10 rounded-xl bg-purple-500 flex items-center justify-center flex-shrink-0">
                                <Clock className="w-5 h-5 text-white" />
                            </div>
                            <div className="text-left flex-1">
                                <p className="text-sm font-semibold text-gray-600">Tiempo de Evidencia</p>
                                <p className="text-3xl font-bold text-gray-900">{tiempos?.evidencia ?? 0} <span className="text-sm font-normal text-gray-400">días</span></p>
                                <p className="text-xs text-gray-400 mt-1">Días promedio que tarda el responsable del área en subir la evidencia de ejecución del plan de mejora</p>
                            </div>
                            <span className="text-gray-400 text-lg">{verDetalleEvidencia ? '▲' : '▼'}</span>
                        </button>

                        {verDetalleEvidencia && (
                            <div className="border-t border-gray-100 p-4 bg-purple-50">
                                {/* Selector de vista */}
                                <div className="flex gap-2 mb-3">
                                    <button
                                        onClick={() => setVistaEvidencia('area')}
                                        className={`px-3 py-1 text-xs font-semibold rounded-lg transition ${vistaEvidencia === 'area' ? 'bg-purple-500 text-white' : 'bg-white text-gray-600 border border-gray-300'}`}
                                    >
                                        Por Área
                                    </button>
                                    <button
                                        onClick={() => setVistaEvidencia('jefe')}
                                        className={`px-3 py-1 text-xs font-semibold rounded-lg transition ${vistaEvidencia === 'jefe' ? 'bg-purple-500 text-white' : 'bg-white text-gray-600 border border-gray-300'}`}
                                    >
                                        Por Coordinador
                                    </button>
                                </div>

                                {/* Por área */}
                                {vistaEvidencia === 'area' && (
                                    <div className="space-y-2">
                                        {tiempos?.evidencia_por_area?.length === 0 ? (
                                            <p className="text-xs text-gray-400 text-center">No hay datos</p>
                                        ) : (
                                            tiempos?.evidencia_por_area?.map((a, i) => (
                                                <div key={i} className="bg-white rounded-lg p-3 border border-purple-200 flex items-center justify-between">
                                                    <span className="text-xs text-gray-700">{a.nombre}</span>
                                                    <span className="text-xs font-bold text-purple-600">{a.promedio} días</span>
                                                </div>
                                            ))
                                        )}
                                    </div>
                                )}

                                {/* Por jefe */}
                                {vistaEvidencia === 'jefe' && (
                                    <div className="space-y-2">
                                        {tiempos?.evidencia_por_jefe?.length === 0 ? (
                                            <p className="text-xs text-gray-400 text-center">No hay datos</p>
                                        ) : (
                                            tiempos?.evidencia_por_jefe?.map((j, i) => (
                                                <div key={i} className="bg-white rounded-lg p-3 border border-purple-200 flex items-center justify-between">
                                                    <span className="text-xs text-gray-700">{j.nombre}</span>
                                                    <span className="text-xs font-bold text-purple-600">{j.promedio} días</span>
                                                </div>
                                            ))
                                        )}
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                    <div className="bg-white rounded-card border border-gray-200 shadow-card p-5">
                        <div className="flex items-center gap-3 mb-3">
                            <div className="w-10 h-10 rounded-xl bg-gray-700 flex items-center justify-center">
                                <Clock className="w-5 h-5 text-white" />
                            </div>
                            <p className="text-sm font-semibold text-gray-600">Tiempo Total del Proceso</p>
                        </div>
                        <p className="text-3xl font-bold text-gray-900">{tiempos?.total ?? 0} <span className="text-sm font-normal text-gray-400">días</span></p>
                        <p className="text-xs text-gray-400 mt-1">Días promedio desde que se reporta el evento hasta que se cierra completamente</p>
                    </div>
                </div>
                {/* ── Título porcentaje de avance ── */}
                <div className="flex items-center gap-3">
                    <h2 className="text-lg font-bold text-gray-700 uppercase tracking-wider">Porcentaje de Avance</h2>
                    <div className="flex-1 h-px bg-gray-200"></div>
                </div>
                {/* ── Árbol de jerarquía ── */}
                <div className="space-y-3">

                    {/* Tarjeta Revisados */}
                    <div className="bg-white rounded-card border border-gray-200 shadow-card overflow-hidden">
                        <button
                            onClick={() => setExpandido(expandido === 'revisados' ? null : 'revisados')}
                            className="w-full p-5 flex items-center justify-between hover:bg-gray-50 transition"
                        >
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-xl bg-blue-500 flex items-center justify-center">
                                    <FileText className="w-6 h-6 text-white" />
                                </div>
                                <div className="text-left">
                                    <p className="text-2xl font-bold text-gray-900">{porcentajeRevisados}%</p>
                                    <p className="text-sm text-gray-600">Eventos Revisados</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-4">
                                <div className="w-32 bg-gray-200 rounded-full h-2.5">
                                    <div className="bg-blue-500 h-2.5 rounded-full" style={{ width: `${porcentajeRevisados}%` }}></div>
                                </div>
                                <span className="text-gray-400 text-lg">{expandido === 'revisados' ? '▲' : '▼'}</span>
                            </div>
                        </button>

                        {expandido === 'revisados' && (
                            <div className="border-t border-gray-100 p-5 bg-blue-50 space-y-4">
                                {/* Estados */}
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                                    {[
                                        { label: 'Analizado', valor: detalleRevisados?.analizado, color: 'bg-blue-500', key: 'analizado' },
                                        { label: 'En Mejora', valor: detalleRevisados?.en_mejora, color: 'bg-primary-500', key: 'en_mejora' },
                                        { label: 'Radicado', valor: detalleRevisados?.radicado, color: 'bg-purple-500', key: 'radicado' },
                                        { label: 'Cerrado', valor: detalleRevisados?.cerrado, color: 'bg-gray-600', key: 'cerrado' },
                                    ].map(item => (
                                        <div key={item.label}>
                                            <button
                                                onClick={() => setExpandidoEstado(expandidoEstado === item.key ? null : item.key)}
                                                className="w-full bg-white rounded-lg p-3 text-center border border-gray-200 hover:border-primary-400 transition"
                                            >
                                                <p className="text-2xl font-bold text-gray-900">{item.valor ?? 0}</p>
                                                <div className={`w-full h-1.5 rounded-full ${item.color} mt-1 mb-1`}></div>
                                                <p className="text-xs text-gray-500">{item.label}</p>
                                            </button>

                                            {/* Jefes en mejora */}
                                            {expandidoEstado === 'en_mejora' && item.key === 'en_mejora' && (
                                                <div className="mt-2 bg-white border border-primary-200 rounded-lg p-3">
                                                    <p className="text-xs font-bold text-gray-500 uppercase mb-2">Coordinadores responsables</p>
                                                    {detalleRevisados?.jefes_en_mejora?.map((j, i) => (
                                                        <div key={i} className="flex items-center justify-between py-1 border-b border-gray-100 last:border-0">
                                                            <span className="text-xs text-gray-700">{j.nombre}</span>
                                                            <div className="text-right">
                                                                <span className="text-xs font-bold text-primary-600">{j.total} evento(s)</span>
                                                                <p className="text-xs text-gray-400">#{j.eventos}</p>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            )}

                                            {/* Jefes radicado */}
                                            {expandidoEstado === 'radicado' && item.key === 'radicado' && (
                                                <div className="mt-2 bg-white border border-purple-200 rounded-lg p-3">
                                                    <p className="text-xs font-bold text-gray-500 uppercase mb-2">Responsables que subieron evidencia</p>
                                                    {detalleRevisados?.jefes_radicado?.map((j, i) => (
                                                        <div key={i} className="flex items-center justify-between py-1 border-b border-gray-100 last:border-0">
                                                            <span className="text-xs text-gray-700">{j.nombre}</span>
                                                            <div className="text-right">
                                                                <span className="text-xs font-bold text-purple-600">{j.total} evento(s)</span>
                                                                <p className="text-xs text-gray-400">#{j.eventos}</p>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>

                                {/* Por categoría */}
                                <div>
                                    <p className="text-xs font-bold text-gray-500 uppercase mb-2">Por Categoría</p>
                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                                        {detalleRevisados?.porCategoria?.map((c, i) => (
                                            <div key={i} className="bg-white rounded-lg p-3 border border-gray-200">
                                                <p className="text-lg font-bold text-blue-600">{c.total}</p>
                                                <p className="text-xs text-gray-500">{c.nombre}</p>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Por área */}
                                <div>
                                    <p className="text-xs font-bold text-gray-500 uppercase mb-2">Por Área</p>
                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                                        {detalleRevisados?.porArea?.map((a, i) => (
                                            <div key={i} className="bg-white rounded-lg p-3 border border-gray-200">
                                                <p className="text-lg font-bold text-blue-600">{a.total}</p>
                                                <p className="text-xs text-gray-500">{a.nombre}</p>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Tarjeta Tramitados */}
                    <div className="bg-white rounded-card border border-gray-200 shadow-card overflow-hidden">
                        <button
                            onClick={() => setExpandido(expandido === 'tramitados' ? null : 'tramitados')}
                            className="w-full p-5 flex items-center justify-between hover:bg-gray-50 transition"
                        >
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-xl bg-green-500 flex items-center justify-center">
                                    <CheckCircle className="w-6 h-6 text-white" />
                                </div>
                                <div className="text-left">
                                    <p className="text-2xl font-bold text-gray-900">{porcentajeTramitados}%</p>
                                    <p className="text-sm text-gray-600">Eventos Tramitados</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-4">
                                <div className="w-32 bg-gray-200 rounded-full h-2.5">
                                    <div className="bg-green-500 h-2.5 rounded-full" style={{ width: `${porcentajeTramitados}%` }}></div>
                                </div>
                                <span className="text-gray-400 text-lg">{expandido === 'tramitados' ? '▲' : '▼'}</span>
                            </div>
                        </button>

                        {expandido === 'tramitados' && (
                            <div className="border-t border-gray-100 p-5 bg-green-50 space-y-4">
                                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                                    {[
                                        { label: 'Radicado', valor: detalleTramitados?.radicado, color: 'bg-purple-500' },
                                        { label: 'Cerrado', valor: detalleTramitados?.cerrado, color: 'bg-gray-600' },
                                        { label: 'Días promedio resolución', valor: detalleTramitados?.tiempoPromedio, color: 'bg-green-500' },
                                    ].map(item => (
                                        <div key={item.label} className="bg-white rounded-lg p-3 text-center border border-gray-200">
                                            <p className={`text-xl font-bold text-white ${item.color} rounded-lg py-1 mb-1`}>{item.valor}</p>
                                            <p className="text-xs text-gray-500">{item.label}</p>
                                        </div>
                                    ))}
                                </div>

                                <div>
                                    <p className="text-xs font-bold text-gray-500 uppercase mb-2">Por Responsable</p>
                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                                        {detalleTramitados?.porJefe?.map((j, i) => (
                                            <div key={i} className="bg-white rounded-lg p-3 border border-gray-200">
                                                <p className="text-lg font-bold text-green-600">{j.total}</p>
                                                <p className="text-xs text-gray-500">{j.nombre}</p>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Tarjeta Cancelados */}
                    <div className="bg-white rounded-card border border-gray-200 shadow-card overflow-hidden">
                        <button
                            onClick={() => setExpandido(expandido === 'cancelados' ? null : 'cancelados')}
                            className="w-full p-5 flex items-center justify-between hover:bg-gray-50 transition"
                        >
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-xl bg-red-500 flex items-center justify-center">
                                    <XCircle className="w-6 h-6 text-white" />
                                </div>
                                <div className="text-left">
                                    <p className="text-2xl font-bold text-gray-900">{porcentajeCancelados}%</p>
                                    <p className="text-sm text-gray-600">Eventos Cancelados</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-4">
                                <div className="w-32 bg-gray-200 rounded-full h-2.5">
                                    <div className="bg-red-500 h-2.5 rounded-full" style={{ width: `${porcentajeCancelados}%` }}></div>
                                </div>
                                <span className="text-gray-400 text-lg">{expandido === 'cancelados' ? '▲' : '▼'}</span>
                            </div>
                        </button>

                        {expandido === 'cancelados' && (
                            <div className="border-t border-gray-100 p-5 bg-red-50 space-y-4">
                                <div className="grid grid-cols-2 md:grid-cols-2 gap-3">
                                    <div>
                                        <p className="text-xs font-bold text-gray-500 uppercase mb-2">Por Área</p>
                                        <div className="grid grid-cols-2 gap-2">
                                            {detalleCancelados?.porArea?.map((a, i) => (
                                                <div key={i} className="bg-white rounded-lg p-3 border border-gray-200">
                                                    <p className="text-lg font-bold text-red-600">{a.total}</p>
                                                    <p className="text-xs text-gray-500">{a.nombre}</p>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                    <div>
                                        <p className="text-xs font-bold text-gray-500 uppercase mb-2">Por Categoría</p>
                                        <div className="grid grid-cols-2 gap-2">
                                            {detalleCancelados?.porCategoria?.map((c, i) => (
                                                <div key={i} className="bg-white rounded-lg p-3 border border-gray-200">
                                                    <p className="text-lg font-bold text-red-600">{c.total}</p>
                                                    <p className="text-xs text-gray-500">{c.nombre}</p>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                </div>

                {/* ── Título gráficas ── */}
                <div className="flex items-center gap-3">
                    <h2 className="text-lg font-bold text-gray-700 uppercase tracking-wider">Indicadores Gráficos</h2>
                    <div className="flex-1 h-px bg-gray-200"></div>
                </div>
                {/* ── Gráficas ── */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">


                    {/* ── Gráfica Eventos Por Mes── */}
                    <GraficaCard titulo="Eventos por mes" datos={datosPorMes()}>
                        <div className="mb-3 grid grid-cols-3 gap-2">
                            <select
                                value={areaMesSeleccionada}
                                onChange={e => setAreaMesSeleccionada(e.target.value)}
                                className="w-full border-2 border-primary-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-primary-500"
                            >
                                <option value="">Todas las áreas</option>
                                {estadisticas.areas?.map(a => (
                                    <option key={a.id_area} value={a.id_area}>{a.nombre}</option>
                                ))}
                            </select>
                            <select
                                value={categoriaMesSeleccionada}
                                onChange={e => setCategoriaMesSeleccionada(e.target.value)}
                                className="w-full border-2 border-primary-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-primary-500"
                            >
                                <option value="">Todas las categorías</option>
                                {estadisticas.categorias?.map(c => (
                                    <option key={c.id_categoria} value={c.id_categoria}>{c.nombre}</option>
                                ))}
                            </select>
                            <select
                                value={mesSeleccionado}
                                onChange={e => setMesSeleccionado(e.target.value)}
                                className="w-full border-2 border-primary-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-primary-500"
                            >
                                <option value="">Todos los meses</option>
                                {meses.map((m, i) => (
                                    <option key={i + 1} value={i + 1}>{m}</option>
                                ))}
                            </select>
                        </div>
                        <ResponsiveContainer width="100%" height={250}>
                            <LineChart data={datosPorMes()}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                                <XAxis dataKey="mes" tick={{ fontSize: 12 }} />
                                <YAxis tick={{ fontSize: 12 }} />
                                <Tooltip content={<TooltipPersonalizado />} />
                                <Line
                                    type="monotone"
                                    dataKey="total"
                                    name="Eventos"
                                    stroke={COLORS.primary}
                                    strokeWidth={3}
                                    dot={{ fill: COLORS.primary, r: 5 }}
                                    activeDot={{ r: 7 }}
                                />
                            </LineChart>
                        </ResponsiveContainer>
                    </GraficaCard>

                    <GraficaCard titulo="Distribución por estado" datos={datosEstados}>
                        <div className="mb-3">
                            <select
                                value={categoriaEstado}
                                onChange={e => { setCategoriaEstado(e.target.value); aplicarFiltros(null, null, null, null, e.target.value); }}
                                className="w-full border-2 border-primary-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-primary-500"
                            >
                                <option value="">Todas las categorías</option>
                                {estadisticas.categorias?.map(c => (
                                    <option key={c.id_categoria} value={c.id_categoria}>{c.nombre}</option>
                                ))}
                            </select>
                        </div>
                        <ResponsiveContainer width="100%" height={250}>
                            <PieChart>
                                <Pie
                                    data={datosEstados}
                                    cx="50%"
                                    cy="50%"
                                    outerRadius={90}
                                    dataKey="value"
                                    nameKey="name"
                                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                                    labelLine={false}
                                >
                                    {datosEstados.map((entry, index) => (
                                        <Cell key={index} fill={entry.color} />
                                    ))}
                                </Pie>
                                <Tooltip content={<TooltipPersonalizado />} />
                            </PieChart>
                        </ResponsiveContainer>
                    </GraficaCard>

                    {/* Eventos por categoría y mes */}
                    <GraficaCard titulo="Eventos por categoría y mes" datos={datosCategoriasMes()}>
                        {/* Filtros categoría */}
                        <div className="mb-3 grid grid-cols-2 gap-2">
                            <select
                                value={categoriaSeleccionada}
                                onChange={e => setCategoriaSeleccionada(e.target.value)}
                                className="w-full border-2 border-primary-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-primary-500"
                            >
                                <option value="">Todas las categorías</option>
                                {estadisticas.categorias?.map(c => (
                                    <option key={c.id_categoria} value={c.id_categoria}>{c.nombre}</option>
                                ))}
                            </select>
                            <select
                                value={mesCategoriaSeleccionado}
                                onChange={e => setMesCategoriaSeleccionado(e.target.value)}
                                className="w-full border-2 border-primary-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-primary-500"
                            >
                                <option value="">Todos los meses</option>
                                {meses.map((m, i) => (
                                    <option key={i + 1} value={i + 1}>{m}</option>
                                ))}
                            </select>
                        </div>
                        <ResponsiveContainer width="100%" height={250}>
                            <BarChart data={datosCategoriasMes()}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                                <XAxis dataKey="mes" tick={{ fontSize: 11 }} />
                                <YAxis tick={{ fontSize: 12 }} />
                                <Tooltip content={<TooltipPersonalizado />} />
                                <Legend />
                                {categoriasUnicas.map((id, index) => {
                                    const cat = estadisticas.categorias?.find(c => c.id_categoria === id);
                                    return (
                                        <Bar key={id} dataKey={cat?.nombre ?? id} fill={COLORES[index % COLORES.length]} radius={[4, 4, 0, 0]} />
                                    );
                                })}
                            </BarChart>
                        </ResponsiveContainer>
                    </GraficaCard>

                    {/* Eventos por área y mes */}
                    <GraficaCard titulo="Eventos por área y mes" datos={datosAreasMes()}>
                        {/* Filtros área */}
                        <div className="mb-3 grid grid-cols-3 gap-2">
                            <select
                                value={areaSeleccionada}
                                onChange={e => setAreaSeleccionada(e.target.value)}
                                className="w-full border-2 border-primary-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-primary-500"
                            >
                                <option value="">Todas las áreas</option>
                                {estadisticas.areas?.map(a => (
                                    <option key={a.id_area} value={a.id_area}>{a.nombre}</option>
                                ))}
                            </select>
                            <select
                                value={mesAreaSeleccionado}
                                onChange={e => setMesAreaSeleccionado(e.target.value)}
                                className="w-full border-2 border-primary-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-primary-500"
                            >
                                <option value="">Todos los meses</option>
                                {meses.map((m, i) => (
                                    <option key={i + 1} value={i + 1}>{m}</option>
                                ))}
                            </select>
                            <select
                                value={categoriaAreaSeleccionada}
                                onChange={e => setCategoriaAreaSeleccionada(e.target.value)}
                                className="w-full border-2 border-primary-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-primary-500"
                            >
                                <option value="">Todas las categorías</option>
                                {estadisticas.categorias?.map(c => (
                                    <option key={c.id_categoria} value={c.id_categoria}>{c.nombre}</option>
                                ))}
                            </select>
                        </div>
                        <ResponsiveContainer width="100%" height={250}>
                            <BarChart data={datosAreasMes()}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                                <XAxis dataKey="mes" tick={{ fontSize: 11 }} />
                                <YAxis tick={{ fontSize: 12 }} />
                                <Tooltip content={<TooltipPersonalizado />} />
                                <Legend />
                                {areasUnicas.map((id, index) => {
                                    const area = estadisticas.areas?.find(a => a.id_area === id);
                                    return (
                                        <Bar key={id} dataKey={area?.nombre ?? id} fill={COLORES[index % COLORES.length]} radius={[4, 4, 0, 0]} />
                                    );
                                })}
                            </BarChart>
                        </ResponsiveContainer>
                    </GraficaCard>

                    {/* ── Clasificación de eventos ── */}
                    {(() => {
                        const { datos, clasificaciones: clsUnicas } = datosClasificacionFiltrados();
                        return (
                            <GraficaCard
                                titulo={`Clasificación de Eventos ${new Date().getFullYear()}`}
                                subtitulo="INC: Incidente · COMP: Complicación · EAP: Evento adverso Prevenible · EANP: Evento adverso No Prevenible"
                                datos={datos}
                            >
                                <div className="mb-3 grid grid-cols-4 gap-2">
                                    <select
                                        value={areaClasificacion}
                                        onChange={e => setAreaClasificacion(e.target.value)}
                                        className="w-full border-2 border-primary-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-primary-500"
                                    >
                                        <option value="">Todas las áreas</option>
                                        {estadisticas.areas?.map(a => (
                                            <option key={a.id_area} value={a.id_area}>{a.nombre}</option>
                                        ))}
                                    </select>
                                    <select
                                        value={categoriaClasificacion}
                                        onChange={e => setCategoriaClasificacion(e.target.value)}
                                        className="w-full border-2 border-primary-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-primary-500"
                                    >
                                        <option value="">Todas las clasificaciones</option>
                                        {estadisticas.clasificaciones?.map(c => (
                                            <option key={c} value={c}>{c}</option>
                                        ))}
                                    </select>
                                    <select
                                        value={mesClasificacion}
                                        onChange={e => setMesClasificacion(e.target.value)}
                                        className="w-full border-2 border-primary-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-primary-500"
                                    >
                                        <option value="">Todos los meses</option>
                                        {meses.map((m, i) => (
                                            <option key={i + 1} value={i + 1}>{m}</option>
                                        ))}
                                    </select>
                                    <select
                                        value={categoriaEventoClasificacion}
                                        onChange={e => setCategoriaEventoClasificacion(e.target.value)}
                                        className="w-full border-2 border-primary-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-primary-500"
                                    >
                                        <option value="">Todas las categorías</option>
                                        {estadisticas.categorias?.map(c => (
                                            <option key={c.id_categoria} value={c.id_categoria}>{c.nombre}</option>
                                        ))}
                                    </select>
                                </div>

                                {datos.length === 0 ? (
                                    <div className="flex items-center justify-center h-[300px] text-gray-400 text-sm">
                                        No hay datos para el filtro seleccionado
                                    </div>
                                ) : (
                                    <ResponsiveContainer width="100%" height={250}>
                                        <BarChart data={datos}>
                                            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                                            <XAxis dataKey="mes" tick={{ fontSize: 12 }} />
                                            <YAxis tick={{ fontSize: 12 }} />
                                            <Tooltip content={<TooltipPersonalizado />} />
                                            <Legend />
                                            {clsUnicas.map((cls, index) => (
                                                <Bar key={cls} dataKey={cls} name={cls} fill={COLORES[index % COLORES.length]} radius={[4, 4, 0, 0]} label={{ position: 'top', fontSize: 10 }} />
                                            ))}
                                        </BarChart>
                                    </ResponsiveContainer>
                                )}
                            </GraficaCard>
                        );
                    })()}
                    <GraficaCard titulo="Tasa de Incidencia" subtitulo="Caídas intrainstitucionales y Úlceras por presión" datos={datosTasaIncidencia()}>
                        <div className="mb-3 grid grid-cols-2 md:grid-cols-3 gap-2">
                            <select
                                value={relacionSeleccionada}
                                onChange={e => setRelacionSeleccionada(e.target.value)}
                                className="w-full border-2 border-primary-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-primary-500"
                            >
                                <option value="">Todas las relaciones</option>
                                {estadisticas.relacionesEspecificas?.map(r => (
                                    <option key={r} value={r}>{r}</option>
                                ))}
                            </select>
                            <select
                                value={areaRelacion}
                                onChange={e => setAreaRelacion(e.target.value)}
                                className="w-full border-2 border-primary-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-primary-500"
                            >
                                <option value="">Todas las áreas</option>
                                {estadisticas.areas?.map(a => (
                                    <option key={a.id_area} value={a.id_area}>{a.nombre}</option>
                                ))}
                            </select>
                            <select
                                value={mesRelacion}
                                onChange={e => setMesRelacion(e.target.value)}
                                className="w-full border-2 border-primary-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-primary-500"
                            >
                                <option value="">Todos los meses</option>
                                {meses.map((m, i) => (
                                    <option key={i + 1} value={i + 1}>{m}</option>
                                ))}
                            </select>
                            <select
                                value={categoriaRelacion}
                                onChange={e => setCategoriaRelacion(e.target.value)}
                                className="w-full border-2 border-primary-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-primary-500"
                            >
                                <option value="">Todas las categorías</option>
                                {estadisticas.categorias?.map(c => (
                                    <option key={c.id_categoria} value={c.id_categoria}>{c.nombre}</option>
                                ))}
                            </select>
                            <div className="flex items-center gap-2 border-2 border-primary-300 rounded-lg overflow-hidden focus-within:border-primary-500 col-span-2 md:col-span-2">
                                <input
                                    type="number"
                                    value={egresos}
                                    onChange={e => setEgresos(e.target.value)}
                                    placeholder="N° de egresos..."
                                    className="flex-1 px-3 py-2 text-sm focus:outline-none"
                                    min="1"
                                />
                                <div className="bg-secondary-500 px-3 py-2.5 flex-shrink-0 text-white text-xs font-semibold">
                                    Egresos
                                </div>
                            </div>
                        </div>

                        {datosTasaIncidencia().length === 0 ? (
                            <div className="flex items-center justify-center h-[250px] text-gray-400 text-sm">
                                No hay datos para el filtro seleccionado
                            </div>
                        ) : (
                            <ResponsiveContainer width="100%" height={250}>
                                <BarChart data={datosTasaIncidencia()}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                                    <XAxis dataKey="mes" tick={{ fontSize: 12 }} />
                                    <YAxis tick={{ fontSize: 12 }} />
                                    <Tooltip content={<TooltipPersonalizado />} />
                                    <Legend />
                                    <Bar dataKey="tasa" name={egresos ? "Tasa (eventos/egresos)" : "Total eventos"} fill={COLORS.primary} radius={[4, 4, 0, 0]} label={{ position: 'top', fontSize: 10 }} />
                                </BarChart>
                            </ResponsiveContainer>
                        )}
                    </GraficaCard>

                </div>
                {(() => {
                    const { tabla, mesesUnicos } = datosTablaRelacion();
                    return (
                        <GraficaCard titulo="Eventos por Relación" datos={tabla}>
                            <div className="mb-3 grid grid-cols-2 md:grid-cols-4 gap-2">
                                <select
                                    value={relacionGrafica}
                                    onChange={e => setRelacionGrafica(e.target.value)}
                                    className="w-full border-2 border-primary-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-primary-500"
                                >
                                    <option value="">Todas las relaciones</option>
                                    {estadisticas.todasRelaciones?.map(r => (
                                        <option key={r} value={r}>{r}</option>
                                    ))}
                                </select>
                                <select
                                    value={areaRelacionGrafica}
                                    onChange={e => setAreaRelacionGrafica(e.target.value)}
                                    className="w-full border-2 border-primary-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-primary-500"
                                >
                                    <option value="">Todas las áreas</option>
                                    {estadisticas.areas?.map(a => (
                                        <option key={a.id_area} value={a.id_area}>{a.nombre}</option>
                                    ))}
                                </select>
                                <select
                                    value={mesRelacionGrafica}
                                    onChange={e => setMesRelacionGrafica(e.target.value)}
                                    className="w-full border-2 border-primary-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-primary-500"
                                >
                                    <option value="">Todos los meses</option>
                                    {meses.map((m, i) => (
                                        <option key={i + 1} value={i + 1}>{m}</option>
                                    ))}
                                </select>
                                <select
                                    value={categoriaRelacionGrafica}
                                    onChange={e => setCategoriaRelacionGrafica(e.target.value)}
                                    className="w-full border-2 border-primary-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-primary-500"
                                >
                                    <option value="">Todas las categorías</option>
                                    {estadisticas.categorias?.map(c => (
                                        <option key={c.id_categoria} value={c.id_categoria}>{c.nombre}</option>
                                    ))}
                                </select>
                            </div>

                            {tabla.length === 0 ? (
                                <div className="flex items-center justify-center h-[200px] text-gray-400 text-sm">
                                    No hay datos para el filtro seleccionado
                                </div>
                            ) : (
                                <div className="overflow-x-auto scroll-teal">
                                    <table className="w-full text-sm">
                                        <thead>
                                            <tr className="bg-primary-600 text-white">
                                                <th className="px-4 py-3 text-left text-xs font-semibold uppercase">Evento</th>
                                                <th className="px-4 py-3 text-left text-xs font-semibold uppercase">Área</th>
                                                {mesesUnicos.map(mes => (
                                                    <th key={mes} className="px-4 py-3 text-center text-xs font-semibold uppercase">
                                                        {meses[mes - 1]}
                                                    </th>
                                                ))}
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {tabla.map((fila, index) => (
                                                <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                                                    <td className="px-4 py-3 font-medium text-gray-800">{fila.nombre}</td>
                                                    <td className="px-4 py-3 text-gray-600">{fila.area}</td>
                                                    {mesesUnicos.map(mes => (
                                                        <td key={mes} className="px-4 py-3 text-center text-gray-600">
                                                            {fila[meses[mes - 1]] || ''}
                                                        </td>
                                                    ))}
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </GraficaCard>
                    );
                })()}
            </div>
        </AuthenticatedLayout>
    );
}