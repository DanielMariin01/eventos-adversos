import React from 'react';
import { router } from '@inertiajs/react';

/**
 * Componente Tabla reutilizable
 *
 * Props:
 * - columnas: array de { label, key, render? }
 * - datos: array o objeto paginado de Laravel
 * - acciones: función opcional (fila) => JSX
 * - onRowClick: función opcional (fila) => void
 * - filaSeleccionada: id de la fila seleccionada
 * - renderExpansion: función opcional (fila) => JSX para mostrar fila expandida
 * - porPagina: número actual de registros por página
 * - onPorPaginaCambio: función opcional para cambiar registros por página
 * - mensajeVacio: texto cuando no hay datos
 */

export default function Tabla({
    columnas = [],
    datos = [],
    acciones = null,
    onRowClick = null,
    filaSeleccionada = null,
    renderExpansion = null,
    porPagina = null,
    onPorPaginaCambio = null,
    mensajeVacio = 'No hay registros disponibles.',
}) {
    const esPaginado = datos && typeof datos === 'object' && !Array.isArray(datos) && 'data' in datos;
    const filas = esPaginado ? datos.data : datos;

    const cambiarPagina = (url) => {
        if (url) router.get(url, {}, { preserveState: true });
    };

    return (
        <div>
            {/* Tabla */}
            <div className="bg-white border border-gray-200 rounded-sm shadow overflow-x-auto">
                <table className="w-full text-sm">
                    <thead className="bg-primary-600 text-white">
                        <tr>
                            {columnas.map((col) => (
                                <th
                                    key={col.key ?? col.label}
                                    className="px-4 py-3 text-left whitespace-nowrap uppercase text-xs font-semibold tracking-wider"
                                >
                                    {col.label}
                                </th>
                            ))}
                            {acciones && (
                                <th className="px-4 py-3 text-left whitespace-nowrap uppercase text-xs font-semibold tracking-wider">
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
                            filas.map((fila, index) => {
                                const idFila = fila.id ?? fila.id_eventoAdverso ?? fila.id_usuario ?? index;
                                const seleccionada = filaSeleccionada === idFila;

                                return (
                                    <React.Fragment key={idFila}>
                                        <tr
                                            onClick={() => onRowClick?.(fila)}
                                            className={`
                                                border-b border-gray-100 transition
                                                ${onRowClick ? 'cursor-pointer' : ''}
                                                ${seleccionada
                                                    ? 'bg-celeste border-l-4 border-l-primary-500'
                                                    : 'hover:bg-gray-50'}
                                            `}
                                        >
                                            {columnas.map((col) => (
                                                <td
                                                    key={col.key ?? col.label}
                                                    className="px-4 py-3"
                                                >
                                                    {col.render
                                                        ? col.render(fila)
                                                        : fila[col.key] ?? '—'}
                                                </td>
                                            ))}
                                            {acciones && (
                                                <td className="px-4 py-3 text-center whitespace-nowrap">
                                                    {acciones(fila)}
                                                </td>
                                            )}
                                        </tr>

                                        {/* Fila expandida */}
                                        {renderExpansion && seleccionada && (
                                            <tr className="bg-blue-50 border-b border-blue-100">
                                                <td
                                                    colSpan={columnas.length + (acciones ? 1 : 0)}
                                                    className="px-6 py-3"
                                                >
                                                    {renderExpansion(fila)}
                                                </td>
                                            </tr>
                                        )}
                                    </React.Fragment>
                                );
                            })
                        )}
                    </tbody>
                </table>
            </div>

            {/* Paginación */}
            {esPaginado && (
                <div className="flex items-center justify-between mt-4 flex-wrap gap-3">
                    {onPorPaginaCambio && (
                        <div className="flex items-center gap-2">
                            <span className="text-sm text-gray-500">Mostrar</span>
                            <select
                                value={porPagina}
                                onChange={e => onPorPaginaCambio(Number(e.target.value))}
                                className="border-2 border-primary-300 rounded-lg text-sm px-2 py-1 focus:outline-none focus:border-primary-400"
                            >
                                <option value={5}>5</option>
                                <option value={10}>10</option>
                                <option value={15}>15</option>
                                <option value={20}>20</option>
                            </select>
                            <span className="text-sm text-gray-500">registros</span>
                        </div>
                    )}

                    <p className="text-sm text-gray-500">
                        Mostrando {datos.from ?? 0} – {datos.to ?? 0} de {datos.total} registros
                    </p>

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