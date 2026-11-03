<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Paciente extends Model
{
    protected $table = 'pacientes';

    protected $primaryKey = 'id_paciente';

    protected $fillable = [
        'cedula',
        'nombres',
        'apellidos',
        'sexo',
        'telefono',
        'edad',
        'edad_unidad',
        'entidad',
    ];

    // Relación con eventos adversos
    public function eventosAdversos()
    {
        return $this->hasMany(EventoAdverso::class, 'fk_paciente');
    }
}
