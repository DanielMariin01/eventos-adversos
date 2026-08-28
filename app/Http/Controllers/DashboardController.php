<?php

namespace App\Http\Controllers;

use App\Models\Area;
use App\Models\Categoria;
use App\Models\EventoAdverso;
use App\Models\PlanMejora;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function index(Request $request)
    {
        $anio    = $request->get('anio', now()->year);
        $periodo = $request->get('periodo', 'anual');

        // ── Query base con filtros ──
        $query = EventoAdverso::whereYear('created_at', $anio);

        if ($periodo === 'trimestral') {
            $trimestre = (int) $request->get('trimestre', ceil(now()->month / 3));
            $mesInicio = ($trimestre - 1) * 3 + 1;
            $mesFin    = $trimestre * 3;
            $fechaInicio = \Carbon\Carbon::create($anio, $mesInicio, 1)->startOfMonth();
            $fechaFin    = \Carbon\Carbon::create($anio, $mesFin, 1)->endOfMonth();
            $query->whereBetween('created_at', [$fechaInicio, $fechaFin]);
        } elseif ($periodo === 'semestral') {
            $semestre    = (int) $request->get('semestre', now()->month <= 6 ? 1 : 2);
            $mesInicio   = $semestre === 1 ? 1 : 7;
            $mesFin      = $semestre === 1 ? 6 : 12;
            $fechaInicio = \Carbon\Carbon::create($anio, $mesInicio, 1)->startOfMonth();
            $fechaFin    = \Carbon\Carbon::create($anio, $mesFin, 1)->endOfMonth();
            $query->whereBetween('created_at', [$fechaInicio, $fechaFin]);
        }

        // ── Total general (filtrado) ──
        $totalEventos = (clone $query)->count();

        // ── Porcentajes de avance (filtrado) ──
        $revisados  = (clone $query)->whereIn('estado', ['analizado', 'en_mejora', 'radicado', 'cerrado'])->count();
        $tramitados = (clone $query)->whereIn('estado', ['radicado', 'cerrado'])->count();
        $cancelados = (clone $query)->where('estado', 'cancelado')->count();

        $porcentajeRevisados  = $totalEventos > 0 ? round(($revisados / $totalEventos) * 100, 1) : 0;
        $porcentajeTramitados = $totalEventos > 0 ? round(($tramitados / $totalEventos) * 100, 1) : 0;
        $porcentajeCancelados = $totalEventos > 0 ? round(($cancelados / $totalEventos) * 100, 1) : 0;

        // ── Totales por estado (filtrado) ──
        $totalesPorEstado = (clone $query)
            ->select('estado', DB::raw('count(*) as total'))
            ->when($request->get('categoria_estado'), fn($q, $cat) => $q->where('fk_categoria', $cat))
            ->groupBy('estado')
            ->pluck('total', 'estado');

        // ── Eventos del mes actual vs mes anterior ──
        $ahora       = now();
        $mesActual   = EventoAdverso::whereMonth('created_at', $ahora->month)
            ->whereYear('created_at', $ahora->year)->count();
        $mesAnterior = EventoAdverso::whereMonth('created_at', $ahora->copy()->subMonth()->month)
            ->whereYear('created_at', $ahora->copy()->subMonth()->year)->count();

        // ── Eventos por categoría ──
        $porCategoria = EventoAdverso::select('fk_categoria', DB::raw('count(*) as total'))
            ->with('categoria')->groupBy('fk_categoria')->get()
            ->map(fn($e) => ['nombre' => $e->categoria->nombre ?? 'Sin categoría', 'total' => $e->total]);

        // ── Eventos por área ──
        $porArea = EventoAdverso::select('fk_area', DB::raw('count(*) as total'))
            ->with('area')->groupBy('fk_area')->orderByDesc('total')->limit(8)->get()
            ->map(fn($e) => ['nombre' => $e->area->nombre ?? 'Sin área', 'total' => $e->total]);

        // ── Eventos por mes filtrado ──
        $porMes = (clone $query)->select(
            'fk_area',
            'fk_categoria',
            DB::raw('MONTH(created_at) as mes'),
            DB::raw('YEAR(created_at) as anio'),
            DB::raw('count(*) as total')
        )->groupBy('fk_area', 'fk_categoria', 'anio', 'mes')
            ->orderBy('anio')->orderBy('mes')->get();

        // ── Eventos por categoría y mes ──
        $porCategoriaMes = (clone $query)->select(
            'fk_categoria',
            DB::raw('MONTH(created_at) as mes'),
            DB::raw('YEAR(created_at) as anio'),
            DB::raw('count(*) as total')
        )->groupBy('fk_categoria', 'anio', 'mes')
            ->orderBy('anio')->orderBy('mes')->get();

        // ── Eventos por área y mes ──
        $porAreaMes = (clone $query)->select(
            'fk_area',
            'fk_categoria',
            'relacionado_con',
            DB::raw('MONTH(created_at) as mes'),
            DB::raw('YEAR(created_at) as anio'),
            DB::raw('count(*) as total')
        )->groupBy('fk_area', 'fk_categoria', 'relacionado_con', 'anio', 'mes')
            ->orderBy('anio')->orderBy('mes')->get();

        // ── Planes de mejora por estado ──
        $planesPorEstado = PlanMejora::select('estado', DB::raw('count(*) as total'))
            ->whereHas('evento', function ($q) use ($query) {
                $q->whereIn('id_eventoAdverso', (clone $query)->select('id_eventoAdverso'));
            })
            ->groupBy('estado')->pluck('total', 'estado');

        // ── Planes vencidos ──
        $planesVencidos = PlanMejora::where('fecha_ejecucion', '<', now())
            ->where('estado', 'en_proceso')->count();

        // ── Clasificación por mes ──
        $porClasificacionMes = (clone $query)->select(
            'clasificacion',
            'fk_area',
            'fk_categoria',
            DB::raw('MONTH(created_at) as mes'),
            DB::raw('YEAR(created_at) as anio'),
            DB::raw('count(*) as total')
        )->whereNotNull('clasificacion')
            ->groupBy('clasificacion', 'fk_area', 'fk_categoria', 'anio', 'mes')
            ->orderBy('mes')->get();

        $mesesNombres    = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
        $mesesConDatos   = $porClasificacionMes->pluck('mes')->unique()->sort()->values();
        $clasificaciones = $porClasificacionMes->pluck('clasificacion')->unique()->values();

        $datosClasificacion = $mesesConDatos->map(function ($mes) use ($porClasificacionMes, $mesesNombres, $clasificaciones) {
            $fila = ['mes' => $mesesNombres[$mes - 1]];
            foreach ($clasificaciones as $cls) {
                $fila[$cls] = $porClasificacionMes->where('mes', $mes)->where('clasificacion', $cls)->sum('total');
            }
            return $fila;
        })->filter(fn($f) => collect($f)->except('mes')->sum() > 0)->values();

        // ── Eventos por relación ──
        $porRelacion = (clone $query)->select(
            'relacionado_con',
            'fk_area',
            'fk_categoria',
            DB::raw('MONTH(created_at) as mes'),
            DB::raw('YEAR(created_at) as anio'),
            DB::raw('count(*) as total')
        )->whereNotNull('relacionado_con')
            ->groupBy('relacionado_con', 'fk_area', 'fk_categoria', 'anio', 'mes')
            ->orderBy('mes')->get();

        // ── Relaciones específicas ──
        $relacionesEspecificas = ['Caídas intrainstitucionales', 'Ulceras por presión'];
        $porRelacionMes = (clone $query)->select(
            'relacionado_con',
            'fk_area',
            'fk_categoria',
            DB::raw('MONTH(created_at) as mes'),
            DB::raw('YEAR(created_at) as anio'),
            DB::raw('count(*) as total')
        )->whereIn('relacionado_con', $relacionesEspecificas)
            ->groupBy('relacionado_con', 'fk_area', 'fk_categoria', 'anio', 'mes')
            ->orderBy('mes')->get();

        // ── Detalle revisados ──
        $detalleRevisados = [
            'analizado'       => (clone $query)->where('estado', 'analizado')->count(),
            'en_mejora'       => (clone $query)->where('estado', 'en_mejora')->count(),
            'radicado'        => (clone $query)->where('estado', 'radicado')->count(),
            'cerrado'         => (clone $query)->where('estado', 'cerrado')->count(),
            'jefes_en_mejora' => (clone $query)->select(
                'fk_jefe',
                DB::raw('count(*) as total'),
                DB::raw('GROUP_CONCAT(id_eventoAdverso) as eventos')
            )
                ->with('jefe')->where('estado', 'en_mejora')->whereNotNull('fk_jefe')
                ->groupBy('fk_jefe')->get()
                ->map(fn($e) => [
                    'nombre'  => $e->jefe?->name,
                    'total'   => $e->total,
                    'eventos' => $e->eventos,
                ]),
            'jefes_radicado' => (clone $query)->select(
                'fk_jefe',
                DB::raw('count(*) as total'),
                DB::raw('GROUP_CONCAT(id_eventoAdverso) as eventos')
            )
                ->with('jefe')->where('estado', 'radicado')->whereNotNull('fk_jefe')
                ->groupBy('fk_jefe')->get()
                ->map(fn($e) => [
                    'nombre'  => $e->jefe?->name,
                    'total'   => $e->total,
                    'eventos' => $e->eventos,
                ]),
            'porCategoria'    => (clone $query)->select('fk_categoria', DB::raw('count(*) as total'))
                ->with('categoria')->whereIn('estado', ['analizado', 'en_mejora', 'radicado', 'cerrado'])
                ->groupBy('fk_categoria')->get()
                ->map(fn($e) => ['nombre' => $e->categoria?->nombre, 'total' => $e->total]),
            'porArea'         => (clone $query)->select('fk_area', DB::raw('count(*) as total'))
                ->with('area')->whereIn('estado', ['analizado', 'en_mejora', 'radicado', 'cerrado'])
                ->groupBy('fk_area')->get()
                ->map(fn($e) => ['nombre' => $e->area?->nombre, 'total' => $e->total]),
        ];

        // ── Detalle tramitados ──
        $detalleTramitados = [
            'radicado'       => (clone $query)->where('estado', 'radicado')->count(),
            'cerrado'        => (clone $query)->where('estado', 'cerrado')->count(),
            'tiempoPromedio' => round((clone $query)->whereIn('estado', ['radicado', 'cerrado'])
                ->whereNotNull('fecha_cierre')->get()
                ->avg(fn($e) => $e->created_at->diffInDays($e->fecha_cierre)), 1),
            'porJefe'        => (clone $query)->select('fk_jefe', DB::raw('count(*) as total'))
                ->with('jefe')->whereIn('estado', ['radicado', 'cerrado'])->whereNotNull('fk_jefe')
                ->groupBy('fk_jefe')->get()
                ->map(fn($e) => ['nombre' => $e->jefe?->name, 'total' => $e->total]),
        ];

        // ── Detalle cancelados ──
        $detalleCancelados = [
            'total'        => (clone $query)->where('estado', 'cancelado')->count(),
            'porArea'      => (clone $query)->select('fk_area', DB::raw('count(*) as total'))
                ->with('area')->where('estado', 'cancelado')->groupBy('fk_area')->get()
                ->map(fn($e) => ['nombre' => $e->area?->nombre, 'total' => $e->total]),
            'porCategoria' => (clone $query)->select('fk_categoria', DB::raw('count(*) as total'))
                ->with('categoria')->where('estado', 'cancelado')->groupBy('fk_categoria')->get()
                ->map(fn($e) => ['nombre' => $e->categoria?->nombre, 'total' => $e->total]),
        ];

        // ── Años disponibles ──
        $aniosDisponibles = EventoAdverso::select(DB::raw('YEAR(created_at) as anio'))
            ->groupBy('anio')->orderByDesc('anio')->pluck('anio');

        $todasClasificaciones = [
            'Atención segura',
            'Complicación',
            'Evento adverso no prevenible',
            'Evento adverso prevenible',
            'Evento centinela',
            'Incidente',
        ];

        return Inertia::render('Dashboard', [
            'estadisticas' => [
                'totalEventos'               => $totalEventos,
                'mesActual'                  => $mesActual,
                'mesAnterior'                => $mesAnterior,
                'totalesPorEstado'           => $totalesPorEstado,
                'porCategoria'               => $porCategoria,
                'porArea'                    => $porArea,
                'porMes'                     => $porMes,
                'porCategoriaMes'            => $porCategoriaMes,
                'porAreaMes'                 => $porAreaMes,
                'planesPorEstado'            => $planesPorEstado,
                'planesVencidos'             => $planesVencidos,
                'porClasificacionMes'        => $datosClasificacion,
                'porClasificacionRaw'        => $porClasificacionMes,
                'clasificaciones'            => $todasClasificaciones,
                'categorias'                 => Categoria::where('activo', 1)->get(['id_categoria', 'nombre']),
                'areas'                      => Area::where('activo', 1)->get(['id_area', 'nombre']),
                'aniosDisponibles'           => $aniosDisponibles,
                'anioSeleccionado'           => (int) $anio,
                'periodoSeleccionado'        => $periodo,
                'trimestreSeleccionado'      => (int) $request->get('trimestre', ceil(now()->month / 3)),
                'semestreSeleccionado'       => (int) $request->get('semestre', now()->month <= 6 ? 1 : 2),
                'categoriaEstadoSeleccionada' => $request->get('categoria_estado', ''),
                'porRelacionMes'             => $porRelacionMes,
                'relacionesEspecificas'      => $relacionesEspecificas,
                'porRelacion'                => $porRelacion,
                'todasRelaciones'            => [
                    'Alergias',
                    'Asalto sexual en la institución',
                    'Administración equivocada de medicamentos',
                    'Caídas intrainstitucionales',
                    'Complicación quirúrgica',
                    'Deficiencia en la comunicación',
                    'Demoras en la atención',
                    'Dispositivos y equipos biomédicos',
                    'Egreso inseguro',
                    'Fallas en agendamiento de citas',
                    'Fallas en manejo medico',
                    'Flebitis mecánica',
                    'Fuga de pacientes',
                    'Infecciones de sitio quirúrgico',
                    'Infecciones asociadas a la atención en salud (IAAS)',
                    'Identificación errónea del paciente',
                    'Lesiones de piel',
                    'Reacción adversa a medicamentos',
                    'Reingreso a urgencias',
                    'Traslado inseguro',
                    'Ulceras por presión',
                ],
                'porcentajeRevisados'        => $porcentajeRevisados,
                'porcentajeTramitados'       => $porcentajeTramitados,
                'porcentajeCancelados'       => $porcentajeCancelados,
                'detalleRevisados'           => $detalleRevisados,
                'detalleTramitados'          => $detalleTramitados,
                'detalleCancelados'          => $detalleCancelados,
            ],
        ]);
    }
}
