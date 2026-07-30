<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Revision extends Model
{
    protected $table = 'revisiones';

    protected $primaryKey = 'id_revision';

    protected $fillable = [
        'fk_evento',
        'fk_usuario',
        'tipo',
        'observacion',
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
}