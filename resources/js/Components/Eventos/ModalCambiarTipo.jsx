/**
 * ModalCambiarTipo
 * Modal para cambiar la categoría del evento adverso.
 */

import { COLORS } from '@/theme';
import { useForm } from '@inertiajs/react';
import { useState } from 'react';
import { X } from 'lucide-react';
import Swal from 'sweetalert2';

export default function ModalCambiarTipo({ evento, categorias, onClose }) {

    const { data, setData, patch, processing, errors } = useForm({
        fk_categoria: evento.fk_categoria ?? '',
        observacion: '',
    });

    const [cargando, setCargando] = useState(false);

    const submit = () => {
        setCargando(true);
        patch(route('eventos.tipo', evento.id_eventoAdverso), {
            onSuccess: () => {
                setCargando(false);
                onClose();
                Swal.fire({ icon: 'success', title: 'Tipo de evento actualizado correctamente.' });
            },
            onError: () => {
                setCargando(false);
                Swal.fire({ icon: 'error', title: 'Error al actualizar el tipo de evento.' });
            },
            onFinish: () => setCargando(false),
        });
    };



    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
            {/* Loading overlay */}
            {cargando && (
                <div className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-100/85">
                    <div className="relative w-[150px] h-[73px]">
                        <svg viewBox="0 0 150 73" height="73px" width="150px" xmlns="http://www.w3.org/2000/svg">
                            <polyline
                                points="0,45.486 38.514,45.486 44.595,33.324 50.676,45.486 57.771,45.486 62.838,55.622 71.959,9 80.067,63.729 84.122,45.486 97.297,45.486 103.379,40.419 110.473,45.486 150,45.486"
                                strokeMiterlimit="10"
                                strokeWidth="3"
                                stroke={COLORS.secondary}
                                fill="none"
                            />
                        </svg>
                        <div className="absolute inset-0 bg-slate-100 animate-[heartRateIn_2.5s_linear_infinite]"
                            style={{ left: 0, right: 'auto' }} />
                        <div className="absolute top-0 h-full bg-slate-100 animate-[heartRateOut_2.5s_linear_infinite]"
                            style={{ width: '120%', left: '-120%' }} />
                    </div>
                </div>
            )}
            <div className="bg-white rounded-card shadow-card w-full max-w-lg">

                {/* Header */}
                <div className="bg-primary-600 px-6 py-4 flex items-center justify-between rounded-t-xl">
                    <h2 className="text-white font-bold text-lg">
                        Cambiar Tipo de Evento N°: {evento.id_eventoAdverso}
                    </h2>
                    <button onClick={onClose} className="text-white hover:text-primary-200 transition">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Contenido */}
                <div className="p-6 space-y-4">

                    <div>
                        <label className="block text-sm font-semibold text-gray-600 mb-1">
                            Tipo de evento actual
                        </label>
                        <p className="text-sm text-primary-600 font-bold">
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
                            className="w-full rounded-lg border-2 border-primary-300 px-3 py-3 text-sm focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500"
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
                            className="w-full rounded-lg border-2 border-primary-300 px-3 py-2 text-sm focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 resize-none"
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
                        className="px-5 py-2 text-sm font-semibold text-white bg-primary-500 rounded-lg hover:bg-primary-600 transition disabled:opacity-50"
                    >
                        Guardar
                    </button>
                </div>

            </div>
        </div>
    );
}