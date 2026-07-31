/**
 * ModalVerAnalisis
 * Modal para ver el análisis completo de un evento.
 */

import { X } from 'lucide-react';

function Seccion({ label, valor }) {
    if (!valor) return null;
    return (
        <div className="mb-3">
            <span className="font-bold text-gray-800">{label}: </span>
            <span className="text-gray-700">{valor}</span>
        </div>
    );
}

function SeccionArray({ label, valores }) {
    if (!valores || valores.length === 0) return null;
    return (
        <div className="mb-3">
            <span className="font-bold text-gray-800">{label}: </span>
            <span className="text-gray-700">
                {Array.isArray(valores)
                    ? valores.join(', ')
                    : Object.entries(valores).map(([k, v]) => `${k}: ${v}`).join(' | ')
                }
            </span>
        </div>
    );
}

export default function ModalVerAnalisis({ evento, onClose }) {
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
            <div className="bg-white rounded-lg shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden">

                {/* Header */}
                <div className="bg-purple-600 px-6 py-4 flex items-center justify-between flex-shrink-0">
                    <h2 className="text-white font-bold text-lg">
                        Análisis Evento N° {evento.id_eventoAdverso}
                    </h2>
                    <button onClick={onClose} className="text-white hover:text-teal-200 transition">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Contenido */}
                <div className="flex-1 overflow-y-auto p-6 scroll-teal text-sm">

                    <Seccion label="Barrera" valor={Array.isArray(evento.barreras_vulneradas) ? evento.barreras_vulneradas.join(', ') : null} />
                    {evento.barreras_descripcion && (
                        <p className="text-gray-600 mb-3">{evento.barreras_descripcion}</p>
                    )}

                    <Seccion label="Acción" valor={Array.isArray(evento.acciones_inseguras) ? evento.acciones_inseguras.join(', ') : null} />
                    {evento.acciones_descripcion && (
                        <p className="text-gray-600 mb-3">{evento.acciones_descripcion}</p>
                    )}

                    {evento.factores_contributivos && typeof evento.factores_contributivos === 'object' &&
                        Object.entries(evento.factores_contributivos).map(([factor, desc]) => (
                            <div key={factor} className="mb-3">
                                <span className="font-bold text-gray-800">Factor: </span>
                                <span className="text-gray-700">{factor}</span>
                                {desc && <p className="text-gray-600 mt-1">{desc}</p>}
                            </div>
                        ))
                    }

                    <Seccion label="Descripción Análisis" valor={evento.descripcion_analisis} />
                    <Seccion label="Clasificación" valor={evento.clasificacion} />
                    <Seccion label="Relacionado con" valor={evento.relacionado_con} />
                    <Seccion label="Categorización" valor={evento.categorizacion} />

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