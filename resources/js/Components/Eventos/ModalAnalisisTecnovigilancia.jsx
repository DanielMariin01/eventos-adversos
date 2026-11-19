/**
 * ModalAnalisisTecnovigilancia
 * Análisis propio de los eventos de la categoría Tecnovigilancia.
 * Guarda en la tabla tecnovigilancias (ruta tecnovigilancia.analisis); no cambia el estado del evento.
 */

import { COLORS } from '@/theme';
import { useState } from 'react';
import { useForm } from '@inertiajs/react';
import { X, Save } from 'lucide-react';
import Swal from 'sweetalert2';

// Debe coincidir con CAUSAS_PROBABLES en TecnovigilanciaController.php
const CAUSAS_PROBABLES = [
    'Uso anormal',
    'Respuesta fisiológica anormal o inexplicable',
    'Falla en la alarma',
    'Uso de material biológico',
    'Calibración',
    'Hardware de computador',
    'Contaminación durante la producción',
    'Contaminación post-producción',
    'Diseño',
    'Desconexión',
    'Componente eléctrico',
    'Circuito eléctrico',
    'Contacto eléctrico',
    'Interferencia Electromagnética EIM',
    'Fecha de expiración',
    'Falso Negativo',
    'Falso positivo',
    'Resultado falso de la prueba',
    'Ambiente inapropiado',
    'Incompatibilidad',
    'Instrucciones para uso y rotulado',
    'Escape/ sellado',
    'Mantenimiento',
    'Fabricación',
    'Material',
    'Componentes Mecánicos',
    'Condiciones no higiénicas',
    'No relacionado con el dispositivo',
    'Otros',
    'Empaque',
    'Anatomía/ Fisiología del paciente',
    'Condiciones del paciente',
    'Fuente de energía',
    'Medida de protección',
    'Aseguramiento de la calidad en la institución para la atención de salud',
    'Radiación',
    'Software',
    'Esterilización/desinfección/ limpieza',
    'Condiciones de almacenamiento',
    'Manipulación, falsificación, sabotaje',
    'Entrenamiento',
    'Transporte y entrega',
    'Sin definir',
    'Error de Uso',
    'Desgaste',
];

const clase = 'w-full rounded-lg border-2 border-primary-300 px-3 py-2.5 text-sm focus:outline-none focus:border-primary-500 scroll-teal';

function Campo({ label, error, children }) {
    return (
        <div>
            <label className="block text-sm font-semibold text-gray-600 mb-1">{label}</label>
            {children}
            {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
        </div>
    );
}

// ── Selector Sí / No (valor true / false / null) ──
function SiNo({ value, onChange }) {
    return (
        <select
            value={value === null || value === undefined ? '' : value ? 'si' : 'no'}
            onChange={e => onChange(e.target.value === '' ? null : e.target.value === 'si')}
            className={clase}
        >
            <option value="">Seleccione...</option>
            <option value="si">Sí</option>
            <option value="no">No</option>
        </select>
    );
}

export default function ModalAnalisisTecnovigilancia({ evento, onClose }) {
    const [cargando, setCargando] = useState(false);
    const tecno = evento.tecnovigilancia ?? {};

    const { data, setData, post, processing, errors } = useForm({
        causa_probable: tecno.causa_probable ?? [],
        acciones_correctivas: tecno.acciones_correctivas ?? '',
        reportado_fabricante: tecno.reportado_fabricante ?? null,
        fecha_reporte_fabricante: tecno.fecha_reporte_fabricante ?? '',
        dm_disponible_evaluacion: tecno.dm_disponible_evaluacion ?? null,
        dm_enviado_fabricante: tecno.dm_enviado_fabricante ?? null,
    });

    const toggleCausa = (valor) => {
        if (!valor) return;
        setData('causa_probable', data.causa_probable.includes(valor)
            ? data.causa_probable.filter(v => v !== valor)
            : [...data.causa_probable, valor]
        );
    };

    const submit = () => {
        const faltantes = [];

        if (data.causa_probable.length === 0) faltantes.push('Seleccione al menos una causa probable');
        if (!data.acciones_correctivas.trim()) faltantes.push('Las acciones correctivas y preventivas son obligatorias');
        if (data.reportado_fabricante === null) faltantes.push('Indique si reportó al fabricante/importador/distribuidor');
        if (data.reportado_fabricante && !data.fecha_reporte_fabricante)
            faltantes.push('La fecha de reporte al fabricante es obligatoria');
        if (data.dm_disponible_evaluacion === null) faltantes.push('Indique si el dispositivo médico está disponible para evaluación');
        if (data.dm_enviado_fabricante === null) faltantes.push('Indique si envió el DM al fabricante/importador/distribuidor');

        if (faltantes.length > 0) {
            Swal.fire({
                icon: 'warning',
                title: 'Campos obligatorios',
                html: faltantes.map(e => `• ${e}`).join('<br>'),
            });
            return;
        }

        setCargando(true);
        post(route('tecnovigilancia.analisis', evento.id_eventoAdverso), {
            preserveScroll: true,
            onSuccess: () => {
                setCargando(false);
                onClose();
                Swal.fire({ icon: 'success', title: 'Análisis guardado correctamente.' });
            },
            onError: () => {
                setCargando(false);
                Swal.fire({ icon: 'error', title: 'Error al guardar el análisis.' });
            },
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

            <div className="bg-white rounded-card shadow-card w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden">

                {/* Header */}
                <div className="bg-primary-600 px-6 py-4 flex items-center justify-between flex-shrink-0">
                    <h2 className="text-white font-bold text-lg">
                        Análisis Tecnovigilancia N°: {evento.id_eventoAdverso}
                    </h2>
                    <button onClick={onClose} className="text-white hover:text-primary-200 transition">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Contenido */}
                <div className="flex-1 overflow-y-auto p-6 scroll-teal space-y-5">

                    <Campo label="Causa probable del evento/incidente" error={errors.causa_probable}>
                        <select
                            value=""
                            onChange={e => toggleCausa(e.target.value)}
                            className={`${clase} mb-2`}
                        >
                            <option value="">Seleccione la causa probable...</option>
                            {CAUSAS_PROBABLES.map(c => (
                                <option key={c} value={c}>{c}</option>
                            ))}
                        </select>
                        <div className="flex flex-wrap gap-1">
                            {data.causa_probable.map(c => (
                                <span key={c} onClick={() => toggleCausa(c)}
                                    className="bg-primary-100 text-primary-700 text-xs px-2 py-1 rounded-full cursor-pointer hover:bg-red-100 hover:text-red-600">
                                    {c} ✕
                                </span>
                            ))}
                        </div>
                    </Campo>

                    <Campo label="Acciones correctivas y preventivas iniciadas" error={errors.acciones_correctivas}>
                        <textarea
                            value={data.acciones_correctivas}
                            onChange={e => setData('acciones_correctivas', e.target.value)}
                            placeholder="Describa las acciones correctivas y preventivas iniciadas..."
                            rows={5}
                            className="w-full rounded-lg border-2 border-primary-300 px-3 py-2 text-sm focus:outline-none focus:border-primary-500 resize-none scroll-teal"
                        />
                    </Campo>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Campo label="¿Reportó al Fabricante/Importador/Distribuidor?" error={errors.reportado_fabricante}>
                            <SiNo value={data.reportado_fabricante} onChange={v => setData('reportado_fabricante', v)} />
                        </Campo>

                        <Campo label="Fecha reporte al Fabricante/Importador/Distribuidor" error={errors.fecha_reporte_fabricante}>
                            <input
                                type="date"
                                value={data.fecha_reporte_fabricante}
                                max={new Date().toISOString().split('T')[0]}
                                onChange={e => setData('fecha_reporte_fabricante', e.target.value)}
                                disabled={data.reportado_fabricante !== true}
                                className={`${clase} disabled:bg-gray-100 disabled:text-gray-400`}
                            />
                        </Campo>

                        <Campo label="¿Dispositivo médico disponible para evaluación?" error={errors.dm_disponible_evaluacion}>
                            <SiNo value={data.dm_disponible_evaluacion} onChange={v => setData('dm_disponible_evaluacion', v)} />
                        </Campo>

                        <Campo label="¿Ha enviado el DM al Fabricante/Importador/Distribuidor?" error={errors.dm_enviado_fabricante}>
                            <SiNo value={data.dm_enviado_fabricante} onChange={v => setData('dm_enviado_fabricante', v)} />
                        </Campo>
                    </div>
                </div>

                {/* Footer */}
                <div className="flex justify-end items-center px-6 py-4 border-t border-gray-200 flex-shrink-0">
                    <button
                        type="button"
                        onClick={submit}
                        disabled={processing}
                        className="flex items-center gap-2 px-5 py-2 text-sm font-semibold text-white bg-primary-500 rounded-lg hover:bg-primary-600 transition disabled:opacity-50"
                    >
                        <Save className="w-4 h-4" />
                        Guardar
                    </button>
                </div>
            </div>
        </div>
    );
}
