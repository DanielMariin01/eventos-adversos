<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Relación opcional entre categorías y áreas: si una categoría no tiene
     * filas aquí, el paso "¿En cuál área ocurrió el evento?" sigue mostrando
     * todas las áreas activas (comportamiento actual, sin romper nada). Si
     * tiene filas, solo se muestran esas áreas.
     */
    public function up(): void
    {
        Schema::create('area_categoria', function (Blueprint $table) {
            $table->id();
            $table->unsignedInteger('id_area');
            $table->unsignedInteger('id_categoria');
            $table->timestamps();

            $table->foreign('id_area')->references('id_area')->on('areas')->cascadeOnDelete();
            $table->foreign('id_categoria')->references('id_categoria')->on('categorias')->cascadeOnDelete();
            $table->unique(['id_area', 'id_categoria']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('area_categoria');
    }
};
