<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Inertia\Inertia;
use Spatie\Permission\Models\Role;

class UserController extends Controller
{
    // ── Lista de usuarios ──
    public function index()
    {
        $usuarios = User::with('roles')
            ->orderBy('created_at', 'desc')
            ->get()
            ->map(fn($user) => [
                'id'    => $user->id,
                'name'  => $user->name,
                'email' => $user->email,
                'rol'   => $user->getRoleNames()->first(),
            ]);

        $roles = Role::pluck('name');

        return Inertia::render('Usuarios/Index', [
            'usuarios' => $usuarios,
            'roles'    => $roles,
        ]);
    }
    // ── Formulario crear usuario ──
    public function create()
    {
        $roles = Role::pluck('name');

        return Inertia::render('Usuarios/Create', [
            'roles' => $roles,
        ]);
    }

    // ── Guardar usuario nuevo ──
    public function store(Request $request)
    {
        $request->validate([
            'name'     => 'required|string|max:255',
            'email'    => 'required|email|unique:users,email',
            'password' => 'required|string|min:8',
            'rol'      => 'required|exists:roles,name',
        ]);

        $user = User::create([
            'name'     => $request->name,
            'email'    => $request->email,
            'password' => Hash::make($request->password),
        ]);

        $user->assignRole($request->rol);

        return redirect()->route('usuarios.index')
            ->with('success', 'Usuario creado correctamente.');
    }

    // ── Formulario editar usuario ──
    public function edit(User $user)
    {
        $roles = Role::pluck('name');

        return Inertia::render('Usuarios/Edit', [
            'usuario' => [
                'id'    => $user->id,
                'name'  => $user->name,
                'email' => $user->email,
                'rol'   => $user->getRoleNames()->first(),
            ],
            'roles' => $roles,
        ]);
    }

    // ── Actualizar usuario ──
    public function update(Request $request, User $user)
    {
        $request->validate([
            'name'     => 'required|string|max:255',
            'email'    => 'required|email|unique:users,email,' . $user->id,
            'password' => 'nullable|string|min:8',
            'rol'      => 'required|exists:roles,name',
        ]);

        $user->update([
            'name'  => $request->name,
            'email' => $request->email,
            ...($request->filled('password')
                ? ['password' => Hash::make($request->password)]
                : []),
        ]);

        $user->syncRoles($request->rol);

        return redirect()->route('usuarios.index')
            ->with('success', 'Usuario actualizado correctamente.');
    }

    // ── Eliminar usuario ──
    public function destroy(User $user)
    {
        $user->delete();

        return redirect()->route('usuarios.index')
            ->with('success', 'Usuario eliminado correctamente.');
    }
}
