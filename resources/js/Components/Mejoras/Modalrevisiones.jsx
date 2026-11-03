/**
 * ModalRevisiones
 * Modal para ver el historial de revisiones de un evento.
 */

import { X } from 'lucide-react';

export default function ModalRevisiones({ evento, onClose }) {
    const revisiones = evento.revisiones ?? [];

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
            <div className="bg-white rounded-card shadow-card w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden">

                {/* Header */}
                <div className="bg-lime-600 px-6 py-4 flex items-center justify-between flex-shrink-0">
                    <h2 className="text-white font-bold text-lg">
                        Revisiones Evento N° {evento.id_eventoAdverso}
                    </h2>
                    <button onClick={onClose} className="text-white hover:text-primary-200 transition">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Contenido */}
                <div className="flex-1 overflow-y-auto p-6 scroll-teal">
                    {revisiones.length === 0 ? (
                        <p className="text-center text-gray-400 py-8">No hay revisiones registradas.</p>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead className="bg-lime-600 text-white">
                                    <tr>
                                        <th className="px-4 py-3 text-left text-xs font-semibold uppercase">ID</th>
                                        <th className="px-4 py-3 text-left text-xs font-semibold uppercase">Fecha</th>
                                        <th className="px-4 py-3 text-left text-xs font-semibold uppercase">Tipo</th>
                                        <th className="px-4 py-3 text-left text-xs font-semibold uppercase">Observación</th>
                                        <th className="px-4 py-3 text-left text-xs font-semibold uppercase">Creada por</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {revisiones.map(revision => (
                                        <tr key={revision.id_revision} className="border-b border-gray-100 hover:bg-gray-50">
                                            <td className="px-4 py-3">{revision.id_revision}</td>
                                            <td className="px-4 py-3 text-xs">
                                                {revision.created_at ? new Date(revision.created_at).toLocaleString('es-CO', { timeZone: 'America/Bogota' }) : '—'}
                                            </td>
                                            <td className="px-4 py-3">{revision.tipo}</td>
                                            <td className="px-4 py-3">{revision.observacion}</td>
                                            <td className="px-4 py-3">{revision.usuario?.name ?? '—'}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="flex justify-end px-6 py-4 border-t border-gray-200 flex-shrink-0">
                    <button onClick={onClose} className="flex items-center gap-2 px-5 py-2 text-sm font-semibold text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition">
                        Atrás
                    </button>
                </div>

            </div>
        </div>
    );
}