/**
 * ModalVerPlan
 * Modal para ver el plan de mejora de un evento.
 */

import { X } from 'lucide-react';
import { FaFilePdf, FaFileImage, FaFileAlt } from 'react-icons/fa';

const BADGE_PLAN = {
    en_proceso: 'bg-yellow-500 text-white',
    ejecutado: 'bg-green-500 text-white',
    radicado: 'bg-purple-500 text-white',

};

const LABEL_PLAN = {
    en_proceso: 'En Proceso',
    ejecutado: 'Ejecutado',
    radicado: 'Radicado',
};

const getIcono = (extension) => {
    if (['pdf'].includes(extension?.toLowerCase())) return <FaFilePdf className="text-red-500 text-lg" />;
    if (['jpg', 'jpeg', 'png'].includes(extension?.toLowerCase())) return <FaFileImage className="text-blue-500 text-lg" />;
    return <FaFileAlt className="text-gray-500 text-lg" />;
};

function ListaArchivos({ archivos, titulo }) {
    if (archivos.length === 0) return null;
    return (
        <div>
            <span className="font-bold">{titulo}: </span>
            <div className="mt-2 space-y-2">
                {archivos.map((archivo) => (
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
        </div>
    );
}

export default function ModalVerPlan({ evento, onClose }) {
    const plan = evento.plan_mejora;
    const archivosCalidad = evento.archivos?.filter(a => a.tipo === 'calidad') ?? [];
    const archivosJefe = evento.archivos?.filter(a => a.tipo === 'jefe') ?? [];

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden">

                {/* Header */}
                <div className="bg-blue-600 px-6 py-4 flex items-center justify-between flex-shrink-0 rounded-t-xl">
                    <h2 className="text-white font-bold text-lg">
                        Plan Mejora Evento N° {evento.id_eventoAdverso}
                    </h2>
                    <button onClick={onClose} className="text-white hover:text-blue-200 transition">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Contenido */}
                <div className="flex-1 overflow-y-auto p-6 space-y-4 text-sm scroll-teal">

                    <p><span className="font-bold">Análisis N°:</span> {plan?.id_plan ?? '—'}</p>
                    <p><span className="font-bold">Fecha:</span> {plan?.created_at?.replace('T', ' ').slice(0, 16) ?? '—'}</p>
                    <p><span className="font-bold">Ejecución:</span> {plan?.fecha_ejecucion?.split('T')[0] ?? '—'}</p>

                    <div>
                        <span className="font-bold">Descripción:</span>
                        <div
                            className="mt-1 prose prose-sm max-w-none"
                            dangerouslySetInnerHTML={{ __html: plan?.descripcion ?? '—' }}
                        />
                    </div>

                    <p><span className="font-bold">Responsable:</span> {plan?.jefe?.name ?? '—'}</p>

                    <p>
                        <span className="font-bold">Estado: </span>
                        <span className={`px-2 py-1 rounded-md text-xs font-bold uppercase ${BADGE_PLAN[plan?.estado] ?? 'bg-gray-100 text-gray-600'}`}>
                            {LABEL_PLAN[plan?.estado] ?? plan?.estado ?? '—'}
                        </span>
                    </p>

                    {/* Archivos de calidad */}
                    {archivosCalidad.length > 0
                        ? <ListaArchivos archivos={archivosCalidad} titulo="Archivos Adjuntos Calidad" />
                        : <p><span className="font-bold">Archivos Adjuntos Calidad: </span>Sin archivo.</p>
                    }

                    {/* Evidencia del jefe */}
                    {archivosJefe.length > 0
                        ? <ListaArchivos archivos={archivosJefe} titulo="Evidencia del Jefe" />
                        : <p><span className="font-bold">Evidencia del Jefe: </span>Sin evidencia.</p>
                    }

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