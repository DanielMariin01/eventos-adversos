<?php

namespace App\Http\Controllers;

use App\Models\Area;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;

class AreaController extends Controller
{
    public function index()
    {
        $areas = Area::with('jefe')->orderBy('nombre')->get();
        $jefes = User::role('jefe')->get(['id', 'name']);

        return Inertia::render('Areas/Index', [
            'areas' => $areas,
            'jefes' => $jefes,
        ]);
    }

    public function update(Request $request, Area $area)
    {
        $request->validate([
            'fk_jefe' => 'nullable|exists:users,id',
        ]);

        $area->update([
            'fk_jefe' => $request->fk_jefe,
        ]);

        return redirect()->route('areas.index')
            ->with('success', 'Jefe asignado correctamente.');
    }
}
