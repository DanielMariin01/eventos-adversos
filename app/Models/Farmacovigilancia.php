<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Farmacovigilancia extends Model
{
    protected $table = 'farmacovigilancias';

    protected $primaryKey = 'id_farmacovigilancia';

    protected $fillable = [
        'fk_evento',
        'categorizacion',
        'alergias',
        'factores_contributivos',
    ];

    protected $casts = [
        'categorizacion' => 'array',
        'alergias'       => 'array',
    ];

    public function evento()
    {
        return $this->belongsTo(EventoAdverso::class, 'fk_evento', 'id_eventoAdverso');
    }
}
