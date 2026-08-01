import { Head } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
    PieChart, Pie, Cell, LineChart, Line, Legend
} from 'recharts';
import { AlertTriangle, CheckCircle, Clock, XCircle, TrendingUp, TrendingDown, FileText } from 'lucide-react';

const COLORES = ['#14b8a6', '#0d9488', '#99f6e4', '#5eead4', '#ccfbf1', '#0f766e', '#115e59', '#134e4a'];

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
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5 flex items-center gap-4">
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
    } = estadisticas;

    const tendencia = mesActual - mesAnterior;

    // Datos para gráfica de estados
    const datosEstados = Object.entries(totalesPorEstado ?? {}).map(([estado, total]) => ({
        name: LABEL_ESTADO[estado] ?? estado,
        value: total,
        color: COLORES_ESTADO[estado] ?? '#94a3b8',
    }));

    // Datos para planes
    const datosPlanes = Object.entries(planesPorEstado ?? {}).map(([estado, total]) => ({
        name: estado === 'en_proceso' ? 'En Proceso' : estado === 'ejecutado' ? 'Ejecutado' : 'Radicado',
        total: total,
    }));

    return (
        <AuthenticatedLayout header={<h2 className="text-xl font-semibold text-white uppercase">Dashboard</h2>}>
            <Head title="Dashboard" />

            <div className="max-w-7xl mx-auto py-8 px-6 space-y-6">

                {/* ── Tarjetas de indicadores ── */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <TarjetaIndicador
                        titulo="Total Eventos"
                        valor={totalEventos}
                        icono={FileText}
                        color="bg-teal-500"
                    />
                    <TarjetaIndicador
                        titulo="Eventos este mes"
                        valor={mesActual}
                        icono={tendencia >= 0 ? TrendingUp : TrendingDown}
                        color={tendencia >= 0 ? 'bg-blue-500' : 'bg-orange-500'}
                        subtitulo={`${tendencia >= 0 ? '+' : ''}${tendencia} vs mes anterior`}
                    />
                    <TarjetaIndicador
                        titulo="En Proceso"
                        valor={totalesPorEstado?.en_proceso ?? 0}
                        icono={Clock}
                        color="bg-yellow-500"
                    />
                    <TarjetaIndicador
                        titulo="Planes Vencidos"
                        valor={planesVencidos}
                        icono={AlertTriangle}
                        color="bg-red-500"
                        subtitulo="Sin evidencia subida"
                    />
                </div>

                {/* ── Segunda fila de indicadores ── */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <TarjetaIndicador
                        titulo="Analizado"
                        valor={totalesPorEstado?.analizado ?? 0}
                        icono={FileText}
                        color="bg-blue-500"
                    />
                    <TarjetaIndicador
                        titulo="En Mejora"
                        valor={totalesPorEstado?.en_mejora ?? 0}
                        icono={CheckCircle}
                        color="bg-teal-600"
                    />
                    <TarjetaIndicador
                        titulo="Radicado"
                        valor={totalesPorEstado?.radicado ?? 0}
                        icono={CheckCircle}
                        color="bg-purple-500"
                    />
                    <TarjetaIndicador
                        titulo="Cancelados"
                        valor={totalesPorEstado?.cancelado ?? 0}
                        icono={XCircle}
                        color="bg-red-400"
                    />
                </div>

                {/* ── Gráficas ── */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

                    {/* Eventos por mes */}
                    <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
                        <h3 className="text-sm font-bold text-gray-700 uppercase tracking-wider mb-4">
                            Eventos por mes (últimos 6 meses)
                        </h3>
                        <ResponsiveContainer width="100%" height={250}>
                            <LineChart data={porMes}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                                <XAxis dataKey="mes" tick={{ fontSize: 12 }} />
                                <YAxis tick={{ fontSize: 12 }} />
                                <Tooltip content={<TooltipPersonalizado />} />
                                <Line
                                    type="monotone"
                                    dataKey="total"
                                    name="Eventos"
                                    stroke="#14b8a6"
                                    strokeWidth={3}
                                    dot={{ fill: '#14b8a6', r: 5 }}
                                    activeDot={{ r: 7 }}
                                />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>

                    {/* Eventos por estado */}
                    <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
                        <h3 className="text-sm font-bold text-gray-700 uppercase tracking-wider mb-4">
                            Distribución por estado
                        </h3>
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
                    </div>

                    {/* Eventos por categoría */}
                    <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
                        <h3 className="text-sm font-bold text-gray-700 uppercase tracking-wider mb-4">
                            Eventos por categoría
                        </h3>
                        <ResponsiveContainer width="100%" height={250}>
                            <BarChart data={porCategoria} layout="vertical">
                                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                                <XAxis type="number" tick={{ fontSize: 12 }} />
                                <YAxis dataKey="nombre" type="category" tick={{ fontSize: 11 }} width={130} />
                                <Tooltip content={<TooltipPersonalizado />} />
                                <Bar dataKey="total" name="Eventos" radius={[0, 6, 6, 0]}>
                                    {porCategoria.map((_, index) => (
                                        <Cell key={index} fill={COLORES[index % COLORES.length]} />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </div>

                    {/* Eventos por área */}
                    <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
                        <h3 className="text-sm font-bold text-gray-700 uppercase tracking-wider mb-4">
                            Top áreas con más eventos
                        </h3>
                        <ResponsiveContainer width="100%" height={250}>
                            <BarChart data={porArea} layout="vertical">
                                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                                <XAxis type="number" tick={{ fontSize: 12 }} />
                                <YAxis dataKey="nombre" type="category" tick={{ fontSize: 11 }} width={130} />
                                <Tooltip content={<TooltipPersonalizado />} />
                                <Bar dataKey="total" name="Eventos" radius={[0, 6, 6, 0]}>
                                    {porArea.map((_, index) => (
                                        <Cell key={index} fill={COLORES[index % COLORES.length]} />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </div>

                </div>

                {/* ── Planes de mejora ── */}
                {datosPlanes.length > 0 && (
                    <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
                        <h3 className="text-sm font-bold text-gray-700 uppercase tracking-wider mb-4">
                            Planes de mejora por estado
                        </h3>
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
                    </div>
                )}

            </div>
        </AuthenticatedLayout>
    );
}