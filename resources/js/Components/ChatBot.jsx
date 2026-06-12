import { useState } from 'react';
import { MessageCircle, X, Send } from 'lucide-react';

export default function ChatBot() {
    const [abierto, setAbierto] = useState(false);
    const [mensaje, setMensaje] = useState('');
    const [mensajes, setMensajes] = useState([
        { tipo: 'bot', texto: '¡Hola, soy Aurora! ¿En qué puedo ayudarte?' },
    ]);

    const enviar = () => {
        if (!mensaje.trim()) return;

        setMensajes(prev => [...prev, { tipo: 'user', texto: mensaje }]);
        setMensaje('');

        setTimeout(() => {
            setMensajes(prev => [...prev, { tipo: 'bot', texto: 'Esta función estará disponible próximamente.' }]);
        }, 500);
    };

    return (
        <div className="fixed bottom-4 right-4 z-50">
            {/* Ventana del chat */}
            {abierto && (
                <div className="bg-white shadow-xl rounded-lg w-96 mb-4">
                    {/* Header */}
                    <div className="p-4 border-b bg-purple-600 text-white rounded-t-lg flex justify-between items-center">
                        <p className="text-sm font-semibold">Asistente Aurora</p>
                        <button onClick={() => setAbierto(false)} className="hover:text-gray-200">
                            <X className="w-5 h-5" />
                        </button>
                    </div>

                    {/* Mensajes */}
                    <div className="p-4 h-72 overflow-y-auto space-y-3">
                        {mensajes.map((msg, index) => (
                            <div key={index} className={`flex ${msg.tipo === 'user' ? 'justify-end' : 'justify-start'}`}>
                                <p className={`rounded-lg py-2 px-4 text-sm max-w-xs ${msg.tipo === 'user' ? 'bg-purple-500 text-white' : 'bg-gray-100 text-gray-700'}`}>
                                    {msg.texto}
                                </p>
                            </div>
                        ))}
                    </div>

                    {/* Input */}
                    <div className="p-4 border-t flex gap-2">
                        <input
                            type="text"
                            value={mensaje}
                            onChange={e => setMensaje(e.target.value)}
                            onKeyDown={e => e.key === 'Enter' && enviar()}
                            placeholder="Escribe un mensaje..."
                            className="flex-1 px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500"
                        />
                        <button
                            onClick={enviar}
                            className="bg-cyan-500 hover:bg-cyan-600 text-white px-3 py-2 rounded-lg transition"
                        >
                            <Send className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            )}

            {/* Botón flotante */}
            <button
                onClick={() => setAbierto(!abierto)}
                className="bg-purple-500 hover:bg-purple-600 text-white rounded-full w-14 h-14 flex items-center justify-center shadow-lg transition"
            >
                <MessageCircle className="w-6 h-6" />
            </button>
        </div>
    );
}