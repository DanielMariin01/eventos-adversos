/**
 * ModalAnalisisFarmacovigilancia
 * Análisis propio de los eventos de la categoría Farmacovigilancia.
 * Guarda en la tabla farmacovigilancias (ruta farmacovigilancia.analisis).
 */

import { COLORS } from '@/theme';
import { useState } from 'react';
import { useForm } from '@inertiajs/react';
import { X, Save, Paperclip } from 'lucide-react';
import Swal from 'sweetalert2';

// Deben coincidir con CATEGORIZACIONES y ALERGIAS en FarmacovigilanciaController.php
const CATEGORIZACIONES = [
    'Leve',
    'Moderado',
    'Grave',
    'Mortal',
    'Esperado',
    'No esperado',
    'Relacionado con medicamento',
    'Posiblemente relacionado',
    'No relacionado',
];

const ALERGIAS = [
    'Flebitis química',
    'Extravasaciones',
    'Alergias',
    'Rash Cutáneos',
    'Prurito',
];

const EXTENSIONES_PERMITIDAS = ['pdf', 'jpg', 'jpeg', 'png'];
const MAX_BYTES = 10 * 1024 * 1024; // 10 MB, igual que el backend

const clase = 'w-full rounded-lg border-2 border-primary-300 px-3 py-2.5 text-sm focus:outline-none focus:border-primary-500 scroll-teal';
const claseTexto = 'w-full rounded-lg border-2 border-primary-300 px-3 py-2 text-sm focus:outline-none focus:border-primary-500 resize-none scroll-teal';

function Campo({ label, error, children }) {
    return (
        <div>
            <label className="block text-sm font-semibold text-gray-600 mb-1">{label}</label>
            {children}
            {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
        </div>
    );
}

// ── Selector múltiple: lista desplegable + etiquetas de lo elegido ──
function SelectorMultiple({ opciones, valores, onToggle, placeholder }) {
    return (
        <>
            <select value="" onChange={e => e.target.value && onToggle(e.target.value)} className={`${clase} mb-2`}>
                <option value="">{placeholder}</option>
                {opciones.map(o => (
                    <option key={o} value={o}>{o}</option>
                ))}
            </select>
            <div className="flex flex-wrap gap-1">
                {valores.map(v => (
                    <span key={v} onClick={() => onToggle(v)}
                        className="bg-primary-100 text-primary-700 text-xs px-2 py-1 rounded-full cursor-pointer hover:bg-red-100 hover:text-red-600">
                        {v} ✕
                    </span>
                ))}
            </div>
        </>
    );
}

export default function ModalAnalisisFarmacovigilancia({ evento, jefes = [], onClose }) {
    const [cargando, setCargando] = useState(false);
    const farma = evento.farmacovigilancia ?? {};

    const { data, setData, post, processing, errors } = useForm({
        categorizacion: farma.categorizacion ?? [],
        alergias: farma.alergias ?? [],
        descripcion_analisis: evento.descripcion_analisis ?? '',
        factores_contributivos: farma.factores_contributivos ?? '',
        fk_jefe: evento.fk_jefe ?? evento.area?.fk_jefe ?? '',
        archivos: [],
    });

    const toggleArray = (campo, valor) => {
        setData(campo, data[campo].includes(valor)
            ? data[campo].filter(v => v !== valor)
            : [...data[campo], valor]
        );
    };

    // ── Agregar archivos validando tipo y tamaño ──
    const agregarArchivos = (lista) => {
        const validos = [];
        const rechazados = [];

        lista.forEach(file => {
            const ext = file.name.split('.').pop().toLowerCase();
            if (!EXTENSIONES_PERMITIDAS.includes(ext)) {
                rechazados.push(`${file.name} (formato no permitido)`);
            } else if (file.size > MAX_BYTES) {
                rechazados.push(`${file.name} (supera 10MB)`);
            } else if (!data.archivos.some(a => a.name === file.name && a.size === file.size)) {
                validos.push(file);
            }
        });

        if (rechazados.length > 0) {
            Swal.fire({
                icon: 'warning',
                title: 'Algunos archivos no se agregaron',
                html: rechazados.join('<br>'),
            });
        }

        if (validos.length > 0) setData('archivos', [...data.archivos, ...validos]);
    };

    const quitarArchivo = (index) => {
        setData('archivos', data.archivos.filter((_, i) => i !== index));
    };

    const submit = () => {
        const faltantes = [];

        if (data.categorizacion.length === 0) faltantes.push('Seleccione al menos una categorización');
        if (data.alergias.length === 0) faltantes.push('Seleccione al menos una opción de alergias');
        if (!data.descripcion_analisis.trim()) faltantes.push('La descripción del análisis es obligatoria');
        if (!data.factores_contributivos.trim()) faltantes.push('Los factores contributivos son obligatorios');
        if (!data.fk_jefe) faltantes.push('Seleccione el jefe responsable de ejecución');

        if (faltantes.length > 0) {
            Swal.fire({
                icon: 'warning',
                title: 'Campos obligatorios',
                html: faltantes.map(e => `• ${e}`).join('<br>'),
            });
            return;
        }

        setCargando(true);
        post(route('farmacovigilancia.analisis', evento.id_eventoAdverso), {
            forceFormData: true,
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
                        Análisis Farmacovigilancia N°: {evento.id_eventoAdverso}
                    </h2>
                    <button onClick={onClose} className="text-white hover:text-primary-200 transition">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Contenido */}
                <div className="flex-1 overflow-y-auto p-6 scroll-teal space-y-5">

                    {/* Medicamentos reportados (solo lectura) */}
                    {evento.medicamentos?.length > 0 && (
                        <div className="bg-celeste border border-primary-200 rounded-lg p-3">
                            <p className="text-xs font-bold text-primary-700 uppercase mb-1">Medicamentos reportados</p>
                            <ul className="text-sm text-gray-700 space-y-0.5">
                                {evento.medicamentos.map(m => (
                                    <li key={m.id_medicamento}>
                                        <span className="font-semibold">{m.nombre}</span> — {m.descripcion}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Campo label="Categorización" error={errors.categorizacion}>
                            <SelectorMultiple
                                opciones={CATEGORIZACIONES}
                                valores={data.categorizacion}
                                onToggle={v => toggleArray('categorizacion', v)}
                                placeholder="Seleccione la categorización..."
                            />
                        </Campo>

                        <Campo label="Alergias" error={errors.alergias}>
                            <SelectorMultiple
                                opciones={ALERGIAS}
                                valores={data.alergias}
                                onToggle={v => toggleArray('alergias', v)}
                                placeholder="Seleccione la alergia o reacción..."
                            />
                        </Campo>
                    </div>

                    <Campo label="Descripción" error={errors.descripcion_analisis}>
                        <textarea
                            value={data.descripcion_analisis}
                            onChange={e => setData('descripcion_analisis', e.target.value)}
                            placeholder="Ingrese la descripción del análisis..."
                            rows={6}
                            className={claseTexto}
                        />
                    </Campo>

                    <Campo label="Factores Contributivos" error={errors.factores_contributivos}>
                        <textarea
                            value={data.factores_contributivos}
                            onChange={e => setData('factores_contributivos', e.target.value)}
                            placeholder="Describa los factores contributivos..."
                            rows={4}
                            className={claseTexto}
                        />
                    </Campo>

                    <Campo label="Responsable de Ejecución" error={errors.fk_jefe}>
                        <select
                            value={data.fk_jefe}
                            onChange={e => setData('fk_jefe', e.target.value)}
                            className={clase}
                        >
                            <option value="">Seleccione el jefe...</option>
                            {jefes.map(jefe => (
                                <option key={jefe.id} value={jefe.id}>{jefe.name}</option>
                            ))}
                        </select>
                    </Campo>

                    <Campo label="Adjuntar Evidencia (PDF, JPG, PNG)" error={errors.archivos}>
                        <div className="flex items-center gap-3">
                            <input
                                type="text"
                                readOnly
                                value={data.archivos.length > 0 ? `${data.archivos.length} archivo(s) seleccionado(s)` : ''}
                                placeholder="Seleccione los archivos (Opcional)"
                                className="flex-1 rounded-lg border-2 border-primary-300 bg-gray-50 px-3 py-2 text-sm text-gray-500"
                            />
                            <label className="flex items-center gap-2 bg-primary-500 hover:bg-primary-600 text-white text-sm font-semibold px-4 py-2 rounded-lg cursor-pointer transition">
                                <Paperclip className="w-4 h-4" />
                                Examinar
                                <input
                                    type="file"
                                    multiple
                                    accept=".pdf,.jpg,.jpeg,.png"
                                    className="hidden"
                                    onChange={e => {
                                        agregarArchivos(Array.from(e.target.files));
                                        e.target.value = '';
                                    }}
                                />
                            </label>
                        </div>
                        {data.archivos.length > 0 && (
                            <div className="mt-3 space-y-2">
                                {data.archivos.map((file, index) => (
                                    <div key={index} className="flex items-center gap-3 p-2 bg-celeste border border-primary-200 rounded-lg">
                                        <Paperclip className="w-4 h-4 text-primary-500 flex-shrink-0" />
                                        <p className="text-sm text-gray-700 truncate flex-1">{file.name}</p>
                                        <p className="text-xs text-gray-400">{(file.size / 1024).toFixed(0)} KB</p>
                                        <button type="button" onClick={() => quitarArchivo(index)} title="Quitar archivo"
                                            className="text-gray-400 hover:text-red-500 transition">
                                            <X className="w-4 h-4" />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </Campo>
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
