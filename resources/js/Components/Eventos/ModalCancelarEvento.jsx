/**
 * ModalCancelarEvento
 * Modal para cancelar un evento con observación y jefe responsable.
 */

import { COLORS } from '@/theme';
import { useState } from 'react';
import { useForm } from '@inertiajs/react';
import { X, XCircle } from 'lucide-react';
import Swal from 'sweetalert2';

function Campo({ label, error, children }) {
    return (
        <div>
            <label className="block text-sm font-semibold text-gray-600 mb-1">{label}</label>
            {children}
            {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
        </div>
    );
}

export default function ModalCancelarEvento({ evento, jefes = [], onClose }) {

    const [procesando, setProcesando] = useState(false);

    const { data, setData, patch, errors } = useForm({
        observacion_cancelacion: '',
        fk_jefe: evento.fk_jefe ?? evento.area?.jefe?.id ?? '',
    });

    const submit = () => {
        if (!data.observacion_cancelacion) {
            Swal.fire({ icon: 'warning', title: 'Campo obligatorio', text: 'Por favor ingresa el motivo de cancelación.' });
            return;
        }

        setProcesando(true);
        patch(route('eventos.cancelar', evento.id_eventoAdverso), {
            onSuccess: () => {
                setProcesando(false);
                onClose();
                Swal.fire({ icon: 'success', title: 'Evento cancelado correctamente.' });
            },
            onError: (err) => {
                setProcesando(false);
                console.log('errores:', err);
                Swal.fire({ icon: 'error', title: 'Error al cancelar el evento.' });
            },
            onFinish: () => setProcesando(false),
        });
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
            {/* Loading */}
            {procesando && (
                <div className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-100/70">
                    <div className="relative w-[150px] h-[73px]">
                        <svg viewBox="0 0 150 73" height="73px" width="150px" xmlns="http://www.w3.org/2000/svg">
                            <polyline
                                points="0,45.486 38.514,45.486 44.595,33.324 50.676,45.486 57.771,45.486 62.838,55.622 71.959,9 80.067,63.729 84.122,45.486 97.297,45.486 103.379,40.419 110.473,45.486 150,45.486"
                                strokeMiterlimit="10" strokeWidth="3" stroke={COLORS.secondary} fill="none"
                            />
                        </svg>
                        <div className="absolute inset-0 bg-slate-100 animate-[heartRateIn_0.8s_linear_infinite]" style={{ left: 0, right: 'auto' }} />
                        <div className="absolute top-0 h-full bg-slate-100 animate-[heartRateOut_0.8s_linear_infinite]" style={{ width: '120%', left: '-120%' }} />
                    </div>
                </div>
            )}
            <div className="bg-white rounded-card shadow-card w-full max-w-lg">

                {/* Header */}
                <div className="bg-red-900 px-6 py-4 flex items-center justify-between rounded-t-xl">
                    <h2 className="text-white font-bold text-lg">
                        Cancelar Evento N°: {evento.id_eventoAdverso}
                    </h2>
                    <button onClick={onClose} className="text-white hover:text-red-200 transition">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Contenido */}
                <div className="p-6 space-y-4">

                    <Campo label="Motivo de cancelación *" error={errors.observacion_cancelacion}>
                        <textarea
                            value={data.observacion_cancelacion}
                            onChange={e => setData('observacion_cancelacion', e.target.value)}
                            placeholder="Ingrese el motivo de cancelación..."
                            rows={4}
                            className="w-full rounded-lg border-2 border-primary-300 px-3 py-2 text-sm focus:outline-none focus:border-red-400 focus:ring-1 focus:ring-red-400 resize-none scroll-teal"
                        />
                    </Campo>

                    <Campo label="Responsable del Área" error={errors.fk_jefe}>
                        <select
                            value={data.fk_jefe}
                            onChange={e => setData('fk_jefe', e.target.value)}
                            className="w-full rounded-lg border-2 border-primary-300 px-3 py-3 text-sm focus:outline-none focus:border-red-400"
                        >
                            <option value="">Seleccione el responsable (Opcional)...</option>
                            {jefes.map(jefe => (
                                <option key={jefe.id} value={jefe.id}>{jefe.name}</option>
                            ))}
                        </select>
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
                        className="flex items-center gap-2 px-5 py-2 text-sm font-semibold text-white bg-red-500 rounded-lg hover:bg-red-600 transition disabled:opacity-50"
                    >
                        <XCircle className="w-4 h-4" />
                        {procesando ? 'Cancelando...' : 'Confirmar cancelación'}
                    </button>
                </div>

            </div>
        </div>
    );
}