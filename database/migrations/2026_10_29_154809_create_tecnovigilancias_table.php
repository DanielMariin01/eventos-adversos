<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('tecnovigilancias', function (Blueprint $table) {
            $table->id('id_tecnovigilancia');
            $table->unsignedInteger('fk_evento');
            $table->text('diagnostico_inicial');
            $table->string('nombre_dispositivo', 255);
            $table->string('marca', 150);
            $table->string('modelo', 150);
            $table->string('serie', 100);
            $table->string('area_funcionamiento_dm', 150);
            $table->boolean('uso_mas_de_una_vez');
            $table->enum('deteccion_evento', ['Antes del uso del DM', 'Durante el uso del DM', 'Después del uso del DM']);
            $table->enum('clasificacion', [
                'Evento adverso no serio',
                'Evento adverso serio',
                'Incidente adverso no serio',
                'Incidente adverso serio',
            ]);
            $table->enum('desenlace', [
                'Muerte',
                'Enfermedad o daño que amenace la vida',
                'Daño de una función o estructura corporal',
                'Hospitalización inicial o prolongada',
                'Requiere intervención médica o quirúrgica, para prevenir un daño permanente de una estructura o función corporal',
                'No hubo daño',
                'Otro',
            ]);
            $table->timestamps();

            $table->foreign('fk_evento')->references('id_eventoAdverso')->on('eventos_adversos')->cascadeOnDelete();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('tecnovigilancias');
    }
};
