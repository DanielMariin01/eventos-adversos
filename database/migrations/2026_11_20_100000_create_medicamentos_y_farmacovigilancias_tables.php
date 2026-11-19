<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    // ── Farmacovigilancia (categoría IAAS): medicamentos reportados y datos del análisis ──
    public function up(): void
    {
        Schema::create('medicamentos', function (Blueprint $table) {
            $table->id('id_medicamento');
            $table->unsignedInteger('fk_evento');
            $table->string('nombre', 255);
            $table->text('descripcion');
            $table->timestamps();

            $table->foreign('fk_evento')->references('id_eventoAdverso')->on('eventos_adversos')->cascadeOnDelete();
        });

        Schema::create('farmacovigilancias', function (Blueprint $table) {
            $table->id('id_farmacovigilancia');
            $table->unsignedInteger('fk_evento')->unique();
            $table->json('categorizacion')->nullable();
            $table->json('alergias')->nullable();
            $table->text('factores_contributivos')->nullable();
            $table->timestamps();

            $table->foreign('fk_evento')->references('id_eventoAdverso')->on('eventos_adversos')->cascadeOnDelete();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('farmacovigilancias');
        Schema::dropIfExists('medicamentos');
    }
};
