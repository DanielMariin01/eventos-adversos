<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class PlanMejora extends Model
{
    protected $table = 'planes_mejora';

    protected $primaryKey = 'id_plan';

    protected $fillable = [
        'fk_evento',
        'fk_usuario',
        'fk_jefe',
        'descripcion',
        'fecha_ejecucion',
        'estado',
    ];

    protected $casts = [
        'fecha_ejecucion' => 'date',
    ];

    // ── Relaciones ──
    public function evento()
    {
        return $this->belongsTo(EventoAdverso::class, 'fk_evento', 'id_eventoAdverso');
    }

    public function usuario()
    {
        return $this->belongsTo(User::class, 'fk_usuario');
    }

    public function jefe()
    {
        return $this->belongsTo(User::class, 'fk_jefe');
    }

    public function archivos()
    {
        return $this->hasMany(Archivo::class, 'fk_evento', 'fk_evento');
    }
}
