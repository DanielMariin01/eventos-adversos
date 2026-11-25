<?php

namespace App\Http\Controllers;

use App\Models\Auditoria;
use Illuminate\Http\Request;
use Inertia\Inertia;

class AuditoriaController extends Controller
{
    // ── Lista de auditoría (solo administrador) ──
    public function index(Request $request)
    {
        $registros = Auditoria::query()
            ->when($request->filled('buscar'), function ($query) use ($request) {
                $buscar = '%' . $request->buscar . '%';
                $query->where(function ($q) use ($buscar) {
                    $q->where('usuario_nombre', 'like', $buscar)
                        ->orWhere('descripcion', 'like', $buscar);
                });
            })
            ->when($request->filled('entidad'), fn($q) => $q->where('entidad', $request->entidad))
            ->when($request->filled('accion'), fn($q) => $q->where('accion', $request->accion))
            ->orderByDesc('created_at')
            ->orderByDesc('id_auditoria')
            ->paginate(15)
            ->withQueryString();

        return Inertia::render('Auditoria/Index', [
            'registros' => $registros,
            'filtros'   => $request->only(['buscar', 'entidad', 'accion']),
        ]);
    }
}
