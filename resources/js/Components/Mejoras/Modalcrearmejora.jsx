/**
 * ModalCrearMejora
 * Modal para crear o editar un plan de mejora.
 */

import { COLORS } from '@/theme';
import { useState, useRef } from 'react';
import { useForm } from '@inertiajs/react';
import { X, Save, Paperclip, Mic, MicOff } from 'lucide-react';
import { FaFilePdf, FaFileImage, FaFileAlt } from 'react-icons/fa';
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

const getIcono = (extension) => {
    if (['pdf'].includes(extension?.toLowerCase())) return <FaFilePdf className="text-red-500 text-lg" />;
    if (['jpg', 'jpeg', 'png'].includes(extension?.toLowerCase())) return <FaFileImage className="text-blue-500 text-lg" />;
    return <FaFileAlt className="text-gray-500 text-lg" />;
};

const EXTENSIONES_PERMITIDAS = ['pdf', 'jpg', 'jpeg', 'png'];
const MAX_BYTES = 10 * 1024 * 1024; // 10 MB, igual que el backend

export default function ModalCrearMejora({ evento, jefes, onClose }) {

    const plan = evento.plan_mejora;
    const archivosExistentes = evento.archivos?.filter(a => a.tipo === 'calidad') ?? [];

    const [cargando, setCargando] = useState(false);
    const [grabando, setGrabando] = useState(false);
    const recognitionRef = useRef(null);

    const { data, setData, post, errors } = useForm({
        _method: 'POST',
        descripcion: plan?.descripcion ?? '',
        fecha_ejecucion: plan?.fecha_ejecucion?.split('T')[0] ?? '',
        fk_jefe: plan?.fk_jefe ?? evento.fk_jefe ?? evento.area?.jefe?.id ?? '',
        archivo: null,
    });

    const [arrastrando, setArrastrando] = useState(false);

    // ── Seleccionar archivo (clic o arrastre) validando tipo y tamaño. Solo admite uno. ──
    const seleccionarArchivo = (lista) => {
        if (lista.length === 0) return;

        const file = lista[0];
        const ext = file.name.split('.').pop().toLowerCase();
        let motivo = null;

        if (!EXTENSIONES_PERMITIDAS.includes(ext)) motivo = 'formato no permitido';
        else if (file.size > MAX_BYTES) motivo = 'supera 10MB';

        if (motivo) {
            Swal.fire({ icon: 'warning', title: 'Archivo no agregado', text: `${file.name} (${motivo})` });
            return;
        }

        if (lista.length > 1) {
            Swal.fire({ icon: 'info', title: 'Solo se admite un archivo', text: `Se adjuntó ${file.name}.` });
        }

        setData('archivo', file);
    };

    const onDragOverZona = (e) => {
        e.preventDefault();
        setArrastrando(true);
    };

    const onDragLeaveZona = (e) => {
        if (!e.currentTarget.contains(e.relatedTarget)) setArrastrando(false);
    };

    const onDropZona = (e) => {
        e.preventDefault();
        setArrastrando(false);
        seleccionarArchivo(Array.from(e.dataTransfer.files));
    };

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
        if (!data.descripcion || !data.fecha_ejecucion || !data.fk_jefe) {
            Swal.fire({ icon: 'warning', title: 'Campos obligatorios', text: 'Por favor completa todos los campos requeridos.' });
            return;
        }

        setCargando(true);

        const ruta = plan
            ? route('mejoras.update', plan.id_plan)
            : route('mejoras.store', evento.id_eventoAdverso);

        post(ruta, {
            forceFormData: true,
            onSuccess: () => {
                setCargando(false);
                onClose();
                Swal.fire({ icon: 'success', title: plan ? 'Plan actualizado correctamente.' : 'Plan creado correctamente.' });
            },
            onError: (errors) => {
                setCargando(false);
                console.log('errores:', errors);
                Swal.fire({ icon: 'error', title: 'Error al guardar el plan de mejora.' });
            },
        });
    };

    return (
        // preventDefault en el contenedor: soltar un archivo fuera de la zona no debe abrirlo ni descargarlo
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
            onDragOver={e => e.preventDefault()}
            onDrop={e => e.preventDefault()}
        >

            {/* Loading */}
            {cargando && (
                <div className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-100/70">
                    <div className="relative w-[150px] h-[73px]">
                        <svg viewBox="0 0 150 73" height="73px" width="150px" xmlns="http://www.w3.org/2000/svg">
                            <polyline points="0,45.486 38.514,45.486 44.595,33.324 50.676,45.486 57.771,45.486 62.838,55.622 71.959,9 80.067,63.729 84.122,45.486 97.297,45.486 103.379,40.419 110.473,45.486 150,45.486"
                                strokeMiterlimit="10" strokeWidth="3" stroke={COLORS.secondary} fill="none" />
                        </svg>
                        <div className="absolute inset-0 bg-slate-100 animate-[heartRateIn_0.8s_linear_infinite]" style={{ left: 0, right: 'auto' }} />
                        <div className="absolute top-0 h-full bg-slate-100 animate-[heartRateOut_0.8s_linear_infinite]" style={{ width: '120%', left: '-120%' }} />
                    </div>
                </div>
            )}

            <div className="bg-white rounded-card shadow-card w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden">

                {/* Header */}
                <div className="bg-primary-600 px-6 py-4 flex items-center justify-between flex-shrink-0 rounded-t-xl">
                    <h2 className="text-white font-bold text-lg">
                        {plan ? 'Editar' : 'Crear'} Plan de Mejora Evento N°: {evento.id_eventoAdverso}
                    </h2>
                    <button onClick={onClose} className="text-white hover:text-primary-200 transition">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Contenido */}
                <div className="flex-1 overflow-y-auto p-6 space-y-4 scroll-teal">

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
                            className={`mt-2 flex items-center gap-2 px-3 py-1.5 text-xs rounded-lg transition ${grabando ? 'bg-red-500 text-white animate-pulse' : 'bg-primary-500 text-white hover:bg-primary-600'}`}
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
                                className="w-full rounded-lg border-2 border-primary-300 px-3 py-3 text-sm focus:outline-none focus:border-primary-500"
                            />
                        </Campo>

                        <Campo label="Responsable de Ejecución *" error={errors.fk_jefe}>
                            <select
                                value={data.fk_jefe}
                                onChange={e => setData('fk_jefe', e.target.value)}
                                className="w-full rounded-lg border-2 border-primary-300 px-3 py-3 text-sm focus:outline-none focus:border-primary-500"
                            >
                                <option value="">Seleccione el responsable...</option>
                                {jefes.map(jefe => (
                                    <option key={jefe.id} value={jefe.id}>{jefe.name}</option>
                                ))}
                            </select>
                        </Campo>
                    </div>

                    {/* Archivos existentes */}
                    {archivosExistentes.length > 0 && (
                        <Campo label="Archivos adjuntos anteriores">
                            <div className="space-y-2">
                                {archivosExistentes.map((archivo) => (
                                    <a
                                        key={archivo.id_archivo}
                                        href={`/storage/${archivo.ruta}`}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg hover:bg-celeste hover:border-primary-300 transition group"
                                    >
                                        <div className="w-9 h-9 rounded-lg bg-gray-100 flex items-center justify-center flex-shrink-0 group-hover:bg-primary-100">
                                            {getIcono(archivo.extension)}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-medium text-gray-800 truncate">{archivo.nombre}</p>
                                            <p className="text-xs text-gray-400 uppercase">{archivo.extension}</p>
                                        </div>
                                        <span className="text-xs text-primary-600 font-semibold">Ver →</span>
                                    </a>
                                ))}
                            </div>
                        </Campo>
                    )}

                    {/* Nuevo archivo */}
                    <Campo label="Adjuntar nuevo archivo (Opcional)" error={errors.archivo}>
                        <div
                            onDragOver={onDragOverZona}
                            onDragLeave={onDragLeaveZona}
                            onDrop={onDropZona}
                            className={`flex items-center gap-3 rounded-lg p-1 -m-1 border-2 border-dashed transition ${arrastrando ? 'bg-celeste border-primary-400' : 'border-transparent'}`}
                        >
                            <input
                                type="text"
                                readOnly
                                value={data.archivo ? data.archivo.name : ''}
                                placeholder="Seleccione o arrastre el archivo (Opcional)"
                                className="flex-1 rounded-lg border-2 border-primary-300 bg-gray-50 px-3 py-2 text-sm text-gray-500"
                            />
                            {data.archivo && (
                                <button
                                    type="button"
                                    onClick={() => setData('archivo', null)}
                                    title="Quitar archivo"
                                    className="text-gray-400 hover:text-red-500 transition"
                                >
                                    <X className="w-4 h-4" />
                                </button>
                            )}
                            <label className="flex items-center gap-2 bg-primary-500 hover:bg-primary-600 text-white text-sm font-semibold px-4 py-2 rounded-lg cursor-pointer transition">
                                <Paperclip className="w-4 h-4" />
                                Examinar
                                <input
                                    type="file"
                                    accept=".pdf,.jpg,.jpeg,.png"
                                    className="hidden"
                                    onChange={e => {
                                        seleccionarArchivo(Array.from(e.target.files));
                                        e.target.value = '';
                                    }}
                                />
                            </label>
                        </div>
                    </Campo>

                </div>

                {/* Footer */}
                <div className="flex justify-end gap-3 px-6 py-4 border-t border-gray-200 flex-shrink-0">
                    <button onClick={onClose} className="px-5 py-2 text-sm font-semibold text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition">
                        Cancelar
                    </button>
                    <button onClick={submit} className="flex items-center gap-2 px-5 py-2 text-sm font-semibold text-white bg-primary-500 rounded-lg hover:bg-primary-600 transition">
                        <Save className="w-4 h-4" />
                        Guardar
                    </button>
                </div>

            </div>
        </div>
    );
}