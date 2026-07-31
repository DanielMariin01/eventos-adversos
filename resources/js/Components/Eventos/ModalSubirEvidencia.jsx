/**
 * ModalSubirEvidencia
 * Modal para que el jefe suba evidencia del plan de mejora ejecutado.
 */

import { useState } from 'react';
import { useForm } from '@inertiajs/react';
import { X, Upload, Paperclip } from 'lucide-react';
import { FaFilePdf, FaFileImage, FaFileAlt } from 'react-icons/fa';
import Swal from 'sweetalert2';

const getIcono = (extension) => {
    if (['pdf'].includes(extension?.toLowerCase())) return <FaFilePdf className="text-red-500 text-lg" />;
    if (['jpg', 'jpeg', 'png'].includes(extension?.toLowerCase())) return <FaFileImage className="text-blue-500 text-lg" />;
    return <FaFileAlt className="text-gray-500 text-lg" />;
};

export default function ModalSubirEvidencia({ evento, onClose, setCargando }) {

    const archivosJefe = evento.archivos?.filter(a => a.tipo === 'jefe') ?? [];

    const { data, setData, post, processing } = useForm({
        archivos: [],
    });

    const submit = () => {
        if (data.archivos.length === 0) {
            Swal.fire({ icon: 'warning', title: 'Sin archivos', text: 'Por favor selecciona al menos un archivo.' });
            return;
        }

        setCargando(true);
        post(route('eventos.evidencia', evento.id_eventoAdverso), {
            forceFormData: true,
            onSuccess: () => {
                setCargando(false);
                onClose();
                Swal.fire({ icon: 'success', title: 'Evidencia subida correctamente.', text: 'El evento ha cambiado a estado Radicado.' });
            },
            onError: () => {
                setCargando(false);
                Swal.fire({ icon: 'error', title: 'Error al subir la evidencia.' });
            },
        });
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg max-h-[90vh] flex flex-col overflow-hidden">

                {/* Header */}
                <div className="bg-teal-600 px-6 py-4 flex items-center justify-between flex-shrink-0 rounded-t-xl">
                    <h2 className="text-white font-bold text-lg">
                        Subir Evidencia — Evento N°: {evento.id_eventoAdverso}
                    </h2>
                    <button onClick={onClose} className="text-white hover:text-teal-200 transition">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Contenido */}
                <div className="flex-1 overflow-y-auto p-6 space-y-4 scroll-teal">

                    {/* Archivos ya subidos */}
                    {archivosJefe.length > 0 && (
                        <div>
                            <p className="text-sm font-semibold text-gray-600 mb-2">Evidencias anteriores:</p>
                            <div className="space-y-2">
                                {archivosJefe.map((archivo) => (
                                    <a
                                        key={archivo.id_archivo}
                                        href={`/storage/${archivo.ruta}`}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg hover:bg-teal-50 hover:border-teal-300 transition group"
                                    >
                                        <div className="w-9 h-9 rounded-lg bg-gray-100 flex items-center justify-center flex-shrink-0 group-hover:bg-teal-100">
                                            {getIcono(archivo.extension)}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-medium text-gray-800 truncate">{archivo.nombre}</p>
                                            <p className="text-xs text-gray-400 uppercase">{archivo.extension}</p>
                                        </div>
                                        <span className="text-xs text-teal-600 font-semibold">Ver →</span>
                                    </a>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Subir nuevos archivos */}
                    <div>
                        <p className="text-sm font-semibold text-gray-600 mb-2">
                            Adjuntar evidencia * <span className="text-gray-400 font-normal">(PDF, JPG, PNG)</span>
                        </p>

                        <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:bg-teal-50 hover:border-teal-400 transition">
                            <div className="flex flex-col items-center gap-2">
                                <Upload className="w-8 h-8 text-teal-400" />
                                <p className="text-sm text-gray-500">
                                    <span className="font-semibold text-teal-600">Haz clic</span> o arrastra los archivos aquí
                                </p>
                                <p className="text-xs text-gray-400">PDF, JPG, PNG — máx. 10MB</p>
                            </div>
                            <input
                                type="file"
                                multiple
                                accept=".pdf,.jpg,.jpeg,.png"
                                className="hidden"
                                onChange={e => setData('archivos', Array.from(e.target.files))}
                            />
                        </label>

                        {/* Preview de archivos seleccionados */}
                        {data.archivos.length > 0 && (
                            <div className="mt-3 space-y-2">
                                {data.archivos.map((file, index) => (
                                    <div key={index} className="flex items-center gap-3 p-2 bg-teal-50 border border-teal-200 rounded-lg">
                                        <Paperclip className="w-4 h-4 text-teal-500 flex-shrink-0" />
                                        <p className="text-sm text-gray-700 truncate flex-1">{file.name}</p>
                                        <p className="text-xs text-gray-400">{(file.size / 1024).toFixed(0)} KB</p>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                </div>

                {/* Footer */}
                <div className="flex justify-end gap-3 px-6 py-4 border-t border-gray-200 flex-shrink-0">
                    <button
                        onClick={onClose}
                        className="px-5 py-2 text-sm font-semibold text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition"
                    >
                        Cancelar
                    </button>
                    <button
                        onClick={submit}
                        disabled={processing}
                        className="flex items-center gap-2 px-5 py-2 text-sm font-semibold text-white bg-teal-500 rounded-lg hover:bg-teal-600 transition disabled:opacity-50"
                    >
                        <Upload className="w-4 h-4" />
                        Subir evidencia
                    </button>
                </div>

            </div>
        </div>
    );
}