import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm, router } from '@inertiajs/react';
import TextInput from '@/Components/TextInput';
import InputLabel from '@/Components/InputLabel';
import Tabla from '@/Components/Tabla';
import Swal from 'sweetalert2';
import { useState } from 'react';

export default function Index({ usuarios, roles }) {

    const [modalAbierto, setModalAbierto] = useState(false);
    const [modalEditar, setModalEditar] = useState(false);
    const [usuarioEditar, setUsuarioEditar] = useState(null);

    const { data: dataEditar, setData: setDataEditar, put, processing: processingEditar, errors: errorsEditar, reset: resetEditar } = useForm({
        name: '',
        email: '',
        password: '',
        rol: '',
    });

    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
        email: '',
        password: '',
        rol: '',
    });

    const abrirEditar = (usuario) => {
        setUsuarioEditar(usuario);
        setDataEditar('name', usuario.name);
        setDataEditar('email', usuario.email);
        setDataEditar('password', '');
        setDataEditar('rol', usuario.rol ?? '');
        setModalEditar(true);
    };

    const submitEditar = (e) => {
        e.preventDefault();
        put(route('usuarios.update', usuarioEditar.id), {
            onBefore: () => {
                Swal.fire({
                    title: 'Actualizando usuario...',
                    allowOutsideClick: false,
                    allowEscapeKey: false,
                    showConfirmButton: false,
                    html: `
                        <div style="display:flex;flex-direction:column;align-items:center;gap:16px;padding:8px 0">
                            <div style="display:flex;gap:12px;align-items:center;">
                                <div style="width:20px;height:20px;background:#14b8a6;border-radius:50%;animation:bounce 1.2s ease-in-out infinite;animation-delay:0s;"></div>
                                <div style="width:20px;height:20px;background:#14b8a6;border-radius:50%;animation:bounce 1.2s ease-in-out infinite;animation-delay:0.2s;"></div>
                                <div style="width:20px;height:20px;background:#14b8a6;border-radius:50%;animation:bounce 1.2s ease-in-out infinite;animation-delay:0.4s;"></div>
                            </div>
                            <p style="color:#9ca3af;font-size:12px;margin:0">Por favor espera un momento...</p>
                        </div>
                        <style>@keyframes bounce{0%, 100%{transform:translateY(0);opacity:.4}50%{transform:translateY(-10px);opacity:1}}</style>
                    `,
                });
            },
            onSuccess: () => {
                resetEditar();
                setModalEditar(false);
                Swal.fire({
                    icon: 'success',
                    title: 'Usuario actualizado',
                    text: 'El usuario fue actualizado correctamente.',
                });
            },
            onError: () => {
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: 'Ocurrió un error al actualizar el usuario.',
                });
            },
        });
    };

    const submit = (e) => {
        e.preventDefault();

        const camposVacios = [];
        if (!data.name) camposVacios.push('Nombre');
        if (!data.email) camposVacios.push('Correo');
        if (!data.password) camposVacios.push('Contraseña');
        if (!data.rol) camposVacios.push('Rol');

        if (camposVacios.length > 0) {
            Swal.fire({
                icon: 'warning',
                title: 'Campos obligatorios',
                html: `Por favor completa los siguientes campos:<br>${camposVacios.join('<br>')}`,
            });
            return;
        }

        post(route('usuarios.store'), {
            onBefore: () => {
                Swal.fire({
                    title: 'Creando usuario...',
                    allowOutsideClick: false,
                    allowEscapeKey: false,
                    showConfirmButton: false,
                    html: `
                        <div style="display:flex;flex-direction:column;align-items:center;gap:16px;padding:8px 0">
                            <div style="display:flex;gap:12px;align-items:center;">
                                <div style="width:20px;height:20px;background:#14b8a6;border-radius:50%;animation:bounce 1.2s ease-in-out infinite;animation-delay:0s;"></div>
                                <div style="width:20px;height:20px;background:#14b8a6;border-radius:50%;animation:bounce 1.2s ease-in-out infinite;animation-delay:0.2s;"></div>
                                <div style="width:20px;height:20px;background:#14b8a6;border-radius:50%;animation:bounce 1.2s ease-in-out infinite;animation-delay:0.4s;"></div>
                            </div>
                            <p style="color:#9ca3af;font-size:12px;margin:0">Por favor espera un momento...</p>
                        </div>
                        <style>@keyframes bounce{0%, 100%{transform:translateY(0);opacity:.4}50%{transform:translateY(-10px);opacity:1}}</style>
                    `,
                });
            },
            onSuccess: () => {
                reset();
                setModalAbierto(false);
                Swal.fire({
                    icon: 'success',
                    title: 'Usuario creado',
                    text: 'El usuario fue creado correctamente.',
                });
            },
            onError: () => {
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: 'Ocurrió un error al crear el usuario.',
                });
            },
        });
    };

    const eliminar = (id) => {
        Swal.fire({
            title: '¿Estás seguro?',
            text: 'Esta acción no se puede deshacer.',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#14b8a6',
            cancelButtonColor: '#f43f5e',
            confirmButtonText: 'Sí, eliminar',
            cancelButtonText: 'Cancelar',
        }).then((result) => {
            if (result.isConfirmed) {
                router.delete(route('usuarios.destroy', id));
            }
        });
    };

    // ── Columnas de la tabla ──
    const columnas = [
        { label: 'Nombre', key: 'name' },
        { label: 'Correo', key: 'email' },
        {
            label: 'Rol',
            key: 'rol',

        },
    ];

    // ── Acciones de la tabla ──
    const acciones = (fila) => (
        <div className="flex gap-2 justify-center">
            <button
                onClick={() => abrirEditar(fila)}
                className="bg-blue-500 hover:bg-blue-600 text-white text-xs font-semibold px-4 py-1.5 rounded-sm transition"
            >
                Editar
            </button>
            <button
                onClick={() => eliminar(fila.id)}
                className="bg-red-500 hover:bg-red-600 text-white text-xs font-semibold px-4 py-1.5 rounded-sm transition"
            >
                Eliminar
            </button>
        </div>
    );

    return (
        <AuthenticatedLayout header={<h2 className="text-xl font-semibold text-white">Gestión de Usuarios</h2>}>
            <Head title="Usuarios" />

            <div className="max-w-6xl mx-auto py-12 px-6">

                {/* Botón crear */}
                <div className="flex justify-end mb-6">
                    <button
                        onClick={() => setModalAbierto(true)}
                        className="bg-teal-500 hover:bg-teal-600 text-white text-sm font-semibold px-5 py-2.5 rounded-sm transition"
                    >
                        + Crear usuario
                    </button>
                </div>

                {/* Tabla */}
                <Tabla
                    columnas={columnas}
                    datos={usuarios}
                    acciones={acciones}
                    mensajeVacio="No hay usuarios registrados."
                />
            </div>

            {/* Modal Crear */}
            {modalAbierto && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg shadow-xl w-full max-w-lg px-8 py-8">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-sm font-semibold text-teal-700 uppercase tracking-wider">
                                Crear nuevo usuario
                            </h2>
                            <button
                                onClick={() => { setModalAbierto(false); reset(); }}
                                className="text-gray-400 hover:text-gray-600 text-xl font-bold"
                            >
                                ✕
                            </button>
                        </div>
                        <form onSubmit={submit} className="space-y-4">
                            <div>
                                <InputLabel value="Nombre completo" />
                                <TextInput
                                    type="text"
                                    placeholder="Nombre completo"
                                    value={data.name}
                                    onChange={e => setData('name', e.target.value)}
                                    className="w-full mt-1"
                                />
                                {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
                            </div>
                            <div>
                                <InputLabel value="Correo electrónico" />
                                <TextInput
                                    type="email"
                                    placeholder="Correo electrónico"
                                    value={data.email}
                                    onChange={e => setData('email', e.target.value)}
                                    className="w-full mt-1"
                                />
                                {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
                            </div>
                            <div>
                                <InputLabel value="Contraseña" />
                                <TextInput
                                    type="password"
                                    placeholder="Contraseña"
                                    value={data.password}
                                    onChange={e => setData('password', e.target.value)}
                                    className="w-full mt-1"
                                />
                                {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}
                            </div>
                            <div>
                                <InputLabel value="Rol" />
                                <select
                                    value={data.rol}
                                    onChange={e => setData('rol', e.target.value)}
                                    className="w-full mt-1 rounded-md border-gray-300 shadow-sm focus:border-teal-500 focus:ring-teal-500 text-sm"
                                >
                                    <option value="" disabled>Seleccionar rol</option>
                                    {roles.map(rol => (
                                        <option key={rol} value={rol}>{rol}</option>
                                    ))}
                                </select>
                                {errors.rol && <p className="text-red-500 text-xs mt-1">{errors.rol}</p>}
                            </div>
                            <button
                                type="submit"
                                disabled={processing}
                                className="w-full bg-teal-500 hover:bg-teal-600 text-white font-semibold py-2.5 rounded-lg transition duration-150 mt-4 disabled:opacity-50"
                            >
                                Crear usuario
                            </button>
                        </form>
                    </div>
                </div>
            )}

            {/* Modal Editar */}
            {modalEditar && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg shadow-xl w-full max-w-lg px-8 py-8">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-sm font-semibold text-blue-700 uppercase tracking-wider">
                                Editar usuario
                            </h2>
                            <button
                                onClick={() => { setModalEditar(false); resetEditar(); }}
                                className="text-gray-400 hover:text-gray-600 text-xl font-bold"
                            >
                                ✕
                            </button>
                        </div>
                        <form onSubmit={submitEditar} className="space-y-4">
                            <div>
                                <InputLabel value="Nombre completo" />
                                <TextInput
                                    type="text"
                                    value={dataEditar.name}
                                    onChange={e => setDataEditar('name', e.target.value)}
                                    className="w-full mt-1"
                                />
                                {errorsEditar.name && <p className="text-red-500 text-xs mt-1">{errorsEditar.name}</p>}
                            </div>
                            <div>
                                <InputLabel value="Correo electrónico" />
                                <TextInput
                                    type="email"
                                    value={dataEditar.email}
                                    onChange={e => setDataEditar('email', e.target.value)}
                                    className="w-full mt-1"
                                />
                                {errorsEditar.email && <p className="text-red-500 text-xs mt-1">{errorsEditar.email}</p>}
                            </div>
                            <div>
                                <InputLabel value="Contraseña (dejar vacío para no cambiar)" />
                                <TextInput
                                    type="password"
                                    value={dataEditar.password}
                                    onChange={e => setDataEditar('password', e.target.value)}
                                    className="w-full mt-1"
                                />
                                {errorsEditar.password && <p className="text-red-500 text-xs mt-1">{errorsEditar.password}</p>}
                            </div>
                            <div>
                                <InputLabel value="Rol" />
                                <select
                                    value={dataEditar.rol}
                                    onChange={e => setDataEditar('rol', e.target.value)}
                                    className="w-full mt-1 rounded-md border-gray-300 shadow-sm focus:border-teal-500 focus:ring-teal-500 text-sm"
                                >
                                    <option value="" disabled>Seleccionar rol</option>
                                    {roles.map(rol => (
                                        <option key={rol} value={rol}>{rol}</option>
                                    ))}
                                </select>
                                {errorsEditar.rol && <p className="text-red-500 text-xs mt-1">{errorsEditar.rol}</p>}
                            </div>
                            <button
                                type="submit"
                                disabled={processingEditar}
                                className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2.5 rounded-lg transition duration-150 mt-4 disabled:opacity-50"
                            >
                                Actualizar usuario
                            </button>
                        </form>
                    </div>
                </div>
            )}

        </AuthenticatedLayout>
    );
}