<?php

namespace App\Http\Controllers;

use App\Models\Area;
use App\Models\Categoria;
use App\Models\EventoAdverso;
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

    // ── Guardar evento adverso ──
    public function store(Request $request)
    {
        $request->validate([
            // Categoría y área
            'fk_categoria'           => 'required|exists:categorias,id_categoria',
            'fk_area'                => 'required|exists:areas,id_area',

            // Reportante
            'rep_cedula'             => 'required|string|max:20',
            'rep_nombres'            => 'required|string|max:100',
            'rep_apellidos'          => 'required|string|max:100',
            'rep_cargo'              => 'nullable|string|max:100',
            'rep_empresa'            => 'nullable|string|max:100',

            // Paciente
            'pac_cedula'             => 'nullable|string|max:20',
            'pac_nombres'            => 'nullable|string|max:100',
            'pac_apellidos'          => 'nullable|string|max:100',
            'pac_telefono'           => 'nullable|string|max:20',
            'pac_edad'               => 'nullable|integer|min:0|max:120',
            'pac_entidad'            => 'nullable|string|max:100',

            // Evento
            'fecha_evento'           => 'required|date',
            'descripcion'            => 'required|string',
            'barreras_vulneradas'    => 'nullable|array',
            'factores_contributivos' => 'nullable|array',
            'acciones_inseguras'     => 'nullable|array',
            'clasificacion'          => 'nullable|string|max:100',
            'relacionado_con'        => 'nullable|string|max:255',
            'categorizacion'         => 'nullable|string|max:100',
        ]);

        EventoAdverso::create([
            ...$request->only([
                'fk_categoria',
                'fk_area',
                'rep_cedula',
                'rep_nombres',
                'rep_apellidos',
                'rep_cargo',
                'rep_empresa',
                'pac_cedula',
                'pac_nombres',
                'pac_apellidos',
                'pac_telefono',
                'pac_edad',
                'pac_entidad',
                'fecha_evento',
                'descripcion',
                'barreras_vulneradas',
                'factores_contributivos',
                'acciones_inseguras',
                'clasificacion',
                'relacionado_con',
                'categorizacion',
            ]),
            'estado'     => 'en_proceso',
            'fk_usuario' => Auth::id(),
        ]);

        return redirect()->route('eventos.create')
            ->with('success', '¡Evento adverso reportado correctamente!');
    }

    // ── Lista de eventos (calidad) ──
    public function index()
    {
        $eventos = EventoAdverso::with(['categoria', 'area', 'usuario'])
            ->orderBy('created_at', 'desc')
            ->paginate(10);

        return Inertia::render('Eventos/Index', [
            'eventos' => $eventos,
        ]);
    }

    // ── Ver detalle de evento ──
    public function show(EventoAdverso $evento)
    {
        $evento->load(['categoria', 'area', 'usuario']);

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

        $eventos = EventoAdverso::with(['categoria', 'area'])
            ->whereIn('fk_area', $areas)
            ->orderBy('created_at', 'desc')
            ->paginate(10);

        return Inertia::render('Eventos/MisEventos', [
            'eventos' => $eventos,
        ]);
    }
}
