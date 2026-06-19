import { router } from '@inertiajs/react';

/**
 * Componente Tabla reutilizable
 *
 * Props:
 * - columnas: array de { label, key, render? }
 *   - label: texto del encabezado
 *   - key: clave del objeto (para acceso simple)
 *   - render: función opcional (fila) => JSX para columnas personalizadas
 * - datos: array de objetos o objeto paginado de Laravel { data, from, to, total, prev_page_url, next_page_url }
 * - acciones: función opcional (fila) => JSX para la columna de acciones
 * - porPagina: número actual de registros por página (opcional)
 * - onPorPaginaCambio: función opcional para cambiar registros por página
 * - mensajeVacio: texto cuando no hay datos (opcional)
 */

export default function Tabla({
    columnas = [],
    datos = [],
    acciones = null,
    porPagina = null,
    onPorPaginaCambio = null,
    mensajeVacio = 'No hay registros disponibles.',
}) {
    // Detecta si los datos son paginados (objeto de Laravel) o un array simple
    const esPaginado = datos && typeof datos === 'object' && !Array.isArray(datos) && 'data' in datos;
    const filas = esPaginado ? datos.data : datos;

    const cambiarPagina = (url) => {
        if (url) router.get(url, {}, { preserveState: true });
    };

    return (
        <div>
            {/* Tabla */}
            <div className="bg-white border border-gray-200 rounded-sm shadow overflow-x-auto scroll-teal">
                <table className="w-full text-sm tabla-rayada">
                    <thead className="bg-cyan-600 text-white">
                        <tr>
                            {columnas.map((col) => (
                                <th
                                    key={col.key ?? col.label}
                                    className="px-4 py-3 text-center whitespace-nowrap uppercase text-sm font-semibold tracking-wider"
                                >
                                    {col.label}
                                </th>
                            ))}
                            {acciones && (
                                <th className="px-4 py-3 text-center whitespace-nowrap uppercase text-sm font-semibold tracking-wider">
                                    Acciones
                                </th>
                            )}
                        </tr>
                    </thead>
                    <tbody>
                        {filas.length === 0 ? (
                            <tr>
                                <td
                                    colSpan={columnas.length + (acciones ? 1 : 0)}
                                    className="px-4 py-8 text-center text-gray-400"
                                >
                                    {mensajeVacio}
                                </td>
                            </tr>
                        ) : (
                            filas.map((fila, index) => (
                                <tr
                                    key={fila.id ?? index}
                                    className="border-b border-gray-100 hover:bg-gray-50 transition"
                                >
                                    {columnas.map((col) => (
                                        <td
                                            key={col.key ?? col.label}
                                            className="px-4 py-3 whitespace-nowrap text-center"
                                        >
                                            {col.render
                                                ? col.render(fila)
                                                : fila[col.key] ?? '—'}
                                        </td>
                                    ))}
                                    {acciones && (
                                        <td className="px-4 py-3 whitespace-nowrap text-center">
                                            {acciones(fila)}
                                        </td>
                                    )}
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {/* Paginación — solo si los datos son paginados */}
            {esPaginado && (
                <div className="flex items-center justify-between mt-4 flex-wrap gap-3">

                    {/* Registros por página */}
                    {onPorPaginaCambio && (
                        <div className="flex items-center gap-2">
                            <span className="text-sm text-gray-500">Mostrar</span>
                            <select
                                value={porPagina}
                                onChange={e => onPorPaginaCambio(Number(e.target.value))}
                                className="border border-gray-300 rounded-lg text-sm px-2 py-1 focus:outline-none focus:border-teal-400"
                            >
                                <option value={5}>5</option>
                                <option value={10}>10</option>
                                <option value={15}>15</option>
                                <option value={20}>20</option>
                            </select>
                            <span className="text-sm text-gray-500">registros</span>
                        </div>
                    )}

                    {/* Contador */}
                    <p className="text-sm text-gray-500">
                        Mostrando {datos.from ?? 0} – {datos.to ?? 0} de {datos.total} registros
                    </p>

                    {/* Botones anterior/siguiente */}
                    <div className="flex gap-2">
                        <button
                            onClick={() => cambiarPagina(datos.prev_page_url)}
                            disabled={!datos.prev_page_url}
                            className="px-4 py-2 text-sm bg-white border border-gray-300 rounded-lg disabled:opacity-50 hover:bg-gray-50 transition"
                        >
                            Anterior
                        </button>
                        <button
                            onClick={() => cambiarPagina(datos.next_page_url)}
                            disabled={!datos.next_page_url}
                            className="px-4 py-2 text-sm bg-white border border-gray-300 rounded-lg disabled:opacity-50 hover:bg-gray-50 transition"
                        >
                            Siguiente
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}