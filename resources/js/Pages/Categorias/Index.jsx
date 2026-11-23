import { Head, router, useForm } from '@inertiajs/react';
import { useState } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import Tabla from '@/Components/Tabla';
import Swal from 'sweetalert2';
import { X, Save, Plus } from 'lucide-react';

const claseInput = 'w-full rounded-lg border-2 border-primary-300 px-3 py-2 text-sm focus:outline-none focus:border-primary-500 focus:ring-0';

export default function Index({ categorias }) {
    // ── Crear categoría ──
    const [mostrarForm, setMostrarForm] = useState(false);
    const form = useForm({ nombre: '', descripcion: '' });

    const crear = (e) => {
        e.preventDefault();
        form.post(route('categorias.store'), {
            onSuccess: () => {
                form.reset();
                setMostrarForm(false);
                Swal.fire({ icon: 'success', title: 'Categoría creada correctamente.' });
            },
        });
    };

    // ── Editar categoría ──
    const [categoriaEditar, setCategoriaEditar] = useState(null);
    const formEditar = useForm({ nombre: '', descripcion: '' });

    const abrirEditar = (categoria) => {
        formEditar.clearErrors();
        formEditar.setData({ nombre: categoria.nombre, descripcion: categoria.descripcion ?? '' });
        setCategoriaEditar(categoria);
    };

    const guardarEdicion = (e) => {
        e.preventDefault();
        formEditar.patch(route('categorias.update', categoriaEditar.id_categoria), {
            onSuccess: () => {
                setCategoriaEditar(null);
                Swal.fire({ icon: 'success', title: 'Categoría actualizada correctamente.' });
            },
        });
    };

    // ── Activar / desactivar ──
    const cambiarEstado = (categoria) => {
        const activa = !!categoria.activo;
        Swal.fire({
            title: activa ? '¿Desactivar categoría?' : '¿Activar categoría?',
            text: activa
                ? 'Ya no aparecerá al reportar nuevos eventos. Los eventos existentes no se afectan.'
                : 'Volverá a aparecer al reportar nuevos eventos.',
            icon: 'question',
            showCancelButton: true,
            confirmButtonText: activa ? 'Sí, desactivar' : 'Sí, activar',
            cancelButtonText: 'Cancelar',
        }).then(result => {
            if (result.isConfirmed) {
                router.patch(route('categorias.activo', categoria.id_categoria), {}, { preserveScroll: true });
            }
        });
    };

    const columnas = [
        { label: 'Categoría', key: 'nombre', render: (fila) => <span className="font-semibold text-ink">{fila.nombre}</span> },
        { label: 'Descripción', key: 'descripcion', render: (fila) => <span className="text-xs">{fila.descripcion ?? '—'}</span> },
        {
            label: 'Eventos',
            key: 'eventos_adversos_count',
            render: (fila) => <span className="text-xs">{fila.eventos_adversos_count}</span>,
        },
        {
            label: 'Estado',
            key: 'activo',
            render: (fila) => fila.activo
                ? <span className="bg-secondary-100 text-secondary-700 text-xs font-semibold px-2.5 py-1 rounded-full">Activa</span>
                : <span className="bg-gray-100 text-gray-500 text-xs font-semibold px-2.5 py-1 rounded-full">Inactiva</span>,
        },
    ];

    const acciones = (fila) => (
        <div className="flex gap-2">
            <button
                onClick={() => abrirEditar(fila)}
                className="bg-primary-500 hover:bg-primary-600 text-white text-xs font-semibold px-3 py-1.5 rounded-lg transition"
            >
                Editar
            </button>
            <button
                onClick={() => cambiarEstado(fila)}
                className={`text-white text-xs font-semibold px-3 py-1.5 rounded-lg transition ${fila.activo ? 'bg-red-500 hover:bg-red-600' : 'bg-secondary-500 hover:bg-secondary-600'}`}
            >
                {fila.activo ? 'Desactivar' : 'Activar'}
            </button>
        </div>
    );

    return (
        <AuthenticatedLayout header={<h2 className="text-xl font-semibold text-white uppercase">Gestión de Categorías</h2>}>
            <Head title="Categorías" />

            <div className="max-w-5xl mx-auto py-8 px-6 space-y-6">
                {/* ── Crear categoría ── */}
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
                        <h3 className="text-ink font-semibold">Nueva categoría</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-semibold text-ink mb-1">Nombre de la categoría</label>
                                <input
                                    type="text"
                                    value={form.data.nombre}
                                    onChange={e => form.setData('nombre', e.target.value)}
                                    className={claseInput}
                                />
                                {form.errors.nombre && <p className="text-red-600 text-xs mt-1">{form.errors.nombre}</p>}
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-ink mb-1">Descripción</label>
                                <input
                                    type="text"
                                    value={form.data.descripcion}
                                    onChange={e => form.setData('descripcion', e.target.value)}
                                    className={claseInput}
                                />
                                {form.errors.descripcion && <p className="text-red-600 text-xs mt-1">{form.errors.descripcion}</p>}
                            </div>
                        </div>
                        <div className="flex justify-end">
                            <button
                                type="submit"
                                disabled={form.processing}
                                className="flex items-center gap-2 bg-primary-500 hover:bg-primary-600 active:bg-primary-700 text-white text-xs font-semibold uppercase tracking-widest px-4 py-2.5 rounded-btn transition disabled:opacity-25"
                            >
                                <Save className="w-4 h-4" />
                                Guardar categoría
                            </button>
                        </div>
                    </form>
                )}

                <Tabla
                    columnas={columnas}
                    datos={categorias}
                    acciones={acciones}
                    mensajeVacio="No hay categorías registradas."
                />
            </div>

            {/* ── Modal editar ── */}
            {categoriaEditar && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
                    <form onSubmit={guardarEdicion} className="bg-white rounded-card shadow-card w-full max-w-md">
                        <div className="bg-primary-600 px-6 py-4 flex items-center justify-between rounded-t-xl">
                            <h2 className="text-white font-bold text-lg">Editar categoría</h2>
                            <button type="button" onClick={() => setCategoriaEditar(null)} className="text-white hover:text-primary-200 transition">
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <div className="p-6 space-y-4">
                            <div>
                                <label className="block text-sm font-semibold text-gray-600 mb-1">Nombre</label>
                                <input
                                    type="text"
                                    value={formEditar.data.nombre}
                                    onChange={e => formEditar.setData('nombre', e.target.value)}
                                    className={claseInput}
                                />
                                {formEditar.errors.nombre && <p className="text-red-600 text-xs mt-1">{formEditar.errors.nombre}</p>}
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-gray-600 mb-1">Descripción</label>
                                <textarea
                                    value={formEditar.data.descripcion}
                                    onChange={e => formEditar.setData('descripcion', e.target.value)}
                                    rows={3}
                                    className={`${claseInput} resize-none`}
                                />
                                {formEditar.errors.descripcion && <p className="text-red-600 text-xs mt-1">{formEditar.errors.descripcion}</p>}
                            </div>
                            <p className="text-xs text-gray-500">
                                Algunos nombres (Tecnovigilancia, Farmacovigilancia, Implantables, IAAS, Seguridad del Paciente)
                                activan reglas propias del sistema; cambiarlos las desactiva.
                            </p>
                        </div>

                        <div className="flex justify-end gap-3 px-6 py-4 border-t border-gray-200">
                            <button
                                type="button"
                                onClick={() => setCategoriaEditar(null)}
                                className="px-5 py-2 text-sm font-semibold text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition"
                            >
                                Cancelar
                            </button>
                            <button
                                type="submit"
                                disabled={formEditar.processing}
                                className="flex items-center gap-2 px-5 py-2 text-sm font-semibold text-white bg-primary-500 rounded-lg hover:bg-primary-600 transition disabled:opacity-50"
                            >
                                <Save className="w-4 h-4" />
                                Guardar
                            </button>
                        </div>
                    </form>
                </div>
            )}
        </AuthenticatedLayout>
    );
}
