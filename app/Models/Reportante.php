<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Reportante extends Model
{
    protected $table = 'reportantes';

    protected $primaryKey = 'id_reportante';

    protected $fillable = [
        'cedula',
        'nombres',
        'apellidos',
        'cargo',
     
    ];

    // Relación con eventos adversos
    public function eventosAdversos()
    {
        return $this->hasMany(EventoAdverso::class, 'fk_reportante');
    }
}
