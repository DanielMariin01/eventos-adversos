<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Auth;

class Auditoria extends Model
{
    protected $table = 'auditorias';

    protected $primaryKey = 'id_auditoria';

    protected $fillable = [
        'fk_usuario',
        'usuario_nombre',
        'accion',
        'entidad',
        'id_entidad',
        'descripcion',
        'antes',
        'despues',
    ];

    protected $casts = [
        'antes'   => 'array',
        'despues' => 'array',
    ];

    /**
     * Registra una acción hecha por el usuario autenticado.
     * Nunca pasar contraseñas ni datos sensibles en $antes / $despues.
     */
    public static function registrar(string $accion, string $entidad, ?int $idEntidad, string $descripcion, ?array $antes = null, ?array $despues = null): self
    {
        $user = Auth::user();

        return self::create([
            'fk_usuario'     => $user?->id,
            'usuario_nombre' => $user?->name ?? 'Sistema',
            'accion'         => $accion,
            'entidad'        => $entidad,
            'id_entidad'     => $idEntidad,
            'descripcion'    => mb_substr($descripcion, 0, 500),
            'antes'          => $antes,
            'despues'        => $despues,
        ]);
    }
}
