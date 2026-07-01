<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class EventoAdverso extends Model
{
    protected $table = 'eventos_adversos';
    protected $primaryKey = 'id_evento';

    protected $fillable = [
        'fk_categoria',
        'fk_area',

        // Reportante
        'rep_cedula',
        'rep_nombres',
        'rep_apellidos',
        'rep_cargo',
        'rep_empresa',

        // Paciente
        'pac_cedula',
        'pac_nombres',
        'pac_apellidos',
        'pac_telefono',
        'pac_edad',
        'pac_entidad',

        // Evento
        'fecha_evento',
        'descripcion',
        'barreras_vulneradas',
        'factores_contributivos',
        'acciones_inseguras',
        'clasificacion',
        'relacionado_con',
        'categorizacion',
        'estado',
        'fk_usuario',
    ];

    // Convierte JSON automáticamente a array
    protected $casts = [
        'barreras_vulneradas'    => 'array',
        'factores_contributivos' => 'array',
        'acciones_inseguras'     => 'array',
        'fecha_evento'           => 'datetime',
    ];

    // ── Relaciones ──
    public function categoria()
    {
        return $this->belongsTo(Categoria::class, 'fk_categoria');
    }

    public function area()
    {
        return $this->belongsTo(Area::class, 'fk_area');
    }

    public function usuario()
    {
        return $this->belongsTo(User::class, 'fk_usuario');
    }
}
