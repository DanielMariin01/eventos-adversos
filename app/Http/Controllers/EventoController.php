<?php

namespace App\Http\Controllers;

use App\Models\Area;
use App\Models\Categoria;
use App\Models\EventoAdverso;
use App\Models\Reportante;
use App\Models\Paciente;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

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

        $areas = Area::where('activo', 1)->get();

        return response()->json(['areas' => $areas]);
    }

    // ── Buscar reportante por cédula ──
    public function buscarReportante(string $cedula)
    {
        $reportante = Reportante::where('cedula', $cedula)->first();

        if (!$reportante) {
            return response()->json(null);
        }

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

        if (!$paciente) {
            return response()->json(null);
        }

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
            'fk_categoria'  => 'required|exists:categorias,id_categoria',
            'fk_area'       => 'required|exists:areas,id_area',

            // Reportante
            'rep_cedula'    => 'required|string|max:20',
            'rep_nombres'   => 'required|string|max:100',
            'rep_apellidos' => 'required|string|max:100',
            'rep_cargo'     => 'nullable|string|max:100',
            'rep_empresa'   => 'nullable|string|max:100',

            // Paciente
            'pac_cedula'    => 'nullable|string|max:20',
            'pac_nombres'   => 'required|string|max:100',
            'pac_apellidos' => 'required|string|max:100',
            'pac_telefono'  => 'nullable|string|max:20',
            'pac_edad'      => 'nullable|integer|min:0|max:120',
            'pac_edad_unidad' => 'nullable|string|max:10',
            'pac_entidad'   => 'nullable|string|max:100',

            // Evento
            'fecha_evento'  => 'required|date',
            'descripcion'   => 'required|string',
        ]);

        // Crear o actualizar reportante
        $reportante = Reportante::updateOrCreate(
            ['cedula' => $request->rep_cedula],
            [
                'nombres'   => $request->rep_nombres,
                'apellidos' => $request->rep_apellidos,
                'cargo'     => $request->rep_cargo,
                'empresa'   => $request->rep_empresa,
            ]
        );

        // Crear o actualizar paciente
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

        // Guardar evento adverso
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
        $eventos = EventoAdverso::with(['categoria', 'area', 'reportante', 'paciente', 'usuario'])
            ->orderBy('created_at', 'desc')
            ->paginate(10);

        return Inertia::render('Eventos/Index', [
            'eventos' => $eventos,
        ]);
    }

    // ── Ver detalle de evento ──
    public function show(EventoAdverso $evento)
    {
        $evento->load(['categoria', 'area', 'reportante', 'paciente', 'usuario']);

        return Inertia::render('Eventos/Show', [
            'evento' => $evento,
        ]);
    }

    // ── Actualizar estado (calidad) ──
    public function actualizarEstado(Request $request, EventoAdverso $evento)
    {
        $request->validate([
            'estado' => 'required|in:en_proceso,analizado,procesado',
        ]);

        $evento->update(['estado' => $request->estado]);

        return redirect()->back()
            ->with('success', 'Estado actualizado correctamente.');
    }

    // ── Eventos del jefe ──
    public function misEventos()
    {
        $user  = Auth::user();
        $areas = Area::where('responsable', $user->name)->pluck('id_area');

        $eventos = EventoAdverso::with(['categoria', 'area', 'reportante', 'paciente'])
            ->whereIn('fk_area', $areas)
            ->orderBy('created_at', 'desc')
            ->paginate(10);

        return Inertia::render('Eventos/MisEventos', [
            'eventos' => $eventos,
        ]);
    }
}
