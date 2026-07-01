<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Categoria extends Model
{
    protected $table = 'categorias';
    protected $primaryKey = 'id_categoria';


    protected $fillable = [
        'nombre',
        'descripcion',
        'activo',
    ];

    // Relación con eventos adversos
    public function eventosAdversos()
    {
        return $this->hasMany(EventoAdverso::class, 'fk_categoria');
    }
}
