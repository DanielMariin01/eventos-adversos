import { Head, router } from '@inertiajs/react';
import { useState, useEffect, useRef } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import Tabla from '@/Components/Tabla';
import { Search, Filter } from 'lucide-react';

const ENTIDADES = { usuario: 'Usuario', categoria: 'Categoría', area: 'Área' };

const ACCIONES = {
    crear: 'Crear',
    editar: 'Editar',
    eliminar: 'Eliminar',
    activar: 'Activar',
    desactivar: 'Desactivar',
};

const BADGE_ACCION = {
    crear: 'bg-secondary-500 text-white',
    editar: 'bg-primary-500 text-white',
    eliminar: 'bg-red-500 text-white',
    activar: 'bg-secondary-600 text-white',
    desactivar: 'bg-gray-600 text-white',
};

// ── Texto legible de un valor guardado (listas separadas por coma) ──
const texto = (valor) => {
    if (valor === null || valor === undefined || valor === '') return '—';
    if (Array.isArray(valor)) return valor.join(', ') || '—';
    if (typeof valor === 'boolean') return valor ? 'Sí' : 'No';
    return String(valor);
};

// ── Detalle de los campos que cambiaron ──
function Cambios({ antes, despues }) {
    const campos = Array.from(new Set([...Object.keys(antes ?? {}), ...Object.keys(despues ?? {})]));
    if (campos.length === 0) return null;

    return (
        <div className="text-xs space-y-1">
            {campos.map(campo => {
                const a = antes?.[campo];
                const d = despues?.[campo];
                const igual = JSON.stringify(a) === JSON.stringify(d);
                return (
                    <p key={campo} className={igual ? 'text-gray-500' : 'text-ink'}>
                        <span className="font-semibold capitalize">{campo.replaceAll('_', ' ')}:</span>{' '}
                        {antes && despues && !igual
                            ? <><span className="line-through text-gray-400">{texto(a)}</span> → <span className="font-semibold">{texto(d)}</span></>
                            : texto(despues ?? a)}
                    </p>
                );
            })}
        </div>
    );
}

export default function Index({ registros, filtros = {} }) {
    const [buscar, setBuscar] = useState(filtros.buscar ?? '');
    const [entidad, setEntidad] = useState(filtros.entidad ?? '');
    const [accion, setAccion] = useState(filtros.accion ?? '');
    const [seleccionado, setSeleccionado] = useState(null);

    // ── Búsqueda en servidor (a través de todas las páginas) ──
    const esPrimerRender = useRef(true);
    useEffect(() => {
        if (esPrimerRender.current) {
            esPrimerRender.current = false;
            return;
        }
        const timeout = setTimeout(() => {
            router.get(route('auditoria.index'), {
                buscar: buscar || undefined,
                entidad: entidad || undefined,
                accion: accion || undefined,
            }, { preserveState: true, preserveScroll: true, replace: true });
        }, 400);
        return () => clearTimeout(timeout);
    }, [buscar, entidad, accion]);

    const columnas = [
        {
            label: 'Fecha',
            key: 'created_at',
            render: (fila) => <span className="text-xs whitespace-nowrap">{fila.created_at?.replace('T', ' ').slice(0, 16)}</span>,
        },
        { label: 'Realizado por', key: 'usuario_nombre', render: (fila) => <span className="text-xs font-semibold">{fila.usuario_nombre}</span> },
        {
            label: 'Acción',
            key: 'accion',
            render: (fila) => (
                <span className={`px-2 py-1 rounded-md text-xs font-bold uppercase ${BADGE_ACCION[fila.accion] ?? 'bg-gray-100 text-gray-600'}`}>
                    {ACCIONES[fila.accion] ?? fila.accion}
                </span>
            ),
        },
        { label: 'Sobre', key: 'entidad', render: (fila) => <span className="text-xs">{ENTIDADES[fila.entidad] ?? fila.entidad}</span> },
        { label: 'Descripción', key: 'descripcion', render: (fila) => <span className="text-xs">{fila.descripcion}</span> },
    ];

    return (
        <AuthenticatedLayout header={<h2 className="text-xl font-semibold text-white uppercase">Auditoría</h2>}>
            <Head title="Auditoría" />

            <div className="max-w-7xl mx-auto py-8 px-6">

                {/* ── Buscadores ── */}
                <div className="mb-4 grid grid-cols-1 md:grid-cols-3 gap-3">
                    <div className="flex items-center border-2 border-primary-300 rounded-lg overflow-hidden focus-within:border-primary-500">
                        <input
                            type="text"
                            value={buscar}
                            onChange={e => setBuscar(e.target.value)}
                            placeholder="Buscar por usuario o descripción..."
                            className="flex-1 px-4 py-3 text-sm focus:outline-none"
                        />
                        <div className="bg-secondary-500 px-3 py-2.5"><Search className="w-4 h-4 text-white" /></div>
                    </div>
                    <div className="flex items-center border-2 border-primary-300 rounded-lg overflow-hidden focus-within:border-primary-500">
                        <select value={entidad} onChange={e => setEntidad(e.target.value)} className="flex-1 px-4 py-3 text-sm focus:outline-none bg-white">
                            <option value="">Todos los módulos</option>
                            {Object.entries(ENTIDADES).map(([valor, label]) => <option key={valor} value={valor}>{label}</option>)}
                        </select>
                        <div className="bg-secondary-500 px-3 py-2.5 flex-shrink-0"><Filter className="w-4 h-4 text-white" /></div>
                    </div>
                    <div className="flex items-center border-2 border-primary-300 rounded-lg overflow-hidden focus-within:border-primary-500">
                        <select value={accion} onChange={e => setAccion(e.target.value)} className="flex-1 px-4 py-3 text-sm focus:outline-none bg-white">
                            <option value="">Todas las acciones</option>
                            {Object.entries(ACCIONES).map(([valor, label]) => <option key={valor} value={valor}>{label}</option>)}
                        </select>
                        <div className="bg-secondary-500 px-3 py-2.5 flex-shrink-0"><Filter className="w-4 h-4 text-white" /></div>
                    </div>
                </div>

                <Tabla
                    columnas={columnas}
                    datos={registros}
                    mensajeVacio="No hay registros de auditoría."
                    onRowClick={(fila) => setSeleccionado(seleccionado === fila.id_auditoria ? null : fila.id_auditoria)}
                    filaSeleccionada={seleccionado}
                    renderExpansion={(fila) => (
                        <div className="text-sm">
                            <p className="font-bold mb-1">Detalle del cambio</p>
                            {fila.antes || fila.despues
                                ? <Cambios antes={fila.antes} despues={fila.despues} />
                                : <p className="text-xs text-gray-500">Sin detalle adicional.</p>}
                        </div>
                    )}
                />
            </div>
        </AuthenticatedLayout>
    );
}
