/**
 * PasoImplantable
 * Paso 3 del formulario cuando la categoría es "Implantables" —
 * reemplaza a PasoEvento con las preguntas del formulario
 * "Registro y control de implantables".
 *
 * Props:
 * - data: objeto con los valores del formulario
 * - setData: función para actualizar los valores
 * - errors: errores de validación
 */

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

const inputClase = "w-full rounded-lg border-2 border-primary-300 px-4 py-2.5 text-sm focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500";

export default function PasoImplantable({ data, setData, errors }) {
    return (
        <div className="space-y-6">
            <div className="col-span-1 md:col-span-2 bg-primary-500 rounded-lg px-4 py-3">
                <h3 className="text-white font-semibold text-xs uppercase">Registro y control de implantables</h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Campo label="Fecha de cirugía *" error={errors.fecha_evento}>
                    <input
                        type="date"
                        value={data.fecha_evento}
                        onChange={e => setData('fecha_evento', e.target.value)}
                        className={inputClase}
                    />
                </Campo>

                <Campo label="Procedimiento CX *" error={errors.imp_procedimiento_cx}>
                    <input
                        type="text"
                        value={data.imp_procedimiento_cx}
                        onChange={e => setData('imp_procedimiento_cx', e.target.value)}
                        placeholder="Ingrese el procedimiento"
                        className={inputClase}
                    />
                </Campo>

                <Campo label="Nombre del cirujano *" error={errors.imp_nombre_cirujano}>
                    <input
                        type="text"
                        value={data.imp_nombre_cirujano}
                        onChange={e => setData('imp_nombre_cirujano', e.target.value.toUpperCase())}
                        placeholder="Ingrese el nombre del cirujano"
                        className={`${inputClase} uppercase`}
                    />
                </Campo>

                <Campo label="Especialidad *" error={errors.imp_especialidad}>
                    <input
                        type="text"
                        value={data.imp_especialidad}
                        onChange={e => setData('imp_especialidad', e.target.value)}
                        placeholder="Ingrese la especialidad"
                        className={inputClase}
                    />
                </Campo>

                <div className="col-span-1 sm:col-span-2">
                    <Campo label="Descripción material implantable *" error={errors.imp_descripcion_material}>
                        <textarea
                            value={data.imp_descripcion_material}
                            onChange={e => setData('imp_descripcion_material', e.target.value)}
                            placeholder="Describa el material implantable..."
                            rows={3}
                            className={inputClase}
                        />
                    </Campo>
                </div>

                <Campo label="Marca *" error={errors.imp_marca}>
                    <input
                        type="text"
                        value={data.imp_marca}
                        onChange={e => setData('imp_marca', e.target.value)}
                        placeholder="Ingrese la marca"
                        className={inputClase}
                    />
                </Campo>

                <Campo label="Registro INVIMA *" error={errors.imp_registro_invima}>
                    <input
                        type="text"
                        value={data.imp_registro_invima}
                        onChange={e => setData('imp_registro_invima', e.target.value)}
                        placeholder="Ingrese el registro INVIMA"
                        className={inputClase}
                    />
                </Campo>

                <Campo label="Serie *" error={errors.imp_serie}>
                    <input
                        type="text"
                        value={data.imp_serie}
                        onChange={e => setData('imp_serie', e.target.value)}
                        placeholder="Ingrese la serie"
                        className={inputClase}
                    />
                </Campo>

                <Campo label="No. LOTE *" error={errors.imp_lote}>
                    <input
                        type="text"
                        value={data.imp_lote}
                        onChange={e => setData('imp_lote', e.target.value)}
                        placeholder="Ingrese el número de lote"
                        className={inputClase}
                    />
                </Campo>

                <Campo label="Fecha de vencimiento *" error={errors.imp_fecha_vencimiento}>
                    <input
                        type="date"
                        value={data.imp_fecha_vencimiento}
                        onChange={e => setData('imp_fecha_vencimiento', e.target.value)}
                        className={inputClase}
                    />
                </Campo>
            </div>

            <Campo label="Observaciones *" error={errors.descripcion}>
                <textarea
                    value={data.descripcion}
                    onChange={e => setData('descripcion', e.target.value)}
                    placeholder="Observaciones..."
                    rows={3}
                    className={inputClase}
                />
            </Campo>
        </div>
    );
}
