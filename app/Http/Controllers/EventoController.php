<?php

namespace App\Http\Controllers;

use App\Models\Area;
use App\Models\Archivo;
use App\Models\Categoria;
use App\Models\EventoAdverso;
use App\Models\Reportante;
use App\Models\Paciente;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use App\Models\Revision;

class EventoController extends Controller
{
    // ── Paso 0: Selección de categoría ──
    public function create()
    {
        $categorias = Categoria::where('activo', 1)->get();

        return Inertia::render('Eventos/Create', [
            'categorias' => $categorias,
        ]);
    }

    // ── Paso 0.5: Selección de área ──
    public function seleccionarArea(Request $request)
    {
        $request->validate([
            'fk_categoria' => 'required|exists:categorias,id_categoria',
        ]);

        $areas = Area::with('jefe')->where('activo', 1)->get();

        return response()->json(['areas' => $areas]);
    }

    // ── Buscar reportante por cédula ──
    public function buscarReportante(string $cedula)
    {
        $reportante = Reportante::where('cedula', $cedula)->first();

        if (!$reportante) return response()->json(null);

        return response()->json([
            'nombres'   => $reportante->nombres,
            'apellidos' => $reportante->apellidos,
            'cargo'     => $reportante->cargo,
            'empresa'   => $reportante->empresa,
        ]);
    }

    // ── Buscar paciente por cédula ──
    public function buscarPaciente(string $cedula)
    {
        $paciente = Paciente::where('cedula', $cedula)->first();

        if (!$paciente) return response()->json(null);

        return response()->json([
            'nombres'     => $paciente->nombres,
            'apellidos'   => $paciente->apellidos,
            'telefono'    => $paciente->telefono,
            'edad'        => $paciente->edad,
            'edad_unidad' => $paciente->edad_unidad,
            'entidad'     => $paciente->entidad,
        ]);
    }

    // ── Guardar evento adverso ──
    public function store(Request $request)
    {
        $request->validate([
            'fk_categoria'    => 'required|exists:categorias,id_categoria',
            'fk_area'         => 'required|exists:areas,id_area',
            'rep_cedula'      => 'required|string|max:20',
            'rep_nombres'     => 'required|string|max:100',
            'rep_apellidos'   => 'required|string|max:100',
            'rep_cargo'       => 'nullable|string|max:100',
            'rep_empresa'     => 'nullable|string|max:100',
            'pac_cedula'      => 'nullable|string|max:20',
            'pac_nombres'     => 'required|string|max:100',
            'pac_apellidos'   => 'required|string|max:100',
            'pac_telefono'    => 'nullable|string|max:20',
            'pac_edad'        => 'nullable|integer|min:0|max:120',
            'pac_edad_unidad' => 'nullable|string|max:10',
            'pac_entidad'     => 'nullable|string|max:100',
            'fecha_evento'    => 'required|date',
            'descripcion'     => 'required|string',
        ]);

        $reportante = Reportante::updateOrCreate(
            ['cedula' => $request->rep_cedula],
            [
                'nombres'   => $request->rep_nombres,
                'apellidos' => $request->rep_apellidos,
                'cargo'     => $request->rep_cargo,
                'empresa'   => $request->rep_empresa,
            ]
        );

        $paciente = Paciente::updateOrCreate(
            ['cedula' => $request->pac_cedula ?? uniqid('pac_')],
            [
                'nombres'     => $request->pac_nombres,
                'apellidos'   => $request->pac_apellidos,
                'telefono'    => $request->pac_telefono,
                'edad'        => $request->pac_edad,
                'edad_unidad' => $request->pac_edad_unidad ?? 'Años',
                'entidad'     => $request->pac_entidad,
            ]
        );

        EventoAdverso::create([
            'fk_categoria'  => $request->fk_categoria,
            'fk_area'       => $request->fk_area,
            'fk_reportante' => $reportante->id_reportante,
            'fk_paciente'   => $paciente->id_paciente,
            'fecha_evento'  => $request->fecha_evento,
            'descripcion'   => $request->descripcion,
            'estado'        => 'en_proceso',
            'fk_usuario'    => Auth::id(),
        ]);

        return redirect()->route('eventos.create')
            ->with('success', '¡Evento adverso reportado correctamente!');
    }

    // ── Lista de eventos (calidad) ──
    public function index()
    {
        $jefes = \App\Models\User::role('jefe')->get(['id', 'name']);
        $eventos = EventoAdverso::with(['categoria', 'area', 'reportante', 'paciente'])
            ->whereIn('estado', ['en_proceso'])
            ->orderBy('created_at', 'desc')
            ->paginate(10);

        $categorias = Categoria::where('activo', 1)->get();

        return Inertia::render('Eventos/Index', [
            'eventos'    => $eventos,
            'categorias' => $categorias,
            'jefes'      => $jefes,
        ]);
    }

    // ── Ver detalle de evento ──
    public function show(EventoAdverso $evento)
    {
        $evento->load(['categoria', 'area', 'reportante', 'paciente', 'usuario', 'archivos']);

        return Inertia::render('Eventos/Show', [
            'evento' => $evento,
        ]);
    }

    // ── Guardar análisis (calidad) ──
    public function guardarAnalisis(Request $request, EventoAdverso $evento)
    {

        $clasificacionesCierre = [
            'Evento adverso no prevenible',
            'Complicación',
            'Atención segura',
        ];

        $nuevoEstado = in_array($request->clasificacion, $clasificacionesCierre)
            ? 'cerrado'
            : 'analizado';


        $request->validate([
            'barreras_vulneradas'    => 'nullable|array',
            'barreras_descripcion'   => 'nullable|string',
            'acciones_inseguras'     => 'nullable|array',
            'acciones_descripcion'   => 'nullable|string',
            'factores_contributivos' => 'nullable|array',
            'factores_descripcion'   => 'nullable|string',
            'descripcion_analisis'   => 'nullable|string',
            'clasificacion'          => 'nullable|string|max:100',
            'relacionado_con'        => 'nullable|string|max:255',
            'categorizacion'         => 'nullable|string|max:100',
            'archivos.*'             => 'nullable|file|mimes:pdf,jpg,jpeg,png|max:10240',
            'fk_jefe' => 'nullable|exists:users,id',
        ]);

        $evento->update([
            'barreras_vulneradas'    => $request->barreras_vulneradas,
            'barreras_descripcion'   => $request->barreras_descripcion,
            'acciones_inseguras'     => $request->acciones_inseguras,
            'acciones_descripcion'   => $request->acciones_descripcion,
            'factores_contributivos' => $request->factores_contributivos,
            'factores_descripcion'   => $request->factores_descripcion,
            'descripcion_analisis'   => $request->descripcion_analisis,
            'clasificacion'          => $request->clasificacion,
            'relacionado_con'        => $request->relacionado_con,
            'categorizacion'         => $request->categorizacion,
            'estado'                 => $nuevoEstado,
            'fk_usuario_calidad' => Auth::id(),
            'fk_jefe' => $request->fk_jefe,
            'fecha_analisis'         => now(),
            'fecha_cierre'           => $nuevoEstado === 'cerrado' ? now() : null,
        ]);
        // Guardar archivos
        if ($request->hasFile('archivos')) {
            foreach ($request->file('archivos') as $file) {
                $ruta = $file->store('eventos/calidad', 'public');
                Archivo::create([
                    'fk_evento'  => $evento->id_eventoAdverso,
                    'fk_usuario' => Auth::id(),
                    'tipo'       => 'calidad',
                    'nombre'     => $file->getClientOriginalName(),
                    'ruta'       => $ruta,
                    'extension'  => $file->getClientOriginalExtension(),
                ]);
            }
        }

        // Registrar revisión si el evento se cerró automáticamente
        if ($nuevoEstado === 'cerrado') {
            Revision::create([
                'fk_evento'   => $evento->id_eventoAdverso,
                'fk_usuario'  => Auth::id(),
                'tipo'        => 'Cierre Automático',
                'observacion' => 'El evento N° ' . $evento->id_eventoAdverso . ' fue cerrado automáticamente por clasificación: ' . $request->clasificacion,
            ]);
        }

        return redirect()->route('eventos.index')
            ->with('success', 'Análisis guardado correctamente.');
    }

    // ── Cerrar análisis ──
    public function cerrarAnalisis(EventoAdverso $evento)
    {
        $evento->update([
            'estado'       => 'procesado',
            'fecha_cierre' => now(),
        ]);

        return redirect()->route('eventos.index')
            ->with('success', 'Evento cerrado correctamente.');
    }

    // ── Cancelar evento ──
    public function cancelarEvento(Request $request, EventoAdverso $evento)
    {
        $request->validate([
            'observacion_cancelacion' => 'required|string',
            'fk_jefe'                 => 'nullable|exists:users,id',
        ]);

        $evento->update([
            'estado'                  => 'cancelado',
            'observacion_cancelacion' => $request->observacion_cancelacion,
            'fk_jefe'                 => $request->fk_jefe,
        ]);

        Revision::create([
            'fk_evento'   => $evento->id_eventoAdverso,
            'fk_usuario'  => Auth::id(),
            'tipo'        => 'Cancelación de Evento',
            'observacion' => 'El evento N° ' . $evento->id_eventoAdverso . ' fue cancelado. Motivo: ' . $request->observacion_cancelacion,
        ]);

        return redirect()->route('eventos.index')
            ->with('success', 'Evento cancelado correctamente.');
    }

    // ── Cambiar tipo de evento ──
    public function cambiarTipo(Request $request, EventoAdverso $evento)
    {
        $request->validate([
            'fk_categoria' => 'required|exists:categorias,id_categoria',
            'observacion'  => 'nullable|string',
        ]);

        $evento->update([
            'fk_categoria'    => $request->fk_categoria,
            'observacion_tipo' => $request->observacion,
        ]);

        return redirect()->route('eventos.index')
            ->with('success', 'Tipo de evento actualizado correctamente.');
    }

    // ── Eventos del jefe ──
    // ── Eventos del jefe ──
    public function misEventos()
    {
        $user = Auth::user();

        $eventos = EventoAdverso::with([
            'categoria',
            'area',
            'reportante',
            'paciente',
            'planMejora.jefe',
            'archivos',
            'revisiones.usuario',
        ])
            ->whereIn('estado', ['en_mejora', 'radicado', 'cerrado', 'cancelado'])
            ->where(function ($q) use ($user) {
                $q->whereHas('area', fn($q) => $q->where('fk_jefe', $user->id))
                    ->orWhere('fk_jefe', $user->id);
            })
            ->orderBy('created_at', 'desc')
            ->paginate(10);

        // Eventos próximos a vencer (plan con fecha ejecución en los próximos 7 días)
        $proximosVencer = EventoAdverso::with(['area', 'planMejora'])
            ->where('estado', 'en_mejora')
            ->where(function ($q) use ($user) {
                $q->whereHas('area', fn($q) => $q->where('fk_jefe', $user->id))
                    ->orWhere('fk_jefe', $user->id);
            })
            ->whereHas(
                'planMejora',
                fn($q) => $q
                    ->where('fecha_ejecucion', '<=', now()->addDays(7))
                    ->where('fecha_ejecucion', '>=', now())
                    ->where('estado', 'en_proceso')
            )
            ->get();

        // Eventos vencidos
        $vencidos = EventoAdverso::with(['area', 'planMejora'])
            ->where('estado', 'en_mejora')
            ->where(function ($q) use ($user) {
                $q->whereHas('area', fn($q) => $q->where('fk_jefe', $user->id))
                    ->orWhere('fk_jefe', $user->id);
            })
            ->whereHas(
                'planMejora',
                fn($q) => $q
                    ->where('fecha_ejecucion', '<', now())
                    ->where('estado', 'en_proceso')
            )
            ->get();

        return Inertia::render('Eventos/MisEventos', [
            'eventos'        => $eventos,
            'proximosVencer' => $proximosVencer,
            'vencidos'       => $vencidos,
        ]);
    }
    // ── Subir evidencia jefe ──
    public function subirEvidencia(Request $request, EventoAdverso $evento)
    {
        $request->validate([
            'archivos.*' => 'required|file|mimes:pdf,jpg,jpeg,png|max:10240',
        ]);

        if ($request->hasFile('archivos')) {
            foreach ($request->file('archivos') as $file) {
                $ruta = $file->store('eventos/jefe', 'public');
                Archivo::create([
                    'fk_evento'  => $evento->id_eventoAdverso,
                    'fk_usuario' => Auth::id(),
                    'tipo'       => 'jefe',
                    'nombre'     => $file->getClientOriginalName(),
                    'ruta'       => $ruta,
                    'extension'  => $file->getClientOriginalExtension(),
                ]);
            }
        }

        // Cambiar estado del evento a radicado
        $evento->update(['estado' => 'radicado']);

        // Cambiar estado del plan de mejora a radicado
        if ($evento->planMejora) {
            $evento->planMejora->update(['estado' => 'radicado']);
        }

        // Registrar revisión
        Revision::create([
            'fk_evento'   => $evento->id_eventoAdverso,
            'fk_usuario'  => Auth::id(),
            'tipo'        => 'Evidencia Plan de Mejora',
            'observacion' => 'El jefe subió evidencia del plan de mejora del evento N° ' . $evento->id_eventoAdverso . ' el ' . now()->format('Y-m-d') . ' a las ' . now()->format('H:i'),
        ]);

        return redirect()->back()
            ->with('success', 'Evidencia subida correctamente.');
    }
    public function cancelados()
    {
        $eventos = EventoAdverso::with([
            'categoria',
            'area',
            'reportante',
            'paciente',
            'revisiones.usuario',
            'usuarioCalidad',
        ])
            ->where('estado', 'cancelado')
            ->orderBy('created_at', 'desc')
            ->paginate(10);

        return Inertia::render('Eventos/Cancelados', [
            'eventos' => $eventos,
        ]);
    }

    public function reabrir(EventoAdverso $evento)
    {
        $evento->update(['estado' => 'en_proceso']);

        Revision::create([
            'fk_evento'   => $evento->id_eventoAdverso,
            'fk_usuario'  => Auth::id(),
            'tipo'        => 'Reapertura de Evento',
            'observacion' => 'Se reabrió el evento N° ' . $evento->id_eventoAdverso . ' el ' . now()->format('Y-m-d') . ' a las ' . now()->format('H:i'),
        ]);

        return redirect()->route('eventos.cancelados')
            ->with('success', 'Evento reabierto correctamente.');
    }


    public function exportar()
    {
        $eventos = EventoAdverso::with(['categoria', 'area', 'reportante', 'paciente'])
            ->whereIn('estado', ['en_proceso'])
            ->orderBy('created_at', 'desc')
            ->get();

        $datos = $eventos->map(fn($e) => [
            'N° Evento'          => $e->id_eventoAdverso,
            'Fecha Evento'       => $e->fecha_evento?->format('Y-m-d'),
            'Fecha Creación'     => $e->created_at?->format('Y-m-d H:i'),
            'Categoría'          => $e->categoria?->nombre,
            'Área'               => $e->area?->nombre,
            'Estado'             => $e->estado,
            'Doc Reportante'     => $e->reportante?->cedula,
            'Nombres Reportante' => $e->reportante?->nombres . ' ' . $e->reportante?->apellidos,
            'Cargo Reportante'   => $e->reportante?->cargo,
            'Empresa Reportante' => $e->reportante?->empresa,
            'Doc Paciente'       => $e->paciente?->cedula,
            'Nombres Paciente'   => $e->paciente?->nombres . ' ' . $e->paciente?->apellidos,
            'Edad Paciente'      => $e->paciente?->edad . ' ' . $e->paciente?->edad_unidad,
            'Entidad Paciente'   => $e->paciente?->entidad,
            'Descripción'        => $e->descripcion,
        ]);

        return response()->json($datos);
    }
}
