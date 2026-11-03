/**
 * ModalAnalisis
 * Modal de análisis de eventos adversos para el rol de calidad.
 * Tiene dos pestañas: Datos Básicos y Clasificación.
 */

import { useState, useRef } from 'react';
import { useForm } from '@inertiajs/react';
import { X, User, Building2, Paperclip, Save, Mic, MicOff } from 'lucide-react';
import Swal from 'sweetalert2';

const BARRERAS = [
    'Administrativa', 'Física', 'Humana', 'Natural',
    'No hay barrera vulnerable', 'Tecnológicas',
];

const FACTORES = [
    'Ambiente', 'Contexto institucional', 'Equipo', 'Individuo',
    'Organización y gerencia', 'Paciente', 'Tarea y tecnología',
];

const ACCIONES = [
    'No hay acción insegura', 'Por acción', 'Por omisión',
];

const CLASIFICACIONES = [
    'Atención segura', 'Complicación', 'Evento adverso no prevenible',
    'Evento adverso prevenible', 'Evento centinela', 'Incidente',
];

const RELACIONADO_CON = [
    // --- Existentes ---
    'Alergias', 'Asalto sexual en la institución',
    'Administración equivocada de medicamentos',
    'Caídas intrainstitucionales', 'Complicación quirúrgica',
    'Deficiencia en la comunicación', 'Demoras en la atención',
    'Dispositivos y equipos biomédicos', 'Egreso inseguro',
    'Fallas en agendamiento de citas', 'Fallas en manejo medico',
    'Flebitis mecánica', 'Fuga de pacientes',
    'Infecciones de sitio quirúrgico',
    'Infecciones asociadas a la atención en salud (IAAS)',
    'Identificación errónea del paciente', 'Lesiones de piel',
    'Reacción adversa a medicamentos', 'Reingreso a urgencias',
    'Traslado inseguro', 'Ulceras por presión',

    // --- Nuevos (agregados) ---
    'Errores en la prescripción de medicamentos',
    'Errores en la dispensación de medicamentos',
    'Omisión de medicamentos',
    'Dosis incorrecta de medicamentos',
    'Medicamento incorrecto',
    'Vía de administración incorrecta',
    'Horario o frecuencia incorrecta de medicamentos',
    'Flebitis infecciosa',
    'Flebitis química',
    'Extravasación',
    'Infiltración de acceso venoso',
    'Retiro accidental de catéter',
    'Retiro accidental de sonda',
    'Retiro accidental de otros dispositivos',
    'Lesión asociada a dispositivos médicos',
    'Lesión por fricción o cizallamiento',
    'Broncoaspiración',
    'Infección asociada a CVC',
    'Infección asociada a sonda vesical',
    'Neumonía asociada a ventilación mecánica',
    'Incumplimiento de aislamiento',
    'Fallas en higiene de manos',
    'Error en toma de muestras de laboratorio',
    'Muestra inadecuada o contaminada',
    'Pérdida de muestra',
    'Error en transporte de muestras de laboratorio',
    'Error en rotulación de muestras de laboratorio',
    'Toma de muestra a paciente erróneo',
    'Error en reporte de resultados de laboratorio',
    'Resultado crítico no comunicado oportunamente',
    'Error transfusional',
    'Reacción transfusional',
    'Hemocomponente administrado a paciente incorrecto',
    'Error en identificación de hemocomponentes',
    'Sangrado o hemorragia asociada a procedimiento',
    'Quemadura durante la atención',
    'Lesión durante procedimiento',
    'Perforación o lesión accidental de órgano',
    'Reintervención no programada',
    'Retorno no programado a cirugía',
    'Traslado no programado a UCI',
    'Deterioro clínico no identificado oportunamente',
    'Retraso en el diagnóstico',
    'Diagnóstico incorrecto',
    'Omisión de valoración o seguimiento',
    'Fallas en entrega de turno',
    'Información incompleta durante traslado del paciente',
    'Fallas en comunicación entre servicios',
    'Fallas en comunicación médico-enfermería',
    'Incumplimiento de órdenes médicas',
    'Procedimiento no realizado',
    'Procedimiento realizado incorrectamente',
    'Preparación inadecuada del paciente para procedimiento',
    'Ayuno inadecuado o incumplimiento del ayuno',
    'Cancelación de procedimiento por falla asistencial',
    'Falla en disponibilidad de medicamentos o insumos',
    'Falla en suministro de oxígeno',
    'Autolesión durante la atención',
    'Agresión física durante la atención',
    'Error en dieta o alimentación',
    'Dieta administrada a paciente incorrecto',
    'Evento relacionado con nutrición enteral',
    'Error relacionado con nutrición parenteral',
    'Pérdida de pertenencias del paciente',
    'Fallas en el consentimiento informado',
    'Fallas en referencia y contrarreferencia',
    'Fallas en continuidad del tratamiento',
    'Evento relacionado con infraestructura',
    'Riesgo eléctrico',
    'Derrames o pisos húmedos con riesgo para el paciente',
    'Exposición accidental a sustancias químicas',
    'Evento relacionado con gases medicinales',
    'Incumplimiento de medidas de bioseguridad',
    'Accidente con material cortopunzante',
    'Manejo inadecuado de residuos con riesgo asistencial',
    'Error en historia clínica o registro asistencial',
    'Registro incompleto de la atención',
];


const CATEGORIZACIONES = [
    'Daño permanente al paciente', 'Daño temporal al paciente', 'Sin Daño',
    'Evento cercano a la muerte', 'Muerte',
    'Requiere hospitalización', 'Requiere tratamiento e intervención medica',
];

function Campo({ label, error, children }) {
    return (
        <div>
            <label className="block text-sm font-semibold text-gray-600 mb-1">{label}</label>
            {children}
            {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
        </div>
    );
}

const EXTENSIONES_PERMITIDAS = ['pdf', 'jpg', 'jpeg', 'png'];
const MAX_BYTES = 10 * 1024 * 1024; // 10 MB, igual que el backend

export default function ModalAnalisis({ evento, jefes = [], onClose }) {
    const [pestana, setPestana] = useState('basicos');
    const [arrastrando, setArrastrando] = useState(false);

    const { data, setData, post, processing, errors } = useForm({
        barreras_vulneradas: evento.barreras_vulneradas ?? [],
        barreras_descripcion: evento.barreras_descripcion ?? '',
        acciones_inseguras: evento.acciones_inseguras ?? [],
        acciones_descripcion: evento.acciones_descripcion ?? '',
        factores_contributivos: evento.factores_contributivos ?? {},
        descripcion_analisis: evento.descripcion_analisis ?? '',
        clasificacion: evento.clasificacion ?? '',
        relacionado_con: evento.relacionado_con ?? '',
        categorizacion: evento.categorizacion ?? '',
        fk_jefe: evento.fk_jefe ?? evento.area?.jefe?.id ?? '',
        archivos: [],
    });

    const toggleArray = (campo, valor) => {
        const actual = data[campo] ?? [];
        setData(campo, actual.includes(valor)
            ? actual.filter(v => v !== valor)
            : [...actual, valor]
        );
    };

    const submit = () => {
        const errores = {};

        if (!data.barreras_vulneradas || data.barreras_vulneradas.length === 0)
            errores.barreras = 'Seleccione al menos una barrera vulnerada';
        if (!data.barreras_descripcion)
            errores.barreras_descripcion = 'La descripción de barreras es obligatoria';
        if (!data.acciones_inseguras || data.acciones_inseguras.length === 0)
            errores.acciones = 'Seleccione al menos una acción insegura';
        if (!data.acciones_descripcion)
            errores.acciones_descripcion = 'La descripción de acciones es obligatoria';
        if (!data.factores_contributivos || Object.keys(data.factores_contributivos).length === 0)
            errores.factores = 'Seleccione al menos un factor contributivo';
        if (!data.descripcion_analisis)
            errores.descripcion_analisis = 'La descripción del análisis es obligatoria';
        if (!data.clasificacion)
            errores.clasificacion = 'La clasificación es obligatoria';
        if (!data.relacionado_con)
            errores.relacionado_con = 'La relación es obligatoria';
        if (!data.categorizacion)
            errores.categorizacion = 'La categorización es obligatoria';

        if (Object.keys(errores).length > 0) {
            Swal.fire({
                icon: 'warning',
                title: 'Campos obligatorios',
                html: Object.values(errores).map(e => `• ${e}`).join('<br>'),
            });
            return;
        }

        setCargando(true);
        post(route('eventos.analisis', evento.id_eventoAdverso), {
            forceFormData: true,
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

    const [grabando, setGrabando] = useState(false);
    const recognitionRef = useRef(null);

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
            const transcript = Array.from(event.results)
                .map(r => r[0].transcript)
                .join(' ');
            setData('descripcion_analisis', data.descripcion_analisis + ' ' + transcript);
        };

        recognition.onend = () => setGrabando(false);
        recognitionRef.current = recognition;
        recognition.start();
        setGrabando(true);
    };


    const [grabandoBarrera, setGrabandoBarrera] = useState(false);
    const recognitionBarreraRef = useRef(null);

    const toggleGrabacionBarrera = () => {
        if (!('webkitSpeechRecognition' in window || 'SpeechRecognition' in window)) {
            alert('Tu navegador no soporta reconocimiento de voz.');
            return;
        }

        if (grabandoBarrera) {
            recognitionBarreraRef.current?.stop();
            setGrabandoBarrera(false);
            return;
        }

        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        const recognition = new SpeechRecognition();
        recognition.lang = 'es-CO';
        recognition.continuous = true;
        recognition.interimResults = false;

        recognition.onresult = (event) => {
            const transcript = Array.from(event.results)
                .map(r => r[0].transcript)
                .join(' ');
            setData('barreras_descripcion', data.barreras_descripcion + ' ' + transcript);
        };

        recognition.onend = () => setGrabandoBarrera(false);
        recognitionBarreraRef.current = recognition;
        recognition.start();
        setGrabandoBarrera(true);
    };

    const [cargando, setCargando] = useState(false);

    // ── Agregar archivos (clic o arrastre) validando tipo y tamaño ──
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

        if (validos.length > 0) {
            setData('archivos', [...data.archivos, ...validos]);
        }
    };

    const quitarArchivo = (index) => {
        setData('archivos', data.archivos.filter((_, i) => i !== index));
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
        agregarArchivos(Array.from(e.dataTransfer.files));
    };

    return (
        // preventDefault en el contenedor: soltar un archivo fuera de la zona no debe abrirlo ni descargarlo
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
            onDragOver={e => e.preventDefault()}
            onDrop={e => e.preventDefault()}
        >

            {/* Loading overlay */}
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
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden">

                {/* Header */}
                <div className="bg-teal-600 px-6 py-4 flex items-center justify-between flex-shrink-0">
                    <h2 className="text-white font-bold text-lg">
                        Análisis Evento {evento.categoria?.nombre} N°: {evento.id_eventoAdverso}
                    </h2>
                    <button onClick={onClose} className="text-white hover:text-teal-200 transition">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Pestañas */}
                <div className="flex border-b border-gray-200 flex-shrink-0">
                    <button
                        onClick={() => setPestana('basicos')}
                        className={`flex items-center gap-2 px-6 py-3 text-sm font-semibold transition border-b-2 ${pestana === 'basicos'
                            ? 'border-teal-500 text-teal-600'
                            : 'border-transparent text-gray-500 hover:text-gray-700'
                            }`}
                    >
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${pestana === 'basicos' ? 'bg-teal-500' : 'bg-gray-200'}`}>
                            <User className={`w-4 h-4 ${pestana === 'basicos' ? 'text-white' : 'text-gray-500'}`} />
                        </div>
                        <div className="text-left">
                            <p className="text-xs font-bold">Datos Básicos</p>
                            <p className="text-xs text-gray-400">Información del evento</p>
                        </div>
                    </button>

                    <button
                        onClick={() => setPestana('clasificacion')}
                        className={`flex items-center gap-2 px-6 py-3 text-sm font-semibold transition border-b-2 ${pestana === 'clasificacion'
                            ? 'border-teal-500 text-teal-600'
                            : 'border-transparent text-gray-500 hover:text-gray-700'
                            }`}
                    >
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${pestana === 'clasificacion' ? 'bg-teal-500' : 'bg-gray-200'}`}>
                            <Building2 className={`w-4 h-4 ${pestana === 'clasificacion' ? 'text-white' : 'text-gray-500'}`} />
                        </div>
                        <div className="text-left">
                            <p className="text-xs font-bold">Clasificación</p>
                            <p className="text-xs text-gray-400">Información de la Clasificación</p>
                        </div>
                    </button>
                </div>

                {/* Contenido */}
                <div className="flex-1 overflow-y-auto p-6 scroll-teal">

                    {/* ── Pestaña Datos Básicos ── */}
                    {pestana === 'basicos' && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                            <Campo label="Barreras Vulneradas" error={errors.barreras_vulneradas}>
                                <select
                                    onChange={e => toggleArray('barreras_vulneradas', e.target.value)}
                                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:border-teal-500 mb-2 scroll-teal"
                                    value=""
                                >
                                    <option value="">Seleccione la barrera...</option>
                                    {BARRERAS.map(b => (
                                        <option key={b} value={b}>{b}</option>
                                    ))}
                                </select>
                                <div className="flex flex-wrap gap-1 mb-2">
                                    {(data.barreras_vulneradas ?? []).map(b => (
                                        <span key={b} onClick={() => toggleArray('barreras_vulneradas', b)}
                                            className="bg-teal-100 text-teal-700 text-xs px-2 py-1 rounded-full cursor-pointer hover:bg-red-100 hover:text-red-600">
                                            {b} ✕
                                        </span>
                                    ))}
                                </div>
                                <div className="relative">
                                    <textarea
                                        value={data.barreras_descripcion}
                                        onChange={e => setData('barreras_descripcion', e.target.value)}
                                        placeholder="Ingrese la descripción de la barrera..."
                                        rows={3}
                                        className="w-full rounded-lg border border-gray-300 px-3 py-2 pr-10 text-sm focus:outline-none focus:border-teal-500 resize-none scroll-teal"
                                    />
                                    <button
                                        type="button"
                                        onClick={toggleGrabacionBarrera}
                                        className={`absolute right-3 top-3 p-1.5 rounded-full transition ${grabandoBarrera
                                            ? 'bg-red-500 text-white animate-pulse'
                                            : 'bg-teal-500 text-white hover:bg-teal-600'
                                            }`}
                                    >
                                        {grabandoBarrera ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
                                    </button>
                                </div>
                                {grabandoBarrera && (
                                    <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                                        <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse inline-block" />
                                        Grabando... habla ahora
                                    </p>
                                )}
                            </Campo>

                            <Campo label="Acciones Inseguras" error={errors.acciones_inseguras}>
                                <select
                                    onChange={e => toggleArray('acciones_inseguras', e.target.value)}
                                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:border-teal-500 mb-2 scroll-teal"
                                    value=""
                                >
                                    <option value="">Seleccione la acción...</option>
                                    {ACCIONES.map(a => (
                                        <option key={a} value={a}>{a}</option>
                                    ))}
                                </select>
                                <div className="flex flex-wrap gap-1 mb-2">
                                    {(data.acciones_inseguras ?? []).map(a => (
                                        <span key={a} onClick={() => toggleArray('acciones_inseguras', a)}
                                            className="bg-teal-100 text-teal-700 text-xs px-2 py-1 rounded-full cursor-pointer hover:bg-red-100 hover:text-red-600">
                                            {a} ✕
                                        </span>
                                    ))}
                                </div>
                                <textarea
                                    value={data.acciones_descripcion}
                                    onChange={e => setData('acciones_descripcion', e.target.value)}
                                    placeholder="Ingrese la descripción de la acción..."
                                    rows={3}
                                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:border-teal-500 resize-none"
                                />
                            </Campo>

                            <Campo label="Factores Contributivos" error={errors.factores_contributivos}>
                                <select
                                    onChange={e => {
                                        const factor = e.target.value;
                                        if (!factor) return;
                                        const actual = data.factores_contributivos ?? {};
                                        if (!actual[factor]) {
                                            setData('factores_contributivos', { ...actual, [factor]: '' });
                                        }
                                    }}
                                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:border-teal-500 mb-3 scroll-teal"
                                    value=""
                                >
                                    <option value="">Seleccione el factor...</option>
                                    {FACTORES.map(f => (
                                        <option key={f} value={f}>{f}</option>
                                    ))}
                                </select>

                                {Object.entries(data.factores_contributivos ?? {}).map(([factor, descripcion]) => (
                                    <div key={factor} className="mb-3 border border-gray-200 rounded-lg p-3">
                                        <div className="flex items-center justify-between mb-1">
                                            <span className="text-xs font-semibold text-teal-700">{factor}</span>
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    const actual = { ...data.factores_contributivos };
                                                    delete actual[factor];
                                                    setData('factores_contributivos', actual);
                                                }}
                                                className="text-red-400 hover:text-red-600 text-xs"
                                            >
                                                ✕ Quitar
                                            </button>
                                        </div>
                                        <textarea
                                            value={descripcion}
                                            onChange={e => setData('factores_contributivos', {
                                                ...data.factores_contributivos,
                                                [factor]: e.target.value,
                                            })}
                                            placeholder={`Descripción de ${factor}...`}
                                            rows={2}
                                            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:border-teal-500 resize-none scroll-teal"
                                        />
                                    </div>
                                ))}
                            </Campo>

                            <Campo label="Descripción del Análisis" error={errors.descripcion_analisis}>
                                <div className="relative">
                                    <textarea
                                        value={data.descripcion_analisis}
                                        onChange={e => setData('descripcion_analisis', e.target.value)}
                                        placeholder="Ingrese la descripción del análisis o use el micrófono..."
                                        rows={10}
                                        className="w-full rounded-lg border border-gray-300 px-3 py-2 pr-10 text-sm focus:outline-none focus:border-teal-500 resize-none scroll-teal"
                                    />
                                    <button
                                        type="button"
                                        onClick={toggleGrabacion}
                                        className={`absolute right-3 top-3 p-1.5 rounded-full transition ${grabando
                                            ? 'bg-red-500 text-white animate-pulse'
                                            : 'bg-teal-500 text-white hover:bg-teal-600'
                                            }`}
                                    >
                                        {grabando ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
                                    </button>
                                </div>
                                {grabando && (
                                    <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                                        <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse inline-block" />
                                        Grabando... habla ahora
                                    </p>
                                )}
                            </Campo>

                        </div>
                    )}

                    {/* ── Pestaña Clasificación ── */}
                    {pestana === 'clasificacion' && (
                        <div className="space-y-5">

                            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                                <Campo label="Clasificación" error={errors.clasificacion}>
                                    <select
                                        value={data.clasificacion}
                                        onChange={e => setData('clasificacion', e.target.value)}
                                        className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:border-teal-500 scroll-teal"
                                    >
                                        <option value="">Seleccione la clasificación...</option>
                                        {CLASIFICACIONES.map(c => (
                                            <option key={c} value={c}>{c}</option>
                                        ))}
                                    </select>
                                </Campo>
                                <Campo label="Relación" error={errors.relacionado_con}>
                                    <input
                                        type="text"
                                        list="relacionado-list"
                                        value={data.relacionado_con}
                                        onChange={e => setData('relacionado_con', e.target.value)}
                                        placeholder="Buscar o escribir relación..."
                                        className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:border-teal-500 scroll-teal"
                                    />
                                    <datalist id="relacionado-list">
                                        {RELACIONADO_CON.map(r => (
                                            <option key={r} value={r} />
                                        ))}
                                    </datalist>
                                </Campo>

                                <Campo label="Categorización" error={errors.categorizacion}>
                                    <select
                                        value={data.categorizacion}
                                        onChange={e => setData('categorizacion', e.target.value)}
                                        className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:border-teal-500 scroll-teal"
                                    >
                                        <option value="">Seleccione la categorización...</option>
                                        {CATEGORIZACIONES.map(c => (
                                            <option key={c} value={c}>{c}</option>
                                        ))}
                                    </select>
                                </Campo>
                                <Campo label="Responsable de Ejecución" error={errors.fk_jefe}>
                                    <select
                                        value={data.fk_jefe}
                                        onChange={e => setData('fk_jefe', e.target.value)}
                                        className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:border-teal-500 scroll-teal"
                                    >
                                        <option value="">Seleccione el jefe...</option>
                                        {jefes.map(jefe => (
                                            <option key={jefe.id} value={jefe.id}>{jefe.name}</option>
                                        ))}
                                    </select>
                                </Campo>
                            </div>

                            <Campo label="Adjuntar Evidencia (PDF, JPG, PNG)" error={errors.archivos}>
                                <div
                                    onDragOver={onDragOverZona}
                                    onDragLeave={onDragLeaveZona}
                                    onDrop={onDropZona}
                                    className={`flex items-center gap-3 rounded-lg p-1 -m-1 border-2 border-dashed transition ${arrastrando ? 'bg-teal-50 border-teal-400' : 'border-transparent'}`}
                                >
                                    <input
                                        type="text"
                                        readOnly
                                        value={data.archivos.length > 0 ? `${data.archivos.length} archivo(s) seleccionado(s)` : ''}
                                        placeholder="Seleccione o arrastre los archivos (Opcional)"
                                        className="flex-1 rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-sm text-gray-500"
                                    />
                                    <label className="flex items-center gap-2 bg-teal-500 hover:bg-teal-600 text-white text-sm font-semibold px-4 py-2 rounded-lg cursor-pointer transition">
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
                                            <div key={index} className="flex items-center gap-3 p-2 bg-teal-50 border border-teal-200 rounded-lg">
                                                <Paperclip className="w-4 h-4 text-teal-500 flex-shrink-0" />
                                                <p className="text-sm text-gray-700 truncate flex-1">{file.name}</p>
                                                <p className="text-xs text-gray-400">{(file.size / 1024).toFixed(0)} KB</p>
                                                <button
                                                    type="button"
                                                    onClick={() => quitarArchivo(index)}
                                                    title="Quitar archivo"
                                                    className="text-gray-400 hover:text-red-500 transition"
                                                >
                                                    <X className="w-4 h-4" />
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </Campo>

                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="flex justify-between items-center px-6 py-4 border-t border-gray-200 flex-shrink-0">
                    {pestana === 'clasificacion' ? (
                        <button
                            type="button"
                            onClick={() => setPestana('basicos')}
                            className="flex items-center gap-2 px-5 py-2 text-sm font-semibold text-white bg-blue-500 rounded-lg hover:bg-blue-600 transition"
                        >
                            ← Atrás
                        </button>
                    ) : (
                        <button
                            type="button"
                            onClick={() => setPestana('clasificacion')}
                            className="flex items-center gap-2 px-5 py-2 text-sm font-semibold text-white bg-blue-500 rounded-lg hover:bg-blue-600 transition"
                        >
                            Siguiente →
                        </button>
                    )}
                    <button
                        type="button"
                        onClick={submit}
                        disabled={processing}
                        className="flex items-center gap-2 px-5 py-2 text-sm font-semibold text-white bg-teal-500 rounded-lg hover:bg-teal-600 transition disabled:opacity-50"
                    >
                        <Save className="w-4 h-4" />
                        Guardar
                    </button>
                </div>

            </div>
        </div>
    );
}