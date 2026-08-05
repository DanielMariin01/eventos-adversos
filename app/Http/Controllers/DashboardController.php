<?php

namespace App\Http\Controllers;

use App\Models\Area;
use App\Models\Categoria;
use App\Models\EventoAdverso;
use App\Models\PlanMejora;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function index()
    {
        // ── Totales por estado ──
        $totalesPorEstado = EventoAdverso::select('estado', DB::raw('count(*) as total'))
            ->groupBy('estado')
            ->pluck('total', 'estado');

        // ── Total general ──
        $totalEventos = EventoAdverso::count();

        // ── Eventos del mes actual vs mes anterior ──
        $ahora       = now();
        $mesActual   = EventoAdverso::whereMonth('created_at', $ahora->month)
            ->whereYear('created_at', $ahora->year)
            ->count();
        $mesAnterior = EventoAdverso::whereMonth('created_at', $ahora->copy()->subMonth()->month)
            ->whereYear('created_at', $ahora->copy()->subMonth()->year)
            ->count();

        // ── Eventos por categoría y mes ──
        $porCategoriaMes = EventoAdverso::select(
            'fk_categoria',
            DB::raw('MONTH(created_at) as mes'),
            DB::raw('YEAR(created_at) as anio'),
            DB::raw('count(*) as total')
        )
            ->where('created_at', '>=', now()->subMonths(6))
            ->groupBy('fk_categoria', 'anio', 'mes')
            ->orderBy('anio')
            ->orderBy('mes')
            ->get();

        // ── Eventos por área y mes ──
        $porAreaMes = EventoAdverso::select(
            'fk_area',
            'fk_categoria',
            DB::raw('MONTH(created_at) as mes'),
            DB::raw('YEAR(created_at) as anio'),
            DB::raw('count(*) as total')
        )
            ->where('created_at', '>=', now()->subMonths(6))
            ->groupBy('fk_area', 'fk_categoria', 'anio', 'mes')
            ->orderBy('anio')
            ->orderBy('mes')
            ->get();

        // ── Eventos por mes (últimos 6 meses) ──
        $porMes = EventoAdverso::select(
            DB::raw('MONTH(created_at) as mes'),
            DB::raw('YEAR(created_at) as anio'),
            DB::raw('count(*) as total')
        )
            ->where('created_at', '>=', now()->subMonths(6))
            ->groupBy('anio', 'mes')
            ->orderBy('anio')
            ->orderBy('mes')
            ->get()
            ->map(fn($e) => [
                'mes'   => \Carbon\Carbon::createFromDate($e->anio, $e->mes, 1)->locale('es')->isoFormat('MMM YY'),
                'total' => $e->total,
            ]);

        // ── Planes de mejora por estado ──
        $planesPorEstado = PlanMejora::select('estado', DB::raw('count(*) as total'))
            ->groupBy('estado')
            ->pluck('total', 'estado');

        // ── Planes vencidos ──
        $planesVencidos = PlanMejora::where('fecha_ejecucion', '<', now())
            ->where('estado', 'en_proceso')
            ->count();

        // ── Eventos por clasificación y mes ──
        $porClasificacionMes = EventoAdverso::select(
            'clasificacion',
            DB::raw('MONTH(created_at) as mes'),
            DB::raw('YEAR(created_at) as anio'),
            DB::raw('count(*) as total')
        )
            ->whereYear('created_at', now()->year)
            ->whereNotNull('clasificacion')
            ->groupBy('clasificacion', 'anio', 'mes')
            ->orderBy('mes')
            ->get();

        // Transformar para recharts
        $meses = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
        $clasificaciones = $porClasificacionMes->pluck('clasificacion')->unique()->values();

        $datosClasificacion = collect(range(1, 12))->map(function ($mes) use ($porClasificacionMes, $meses, $clasificaciones) {
            $fila = ['mes' => $meses[$mes - 1]];
            foreach ($clasificaciones as $cls) {
                $fila[$cls] = $porClasificacionMes
                    ->where('mes', $mes)
                    ->where('clasificacion', $cls)
                    ->first()?->total ?? 0;
            }
            return $fila;
        })->filter(fn($f) => collect($f)->except('mes')->sum() > 0)->values();

        return Inertia::render('Dashboard', [
            'estadisticas' => [
                'totalEventos'     => $totalEventos,
                'mesActual'        => $mesActual,
                'mesAnterior'      => $mesAnterior,
                'totalesPorEstado' => $totalesPorEstado,
                'porMes'           => $porMes,
                'planesPorEstado'  => $planesPorEstado,
                'planesVencidos'   => $planesVencidos,
                'porClasificacionMes' => $datosClasificacion,
                'clasificaciones'     => $clasificaciones,
                'porCategoriaMes' => $porCategoriaMes,
                'porAreaMes'      => $porAreaMes,
                'categorias'      => Categoria::where('activo', 1)->get(['id_categoria', 'nombre']),
                'areas'           => Area::where('activo', 1)->get(['id_area', 'nombre']),
            ],
        ]);
    }
}
