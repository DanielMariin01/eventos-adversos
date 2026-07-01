<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Area extends Model
{
    protected $table = 'areas';
    protected $primaryKey = 'id_area';

    protected $fillable = [
        'nombre',
        'responsable',
        'activo',
    ];

    // Relación con eventos adversos
    public function eventosAdversos()
    {
        return $this->hasMany(EventoAdverso::class, 'fk_area');
    }
}
