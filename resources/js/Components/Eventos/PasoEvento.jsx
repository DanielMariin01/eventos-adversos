/**
 * PasoEvento
 * Paso 3 del formulario — información del evento adverso.
 *
 * Props:
 * - data: objeto con los valores del formulario
 * - setData: función para actualizar los valores
 * - errors: errores de validación
 */
import { useState, useRef } from 'react';
import { Mic, MicOff } from 'lucide-react';

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

export default function PasoEvento({ data, setData, errors }) {
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

    return (
        <div className="space-y-6">

            <Campo label="Fecha del Evento *" error={errors.fecha_evento}>
                <input
                    type="datetime-local"
                    value={data.fecha_evento}
                    onChange={e => setData('fecha_evento', e.target.value)}
                    className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500"
                />
            </Campo>

            <Campo label="Descripción del evento *" error={errors.descripcion}>
                <div className="relative">
                    <textarea
                        value={data.descripcion}
                        onChange={e => setData('descripcion', e.target.value)}
                        placeholder="Describa detalladamente lo que ocurrió o use el micrófono..."
                        rows={5}
                        className="w-full rounded-lg border border-gray-300 px-4 py-2.5 pr-12 text-sm focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500 resize-none"
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
    );
}