<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Spatie\Permission\Traits\HasRoles;


class User extends Authenticatable
{
    use HasFactory, Notifiable, HasRoles;

    protected $fillable = [
        'name',
        'email',
        'password',
    ];

    protected $hidden = [
        'password',
        'remember_token',
    ];

    /** Nombre de la ruta a la que llega el usuario al iniciar sesión, según su rol. */
    public function rutaDeInicio(): string
    {
        if ($this->hasAnyRole(['calidad', 'administrador'])) {
            return 'dashboard';
        }

        // Tecnovigilancia tiene prioridad sobre jefe (el jefe accede desde "Mis Eventos")
        if ($this->hasRole('tecnovigilancia')) {
            return 'tecnovigilancia.index';
        }

        return $this->hasRole('jefe') ? 'dashboard' : 'eventos.create';
    }

    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password'          => 'hashed',
        ];
    }
}