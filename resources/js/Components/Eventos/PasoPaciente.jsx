/**
 * PasoPaciente
 * Paso 2 del formulario — datos del paciente.
 *
 * Props:
 * - data: objeto con los valores del formulario
 * - setData: función para actualizar los valores
 * - errors: errores de validación
 */

const ENTIDADES = [
    'Sura',
    'Sanitas',
    'Compensar',
    'Famisanar',
    'Cafesalud',
    'Coomeva',
    'Nueva EPS',
    'Salud Total',
    'Medimás',
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
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

            <Campo label="Cédula" error={errors.pac_cedula}>
                <input
                    type="number"
                    value={data.pac_cedula}
                    onChange={e => setData('pac_cedula', e.target.value)}
                    placeholder="Ingrese la cédula"
                    className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500"
                />
            </Campo>

            <Campo label="Nombres" error={errors.pac_nombres}>
                <input
                    type="text"
                    value={data.pac_nombres}
                    onChange={e => setData('pac_nombres', e.target.value)}
                    placeholder="Ingrese los nombres"
                    className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500"
                />
            </Campo>

            <Campo label="Apellidos" error={errors.pac_apellidos}>
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