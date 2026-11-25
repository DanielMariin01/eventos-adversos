<?php

namespace App\Http\Controllers\Concerns;

use Illuminate\Http\Request;

/**
 * Búsqueda en servidor para las listas de eventos (Eventos Adversos, Cancelados, Mis Eventos,
 * Tecnovigilancia, Farmacovigilancia). Así el resultado sale en la primera página sin importar
 * en qué página estaba el evento.
 */
trait BuscaEventos
{
    // Filtros que viajan en la URL y se devuelven a la página
    protected function filtrosBusqueda(Request $request): array
    {
        return $request->only(['evento', 'reportante', 'paciente', 'estado', 'dispositivo', 'medicamento']);
    }

    protected function aplicarBusqueda($query, Request $request)
    {
        return $query
            ->when($request->filled('evento'), function ($q) use ($request) {
                $q->where('id_eventoAdverso', 'like', '%' . trim($request->evento) . '%');
            })
            ->when($request->filled('reportante'), function ($q) use ($request) {
                $q->whereHas('reportante', fn($r) => $this->coincidePersona($r, $request->reportante));
            })
            ->when($request->filled('paciente'), function ($q) use ($request) {
                $q->whereHas('paciente', fn($r) => $this->coincidePersona($r, $request->paciente));
            })
            ->when($request->filled('estado'), function ($q) use ($request) {
                $q->where('estado', $request->estado);
            })
            ->when($request->filled('dispositivo'), function ($q) use ($request) {
                $texto = '%' . trim($request->dispositivo) . '%';
                $q->whereHas('tecnovigilancia', function ($t) use ($texto) {
                    $t->where('nombre_dispositivo', 'like', $texto)
                        ->orWhere('marca', 'like', $texto)
                        ->orWhere('modelo', 'like', $texto)
                        ->orWhere('serie', 'like', $texto);
                });
            })
            ->when($request->filled('medicamento'), function ($q) use ($request) {
                $q->whereHas('medicamentos', fn($m) => $m->where('nombre', 'like', '%' . trim($request->medicamento) . '%'));
            });
    }

    // Cédula, nombres, apellidos o nombre completo
    private function coincidePersona($query, string $texto): void
    {
        $like = '%' . trim($texto) . '%';

        $query->where(function ($q) use ($like) {
            $q->where('cedula', 'like', $like)
                ->orWhere('nombres', 'like', $like)
                ->orWhere('apellidos', 'like', $like)
                ->orWhereRaw("CONCAT(nombres, ' ', apellidos) like ?", [$like]);
        });
    }
}
