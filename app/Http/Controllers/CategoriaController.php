<?php

namespace App\Http\Controllers;

use App\Models\Categoria;
use Illuminate\Http\Request;
use Inertia\Inertia;

class CategoriaController extends Controller
{
    // ── Lista de categorías (activas e inactivas) ──
    public function index()
    {
        return Inertia::render('Categorias/Index', [
            'categorias' => Categoria::withCount('eventosAdversos')->orderBy('nombre')->get(),
        ]);
    }

    // ── Crear categoría ──
    public function store(Request $request)
    {
        $datos = $request->validate([
            'nombre'      => 'required|string|max:150|unique:categorias,nombre',
            'descripcion' => 'nullable|string|max:500',
        ]);

        Categoria::create([
            'nombre'      => trim($datos['nombre']),
            'descripcion' => $datos['descripcion'] ?? null,
            'activo'      => 1,
        ]);

        return redirect()->route('categorias.index')
            ->with('success', 'Categoría creada correctamente.');
    }

    // ── Editar nombre y descripción ──
    // Ojo: algunos nombres activan lógica propia (Tecnovigilancia, Implantables, Farmacovigilancia, IAAS,
    // Seguridad del Paciente); renombrarlos desactiva esa lógica.
    public function update(Request $request, Categoria $categoria)
    {
        $datos = $request->validate([
            'nombre'      => 'required|string|max:150|unique:categorias,nombre,' . $categoria->id_categoria . ',id_categoria',
            'descripcion' => 'nullable|string|max:500',
        ]);

        $categoria->update([
            'nombre'      => trim($datos['nombre']),
            'descripcion' => $datos['descripcion'] ?? null,
        ]);

        return redirect()->route('categorias.index')
            ->with('success', 'Categoría actualizada correctamente.');
    }

    // ── Activar / desactivar (no se borra, para no romper los eventos existentes) ──
    public function toggleActivo(Categoria $categoria)
    {
        $categoria->update(['activo' => $categoria->activo ? 0 : 1]);

        return redirect()->route('categorias.index')
            ->with('success', $categoria->activo ? 'Categoría activada.' : 'Categoría desactivada.');
    }
}
