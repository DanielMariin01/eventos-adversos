/**
 * GraficaCard
 * Componente reutilizable que envuelve una gráfica con botones de descarga.
 *
 * Props:
 * - titulo: string
 * - subtitulo: string (opcional)
 * - datos: array de objetos para exportar a Excel
 * - children: la gráfica de Recharts
 */

import { useRef } from 'react';
import html2canvas from 'html2canvas';
import * as XLSX from 'xlsx';
import { Download, FileSpreadsheet } from 'lucide-react';

export default function GraficaCard({ titulo, subtitulo, datos = [], children }) {
    const graficaRef = useRef(null);

    // ── Descargar como PNG ──
    const descargarPNG = async () => {
        if (!graficaRef.current) return;
        const canvas = await html2canvas(graficaRef.current, {
            backgroundColor: '#ffffff',
            scale: 2,
        });
        const link = document.createElement('a');
        link.download = `${titulo.replace(/\s+/g, '_')}.png`;
        link.href = canvas.toDataURL('image/png');
        link.click();
    };

    // ── Descargar como Excel ──
    const descargarExcel = () => {
        if (!datos.length) return;
        const ws = XLSX.utils.json_to_sheet(datos);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, 'Datos');
        XLSX.writeFile(wb, `${titulo.replace(/\s+/g, '_')}.xlsx`);
    };

    return (
        <div className="bg-white rounded-xl border border-gray-200 shadow-base p-6">
            {/* Header */}
            <div className="flex items-start justify-between mb-4">
                <div>
                    <h3 className="text-sm font-bold text-gray-700 uppercase tracking-wider">
                        {titulo}
                    </h3>
                    {subtitulo && (
                        <p className="text-xs text-gray-400 mt-0.5">{subtitulo}</p>
                    )}
                </div>

                {/* Botones de descarga */}
                <div className="flex gap-2 flex-shrink-0">
                    <button
                        onClick={descargarPNG}
                        title="Descargar imagen PNG"
                        className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-teal-500 rounded-lg hover:bg-teal-600 transition"
                    >
                        <Download className="w-3.5 h-3.5" />
                        PNG
                    </button>
                    <button
                        onClick={descargarExcel}
                        title="Descargar datos en Excel"
                        className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-green-600 rounded-lg hover:bg-green-700 transition"
                    >
                        <FileSpreadsheet className="w-3.5 h-3.5" />
                        Excel
                    </button>
                </div>
            </div>

            {/* Gráfica */}
            <div ref={graficaRef}>
                {children}
            </div>
        </div>
    );
}