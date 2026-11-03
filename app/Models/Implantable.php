<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Implantable extends Model
{
    protected $table = 'implantables';

    protected $primaryKey = 'id_implantable';

    protected $fillable = [
        'fk_evento',
        'procedimiento_cx',
        'nombre_cirujano',
        'especialidad',
        'descripcion_material',
        'marca',
        'registro_invima',
        'serie',
        'lote',
        'fecha_vencimiento',
        'nombre_funcionario_reporta',
    ];

    protected $casts = [
        'fecha_vencimiento' => 'date',
    ];

    public function evento()
    {
        return $this->belongsTo(EventoAdverso::class, 'fk_evento', 'id_eventoAdverso');
    }
}
