<?php

namespace App\Http\Controllers;

use App\Models\Auditoria;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Spatie\Permission\Models\Role;

class UserController extends Controller
{
    // ── Permisos del rol gestor_usuarios ──
    // El gestor crea, edita y elimina usuarios, pero NO puede tocar a los administradores
    // ni asignar el rol administrador: eso es solo de los administradores.
    private function esAdministrador(): bool
    {
        return Auth::user()->hasRole('administrador');
    }

    private function protegerAdministrador(User $user): void
    {
        abort_if(
            !$this->esAdministrador() && $user->hasRole('administrador'),
            403,
            'Solo un administrador puede ver, editar o eliminar usuarios administradores.'
        );
    }

    // Roles que puede asignar el usuario actual
    private function rolesAsignables()
    {
        return Role::pluck('name')->reject(fn($rol) => !$this->esAdministrador() && $rol === 'administrador')->values();
    }

    private function reglaRoles(): array
    {
        return [
            'roles'   => 'required|array|min:1',
            'roles.*' => ['exists:roles,name', Rule::notIn($this->esAdministrador() ? [] : ['administrador'])],
        ];
    }

    // Datos del usuario para la auditoría (sin contraseña)
    private function datosAuditoria(User $user): array
    {
        return [
            'name'  => $user->name,
            'email' => $user->email,
            'roles' => $user->getRoleNames()->sort()->values()->all(),
        ];
    }

    // ── Lista de usuarios ──
    public function index()
    {
        $usuarios = User::with('roles')
            ->when(!$this->esAdministrador(), fn($q) => $q->whereDoesntHave('roles', fn($r) => $r->where('name', 'administrador')))
            ->orderBy('created_at', 'desc')
            ->get()
            ->map(fn($user) => [
                'id'    => $user->id,
                'name'  => $user->name,
                'email' => $user->email,
                'roles' => $user->getRoleNames()->values(),
            ]);

        return Inertia::render('Usuarios/Index', [
            'usuarios' => $usuarios,
            'roles'    => $this->rolesAsignables(),
        ]);
    }
    // ── Formulario crear usuario ──
    public function create()
    {
        return Inertia::render('Usuarios/Create', [
            'roles' => $this->rolesAsignables(),
        ]);
    }

    // ── Guardar usuario nuevo ──
    public function store(Request $request)
    {
        $request->validate([
            'name'     => 'required|string|max:255',
            'email'    => 'required|email|unique:users,email',
            'password' => 'required|string|min:8',
            ...$this->reglaRoles(),
        ], [
            'roles.required'   => 'Selecciona al menos un rol.',
            'roles.min'        => 'Selecciona al menos un rol.',
            'roles.*.not_in'   => 'No tienes permiso para asignar el rol administrador.',
        ]);

        $user = User::create([
            'name'     => $request->name,
            'email'    => $request->email,
            'password' => Hash::make($request->password),
        ]);

        $user->syncRoles($request->roles);

        Auditoria::registrar(
            'crear',
            'usuario',
            $user->id,
            'Creó el usuario ' . $user->name . ' (' . $user->email . ')',
            null,
            $this->datosAuditoria($user)
        );

        return redirect()->route('usuarios.index')
            ->with('success', 'Usuario creado correctamente.');
    }

    // ── Formulario editar usuario ──
    public function edit(User $user)
    {
        $this->protegerAdministrador($user);

        return Inertia::render('Usuarios/Edit', [
            'usuario' => [
                'id'    => $user->id,
                'name'  => $user->name,
                'email' => $user->email,
                'roles' => $user->getRoleNames()->values(),
            ],
            'roles' => $this->rolesAsignables(),
        ]);
    }

    // ── Actualizar usuario ──
    public function update(Request $request, User $user)
    {
        $this->protegerAdministrador($user);

        $request->validate([
            'name'     => 'required|string|max:255',
            'email'    => 'required|email|unique:users,email,' . $user->id,
            'password' => 'nullable|string|min:8',
            ...$this->reglaRoles(),
        ], [
            'roles.required'   => 'Selecciona al menos un rol.',
            'roles.min'        => 'Selecciona al menos un rol.',
            'roles.*.not_in'   => 'No tienes permiso para asignar el rol administrador.',
        ]);

        $antes = $this->datosAuditoria($user);

        $user->update([
            'name'  => $request->name,
            'email' => $request->email,
            ...($request->filled('password')
                ? ['password' => Hash::make($request->password)]
                : []),
        ]);

        $user->syncRoles($request->roles);

        $despues = $this->datosAuditoria($user->refresh());
        if ($request->filled('password')) {
            $despues['contraseña_cambiada'] = true;   // solo se indica que cambió; nunca se guarda
        }

        Auditoria::registrar(
            'editar',
            'usuario',
            $user->id,
            'Editó el usuario ' . $user->name . ' (' . $user->email . ')',
            $antes,
            $despues
        );

        return redirect()->route('usuarios.index')
            ->with('success', 'Usuario actualizado correctamente.');
    }

    // ── Eliminar usuario ──
    public function destroy(User $user)
    {
        $this->protegerAdministrador($user);

        if ($user->id === Auth::id()) {
            return redirect()->back()
                ->withErrors(['usuario' => 'No puedes eliminar tu propio usuario.']);
        }

        $antes = $this->datosAuditoria($user);
        $descripcion = 'Eliminó el usuario ' . $user->name . ' (' . $user->email . ')';
        $id = $user->id;

        $user->delete();

        Auditoria::registrar('eliminar', 'usuario', $id, $descripcion, $antes, null);

        return redirect()->route('usuarios.index')
            ->with('success', 'Usuario eliminado correctamente.');
    }
}
