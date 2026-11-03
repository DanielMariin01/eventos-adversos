<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('implantables', function (Blueprint $table) {
            $table->id('id_implantable');
            $table->unsignedInteger('fk_evento');
            $table->string('procedimiento_cx', 255);
            $table->string('nombre_cirujano', 150);
            $table->string('especialidad', 150);
            $table->text('descripcion_material');
            $table->string('marca', 150);
            $table->string('registro_invima', 100);
            $table->string('serie', 100);
            $table->string('lote', 100);
            $table->date('fecha_vencimiento');
            $table->string('nombre_funcionario_reporta', 150);
            $table->timestamps();

            $table->foreign('fk_evento')->references('id_eventoAdverso')->on('eventos_adversos')->cascadeOnDelete();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('implantables');
    }
};
