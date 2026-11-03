<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Tecnovigilancia extends Model
{
    protected $table = 'tecnovigilancias';

    protected $primaryKey = 'id_tecnovigilancia';

    protected $fillable = [
        'fk_evento',
        'diagnostico_inicial',
        'nombre_dispositivo',
        'marca',
        'modelo',
        'serie',
        'area_funcionamiento_dm',
        'uso_mas_de_una_vez',
        'deteccion_evento',
        'clasificacion',
        'desenlace',
    ];

    protected $casts = [
        'uso_mas_de_una_vez' => 'boolean',
    ];

    public function evento()
    {
        return $this->belongsTo(EventoAdverso::class, 'fk_evento', 'id_eventoAdverso');
    }
}
