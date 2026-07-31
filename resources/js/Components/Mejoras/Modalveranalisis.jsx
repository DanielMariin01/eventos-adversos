/**
 * ModalVerAnalisis
 * Modal para ver el análisis completo de un evento.
 */

import { X } from 'lucide-react';
import { FaFilePdf, FaFileImage, FaFileAlt } from 'react-icons/fa';

const getIcono = (extension) => {
    if (['pdf'].includes(extension?.toLowerCase())) return <FaFilePdf className="text-red-500 text-lg" />;
    if (['jpg', 'jpeg', 'png'].includes(extension?.toLowerCase())) return <FaFileImage className="text-blue-500 text-lg" />;
    return <FaFileAlt className="text-gray-500 text-lg" />;
};

export default function ModalVerAnalisis({ evento, onClose }) {
    const archivosAnalisis = evento.archivos?.filter(a => a.tipo === 'calidad') ?? [];

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden">

                {/* Header */}
                <div className="bg-teal-600 px-6 py-4 flex items-center justify-between flex-shrink-0">
                    <h2 className="text-white font-bold text-lg">
                        Análisis Evento N° {evento.id_eventoAdverso}
                    </h2>
                    <button onClick={onClose} className="text-white hover:text-teal-200 transition">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Contenido */}
                <div className="flex-1 overflow-y-auto p-6 scroll-teal text-sm space-y-3">

                    {/* Barreras */}
                    {evento.barreras_vulneradas?.length > 0 && (
                        <div>
                            <span className="font-bold text-gray-800">Barrera: </span>
                            <span className="text-gray-700">
                                {Array.isArray(evento.barreras_vulneradas)
                                    ? evento.barreras_vulneradas.join(', ')
                                    : evento.barreras_vulneradas}
                            </span>
                            {evento.barreras_descripcion && (
                                <p className="text-gray-600 mt-1">{evento.barreras_descripcion}</p>
                            )}
                        </div>
                    )}

                    {/* Acciones */}
                    {evento.acciones_inseguras?.length > 0 && (
                        <div>
                            <span className="font-bold text-gray-800">Acción: </span>
                            <span className="text-gray-700">
                                {Array.isArray(evento.acciones_inseguras)
                                    ? evento.acciones_inseguras.join(', ')
                                    : evento.acciones_inseguras}
                            </span>
                            {evento.acciones_descripcion && (
                                <p className="text-gray-600 mt-1">{evento.acciones_descripcion}</p>
                            )}
                        </div>
                    )}

                    {/* Factores */}
                    {evento.factores_contributivos && typeof evento.factores_contributivos === 'object' &&
                        Object.entries(evento.factores_contributivos).map(([factor, desc]) => (
                            <div key={factor}>
                                <span className="font-bold text-gray-800">Factor: </span>
                                <span className="text-gray-700">{factor}</span>
                                {desc && <p className="text-gray-600 mt-1">{desc}</p>}
                            </div>
                        ))
                    }

                    {/* Descripción análisis */}
                    {evento.descripcion_analisis && (
                        <div>
                            <span className="font-bold text-gray-800">Descripción Análisis: </span>
                            <p className="text-gray-600 mt-1">{evento.descripcion_analisis}</p>
                        </div>
                    )}

                    {/* Clasificación */}
                    {evento.clasificacion && (
                        <p>
                            <span className="font-bold text-gray-800">Clasificación: </span>
                            <span className="text-gray-700">{evento.clasificacion}</span>
                        </p>
                    )}

                    {/* Relacionado con */}
                    {evento.relacionado_con && (
                        <p>
                            <span className="font-bold text-gray-800">Relacionado con: </span>
                            <span className="text-gray-700">{evento.relacionado_con}</span>
                        </p>
                    )}

                    {/* Categorización */}
                    {evento.categorizacion && (
                        <p>
                            <span className="font-bold text-gray-800">Categorización: </span>
                            <span className="text-gray-700">{evento.categorizacion}</span>
                        </p>
                    )}

                    {/* Archivos */}
                    <div>
                        <span className="font-bold text-gray-800">Archivos Adjuntos: </span>
                        {archivosAnalisis.length === 0 ? (
                            <span className="text-gray-500">Sin archivo.</span>
                        ) : (
                            <div className="mt-2 space-y-2">
                                {archivosAnalisis.map((archivo) => (
                                    <a
                                        key={archivo.id_archivo}
                                        href={`/storage/${archivo.ruta}`}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg hover:bg-teal-50 hover:border-teal-300 transition group"
                                    >
                                        <div className="w-9 h-9 rounded-lg bg-gray-100 flex items-center justify-center flex-shrink-0 group-hover:bg-teal-100">
                                            {getIcono(archivo.extension)}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-medium text-gray-800 truncate">{archivo.nombre}</p>
                                            <p className="text-xs text-gray-400 uppercase">{archivo.extension}</p>
                                        </div>
                                        <span className="text-xs text-teal-600 font-semibold">Ver →</span>
                                    </a>
                                ))}
                            </div>
                        )}
                    </div>

                </div>

                {/* Footer */}
                <div className="flex justify-end px-6 py-4 border-t border-gray-200 flex-shrink-0">
                    <button
                        onClick={onClose}
                        className="flex items-center gap-2 px-5 py-2 text-sm font-semibold text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition"
                    >
                        Atrás
                    </button>
                </div>

            </div>
        </div>
    );
}