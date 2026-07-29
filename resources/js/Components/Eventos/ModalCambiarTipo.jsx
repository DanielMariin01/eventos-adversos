/**
 * ModalCambiarTipo
 * Modal para cambiar la categoría del evento adverso.
 */

import { useForm } from '@inertiajs/react';
import { X } from 'lucide-react';
import Swal from 'sweetalert2';

export default function ModalCambiarTipo({ evento, categorias, onClose }) {

    const { data, setData, patch, processing, errors } = useForm({
        fk_categoria: evento.fk_categoria ?? '',
        observacion: '',
    });

    const submit = () => {
        patch(route('eventos.tipo', evento.id_eventoAdverso), {
            onSuccess: () => {
                onClose();
                Swal.fire({ icon: 'success', title: 'Tipo de evento actualizado correctamente.' });
            },
            onError: () => {
                Swal.fire({ icon: 'error', title: 'Error al actualizar el tipo de evento.' });
            },
        });
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg">

                {/* Header */}
                <div className="bg-teal-600 px-6 py-4 flex items-center justify-between rounded-t-xl">
                    <h2 className="text-white font-bold text-lg">
                        Cambiar Tipo de Evento N°: {evento.id_eventoAdverso}
                    </h2>
                    <button onClick={onClose} className="text-white hover:text-teal-200 transition">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Contenido */}
                <div className="p-6 space-y-4">

                    <div>
                        <label className="block text-sm font-semibold text-gray-600 mb-1">
                            Tipo de evento actual
                        </label>
                        <p className="text-sm text-teal-600 font-bold">
                            {evento.categoria?.nombre ?? '—'}
                        </p>
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-gray-600 mb-1">
                            Nuevo tipo de evento *
                        </label>
                        <select
                            value={data.fk_categoria}
                            onChange={e => setData('fk_categoria', e.target.value)}
                            className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500"
                        >
                            <option value="">Seleccione la categoría...</option>
                            {categorias.map(c => (
                                <option key={c.id_categoria} value={c.id_categoria}>
                                    {c.nombre}
                                </option>
                            ))}
                        </select>
                        {errors.fk_categoria && (
                            <p className="text-red-500 text-xs mt-1">{errors.fk_categoria}</p>
                        )}
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-gray-600 mb-1">
                            Observación
                        </label>
                        <textarea
                            value={data.observacion}
                            onChange={e => setData('observacion', e.target.value)}
                            placeholder="Ingrese una observación sobre el cambio..."
                            rows={4}
                            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500 resize-none"
                        />
                    </div>

                </div>

                {/* Footer */}
                <div className="flex justify-end gap-3 px-6 py-4 border-t border-gray-200">
                    <button
                        type="button"
                        onClick={onClose}
                        className="px-5 py-2 text-sm font-semibold text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition"
                    >
                        Cancelar
                    </button>
                    <button
                        type="button"
                        onClick={submit}
                        disabled={processing}
                        className="px-5 py-2 text-sm font-semibold text-white bg-teal-500 rounded-lg hover:bg-teal-600 transition disabled:opacity-50"
                    >
                        💾 Guardar
                    </button>
                </div>

            </div>
        </div>
    );
}