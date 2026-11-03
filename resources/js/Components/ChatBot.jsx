import { useState, useEffect } from 'react';

import { X, Send, MessageCircle } from 'lucide-react';

export default function ChatBot() {
    const [abierto, setAbierto] = useState(false);
    const [mensaje, setMensaje] = useState('');
    const [mensajes, setMensajes] = useState([
        { tipo: 'bot', texto: '¡Hola, soy Aurora! ¿En qué puedo ayudarte?' },
    ]);
    const [mostrarSaludo, setMostrarSaludo] = useState(true);

    const enviar = () => {
        if (!mensaje.trim()) return;

        setMensajes(prev => [...prev, { tipo: 'user', texto: mensaje }]);
        setMensaje('');

        setTimeout(() => {
            setMensajes(prev => [...prev, { tipo: 'bot', texto: 'Esta función estará disponible próximamente.' }]);
        }, 500);
    };
    useEffect(() => {
        const timer = setTimeout(() => setMostrarSaludo(false), 5000);
        return () => clearTimeout(timer);
    }, []);

    return (
        <div className="fixed bottom-4 right-4 z-50">
            {/* Ventana del chat */}
            {abierto && (
                <div className="bg-white shadow-xl rounded-lg w-96 mb-4">
                    {/* Header */}
                    <div className="p-4 border-b bg-violet-600 text-white rounded-t-lg flex justify-between items-center">
                        <p className="text-sm font-semibold">Asistente Aurora</p>
                        <button onClick={() => setAbierto(false)} className="hover:text-gray-200">
                            <X className="w-5 h-5" />
                        </button>
                    </div>

                    {/* Mensajes */}
                    <div className="p-4 h-72 overflow-y-auto space-y-3">
                        {mensajes.map((msg, index) => (
                            <div key={index} className={`flex ${msg.tipo === 'user' ? 'justify-end' : 'justify-start'}`}>
                                <p className={`rounded-lg py-2 px-4 text-sm max-w-xs ${msg.tipo === 'user' ? 'bg-violet-600 text-white' : 'bg-gray-100 text-gray-700'}`}>
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
                            className="flex-1 px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-secondary-500"
                        />
                        <button
                            onClick={enviar}
                            className="bg-secondary-500 hover:bg-secondary-600 text-white px-3 py-2 rounded-lg transition"
                        >
                            <Send className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            )}

            {/* Botón flotante */}
            {/* Botón flotante */}
            <div className="relative">
                {/* Globo de saludo */}
                {mostrarSaludo && !abierto && (
                    <div className="absolute bottom-2 right-16 bg-violet-500 text-white text-sm font-medium px-4 py-2 rounded-2xl shadow-lg whitespace-nowrap animate-bounce">
                        ¡Hola, soy Aurora! 👋
                        <span className="absolute top-1/2 -right-1 -translate-y-1/2 w-3 h-3 bg-violet-500 rotate-45" />
                    </div>
                )}
                <button
                    onClick={() => setAbierto(!abierto)}
                    className="group relative w-16 h-16"
                >
                    {/* Anillo con degradado */}
                    <span className="absolute inset-0 rounded-full to-secondary-400 p-[3px] transition-transform duration-200 group-hover:scale-105">
                        <span className="flex items-center justify-center w-full h-full rounded-full border-2 border-violet-700 bg-white shadow-lg overflow-hidden relative">
                            {abierto ? (
                                <span className="flex items-center justify-center w-full h-full rounded-full bg-violet-600">
                                    <MessageCircle className="w-6 h-6 text-white" />
                                </span>
                            ) : (
                                <img
                                    src="/imagenes/Aurora.png"
                                    alt="Aurora"
                                    className="w-full h-full object-cover object-top rounded-full"
                                />
                            )}
                        </span>
                    </span>
                </button>
            </div>
        </div>
    );
}