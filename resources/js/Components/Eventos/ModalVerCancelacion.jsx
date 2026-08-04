/**
 * ModalVerCancelacion
 * Modal para ver la información de cancelación de un evento.
 */

import { X } from 'lucide-react';

export default function ModalVerCancelacion({ evento, onClose }) {
    // Buscar la revisión de cancelación
    const revisionCancelacion = evento.revisiones?.find(r => r.tipo === 'Cancelación de Evento');

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg">

                {/* Header */}
                <div className="bg-red-900 px-6 py-4 flex items-center justify-between rounded-t-xl">
                    <h2 className="text-white font-bold text-lg">
                        Cancelación Evento N°: {evento.id_eventoAdverso}
                    </h2>
                    <button onClick={onClose} className="text-white hover:text-red-200 transition">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Contenido */}
                <div className="p-6 space-y-4 text-sm">

                    <div className=" rounded-lg p-4 space-y-3">
                        <p>
                            <span className="font-bold text-gray-700">Fecha de cancelación: </span>
                            <span className="text-gray-600">
                                {revisionCancelacion?.created_at
                                    ? new Date(revisionCancelacion.created_at).toLocaleDateString('es-CO', { timeZone: 'America/Bogota' })
                                    : '—'}
                            </span>
                        </p>
                        <p>
                            <span className="font-bold text-gray-700">Hora de cancelación: </span>
                            <span className="text-gray-600">
                                {revisionCancelacion?.created_at
                                    ? new Date(revisionCancelacion.created_at).toLocaleTimeString('es-CO', { timeZone: 'America/Bogota' })
                                    : '—'}
                            </span>
                        </p>

                        <p>
                            <span className="font-bold text-gray-700">Cancelado por: </span>
                            <span className="text-gray-600">
                                {revisionCancelacion?.usuario?.name ?? evento.usuarioCalidad?.name ?? '—'}
                            </span>
                        </p>

                        <div>
                            <span className="font-bold text-gray-700">Motivo de cancelación: </span>
                            <p className="text-gray-600 mt-1 bg-white shadow-xl rounded-lg p-3">
                                {evento.observacion_cancelacion ?? '—'}
                            </p>
                        </div>
                    </div>

                </div>

                {/* Footer */}
                <div className="flex justify-end px-6 py-4 border-t border-gray-200">
                    <button
                        onClick={onClose}
                        className="px-5 py-2 text-sm font-semibold text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition"
                    >
                        Cerrar
                    </button>
                </div>

            </div>
        </div>
    );
}