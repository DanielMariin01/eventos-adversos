<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class EventoAdverso extends Model
{
    protected $table = 'eventos_adversos';

    protected $primaryKey = 'id_eventoAdverso';

    protected $fillable = [
        'fk_categoria',
        'fk_area',
        'fk_reportante',
        'fk_paciente',

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

    public function reportante()
    {
        return $this->belongsTo(Reportante::class, 'fk_reportante');
    }

    public function paciente()
    {
        return $this->belongsTo(Paciente::class, 'fk_paciente');
    }

    public function usuario()
    {
        return $this->belongsTo(User::class, 'fk_usuario');
    }
}
