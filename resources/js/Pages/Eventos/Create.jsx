import { Head, useForm, router } from '@inertiajs/react';
import { useState } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import TarjetaCategoria from '@/Components/Eventos/TarjetaCategoria';
import TarjetaArea from '@/Components/Eventos/TarjetaArea';
import PasoIndicador from '@/Components/Eventos/PasoIndicador';
import PasoReportante from '@/Components/Eventos/PasoReportante';
import PasoPaciente from '@/Components/Eventos/PasoPaciente';
import PasoEvento from '@/Components/Eventos/PasoEvento';
import Swal from 'sweetalert2';

export default function Create({ categorias, areas: areasProp = null, fk_categoria: fkCategoriaProp = null }) {

    // ── Estado de navegación ──
    const [etapa, setEtapa] = useState(areasProp ? 'area' : 'categoria'); // 'categoria' | 'area' | 'formulario'
    const [paso, setPaso] = useState(1);
    const [areas, setAreas] = useState(areasProp ?? []);
    const [cargandoAreas, setCargandoAreas] = useState(false);
    const [erroresPaso, setErroresPaso] = useState({});

    const { data, setData, post, processing, errors, reset } = useForm({
        fk_categoria: fkCategoriaProp ?? '',
        fk_area: '',

        // Reportante
        rep_cedula: '',
        rep_nombres: '',
        rep_apellidos: '',
        rep_cargo: '',
        rep_empresa: '',

        // Paciente
        pac_cedula: '',
        pac_nombres: '',
        pac_apellidos: '',
        pac_telefono: '',
        pac_edad: '',
        pac_edad_unidad: 'Años',
        pac_entidad: '',

        // Evento
        fecha_evento: '',
        descripcion: '',
        barreras_vulneradas: [],
        factores_contributivos: [],
        acciones_inseguras: [],
        clasificacion: '',
        relacionado_con: '',
        categorizacion: '',
    });

    // ── Selección de categoría ──
    const seleccionarCategoria = async (idCategoria) => {
        setCargandoAreas(true);

        try {
            const response = await fetch(route('eventos.area'), {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-XSRF-TOKEN': decodeURIComponent(document.cookie.split('; ').find(r => r.startsWith('XSRF-TOKEN='))?.split('=')[1] ?? ''),
                    'Accept': 'application/json',
                },
                body: JSON.stringify({ fk_categoria: idCategoria }),
            });

            const json = await response.json();
            setAreas(json.areas ?? []);
            setData('fk_categoria', idCategoria);
            setEtapa('area');
        } catch (error) {
            console.log('error:', error);
            Swal.fire({ icon: 'error', title: 'Error', text: 'No se pudieron cargar las áreas.' });
        } finally {
            setCargandoAreas(false);
        }
    };

    // ── Selección de área ──
    const seleccionarArea = (idArea) => {
        setData('fk_area', idArea);
        setEtapa('formulario');
    };

    // ── Navegación entre pasos ──
    const siguiente = () => {
        const nuevosErrores = {};

        if (paso === 1) {
            if (!data.rep_cedula) nuevosErrores.rep_cedula = 'La cédula es obligatoria';
            if (!data.rep_nombres) nuevosErrores.rep_nombres = 'Los nombres son obligatorios';
            if (!data.rep_apellidos) nuevosErrores.rep_apellidos = 'Los apellidos son obligatorios';
        }

        if (paso === 2) {
            if (!data.pac_nombres) nuevosErrores.pac_nombres = 'Los nombres son obligatorios';
            if (!data.pac_apellidos) nuevosErrores.pac_apellidos = 'Los apellidos son obligatorios';
        }

        if (Object.keys(nuevosErrores).length > 0) {
            setErroresPaso(nuevosErrores);
            Swal.fire({
                icon: 'warning',
                iconColor: '#3b82f6',
                title: 'Campos obligatorios',
                text: 'Por favor completa todos los campos requeridos.',
            });
            return;
        }

        setErroresPaso({});
        setPaso(p => Math.min(p + 1, 3));
    };
    const anterior = () => {
        if (paso === 1) {
            setEtapa('area');
            setData('fk_area', '');
        } else {
            setPaso(p => p - 1);
        }
    };

    // ── Envío del formulario ──
    const submit = (e) => {
        if (e && e.preventDefault) e.preventDefault();
        const nuevosErrores = {};
        if (!data.fecha_evento) nuevosErrores.fecha_evento = 'La fecha del evento es obligatoria';
        if (!data.descripcion) nuevosErrores.descripcion = 'La descripción es obligatoria';

        if (Object.keys(nuevosErrores).length > 0) {
            setErroresPaso(nuevosErrores);
            Swal.fire({
                icon: 'warning',
                iconColor: '#3b82f6',
                title: 'Campos obligatorios',
                text: 'Por favor completa todos los campos requeridos.',
            });
            return;
        }

        post(route('eventos.store'), {
            onSuccess: () => {
                reset();
                setEtapa('categoria');
                setPaso(1);
                Swal.fire({
                    icon: 'success',
                    title: '¡Evento registrado!',
                    text: 'El evento adverso fue reportado correctamente.',
                });
            },
            onError: () => {
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: 'Ocurrió un error al registrar el evento. Verifica los campos.',
                });
            },
        });
    };

    return (
        <AuthenticatedLayout header={<h2 className="text-xl font-semibold text-white uppercase">Reporte de Evento Adverso</h2>}>
            <Head title="Reportar Evento Adverso" />
            {/* Loading overlay */}
            {processing && (
                <div className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-100/70">
                    <div className="relative w-[150px] h-[73px]">
                        <svg
                            viewBox="0 0 150 73"
                            height="73px"
                            width="150px"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <polyline
                                points="0,45.486 38.514,45.486 44.595,33.324 50.676,45.486 57.771,45.486 62.838,55.622 71.959,9 80.067,63.729 84.122,45.486 97.297,45.486 103.379,40.419 110.473,45.486 150,45.486"
                                strokeMiterlimit="10"
                                strokeWidth="3"
                                stroke="#009B9E"
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
            <div className="max-w-4xl mx-auto py-10 px-6">

                {/* ── ETAPA 1: Selección de categoría ── */}
                {etapa === 'categoria' && (
                    <div>
                        {cargandoAreas ? (
                            <div className="flex justify-center py-12">
                                <div className="w-8 h-8 border-4 border-teal-500 border-t-transparent rounded-full animate-spin"></div>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {categorias.map(categoria => (
                                    <TarjetaCategoria
                                        key={categoria.id_categoria}
                                        categoria={categoria}
                                        seleccionada={data.fk_categoria === categoria.id_categoria}
                                        onClick={() => seleccionarCategoria(categoria.id_categoria)}
                                    />
                                ))}
                            </div>
                        )}
                    </div>
                )}

                {/* ── ETAPA 2: Selección de área ── */}
                {etapa === 'area' && (
                    <div>
                        <div className="mb-8 text-center">
                            <h2 className="text-2xl font-bold text-teal-600 mb-2">¿Cuál es el área responsable del evento?</h2>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                            {areas.map(area => (
                                <TarjetaArea
                                    key={area.id_area}
                                    area={area}
                                    seleccionada={data.fk_area === area.id_area}
                                    onClick={() => seleccionarArea(area.id_area)}
                                />
                            ))}
                        </div>

                        <button
                            type="button"
                            onClick={() => setEtapa('categoria')}
                            className="text-sm text-gray-500 hover:text-teal-600 transition"
                        >
                            ← Volver a categorías
                        </button>
                    </div>
                )}

                {/* ── ETAPA 3: Formulario de 3 pasos ── */}
                {etapa === 'formulario' && (
                    <div>
                        <PasoIndicador pasoActual={paso} />

                        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-8 mb-6">
                            {paso === 1 && <PasoReportante data={data} setData={setData} errors={{ ...errors, ...erroresPaso }} />}
                            {paso === 2 && <PasoPaciente data={data} setData={setData} errors={{ ...errors, ...erroresPaso }} />}
                            {paso === 3 && <PasoEvento data={data} setData={setData} errors={{ ...errors, ...erroresPaso }} />}
                        </div>

                        <div className="flex justify-between">
                            <button
                                type="button"
                                onClick={anterior}
                                className="px-6 py-2.5 text-sm font-semibold text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition"
                            >
                                ← Anterior
                            </button>

                            {paso < 3 ? (
                                <button
                                    type="button"
                                    onClick={siguiente}
                                    className="px-6 py-2.5 text-sm font-semibold text-white bg-teal-500 rounded-lg hover:bg-teal-600 transition"
                                >
                                    Siguiente →
                                </button>
                            ) : (
                                <button
                                    type="button"
                                    onClick={submit}
                                    disabled={processing}
                                    className="px-6 py-2.5 text-sm font-semibold text-white bg-teal-500 rounded-lg hover:bg-teal-600 transition disabled:opacity-50"
                                >
                                    Registrar evento
                                </button>
                            )}
                        </div>
                    </div>
                )}

            </div>
        </AuthenticatedLayout>
    );
}