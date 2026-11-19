/**
 * PasoFarmacovigilancia
 * Paso 3 del formulario para la categoría IAAS — información del evento adverso
 * (igual a PasoEvento) más los medicamentos involucrados.
 *
 * Props:
 * - data: objeto con los valores del formulario
 * - setData: función para actualizar los valores
 * - errors: errores de validación
 */
import { useState, useRef } from 'react';
import { Mic, MicOff, Plus, Trash2 } from 'lucide-react';

function Campo({ label, error, children }) {
    return (
        <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
                {label}
            </label>
            {children}
            {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
        </div>
    );
}

export default function PasoFarmacovigilancia({ data, setData, errors }) {
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
            setData('descripcion', data.descripcion + ' ' + transcript);
        };

        recognition.onend = () => setGrabando(false);

        recognitionRef.current = recognition;
        recognition.start();
        setGrabando(true);
    };

    const medicamentos = data.medicamentos ?? [];

    const actualizarMedicamento = (index, campo, valor) => {
        setData('medicamentos', medicamentos.map((m, i) => (i === index ? { ...m, [campo]: valor } : m)));
    };

    const agregarMedicamento = () => {
        setData('medicamentos', [...medicamentos, { nombre: '', descripcion: '' }]);
    };

    const quitarMedicamento = (index) => {
        setData('medicamentos', medicamentos.filter((_, i) => i !== index));
    };

    const inputClase = 'w-full rounded-lg border-2 border-primary-300 px-4 py-3 text-sm focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500';

    return (
        <div className="space-y-6">
            <div className="col-span-1 md:col-span-2 bg-primary-500 rounded-lg px-4 py-3">
                <h3 className="text-white font-semibold text-xs uppercase">Información del evento adverso</h3>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Campo label="Fecha del Evento *" error={errors.fecha_evento}>
                    <input
                        type="date"
                        value={data.fecha_evento}
                        onChange={e => setData('fecha_evento', e.target.value)}
                        className="w-full rounded-lg border-2 border-primary-300 px-4 py-3 text-sm focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500"
                    />
                </Campo>

            </div>

            <Campo label="Descripción del evento *" error={errors.descripcion}>
                <div className={`flex items-end gap-2 bg-white border-2 rounded-2xl px-4 py-2 shadow-sm transition ${grabando ? 'border-red-400 ring-1 ring-red-400' : 'border-primary-300 focus-within:border-primary-500 focus-within:ring-1 focus-within:ring-primary-500'
                    }`}>
                    <textarea
                        value={data.descripcion}
                        onChange={e => setData('descripcion', e.target.value)}
                        placeholder="Describa detalladamente lo que ocurrió..."
                        rows={3}
                        className="flex-1 resize-none text-sm text-gray-800 placeholder-gray-400 focus:outline-none scroll-teal bg-transparent py-1"
                    />
                    <button
                        type="button"
                        onClick={toggleGrabacion}
                        className={`flex-shrink-0 mb-1 p-2 rounded-full transition ${grabando
                                ? 'bg-red-500 text-white animate-pulse'
                                : 'bg-primary-500 text-white hover:bg-primary-600'
                            }`}
                    >
                        {grabando ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
                    </button>
                </div>
                {grabando && (
                    <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                        <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse inline-block" />
                        Grabando... habla ahora
                    </p>
                )}
            </Campo>

            {/* ── Medicamentos ── */}
            <div className="space-y-3">
                <div className="flex items-center justify-between bg-primary-500 rounded-lg px-4 py-3">
                    <h3 className="text-white font-semibold text-xs uppercase">Medicamentos *</h3>
                    <button
                        type="button"
                        onClick={agregarMedicamento}
                        className="flex items-center gap-1 text-xs font-semibold text-white bg-secondary-500 hover:bg-secondary-600 rounded-btn px-3 py-1.5 transition"
                    >
                        <Plus className="w-4 h-4" /> Agregar medicamento
                    </button>
                </div>

                {errors.medicamentos && <p className="text-red-500 text-xs">{errors.medicamentos}</p>}

                {medicamentos.map((medicamento, index) => (
                    <div key={index} className="border border-gray-200 rounded-lg p-4 space-y-3">
                        <div className="flex items-center justify-between">
                            <span className="text-xs font-semibold text-primary-700 uppercase">Medicamento {index + 1}</span>
                            {medicamentos.length > 1 && (
                                <button
                                    type="button"
                                    onClick={() => quitarMedicamento(index)}
                                    title="Quitar medicamento"
                                    className="flex items-center gap-1 text-xs text-red-400 hover:text-red-600 transition"
                                >
                                    <Trash2 className="w-4 h-4" /> Quitar
                                </button>
                            )}
                        </div>
                        <Campo label="Nombre del medicamento *" error={errors[`medicamentos.${index}.nombre`]}>
                            <input
                                type="text"
                                value={medicamento.nombre}
                                onChange={e => actualizarMedicamento(index, 'nombre', e.target.value)}
                                placeholder="Nombre del medicamento"
                                className={inputClase}
                            />
                        </Campo>
                        <Campo label="Descripción *" error={errors[`medicamentos.${index}.descripcion`]}>
                            <textarea
                                value={medicamento.descripcion}
                                onChange={e => actualizarMedicamento(index, 'descripcion', e.target.value)}
                                placeholder="Describa con palabras breves"
                                rows={2}
                                className="w-full rounded-lg border-2 border-primary-300 px-4 py-3 text-sm focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 resize-none scroll-teal"
                            />
                        </Campo>
                    </div>
                ))}
            </div>

        </div>
    );
}