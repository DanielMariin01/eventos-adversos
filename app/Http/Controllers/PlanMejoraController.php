<?php

namespace App\Http\Controllers;

use App\Models\Archivo;
use App\Models\EventoAdverso;
use App\Models\PlanMejora;
use App\Models\Revision;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;


class PlanMejoraController extends Controller
{
    // ── Lista de eventos analizado y en_mejora ──
    public function index()
    {
        $eventos = EventoAdverso::with([
            'categoria',
            'area.jefe',
            'reportante',
            'paciente',
            'planMejora.jefe',
            'archivos',
            'revisiones.usuario',
        ])
            ->whereIn('estado', ['analizado', 'en_mejora', 'radicado', 'cerrado', 'procesado'])
            ->orderBy('created_at', 'desc')
            ->paginate(10);
        $jefes = User::role('jefe')->get(['id', 'name']);

        return Inertia::render('Mejoras/Index', [
            'eventos' => $eventos,
            'jefes'   => $jefes,
        ]);
    }

    // ── Crear plan de mejora ──
    public function store(Request $request, EventoAdverso $evento)
    {
        $request->validate([
            'descripcion'     => 'required|string',
            'fecha_ejecucion' => 'required|date',
            'fk_jefe'         => 'required|exists:users,id',
            'archivo'         => 'nullable|file|mimes:pdf,jpg,jpeg,png|max:10240',
        ]);

        // Crear plan de mejora
        $plan = PlanMejora::create([
            'fk_evento'       => $evento->id_eventoAdverso,
            'fk_usuario'      => Auth::id(),
            'fk_jefe'         => $request->fk_jefe,
            'descripcion'     => $request->descripcion,
            'fecha_ejecucion' => $request->fecha_ejecucion,
            'estado'          => 'en_proceso',
        ]);

        // Guardar archivo si existe
        if ($request->hasFile('archivo')) {
            $file = $request->file('archivo');
            $ruta = $file->store('mejoras', 'public');
            Archivo::create([
                'fk_evento'  => $evento->id_eventoAdverso,
                'fk_usuario' => Auth::id(),
                'tipo'       => 'calidad',
                'nombre'     => $file->getClientOriginalName(),
                'ruta'       => $ruta,
                'extension'  => $file->getClientOriginalExtension(),
            ]);
        }

        // Cambiar estado del evento a en_mejora
        $evento->update(['estado' => 'en_mejora']);

        // Guardar revisión
        Revision::create([
            'fk_evento'   => $evento->id_eventoAdverso,
            'fk_usuario'  => Auth::id(),
            'tipo'        => 'Plan de Mejora',
            'observacion' => 'Se creó el plan de mejora para el evento N° ' . $evento->id_eventoAdverso,
        ]);

        return redirect()->route('mejoras.index')
            ->with('success', 'Plan de mejora creado correctamente.');
    }

    // ── Ver revisiones del evento ──
    public function revisiones(EventoAdverso $evento)
    {
        $revisiones = Revision::with('usuario')
            ->where('fk_evento', $evento->id_eventoAdverso)
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json($revisiones);
    }

    public function update(Request $request, PlanMejora $plan)
    {
        $request->validate([
            'descripcion'     => 'required|string',
            'fecha_ejecucion' => 'required|date',
            'fk_jefe'         => 'required|exists:users,id',
            'archivo'         => 'nullable|file|mimes:pdf,jpg,jpeg,png|max:10240',
        ]);

        $plan->update([
            'descripcion'     => $request->descripcion,
            'fecha_ejecucion' => $request->fecha_ejecucion,
            'fk_jefe'         => $request->fk_jefe,
        ]);

        // Registrar revisión
        Revision::create([
            'fk_evento'  => $plan->fk_evento,
            'fk_usuario' => Auth::id(),
            'tipo'       => 'Edición Plan de Mejora',
            'observacion' => 'Se editó el plan de mejora del evento N° ' . $plan->fk_evento . ' el ' . now()->format('Y-m-d') . ' a las ' . now()->format('H:i'),
        ]);

        if ($request->hasFile('archivo')) {
            $file = $request->file('archivo');
            $ruta = $file->store('mejoras', 'public');
            Archivo::create([
                'fk_evento'  => $plan->fk_evento,
                'fk_usuario' => Auth::id(),
                'tipo'       => 'calidad',
                'nombre'     => $file->getClientOriginalName(),
                'ruta'       => $ruta,
                'extension'  => $file->getClientOriginalExtension(),
            ]);
        }

        return redirect()->route('mejoras.index')
            ->with('success', 'Plan de mejora actualizado correctamente.');
    }

    public function cerrarCaso(EventoAdverso $evento)
    {
        if ($evento->estado !== 'radicado') {
            return redirect()->back()
                ->with('error', 'Solo se pueden cerrar eventos con estado Radicado.');
        }

        $evento->update([
            'estado'       => 'cerrado',
            'fecha_cierre' => now(),
        ]);

        // Registrar revisión
        \App\Models\Revision::create([
            'fk_evento'   => $evento->id_eventoAdverso,
            'fk_usuario'  => Auth::id(),
            'tipo'        => 'Cierre de Caso',
            'observacion' => 'Se cerró el caso del evento N° ' . $evento->id_eventoAdverso . ' el ' . now()->format('Y-m-d') . ' a las ' . now()->format('H:i'),
        ]);

        return redirect()->route('mejoras.index')
            ->with('success', 'Caso cerrado correctamente.');
    }


    public function exportar()
    {
        $eventos = EventoAdverso::with([
            'categoria',
            'area',
            'reportante',
            'paciente',
            'planMejora.jefe',
            'usuarioCalidad',
        ])
            ->whereIn('estado', ['analizado', 'en_mejora', 'radicado', 'cerrado', 'procesado'])
            ->orderBy('created_at', 'desc')
            ->get();

        $datos = $eventos->map(fn($e) => [
            // Datos generales
            'N° Evento'              => $e->id_eventoAdverso,
            'Fecha Evento'           => $e->fecha_evento?->format('Y-m-d'),
            'Fecha Creación'         => $e->created_at?->format('Y-m-d H:i'),
            'Categoría'              => $e->categoria?->nombre,
            'Área'                   => $e->area?->nombre,
            'Estado Evento'          => $e->estado,

            // Reportante
            'Doc Reportante'         => $e->reportante?->cedula,
            'Nombres Reportante'     => $e->reportante?->nombres . ' ' . $e->reportante?->apellidos,
            'Cargo Reportante'       => $e->reportante?->cargo,
            'Empresa Reportante'     => $e->reportante?->empresa,

            // Paciente
            'Doc Paciente'           => $e->paciente?->cedula,
            'Nombres Paciente'       => $e->paciente?->nombres . ' ' . $e->paciente?->apellidos,
            'Edad Paciente'          => $e->paciente?->edad . ' ' . $e->paciente?->edad_unidad,
            'Entidad Paciente'       => $e->paciente?->entidad,

            // Descripción del evento
            'Descripción Evento'     => $e->descripcion,

            // Análisis
            'Barreras Vulneradas'    => is_array($e->barreras_vulneradas)
                ? implode(', ', $e->barreras_vulneradas)
                : $e->barreras_vulneradas,
            'Descripción Barreras'   => $e->barreras_descripcion,
            'Acciones Inseguras'     => is_array($e->acciones_inseguras)
                ? implode(', ', $e->acciones_inseguras)
                : $e->acciones_inseguras,
            'Descripción Acciones'   => $e->acciones_descripcion,
            'Factores Contributivos' => is_array($e->factores_contributivos)
                ? implode(', ', array_keys($e->factores_contributivos))
                : $e->factores_contributivos,
            'Descripción Análisis'   => $e->descripcion_analisis,
            'Clasificación'          => $e->clasificacion,
            'Relacionado Con'        => $e->relacionado_con,
            'Categorización'         => $e->categorizacion,
            'Analizado Por'          => $e->usuarioCalidad?->name,
            'Fecha Análisis'         => $e->fecha_analisis?->format('Y-m-d H:i'),

            // Plan de mejora
            'Jefe Responsable'       => $e->planMejora?->jefe?->name,
            'Descripción Plan'       => strip_tags($e->planMejora?->descripcion ?? ''),
            'Fecha Ejecución'        => $e->planMejora?->fecha_ejecucion?->format('Y-m-d'),
            'Estado Plan'            => $e->planMejora?->estado,
            'Fecha Cierre'           => $e->fecha_cierre?->format('Y-m-d H:i'),
        ]);

        return response()->json($datos);
    }
}
