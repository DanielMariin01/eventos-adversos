<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    // ── Auditoría de usuarios, categorías y áreas (quién creó, actualizó o eliminó) ──
    public function up(): void
    {
        Schema::create('auditorias', function (Blueprint $table) {
            $table->id('id_auditoria');
            $table->unsignedBigInteger('fk_usuario')->nullable();   // sin FK: el registro debe sobrevivir si se borra el usuario
            $table->string('usuario_nombre', 255);                  // copia del nombre al momento de la acción
            $table->string('accion', 30);                           // crear | editar | eliminar | activar | desactivar
            $table->string('entidad', 30);                          // usuario | categoria | area
            $table->unsignedBigInteger('id_entidad')->nullable();
            $table->string('descripcion', 500);
            $table->json('antes')->nullable();
            $table->json('despues')->nullable();
            $table->timestamps();

            $table->index(['entidad', 'accion']);
            $table->index('created_at');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('auditorias');
    }
};
