<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Medicamento extends Model
{
    protected $table = 'medicamentos';

    protected $primaryKey = 'id_medicamento';

    protected $fillable = [
        'fk_evento',
        'nombre',
        'descripcion',
    ];

    public function evento()
    {
        return $this->belongsTo(EventoAdverso::class, 'fk_evento', 'id_eventoAdverso');
    }
}
