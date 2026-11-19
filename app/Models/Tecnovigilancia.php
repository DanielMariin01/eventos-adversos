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
        'causa_probable',
        'acciones_correctivas',
        'reportado_fabricante',
        'fecha_reporte_fabricante',
        'dm_disponible_evaluacion',
        'dm_enviado_fabricante',
    ];

    protected $casts = [
        'uso_mas_de_una_vez' => 'boolean',
        'causa_probable' => 'array',
        'reportado_fabricante' => 'boolean',
        'fecha_reporte_fabricante' => 'date:Y-m-d',
        'dm_disponible_evaluacion' => 'boolean',
        'dm_enviado_fabricante' => 'boolean',
    ];

    public function evento()
    {
        return $this->belongsTo(EventoAdverso::class, 'fk_evento', 'id_eventoAdverso');
    }
}
