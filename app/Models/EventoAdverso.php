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
        'fk_jefe',

        // Evento
        'fecha_evento',
        'descripcion',
        'barreras_vulneradas',
        'barreras_descripcion',
        'factores_contributivos',
        'acciones_inseguras',
        'acciones_descripcion',
        'descripcion_analisis',
        'clasificacion',
        'relacionado_con',
        'categorizacion',
        'estado',
        'fk_usuario',
        'fk_usuario_calidad',
        'fecha_analisis',
        'fecha_cierre',
        'observacion_tipo',
        'observacion_cancelacion',
    ];

    protected $casts = [
        'barreras_vulneradas'    => 'array',
        'factores_contributivos' => 'array',
        'acciones_inseguras'     => 'array',
        'fecha_evento'           => 'datetime',
        'fecha_analisis'         => 'datetime',
        'fecha_cierre'           => 'datetime',
    ];

    public function archivos()
    {
        return $this->hasMany(Archivo::class, 'fk_evento', 'id_eventoAdverso');
    }

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
    public function planMejora()
    {
        return $this->hasOne(PlanMejora::class, 'fk_evento', 'id_eventoAdverso');
    }

    public function revisiones()
    {
        return $this->hasMany(Revision::class, 'fk_evento', 'id_eventoAdverso');
    }
    // Agrega la relación:
    public function jefe()
    {
        return $this->belongsTo(User::class, 'fk_jefe');
    }
    public function usuarioCalidad()
    {
        return $this->belongsTo(User::class, 'fk_usuario_calidad');
    }
}
