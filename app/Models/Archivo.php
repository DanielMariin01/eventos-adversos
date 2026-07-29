<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Archivo extends Model
{
    protected $table = 'archivos';

    protected $primaryKey = 'id_archivo';

    protected $fillable = [
        'fk_evento',
        'fk_usuario',
        'tipo',
        'nombre',
        'ruta',
        'extension',
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
