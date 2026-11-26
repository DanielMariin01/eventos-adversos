<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Concerns\BuscaEventos;
use App\Models\Area;
use App\Models\Categoria;
use App\Models\EventoAdverso;
use Illuminate\Http\Request;
use Inertia\Inertia;

// Menú Implantables: no tiene análisis. Solo se ven los datos del implantable y se puede
// cambiar el tipo y el área del evento (con las rutas eventos.tipo y eventos.cambiarArea).
class ImplantablesController extends Controller
{
    use BuscaEventos;

    private const CATEGORIA = 'Implantables';

    // ── Consulta base: solo eventos de la categoría Implantables en proceso ──
    private function consulta()
    {
        return EventoAdverso::with(['categoria', 'area', 'reportante', 'paciente', 'implantable'])
            ->whereHas('categoria', fn($q) => $q->where('nombre', self::CATEGORIA))
            ->where('estado', 'en_proceso')
            ->orderBy('created_at', 'desc');
    }

    // ── Lista de eventos de implantables ──
    public function index(Request $request)
    {
        return Inertia::render('Implantables/Index', [
            'eventos'    => $this->aplicarBusqueda($this->consulta(), $request)->paginate(10)->withQueryString(),
            'categorias' => Categoria::where('activo', 1)->get(),
            'areas'      => Area::where('activo', 1)->get(['id_area', 'nombre']),
            'filtros'    => $this->filtrosBusqueda($request),
        ]);
    }

    // ── Exportar a Excel (el navegador genera el .xlsx) ──
    public function exportar()
    {
        $datos = $this->consulta()->get()->map(fn($e) => [
            'N° Evento'            => $e->id_eventoAdverso,
            'Fecha Evento'         => $e->fecha_evento?->format('Y-m-d'),
            'Fecha Creación'       => $e->created_at?->format('Y-m-d H:i'),
            'Área'                 => $e->area?->nombre,
            'Estado'               => $e->estado,
            'Doc Reportante'       => $e->reportante?->cedula,
            'Nombres Reportante'   => trim($e->reportante?->nombres . ' ' . $e->reportante?->apellidos),
            'Cargo Reportante'     => $e->reportante?->cargo,
            'Doc Paciente'         => $e->paciente?->cedula,
            'Nombres Paciente'     => trim($e->paciente?->nombres . ' ' . $e->paciente?->apellidos),
            'Procedimiento CX'     => $e->implantable?->procedimiento_cx,
            'Cirujano'             => $e->implantable?->nombre_cirujano,
            'Especialidad'         => $e->implantable?->especialidad,
            'Descripción material' => $e->implantable?->descripcion_material,
            'Marca'                => $e->implantable?->marca,
            'Registro INVIMA'      => $e->implantable?->registro_invima,
            'Serie'                => $e->implantable?->serie,
            'Lote'                 => $e->implantable?->lote,
            'Fecha vencimiento'    => $e->implantable?->fecha_vencimiento?->format('Y-m-d'),
            'Funcionario que reporta' => $e->implantable?->nombre_funcionario_reporta,
            'Descripción'          => $e->descripcion,
        ]);

        return response()->json($datos);
    }
}
