import { COLORS } from '@/theme';
import { Head, router, useForm } from '@inertiajs/react';
import { useState } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import Tabla from '@/Components/Tabla';
import Swal from 'sweetalert2';
import { X, Save, Plus } from 'lucide-react';

export default function Index({ areas, jefes }) {

    const [modalEditar, setModalEditar] = useState(false);
    const [areaSeleccionada, setAreaSeleccionada] = useState(null);
    const [fkJefe, setFkJefe] = useState('');
    const [cargando, setCargando] = useState(false);


    // ── Crear área ──
    const [mostrarForm, setMostrarForm] = useState(false);
    const form = useForm({ nombre: '', responsable: '', fk_jefe: '' });

    const crear = (e) => {
        e.preventDefault();
        form.post(route('areas.store'), {
            onSuccess: () => {
                form.reset();
                setMostrarForm(false);
                Swal.fire({ icon: 'success', title: 'Área creada correctamente.' });
            },
        });
    };

    const abrirEditar =(area) => {
        setAreaSeleccionada(area);
        setFkJefe(area.fk_jefe ?? '');
        setModalEditar(true);
    };

    const guardar = () => {
        setCargando(true);
        router.patch(route('areas.update', areaSeleccionada.id_area), { fk_jefe: fkJefe }, {
            onSuccess: () => {
                setCargando(false);
                setModalEditar(false);
                Swal.fire({ icon: 'success', title: 'Jefe asignado correctamente.' });
            },
            onError: () => {
                setCargando(false);
                Swal.fire({ icon: 'error', title: 'Error al asignar el jefe.' });
            },
        });
    };

    const columnas = [
        { label: 'Área', key: 'nombre' },
        { label: 'Responsable', key: 'responsable', render: (fila) => fila.responsable ?? '—' },
        {
            label: 'Jefe Asignado',
            key: 'jefe',
            render: (fila) => fila.jefe
                ? <span className="bg-primary-100 text-primary-700 text-xs font-semibold px-2.5 py-1 rounded-full">{fila.jefe.name}</span>
                : <span className="bg-gray-100 text-gray-500 text-xs px-2.5 py-1 rounded-full">Sin asignar</span>,
        },
    ];

    const acciones = (fila) => (
        <button
            onClick={() => abrirEditar(fila)}
            className="bg-primary-500 hover:bg-primary-600 text-white text-xs font-semibold px-3 py-1.5 rounded-lg transition"
        >
            Asignar jefe
        </button>
    );

    return (
        <AuthenticatedLayout header={<h2 className="text-xl font-semibold text-white uppercase">Gestión de Áreas</h2>}>
            <Head title="Áreas" />

            {/* Loading */}
            {cargando && (
                <div className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-100/85">
                    <div className="relative w-[150px] h-[73px]">
                        <svg viewBox="0 0 150 73" height="73px" width="150px" xmlns="http://www.w3.org/2000/svg">
                            <polyline
                                points="0,45.486 38.514,45.486 44.595,33.324 50.676,45.486 57.771,45.486 62.838,55.622 71.959,9 80.067,63.729 84.122,45.486 97.297,45.486 103.379,40.419 110.473,45.486 150,45.486"
                                strokeMiterlimit="10"
                                strokeWidth="3"
                                stroke={COLORS.secondary}
                                fill="none"
                            />
                        </svg>
                        <div className="absolute inset-0 bg-slate-100 animate-[heartRateIn_2.5s_linear_infinite]"
                            style={{ left: 0, right: 'auto' }} />
                        <div className="absolute top-0 h-full bg-slate-100 animate-[heartRateOut_2.5s_linear_infinite]"
                            style={{ width: '120%', left: '-120%' }} />
                    </div>
                </div>
            )}

            <div className="max-w-5xl mx-auto py-8 px-6 space-y-6">
                {/* ── Crear área ── */}
                <div className="flex justify-end">
                    <button
                        onClick={() => { setMostrarForm(!mostrarForm); form.clearErrors(); }}
                        className="flex items-center gap-2 bg-primary-500 hover:bg-primary-600 active:bg-primary-700 text-white text-xs font-semibold uppercase tracking-widest px-4 py-2.5 rounded-btn transition"
                    >
                        {mostrarForm ? <X className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                        {mostrarForm ? 'Cancelar' : 'Crear'}
                    </button>
                </div>

                {mostrarForm && (
                    <form onSubmit={crear} className="bg-white rounded-card shadow-card p-6 space-y-4">
                        <h3 className="text-ink font-semibold">Nueva área</h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div>
                                <label className="block text-sm font-semibold text-ink mb-1">Nombre del área</label>
                                <input
                                    type="text"
                                    value={form.data.nombre}
                                    onChange={e => form.setData('nombre', e.target.value)}
                                    className="w-full rounded-lg border-2 border-primary-300 px-3 py-2 text-sm focus:outline-none focus:border-primary-500 focus:ring-0"
                                />
                                {form.errors.nombre && <p className="text-red-600 text-xs mt-1">{form.errors.nombre}</p>}
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-ink mb-1">Responsable</label>
                                <input
                                    type="text"
                                    value={form.data.responsable}
                                    onChange={e => form.setData('responsable', e.target.value)}
                                    className="w-full rounded-lg border-2 border-primary-300 px-3 py-2 text-sm focus:outline-none focus:border-primary-500 focus:ring-0"
                                />
                                {form.errors.responsable && <p className="text-red-600 text-xs mt-1">{form.errors.responsable}</p>}
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-ink mb-1">Jefe del área</label>
                                <select
                                    value={form.data.fk_jefe}
                                    onChange={e => form.setData('fk_jefe', e.target.value)}
                                    className="w-full rounded-lg border-2 border-primary-300 px-3 py-2 text-sm focus:outline-none focus:border-primary-500 focus:ring-0"
                                >
                                    <option value="">Sin asignar</option>
                                    {jefes.map(jefe => (
                                        <option key={jefe.id} value={jefe.id}>{jefe.name}</option>
                                    ))}
                                </select>
                                {form.errors.fk_jefe && <p className="text-red-600 text-xs mt-1">{form.errors.fk_jefe}</p>}
                            </div>
                        </div>
                        <div className="flex justify-end">
                            <button
                                type="submit"
                                disabled={form.processing}
                                className="flex items-center gap-2 bg-primary-500 hover:bg-primary-600 active:bg-primary-700 text-white text-xs font-semibold uppercase tracking-widest px-4 py-2.5 rounded-btn transition disabled:opacity-25"
                            >
                                <Save className="w-4 h-4" />
                                Guardar área
                            </button>
                        </div>
                    </form>
                )}

                <Tabla
                    columnas={columnas}
                    datos={areas}
                    acciones={acciones}
                    mensajeVacio="No hay áreas registradas."
                />
            </div>

            {/* Modal asignar jefe */}
            {modalEditar && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
                    <div className="bg-white rounded-card shadow-card w-full max-w-md">

                        <div className="bg-primary-600 px-6 py-4 flex items-center justify-between rounded-t-xl">
                            <h2 className="text-white font-bold text-lg">
                                Asignar Jefe — {areaSeleccionada?.nombre}
                            </h2>
                            <button onClick={() => setModalEditar(false)} className="text-white hover:text-primary-200 transition">
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <div className="p-6 space-y-4">
                            <div>
                                <label className="block text-sm font-semibold text-gray-600 mb-1">
                                    Jefe del área
                                </label>
                                <select
                                    value={fkJefe}
                                    onChange={e => setFkJefe(e.target.value)}
                                    className="w-full rounded-lg border-2 border-primary-300 px-3 py-3 text-sm focus:outline-none focus:border-primary-500"
                                >
                                    <option value="">Sin asignar</option>
                                    {jefes.map(jefe => (
                                        <option key={jefe.id} value={jefe.id}>{jefe.name}</option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        <div className="flex justify-end gap-3 px-6 py-4 border-t border-gray-200">
                            <button
                                onClick={() => setModalEditar(false)}
                                className="px-5 py-2 text-sm font-semibold text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition"
                            >
                                Cancelar
                            </button>
                            <button
                                onClick={guardar}
                                className="flex items-center gap-2 px-5 py-2 text-sm font-semibold text-white bg-primary-500 rounded-lg hover:bg-primary-600 transition"
                            >
                                <Save className="w-4 h-4" />
                                Guardar
                            </button>
                        </div>

                    </div>
                </div>
            )}

        </AuthenticatedLayout>
    );
}