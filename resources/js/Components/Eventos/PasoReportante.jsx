/**
 * PasoReportante
 * Paso 1 del formulario — datos del reportante.
 *
 * Props:
 * - data: objeto con los valores del formulario
 * - setData: función para actualizar los valores
 * - errors: errores de validación
 */

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
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

            <Campo label="Cédula *" error={errors.rep_cedula}>
                <input
                    type="number"
                    value={data.rep_cedula}
                    onChange={e => setData('rep_cedula', e.target.value)}
                    placeholder="Ingrese la cédula"
                    className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500"
                />
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

            <Campo label="Empresa" error={errors.rep_empresa}>
                <select
                    value={data.rep_empresa}
                    onChange={e => setData('rep_empresa', e.target.value)}
                    className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500"
                >
                    <option value="">Seleccione la entidad...</option>
                    {EMPRESAS.map(empresa => (
                        <option key={empresa} value={empresa}>{empresa}</option>
                    ))}
                </select>
            </Campo>

        </div>
    );
}