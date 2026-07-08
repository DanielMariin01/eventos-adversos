/**
 * PasoReportante
 * Paso 1 del formulario — datos del reportante.
 * Autocompleta los datos si la cédula ya existe en la BD.
 */

import { useState } from 'react';

const CARGOS = [
    'Médico',
    'Enfermero/a',
    'Auxiliar de enfermería',
    'Bacteriólogo/a',
    'Fisioterapeuta',
    'Fonoaudiólogo/a',
    'Nutricionista',
    'Odontólogo/a',
    'Optómetra',
    'Psicólogo/a',
    'Químico farmacéutico',
    'Radiólogo/a',
    'Regente de farmacia',
    'Técnico en radiología',
    'Terapeuta ocupacional',
    'Trabajador/a social',
    'Administrativo',
    'Otro',
];

const EMPRESAS = [
    'Clínica Central del Eje',
    'Otra',
];

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

export default function PasoReportante({ data, setData, errors }) {
    const [buscando, setBuscando] = useState(false);
    const [autocompletado, setAutocompletado] = useState(false);

    const buscarReportante = async (cedula) => {
        if (!cedula || cedula.length < 5) return;

        setBuscando(true);
        setAutocompletado(false);

        try {
            const response = await fetch(route('eventos.reportante', cedula), {
                headers: { 'Accept': 'application/json' },
            });

            const json = await response.json();

            if (json) {
                setData('rep_nombres', json.nombres ?? '');
                setData('rep_apellidos', json.apellidos ?? '');
                setData('rep_cargo', json.cargo ?? '');
                setData('rep_empresa', json.empresa ?? '');
                setAutocompletado(true);
            }
        } catch {
            // Si falla la búsqueda no hace nada, el usuario llena manualmente
        } finally {
            setBuscando(false);
        }
    };

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

            <Campo label="Cédula *" error={errors.rep_cedula}>
                <div className="relative">
                    <input
                        type="number"
                        value={data.rep_cedula}
                        onChange={e => {
                            setData('rep_cedula', e.target.value);
                            setAutocompletado(false);
                        }}
                        onBlur={e => buscarReportante(e.target.value)}
                        placeholder="Ingrese la cédula"
                        className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500"
                    />
                    {buscando && (
                        <div className="absolute right-3 top-1/2 -translate-y-1/2">
                            <div className="w-4 h-4 border-2 border-teal-500 border-t-transparent rounded-full animate-spin"></div>
                        </div>
                    )}
                </div>
                {autocompletado && (
                    <p className="text-teal-600 text-xs mt-1 flex items-center gap-1">
                        <span>✓</span> Datos autocompletados
                    </p>
                )}
            </Campo>

            <Campo label="Nombres *" error={errors.rep_nombres}>
                <input
                    type="text"
                    value={data.rep_nombres}
                    onChange={e => setData('rep_nombres', e.target.value)}
                    placeholder="Ingrese los nombres"
                    className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500"
                />
            </Campo>

            <Campo label="Apellidos *" error={errors.rep_apellidos}>
                <input
                    type="text"
                    value={data.rep_apellidos}
                    onChange={e => setData('rep_apellidos', e.target.value)}
                    placeholder="Ingrese los apellidos"
                    className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500"
                />
            </Campo>

            <Campo label="Cargo" error={errors.rep_cargo}>
                <select
                    value={data.rep_cargo}
                    onChange={e => setData('rep_cargo', e.target.value)}
                    className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500"
                >
                    <option value="">Seleccione el cargo...</option>
                    {CARGOS.map(cargo => (
                        <option key={cargo} value={cargo}>{cargo}</option>
                    ))}
                </select>
            </Campo>



        </div>
    );
}