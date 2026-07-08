/**
 * PasoPaciente
 * Paso 2 del formulario — datos del paciente.
 * Autocompleta los datos si la cédula ya existe en la BD.
 */

import { useState } from 'react';

const ENTIDADES = [
    'Sura',
    'Sanitas',
    'SOS',
    'Asmet',
    'Fomag',
    'Sanitas',
    'Comfachoco',
    'Coosalud',
    'SOAT',
    'Axa Colpatria',
    'Sura EPS',
    'Sura MP',
    'Sanitas',
    'Compensar',
    'Famisanar',
    'Coomeva',
    'Nueva EPS',
    'Salud Total',
    'Particular',
    'Otra',
];

const UNIDADES_EDAD = [
    'Años',
    'Meses',
    'Días',
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

export default function PasoPaciente({ data, setData, errors }) {
    const [buscando, setBuscando] = useState(false);
    const [autocompletado, setAutocompletado] = useState(false);

    const buscarPaciente = async (cedula) => {
        if (!cedula || cedula.length < 3) return;

        setBuscando(true);
        setAutocompletado(false);

        try {
            const response = await fetch(route('eventos.paciente', cedula), {
                headers: { 'Accept': 'application/json' },
            });

            console.log('status:', response.status);
            const json = await response.json();
            console.log('respuesta:', json);

            if (json) {
                setData('pac_nombres', json.nombres ?? '');
                setData('pac_apellidos', json.apellidos ?? '');
                setData('pac_telefono', json.telefono ?? '');
                setData('pac_edad', json.edad ?? '');
                setData('pac_edad_unidad', json.edad_unidad ?? 'Años');
                setData('pac_entidad', json.entidad ?? '');
                setAutocompletado(true);
            }
        } catch (error) {
            console.log('error:', error);
        } finally {
            setBuscando(false);
        }
    };

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

            <Campo label="Cédula" error={errors.pac_cedula}>
                <div className="relative">
                    <input
                        type="number"
                        value={data.pac_cedula}
                        onChange={e => {
                            setData('pac_cedula', e.target.value);
                            setAutocompletado(false);
                        }}
                        onBlur={e => buscarPaciente(e.target.value)}
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

            <Campo label="Nombres *" error={errors.pac_nombres}>
                <input
                    type="text"
                    value={data.pac_nombres}
                    onChange={e => setData('pac_nombres', e.target.value)}
                    placeholder="Ingrese los nombres"
                    className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500"
                />
            </Campo>

            <Campo label="Apellidos *" error={errors.pac_apellidos}>
                <input
                    type="text"
                    value={data.pac_apellidos}
                    onChange={e => setData('pac_apellidos', e.target.value)}
                    placeholder="Ingrese los apellidos"
                    className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500"
                />
            </Campo>

            <Campo label="Teléfono" error={errors.pac_telefono}>
                <input
                    type="tel"
                    value={data.pac_telefono}
                    onChange={e => setData('pac_telefono', e.target.value)}
                    placeholder="Ingrese el número de teléfono"
                    className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500"
                />
            </Campo>

            <Campo label="Edad" error={errors.pac_edad}>
                <div className="flex gap-2">
                    <input
                        type="number"
                        value={data.pac_edad}
                        onChange={e => setData('pac_edad', e.target.value)}
                        placeholder="Ingrese la edad"
                        min="0"
                        max="120"
                        className="flex-1 rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500"
                    />
                    <select
                        value={data.pac_edad_unidad}
                        onChange={e => setData('pac_edad_unidad', e.target.value)}
                        className="w-28 rounded-lg border border-gray-300 px-3 py-2.5 text-sm focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500"
                    >
                        {UNIDADES_EDAD.map(u => (
                            <option key={u} value={u}>{u}</option>
                        ))}
                    </select>
                </div>
            </Campo>

            <Campo label="Entidad" error={errors.pac_entidad}>
                <select
                    value={data.pac_entidad}
                    onChange={e => setData('pac_entidad', e.target.value)}
                    className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500"
                >
                    <option value="">Seleccione la entidad...</option>
                    {ENTIDADES.map(entidad => (
                        <option key={entidad} value={entidad}>{entidad}</option>
                    ))}
                </select>
            </Campo>

        </div>
    );
}