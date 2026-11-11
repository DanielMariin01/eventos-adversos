<?php

namespace App\Http\Controllers;

use App\Models\Area;
use App\Models\Categoria;
use App\Models\EventoAdverso;
use App\Models\User;
use Inertia\Inertia;

class TecnovigilanciaController extends Controller
{
    private const CATEGORIA = 'Tecnovigilancia';

    // ── Consulta base: solo eventos de la categoría Tecnovigilancia en proceso ──
    private function consulta()
    {
        return EventoAdverso::with(['categoria', 'area', 'reportante', 'paciente', 'tecnovigilancia'])
            ->whereHas('categoria', fn($q) => $q->where('nombre', self::CATEGORIA))
            ->where('estado', 'en_proceso')
            ->orderBy('created_at', 'desc');
    }

    // ── Lista de eventos de tecnovigilancia ──
    public function index()
    {
        return Inertia::render('Tecnovigilancia/Index', [
            'eventos'    => $this->consulta()->paginate(10),
            'categorias' => Categoria::where('activo', 1)->get(),
            'jefes'      => User::role('jefe')->get(['id', 'name']),
            'areas'      => Area::where('activo', 1)->get(['id_area', 'nombre']),
        ]);
    }

    // ── Exportar a Excel (el navegador genera el .xlsx) ──
    public function exportar()
    {
        $datos = $this->consulta()->get()->map(fn($e) => [
            'N° Evento'               => $e->id_eventoAdverso,
            'Fecha Evento'            => $e->fecha_evento?->format('Y-m-d'),
            'Fecha Creación'          => $e->created_at?->format('Y-m-d H:i'),
            'Área'                    => $e->area?->nombre,
            'Estado'                  => $e->estado,
            'Doc Reportante'          => $e->reportante?->cedula,
            'Nombres Reportante'      => trim($e->reportante?->nombres . ' ' . $e->reportante?->apellidos),
            'Cargo Reportante'        => $e->reportante?->cargo,
            'Doc Paciente'            => $e->paciente?->cedula,
            'Nombres Paciente'        => trim($e->paciente?->nombres . ' ' . $e->paciente?->apellidos),
            'Dispositivo'             => $e->tecnovigilancia?->nombre_dispositivo,
            'Marca'                   => $e->tecnovigilancia?->marca,
            'Modelo'                  => $e->tecnovigilancia?->modelo,
            'Serie'                   => $e->tecnovigilancia?->serie,
            'Área de funcionamiento'  => $e->tecnovigilancia?->area_funcionamiento_dm,
            'Uso más de una vez'      => is_null($e->tecnovigilancia) ? null : ($e->tecnovigilancia->uso_mas_de_una_vez ? 'Sí' : 'No'),
            'Detección del evento'    => $e->tecnovigilancia?->deteccion_evento,
            'Clasificación'           => $e->tecnovigilancia?->clasificacion,
            'Desenlace'               => $e->tecnovigilancia?->desenlace,
            'Diagnóstico inicial'     => $e->tecnovigilancia?->diagnostico_inicial,
            'Descripción'             => $e->descripcion,
        ]);

        return response()->json($datos);
    }
}
