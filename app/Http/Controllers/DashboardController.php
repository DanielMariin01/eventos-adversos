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


        $query = EventoAdverso::whereYear('created_at', $anio);

        // Filtro por periodo
        if ($periodo === 'trimestral') {
            $trimestre = (int) $request->get('trimestre', ceil(now()->month / 3));
            $mesInicio = ($trimestre - 1) * 3 + 1;
            $mesFin    = $trimestre * 3;
            $query->whereMonth('created_at', '>=', $mesInicio)
                ->whereMonth('created_at', '<=', $mesFin);
        } elseif ($periodo === 'semestral') {
            $semestre  = (int) $request->get('semestre', now()->month <= 6 ? 1 : 2);
            $mesInicio = $semestre === 1 ? 1 : 7;
            $mesFin    = $semestre === 1 ? 6 : 12;
            $query->whereMonth('created_at', '>=', $mesInicio)
                ->whereMonth('created_at', '<=', $mesFin);
        }

        // ── Datos detallados por estado ──
        $detalleRevisados = [
            'analizado'  => EventoAdverso::where('estado', 'analizado')->count(),
            'en_mejora'  => EventoAdverso::where('estado', 'en_mejora')->count(),
            'radicado'   => EventoAdverso::where('estado', 'radicado')->count(),
            'cerrado'    => EventoAdverso::where('estado', 'cerrado')->count(),
            'porCategoria' => EventoAdverso::select('fk_categoria', DB::raw('count(*) as total'))
                ->with('categoria')
                ->whereIn('estado', ['analizado', 'en_mejora', 'radicado', 'cerrado'])
                ->groupBy('fk_categoria')
                ->get()
                ->map(fn($e) => ['nombre' => $e->categoria?->nombre, 'total' => $e->total]),
            'porArea' => EventoAdverso::select('fk_area', DB::raw('count(*) as total'))
                ->with('area')
                ->whereIn('estado', ['analizado', 'en_mejora', 'radicado', 'cerrado'])
                ->groupBy('fk_area')
                ->get()
                ->map(fn($e) => ['nombre' => $e->area?->nombre, 'total' => $e->total]),
        ];

        $detalleTramitados = [
            'radicado'  => EventoAdverso::where('estado', 'radicado')->count(),
            'cerrado'   => EventoAdverso::where('estado', 'cerrado')->count(),
            'tiempoPromedio' => round(EventoAdverso::whereIn('estado', ['radicado', 'cerrado'])
                ->whereNotNull('fecha_cierre')
                ->get()
                ->avg(fn($e) => $e->created_at->diffInDays($e->fecha_cierre)), 1),
            'porJefe' => EventoAdverso::select('fk_jefe', DB::raw('count(*) as total'))
                ->with('jefe')
                ->whereIn('estado', ['radicado', 'cerrado'])
                ->whereNotNull('fk_jefe')
                ->groupBy('fk_jefe')
                ->get()
                ->map(fn($e) => ['nombre' => $e->jefe?->name, 'total' => $e->total]),
        ];

        $detalleCancelados = [
            'total'       => EventoAdverso::where('estado', 'cancelado')->count(),
            'porArea'     => EventoAdverso::select('fk_area', DB::raw('count(*) as total'))
                ->with('area')
                ->where('estado', 'cancelado')
                ->groupBy('fk_area')
                ->get()
                ->map(fn($e) => ['nombre' => $e->area?->nombre, 'total' => $e->total]),
            'porCategoria' => EventoAdverso::select('fk_categoria', DB::raw('count(*) as total'))
                ->with('categoria')
                ->where('estado', 'cancelado')
                ->groupBy('fk_categoria')
                ->get()
                ->map(fn($e) => ['nombre' => $e->categoria?->nombre, 'total' => $e->total]),
        ];

        $detalleRevisados = [
            'analizado'       => (clone $query)->where('estado', 'analizado')->count(),
            'en_mejora'       => (clone $query)->where('estado', 'en_mejora')->count(),
            'radicado'        => (clone $query)->where('estado', 'radicado')->count(),
            'cerrado'         => (clone $query)->where('estado', 'cerrado')->count(),
            'jefes_en_mejora' => (clone $query)->select('fk_jefe', DB::raw('count(*) as total'))
                ->with('jefe')
                ->where('estado', 'en_mejora')
                ->whereNotNull('fk_jefe')
                ->groupBy('fk_jefe')
                ->get()
                ->map(fn($e) => ['nombre' => $e->jefe?->name, 'total' => $e->total]),
            'jefes_radicado'  => (clone $query)->select('fk_jefe', DB::raw('count(*) as total'))
                ->with('jefe')
                ->where('estado', 'radicado')
                ->whereNotNull('fk_jefe')
                ->groupBy('fk_jefe')
                ->get()
                ->map(fn($e) => ['nombre' => $e->jefe?->name, 'total' => $e->total]),
            'porCategoria'    => (clone $query)->select('fk_categoria', DB::raw('count(*) as total'))
                ->with('categoria')
                ->whereIn('estado', ['analizado', 'en_mejora', 'radicado', 'cerrado'])
                ->groupBy('fk_categoria')
                ->get()
                ->map(fn($e) => ['nombre' => $e->categoria?->nombre, 'total' => $e->total]),
            'porArea'         => (clone $query)->select('fk_area', DB::raw('count(*) as total'))
                ->with('area')
                ->whereIn('estado', ['analizado', 'en_mejora', 'radicado', 'cerrado'])
                ->groupBy('fk_area')
                ->get()
                ->map(fn($e) => ['nombre' => $e->area?->nombre, 'total' => $e->total]),
        ];

        $detalleTramitados = [
            'radicado'       => (clone $query)->where('estado', 'radicado')->count(),
            'cerrado'        => (clone $query)->where('estado', 'cerrado')->count(),
            'tiempoPromedio' => round((clone $query)->whereIn('estado', ['radicado', 'cerrado'])
                ->whereNotNull('fecha_cierre')
                ->get()
                ->avg(fn($e) => $e->created_at->diffInDays($e->fecha_cierre)), 1),
            'porJefe'        => (clone $query)->select('fk_jefe', DB::raw('count(*) as total'))
                ->with('jefe')
                ->whereIn('estado', ['radicado', 'cerrado'])
                ->whereNotNull('fk_jefe')
                ->groupBy('fk_jefe')
                ->get()
                ->map(fn($e) => ['nombre' => $e->jefe?->name, 'total' => $e->total]),
        ];

        $detalleCancelados = [
            'total'        => (clone $query)->where('estado', 'cancelado')->count(),
            'porArea'      => (clone $query)->select('fk_area', DB::raw('count(*) as total'))
                ->with('area')
                ->where('estado', 'cancelado')
                ->groupBy('fk_area')
                ->get()
                ->map(fn($e) => ['nombre' => $e->area?->nombre, 'total' => $e->total]),
            'porCategoria' => (clone $query)->select('fk_categoria', DB::raw('count(*) as total'))
                ->with('categoria')
                ->where('estado', 'cancelado')
                ->groupBy('fk_categoria')
                ->get()
                ->map(fn($e) => ['nombre' => $e->categoria?->nombre, 'total' => $e->total]),
        ];

        // ── Totales por estado (filtrado) ──
        // ── Totales por estado (filtrado) ──
        $totalesPorEstado = (clone $query)
            ->select('estado', DB::raw('count(*) as total'))
            ->when($request->get('categoria_estado'), fn($q, $cat) => $q->where('fk_categoria', $cat))
            ->groupBy('estado')
            ->pluck('total', 'estado');

        // ── Total general (filtrado) ──
        $totalEventos = (clone $query)->count();


        // ── Porcentajes de avance ──
        $totalGeneral     = (clone $query)->count();
        $revisados        = (clone $query)->whereIn('estado', ['analizado', 'en_mejora', 'radicado', 'cerrado'])->count();
        $tramitados       = (clone $query)->whereIn('estado', ['radicado', 'cerrado'])->count();
        $cancelados       = (clone $query)->where('estado', 'cancelado')->count();

        $porcentajeRevisados  = $totalGeneral > 0 ? round(($revisados / $totalGeneral) * 100, 1) : 0;
        $porcentajeTramitados = $totalGeneral > 0 ? round(($tramitados / $totalGeneral) * 100, 1) : 0;
        $porcentajeCancelados = $totalGeneral > 0 ? round(($cancelados / $totalGeneral) * 100, 1) : 0;
        // ── Eventos del mes actual vs mes anterior ──
        $ahora       = now();
        $mesActual   = EventoAdverso::whereMonth('created_at', $ahora->month)
            ->whereYear('created_at', $ahora->year)
            ->count();
        $mesAnterior = EventoAdverso::whereMonth('created_at', $ahora->copy()->subMonth()->month)
            ->whereYear('created_at', $ahora->copy()->subMonth()->year)
            ->count();

        // ── Eventos por categoría ──
        $porCategoria = EventoAdverso::select('fk_categoria', DB::raw('count(*) as total'))
            ->with('categoria')
            ->groupBy('fk_categoria')
            ->get()
            ->map(fn($e) => [
                'nombre' => $e->categoria->nombre ?? 'Sin categoría',
                'total'  => $e->total,
            ]);

        // ── Eventos por área ──
        $porArea = EventoAdverso::select('fk_area', DB::raw('count(*) as total'))
            ->with('area')
            ->groupBy('fk_area')
            ->orderByDesc('total')
            ->limit(8)
            ->get()
            ->map(fn($e) => [
                'nombre' => $e->area->nombre ?? 'Sin área',
                'total'  => $e->total,
            ]);

        // ── Eventos por mes filtrado ──
        $porMes = (clone $query)->select(
            'fk_area',
            'fk_categoria',
            DB::raw('MONTH(created_at) as mes'),
            DB::raw('YEAR(created_at) as anio'),
            DB::raw('count(*) as total')
        )
            ->groupBy('fk_area', 'fk_categoria', 'anio', 'mes')
            ->orderBy('anio')->orderBy('mes')
            ->get();

        // ── Eventos por categoría y mes ──
        $porCategoriaMes = (clone $query)->select(
            'fk_categoria',
            DB::raw('MONTH(created_at) as mes'),
            DB::raw('YEAR(created_at) as anio'),
            DB::raw('count(*) as total')
        )
            ->groupBy('fk_categoria', 'anio', 'mes')
            ->orderBy('anio')->orderBy('mes')
            ->get();

        // ── Eventos por área y mes ──
        $porAreaMes = (clone $query)->select(
            'fk_area',
            'fk_categoria',
            DB::raw('MONTH(created_at) as mes'),
            DB::raw('YEAR(created_at) as anio'),
            DB::raw('count(*) as total')
        )
            ->groupBy('fk_area', 'fk_categoria', 'anio', 'mes')
            ->orderBy('anio')->orderBy('mes')
            ->get();

        // ── Planes de mejora por estado ──
        $planesPorEstado = PlanMejora::select('estado', DB::raw('count(*) as total'))
            ->whereHas('evento', function ($q) use ($query) {
                $q->whereIn('id_eventoAdverso', (clone $query)->select('id_eventoAdverso'));
            })
            ->groupBy('estado')
            ->pluck('total', 'estado');

        // ── Planes vencidos ──
        $planesVencidos = PlanMejora::where('fecha_ejecucion', '<', now())
            ->where('estado', 'en_proceso')
            ->count();

        // ── Clasificación por mes ──
        $porClasificacionMes = (clone $query)
            ->select(
                'clasificacion',
                'fk_area',
                'fk_categoria',
                DB::raw('MONTH(created_at) as mes'),
                DB::raw('YEAR(created_at) as anio'),
                DB::raw('count(*) as total')
            )
            ->whereNotNull('clasificacion')
            ->groupBy('clasificacion', 'fk_area', 'fk_categoria', 'anio', 'mes')
            ->orderBy('mes')
            ->get();


        $mesesNombres   = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
        $clasificaciones = $porClasificacionMes->pluck('clasificacion')->unique()->values();

        $mesesConDatos = $porClasificacionMes->pluck('mes')->unique()->sort()->values();
        $todasClasificaciones = [
            'Atención segura',
            'Complicación',
            'Evento adverso no prevenible',
            'Evento adverso prevenible',
            'Evento centinela',
            'Incidente',
        ];

        $datosClasificacion = $mesesConDatos->map(function ($mes) use ($porClasificacionMes, $mesesNombres, $clasificaciones) {
            $fila = ['mes' => $mesesNombres[$mes - 1]];
            foreach ($clasificaciones as $cls) {
                $fila[$cls] = $porClasificacionMes
                    ->where('mes', $mes)
                    ->where('clasificacion', $cls)
                    ->sum('total');
            }
            return $fila;
        })->filter(fn($f) => collect($f)->except('mes')->sum() > 0)->values();

        // ── Años disponibles ──
        $aniosDisponibles = EventoAdverso::select(DB::raw('YEAR(created_at) as anio'))
            ->groupBy('anio')
            ->orderByDesc('anio')
            ->pluck('anio');

        // ── Eventos por relación ──
        $porRelacion = (clone $query)->select(
            'relacionado_con',
            'fk_area',
            'fk_categoria',
            DB::raw('MONTH(created_at) as mes'),
            DB::raw('YEAR(created_at) as anio'),
            DB::raw('count(*) as total')
        )
            ->whereNotNull('relacionado_con')
            ->groupBy('relacionado_con', 'fk_area', 'fk_categoria', 'anio', 'mes')
            ->orderBy('mes')
            ->get();

        // ── Eventos por relación específica (Caídas y Úlceras) ──
        $relacionesEspecificas = ['Caídas intrainstitucionales', 'Ulceras por presión'];

        $porRelacionMes = (clone $query)
            ->select(
                'relacionado_con',
                'fk_area',
                'fk_categoria',
                DB::raw('MONTH(created_at) as mes'),
                DB::raw('YEAR(created_at) as anio'),
                DB::raw('count(*) as total')
            )
            ->whereIn('relacionado_con', $relacionesEspecificas)
            ->groupBy('relacionado_con', 'fk_area', 'fk_categoria', 'anio', 'mes')
            ->orderBy('mes')
            ->get();


        $totalGeneral = EventoAdverso::count();

        $revisados = EventoAdverso::whereIn('estado', ['analizado', 'en_mejora', 'radicado', 'cerrado'])->count();
        $tramitados = EventoAdverso::whereIn('estado', ['radicado', 'cerrado'])->count();
        $cancelados = EventoAdverso::where('estado', 'cancelado')->count();

        $porcentajeRevisados = $totalGeneral > 0 ? round(($revisados / $totalGeneral) * 100, 1) : 0;
        $porcentajeTramitados = $totalGeneral > 0 ? round(($tramitados / $totalGeneral) * 100, 1) : 0;
        $porcentajeCancelados = $totalGeneral > 0 ? round(($cancelados / $totalGeneral) * 100, 1) : 0;

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
                'clasificaciones'            => $todasClasificaciones,
                'categorias'                 => Categoria::where('activo', 1)->get(['id_categoria', 'nombre']),
                'areas'                      => Area::where('activo', 1)->get(['id_area', 'nombre']),
                'aniosDisponibles'           => $aniosDisponibles,
                'anioSeleccionado'           => (int) $anio,
                'periodoSeleccionado'        => $periodo,
                'trimestreSeleccionado'      => (int) $request->get('trimestre', ceil(now()->month / 3)),
                'semestreSeleccionado'       => (int) $request->get('semestre', now()->month <= 6 ? 1 : 2),
                'categoriaEstadoSeleccionada' => $request->get('categoria_estado', ''),
                'porClasificacionRaw'        => $porClasificacionMes,
                'porRelacionMes' => $porRelacionMes,
                'relacionesEspecificas' => $relacionesEspecificas,
                'porRelacion' => $porRelacion,
                'todasRelaciones' => [
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
                'porcentajeRevisados'  => $porcentajeRevisados,
                'porcentajeTramitados' => $porcentajeTramitados,
                'porcentajeCancelados' => $porcentajeCancelados,
                'detalleRevisados'  => $detalleRevisados,
                'detalleTramitados' => $detalleTramitados,
                'detalleCancelados' => $detalleCancelados,
            ],
        ]);
    }
}
