/**
 * ModalCrearMejora
 * Modal para crear un plan de mejora para un evento analizado.
 */

import { useState, useRef } from 'react';
import { useForm } from '@inertiajs/react';
import { X, Save, Paperclip, Mic, MicOff } from 'lucide-react';
import Swal from 'sweetalert2';
import Editor from '@/Components/Editor';

function Campo({ label, error, children }) {
    return (
        <div>
            <label className="block text-sm font-semibold text-gray-600 mb-1">{label}</label>
            {children}
            {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
        </div>
    );
}

export default function ModalCrearMejora({ evento, jefes, onClose }) {

    const [cargando, setCargando] = useState(false);
    const [grabando, setGrabando] = useState(false);
    const recognitionRef = useRef(null);
    const plan = evento.plan_mejora;

    const { data, setData, post, errors } = useForm({
        _method: 'POST',
        descripcion: plan?.descripcion ?? '',
        fecha_ejecucion: plan?.fecha_ejecucion ?? '',
        fk_jefe: plan?.fk_jefe ?? evento.area?.jefe?.id ?? '',
        archivo: null,
    });

    const toggleGrabacion = () => {
        if (!('webkitSpeechRecognition' in window || 'SpeechRecognition' in window)) {
            alert('Tu navegador no soporta reconocimiento de voz.');
            return;
        }
        if (grabando) {
            recognitionRef.current?.stop();
            setGrabando(false);
            return;
        }
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        const recognition = new SpeechRecognition();
        recognition.lang = 'es-CO';
        recognition.continuous = true;
        recognition.interimResults = false;
        recognition.onresult = (event) => {
            const transcript = Array.from(event.results).map(r => r[0].transcript).join(' ');
            setData('descripcion', data.descripcion + ' ' + transcript);
        };
        recognition.onend = () => setGrabando(false);
        recognitionRef.current = recognition;
        recognition.start();
        setGrabando(true);
    };

    const submit = () => {
        console.log('data a enviar:', data);
        if (!data.descripcion || !data.fecha_ejecucion || !data.fk_jefe) {
            Swal.fire({ icon: 'warning', title: 'Campos obligatorios', text: 'Por favor completa todos los campos requeridos.' });
            return;
        }

        setCargando(true);
        if (plan) {
            post(route('mejoras.update', plan.id_plan), {
                forceFormData: true,
                onSuccess: () => {
                    setCargando(false);
                    onClose();
                    Swal.fire({ icon: 'success', title: 'Plan de mejora actualizado correctamente.' });
                },
                onError: (errors) => {
                    setCargando(false);
                    console.log('errores:', errors);
                    Swal.fire({ icon: 'error', title: 'Error al actualizar el plan de mejora.' });
                },
            });
        } else {
            // Crear
            post(route('mejoras.store', evento.id_eventoAdverso), {
                forceFormData: true,
                onSuccess: () => {
                    setCargando(false);
                    onClose();
                    Swal.fire({ icon: 'success', title: 'Plan de mejora creado correctamente.' });
                },
                onError: () => {
                    setCargando(false);
                    Swal.fire({ icon: 'error', title: 'Error al crear el plan de mejora.' });
                },
            });
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">

            {/* Loading */}
            {cargando && (
                <div className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-100/85">
                    <div className="relative w-[150px] h-[73px]">
                        <svg viewBox="0 0 150 73" height="73px" width="150px" xmlns="http://www.w3.org/2000/svg">
                            <polyline
                                points="0,45.486 38.514,45.486 44.595,33.324 50.676,45.486 57.771,45.486 62.838,55.622 71.959,9 80.067,63.729 84.122,45.486 97.297,45.486 103.379,40.419 110.473,45.486 150,45.486"
                                strokeMiterlimit="10"
                                strokeWidth="3"
                                stroke="#009B9E"
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

            <div className="bg-white rounded-lg shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden">

                {/* Header */}
                <div className="bg-teal-500 px-6 py-4 flex items-center justify-between rounded-t-md">
                    <h2 className="text-white font-bold text-lg">
                        {plan ? 'Editar' : 'Crear'} Plan de Mejora Evento N°: {evento.id_eventoAdverso}
                    </h2>
                    <button onClick={onClose} className="text-white hover:text-teal-200 transition">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Contenido */}
                <div className="p-6 space-y-4 flex-1 overflow-y-auto scroll-teal">

                    <Campo label="Descripción *" error={errors.descripcion}>
                        <Editor
                            value={data.descripcion}
                            onChange={val => setData('descripcion', val)}
                            placeholder="Describa el plan de mejora..."
                            minHeight="200px"
                        />
                        <button
                            type="button"
                            onClick={toggleGrabacion}
                            className={`mt-2 flex items-center gap-2 px-3 py-1.5 text-xs rounded-lg transition ${grabando ? 'bg-red-500 text-white animate-pulse' : 'bg-teal-500 text-white hover:bg-teal-600'}`}
                        >
                            {grabando ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
                            {grabando ? 'Detener grabación' : 'Usar micrófono'}
                        </button>
                        {grabando && (
                            <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                                <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse inline-block" />
                                Grabando... habla ahora
                            </p>
                        )}
                    </Campo>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Campo label="Fecha de Ejecución *" error={errors.fecha_ejecucion}>
                            <input
                                type="date"
                                value={data.fecha_ejecucion}
                                onChange={e => setData('fecha_ejecucion', e.target.value)}
                                className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm focus:outline-none focus:border-teal-500"
                            />
                        </Campo>

                        <Campo label="Responsable de Ejecución *" error={errors.fk_jefe}>
                            <select
                                value={data.fk_jefe}
                                onChange={e => setData('fk_jefe', e.target.value)}
                                className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm focus:outline-none focus:border-teal-500"
                            >
                                <option value="">Seleccione el responsable...</option>
                                {jefes.map(jefe => (
                                    <option key={jefe.id} value={jefe.id}>{jefe.name}</option>
                                ))}
                            </select>
                        </Campo>
                    </div>

                    <Campo label="Archivo Plan de Mejora (Opcional)" error={errors.archivo}>
                        <div className="flex items-center gap-3">
                            <input
                                type="text"
                                readOnly
                                value={data.archivo ? data.archivo.name : ''}
                                placeholder="Seleccione el archivo (Opcional)"
                                className="flex-1 rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-sm text-gray-500"
                            />
                            <label className="flex items-center gap-2 bg-teal-500 hover:bg-teal-600 text-white text-sm font-semibold px-4 py-2 rounded-lg cursor-pointer transition">
                                <Paperclip className="w-4 h-4" />
                                Examinar
                                <input
                                    type="file"
                                    accept=".pdf,.jpg,.jpeg,.png"
                                    className="hidden"
                                    onChange={e => setData('archivo', e.target.files[0])}
                                />
                            </label>
                        </div>
                    </Campo>

                </div>

                {/* Footer */}
                <div className="flex justify-end gap-3 px-6 py-4 border-t border-gray-200">
                    <button onClick={onClose} className="px-5 py-2 text-sm font-semibold text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition">
                        Cancelar
                    </button>
                    <button onClick={submit} className="flex items-center gap-2 px-5 py-2 text-sm font-semibold text-white bg-teal-500 rounded-lg hover:bg-teal-600 transition">
                        <Save className="w-4 h-4" />
                        Guardar
                    </button>
                </div>

            </div>
        </div>
    );
}