<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    // ── Campos de análisis propios de Tecnovigilancia (aditivo, todo nullable) ──
    public function up(): void
    {
        Schema::table('tecnovigilancias', function (Blueprint $table) {
            $table->json('causa_probable')->nullable();
            $table->text('acciones_correctivas')->nullable();
            $table->boolean('reportado_fabricante')->nullable();
            $table->date('fecha_reporte_fabricante')->nullable();
            $table->boolean('dm_disponible_evaluacion')->nullable();
            $table->boolean('dm_enviado_fabricante')->nullable();
        });
    }

    public function down(): void
    {
        Schema::table('tecnovigilancias', function (Blueprint $table) {
            $table->dropColumn([
                'causa_probable',
                'acciones_correctivas',
                'reportado_fabricante',
                'fecha_reporte_fabricante',
                'dm_disponible_evaluacion',
                'dm_enviado_fabricante',
            ]);
        });
    }
};
