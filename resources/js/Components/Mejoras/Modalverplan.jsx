/**
 * ModalVerPlan
 * Modal para ver el plan de mejora de un evento.
 */

import { X } from 'lucide-react';

const BADGE_PLAN = {
    en_proceso: 'bg-yellow-500 text-white',
    ejecutado: 'bg-green-500 text-white',
};

const LABEL_PLAN = {
    en_proceso: 'En Proceso',
    ejecutado: 'Ejecutado',
};

export default function ModalVerPlan({ evento, onClose }) {
    const plan = evento.plan_mejora;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl">

                {/* Header */}
                <div className="bg-blue-600 px-6 py-4 flex items-center justify-between rounded-t-md">
                    <h2 className="text-white font-bold text-lg">
                        Plan Mejora Evento N° {evento.id_eventoAdverso}
                    </h2>
                    <button onClick={onClose} className="text-white hover:text-blue-200 transition">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Contenido */}
                <div className="p-6 space-y-3 text-sm">
                    <p><span className="font-bold">Análisis N°:</span> {plan?.id_plan ?? '—'}</p>
                    <p><span className="font-bold">Fecha:</span> {plan?.created_at?.replace('T', ' ').slice(0, 16) ?? '—'}</p>
                    <p><span className="font-bold">Ejecución:</span> {plan?.fecha_ejecucion?.split('T')[0] ?? '—'}</p>
                    <div>
                        <span className="font-bold">Descripción:</span>
                        <div
                            className=" mt-1 prose prose-sm max-w-none"
                            dangerouslySetInnerHTML={{ __html: plan?.descripcion ?? '—' }}
                        />
                    </div>
                    <p><span className="font-bold">Responsable:</span> {plan?.jefe?.name ?? '—'}</p>
                    <p>
                        <span className="font-bold">Archivo Adjunto: </span>
                        {plan?.archivo ? (
                            <a href={`/storage/${plan.archivo}`} target="_blank" className="text-teal-600 underline">
                                Ver archivo
                            </a>
                        ) : 'Sin archivo.'}
                    </p>
                    <p>
                        <span className="font-bold">Estado: </span>
                        <span className={`px-2 py-1 rounded-md text-xs font-bold uppercase ${BADGE_PLAN[plan?.estado] ?? 'bg-gray-100 text-gray-600'}`}>
                            {LABEL_PLAN[plan?.estado] ?? plan?.estado ?? '—'}
                        </span>
                    </p>
                </div>

                {/* Footer */}
                <div className="flex justify-end px-6 py-4 border-t border-gray-200">
                    <button onClick={onClose} className="flex items-center gap-2 px-5 py-2 text-sm font-semibold text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition">
                        Atrás
                    </button>
                </div>

            </div>
        </div>
    );
}