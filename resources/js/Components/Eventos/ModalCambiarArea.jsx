import { COLORS } from '@/theme';
import { useState } from 'react';
import { useForm } from '@inertiajs/react';
import { X, MapPin } from 'lucide-react';
import Swal from 'sweetalert2';
import Select from 'react-select';

function Campo({ label, error, children }) {
    return (
        <div>
            <label className="block text-sm font-semibold text-gray-600 mb-1">{label}</label>
            {children}
            {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
        </div>
    );
}

export default function ModalCambiarArea({ evento, areas = [], onClose }) {
    const [procesando, setProcesando] = useState(false);
    const { data, setData, patch, errors } = useForm({
        fk_area: '',
        observacion: '',
    });

    const submit = () => {
        if (!data.fk_area) {
            Swal.fire({ icon: 'warning', title: 'Campo obligatorio', text: 'Por favor selecciona un área.' });
            return;
        }
        if (String(data.fk_area) === String(evento.fk_area)) {
            Swal.fire({ icon: 'info', title: 'Sin cambios', text: 'El área seleccionada es la misma que la actual.' });
            return;
        }
        setProcesando(true);
        patch(route('eventos.cambiarArea', evento.id_eventoAdverso), {
            onSuccess: () => {
                setProcesando(false);
                onClose();
                Swal.fire({ icon: 'success', title: 'Área actualizada correctamente.' });
            },
            onError: () => {
                setProcesando(false);
                Swal.fire({ icon: 'error', title: 'Error al actualizar el área.' });
            },
            onFinish: () => setProcesando(false),
        });
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
            {/* Loading overlay */}
            {procesando && (
                <div className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-100/70">
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
                        <div
                            className="absolute inset-0 bg-slate-100 animate-[heartRateIn_2.5s_linear_infinite]"
                            style={{ left: 0, right: 'auto' }}
                        />
                        <div
                            className="absolute top-0 h-full bg-slate-100 animate-[heartRateOut_2.5s_linear_infinite]"
                            style={{ width: '120%', left: '-120%' }}
                        />
                    </div>
                </div>
            )}

            <div className="bg-white rounded-card shadow-card w-full max-w-lg">
                {/* Header */}
                <div className="bg-orange-500 px-6 py-4 flex items-center justify-between rounded-t-xl">
                    <h2 className="text-white font-bold text-lg flex items-center gap-2">
                        <MapPin className="w-5 h-5" />
                        Cambiar Área — Evento N°: {evento.id_eventoAdverso}
                    </h2>
                    <button
                        onClick={onClose}
                        disabled={procesando}
                        className="text-white hover:text-orange-200 transition disabled:opacity-50"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Body */}
                <div className="p-6 space-y-4">
                    {/* Área actual */}
                    <div className="bg-gray-50 border border-gray-200 rounded-lg px-4 py-3">
                        <p className="text-xs text-gray-500 font-semibold uppercase mb-1">Área actual</p>
                        <p className="text-sm font-bold text-gray-800">{evento.area?.nombre ?? '—'}</p>
                    </div>

                    {/* Selector nueva área */}
                    <Campo label="Nueva área *" error={errors.fk_area}>
                        <select
                            value={data.fk_area}
                            onChange={e => setData('fk_area', e.target.value)}
                            className="w-full rounded-lg border-2 border-primary-300 px-3 py-3 text-sm focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500"
                        >
                            <option value="">Seleccione el área...</option>
                            {areas.map(area => (
                                <option key={area.id_area} value={area.id_area}>
                                    {area.nombre}
                                </option>
                            ))}
                        </select>
                    </Campo>

                    {/* Motivo */}
                    <Campo label="Motivo del cambio (opcional)" error={errors.observacion}>
                        <textarea
                            value={data.observacion}
                            onChange={e => setData('observacion', e.target.value)}
                            placeholder="Ingrese el motivo del cambio de área..."
                            rows={3}
                            className="w-full rounded-lg border-2 border-primary-300 px-3 py-2 text-sm focus:outline-none focus:border-orange-500 resize-none"
                        />
                    </Campo>
                </div>

                {/* Footer */}
                <div className="flex justify-end gap-3 px-6 py-4 border-t border-gray-200">
                    <button
                        onClick={onClose}
                        disabled={procesando}
                        className="px-5 py-2 text-sm font-semibold text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition disabled:opacity-50"
                    >
                        Cancelar
                    </button>
                    <button
                        onClick={submit}
                        disabled={procesando}
                        className="flex items-center gap-2 px-5 py-2 text-sm font-semibold text-white bg-orange-500 rounded-lg hover:bg-orange-600 transition disabled:opacity-50"
                    >
                        <MapPin className="w-4 h-4" />
                        {procesando ? 'Guardando...' : 'Cambiar área'}
                    </button>
                </div>
            </div>
        </div>
    );
}