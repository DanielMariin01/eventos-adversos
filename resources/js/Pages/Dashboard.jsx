import { Head } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import GraficaCard from '@/Components/GraficaCard';
import { useState } from 'react';
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
    PieChart, Pie, Cell, LineChart, Line, Legend
} from 'recharts';
import { AlertTriangle, CheckCircle, Clock, XCircle, TrendingUp, TrendingDown, FileText } from 'lucide-react';

const COLORES = [
    '#14b8a6', // teal
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
    '#14b8a6', // teal repeat
];

const COLORES_ESTADO = {
    en_proceso: '#f59e0b',
    analizado: '#3b82f6',
    en_mejora: '#14b8a6',
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
        <div className="bg-white rounded-xl border border-gray-200 shadow-lg p-5 flex items-center gap-4">
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
    } = estadisticas;

    const tendencia = mesActual - mesAnterior;

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


    // Datos por categoría y mes
    const meses = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];

    const datosCategoriasMes = () => {
        const filtrado = categoriaSeleccionada
            ? estadisticas.porCategoriaMes.filter(e => e.fk_categoria == categoriaSeleccionada)
            : estadisticas.porCategoriaMes;

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
        const filtrado = areaSeleccionada
            ? estadisticas.porAreaMes.filter(e => e.fk_area == areaSeleccionada)
            : estadisticas.porAreaMes;

        const porMesAgrupado = {};
        filtrado.forEach(e => {
            const key = `${meses[e.mes - 1]} ${e.anio}`;
            if (!porMesAgrupado[key]) porMesAgrupado[key] = { mes: key };
            const area = estadisticas.areas.find(a => a.id_area === e.fk_area);
            porMesAgrupado[key][area?.nombre ?? e.fk_area] = e.total;
        });
        return Object.values(porMesAgrupado);
    };

    const categoriasUnicas = [...new Set(estadisticas.porCategoriaMes?.map(e => e.fk_categoria) ?? [])];
    const areasUnicas = [...new Set(estadisticas.porAreaMes?.map(e => e.fk_area) ?? [])];

    return (
        <AuthenticatedLayout header={<h2 className="text-xl font-semibold text-white uppercase">Dashboard</h2>}>
            <Head title="Dashboard" />

            <div className="max-w-7xl mx-auto py-8 px-6 space-y-6">

                {/* ── Tarjetas de indicadores ── */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <TarjetaIndicador titulo="Total Eventos" valor={totalEventos} icono={FileText} color="bg-teal-500" />
                    <TarjetaIndicador
                        titulo="Eventos este mes"
                        valor={mesActual}
                        icono={tendencia >= 0 ? TrendingUp : TrendingDown}
                        color={tendencia >= 0 ? 'bg-blue-500' : 'bg-orange-500'}
                        subtitulo={`${tendencia >= 0 ? '+' : ''}${tendencia} vs mes anterior`}
                    />
                    <TarjetaIndicador titulo="En Proceso" valor={totalesPorEstado?.en_proceso ?? 0} icono={Clock} color="bg-yellow-500" />
                    <TarjetaIndicador titulo="Planes Vencidos" valor={planesVencidos} icono={AlertTriangle} color="bg-red-500" subtitulo="Sin evidencia subida" />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <TarjetaIndicador titulo="Analizado" valor={totalesPorEstado?.analizado ?? 0} icono={FileText} color="bg-blue-500" />
                    <TarjetaIndicador titulo="En Mejora" valor={totalesPorEstado?.en_mejora ?? 0} icono={CheckCircle} color="bg-teal-600" />
                    <TarjetaIndicador titulo="Radicado" valor={totalesPorEstado?.radicado ?? 0} icono={CheckCircle} color="bg-purple-500" />
                    <TarjetaIndicador titulo="Cancelados" valor={totalesPorEstado?.cancelado ?? 0} icono={XCircle} color="bg-red-400" />
                </div>

                {/* ── Gráficas ── */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

                    <GraficaCard titulo="Eventos por mes (últimos 6 meses)" datos={porMes}>
                        <ResponsiveContainer width="100%" height={250}>
                            <LineChart data={porMes}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                                <XAxis dataKey="mes" tick={{ fontSize: 12 }} />
                                <YAxis tick={{ fontSize: 12 }} />
                                <Tooltip content={<TooltipPersonalizado />} />
                                <Line type="monotone" dataKey="total" name="Eventos" stroke="#14b8a6" strokeWidth={3} dot={{ fill: '#14b8a6', r: 5 }} activeDot={{ r: 7 }} />
                            </LineChart>
                        </ResponsiveContainer>
                    </GraficaCard>

                    <GraficaCard titulo="Distribución por estado" datos={datosEstados}>
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
                        <div className="mb-3">
                            <select
                                value={categoriaSeleccionada}
                                onChange={e => setCategoriaSeleccionada(e.target.value)}
                                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-teal-500"
                            >
                                <option value="">Todas las categorías</option>
                                {estadisticas.categorias?.map(c => (
                                    <option key={c.id_categoria} value={c.id_categoria}>{c.nombre}</option>
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
                        <div className="mb-3">
                            <select
                                value={areaSeleccionada}
                                onChange={e => setAreaSeleccionada(e.target.value)}
                                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-teal-500"
                            >
                                <option value="">Todas las áreas</option>
                                {estadisticas.areas?.map(a => (
                                    <option key={a.id_area} value={a.id_area}>{a.nombre}</option>
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

                </div>

                {/* ── Planes de mejora ── */}
                {datosPlanes.length > 0 && (
                    <GraficaCard titulo="Planes de mejora por estado" datos={datosPlanes}>
                        <ResponsiveContainer width="100%" height={200}>
                            <BarChart data={datosPlanes}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                                <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                                <YAxis tick={{ fontSize: 12 }} />
                                <Tooltip content={<TooltipPersonalizado />} />
                                <Bar dataKey="total" name="Planes" radius={[6, 6, 0, 0]}>
                                    {datosPlanes.map((_, index) => (
                                        <Cell key={index} fill={COLORES[index % COLORES.length]} />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </GraficaCard>
                )}

                {/* ── Clasificación de eventos ── */}
                {porClasificacionMes?.length > 0 && (
                    <GraficaCard
                        titulo={`Clasificación de Eventos ${new Date().getFullYear()}`}
                        subtitulo="INC: Incidente · COMP: Complicación · EAP: Evento adverso Prevenible · EANP: Evento adverso No Prevenible"
                        datos={porClasificacionMes}
                    >
                        <ResponsiveContainer width="100%" height={300}>
                            <BarChart data={porClasificacionMes}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                                <XAxis dataKey="mes" tick={{ fontSize: 12 }} />
                                <YAxis tick={{ fontSize: 12 }} />
                                <Tooltip content={<TooltipPersonalizado />} />
                                <Legend />
                                {clasificaciones.map((cls, index) => (
                                    <Bar key={cls} dataKey={cls} name={cls} fill={COLORES[index % COLORES.length]} radius={[4, 4, 0, 0]} label={{ position: 'top', fontSize: 10 }} />
                                ))}
                            </BarChart>
                        </ResponsiveContainer>
                    </GraficaCard>
                )}

            </div>
        </AuthenticatedLayout>
    );
}