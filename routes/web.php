<?php

use App\Http\Controllers\ProfileController;
use App\Http\Controllers\EventoController;
use App\Http\Controllers\UserController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\PlanMejoraController;
use App\Http\Controllers\AreaController;

Route::get('/', function () {
    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
    ]);
});

Route::get('/dashboard', function () {
    return Inertia::render('Dashboard');
})->middleware(['auth', 'role:administrador|calidad|jefe'])->name('dashboard');

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

// ── Rutas de gestión de usuarios (solo administrador) ──
Route::middleware(['auth', 'role:administrador'])->group(function () {
    Route::get('/usuarios', [UserController::class, 'index'])->name('usuarios.index');
    Route::get('/usuarios/crear', [UserController::class, 'create'])->name('usuarios.create');
    Route::post('/usuarios', [UserController::class, 'store'])->name('usuarios.store');
    Route::get('/usuarios/{user}/editar', [UserController::class, 'edit'])->name('usuarios.edit');
    Route::put('/usuarios/{user}', [UserController::class, 'update'])->name('usuarios.update');
    Route::delete('/usuarios/{user}', [UserController::class, 'destroy'])->name('usuarios.destroy');
});
// ── Rutas de eventos adversos ──
Route::middleware(['auth'])->group(function () {

    // Rutas específicas primero
    Route::get('/eventos/crear', [EventoController::class, 'create'])->name('eventos.create');
    Route::post('/eventos/area', [EventoController::class, 'seleccionarArea'])->name('eventos.area');
    Route::get('/eventos/reportante/{cedula}', [EventoController::class, 'buscarReportante'])->name('eventos.reportante');
    Route::get('/eventos/paciente/{cedula}', [EventoController::class, 'buscarPaciente'])->name('eventos.paciente');
    Route::post('/eventos', [EventoController::class, 'store'])->name('eventos.store');

    // Rutas genéricas después
    Route::get('/eventos', [EventoController::class, 'index'])->name('eventos.index');
    Route::get('/eventos/{evento}', [EventoController::class, 'show'])->name('eventos.show');
    Route::patch('/eventos/{evento}/estado', [EventoController::class, 'actualizarEstado'])->name('eventos.estado');


    Route::post('/eventos/{evento}/analisis', [EventoController::class, 'guardarAnalisis'])->name('eventos.analisis');
    Route::patch('/eventos/{evento}/cerrar', [EventoController::class, 'cerrarAnalisis'])->name('eventos.cerrar');
    Route::patch('/eventos/{evento}/cancelar', [EventoController::class, 'cancelarEvento'])->name('eventos.cancelar');
    Route::patch('/eventos/{evento}/tipo', [EventoController::class, 'cambiarTipo'])->name('eventos.tipo');
    Route::post('/eventos/{evento}/evidencia', [EventoController::class, 'subirEvidencia'])->name('eventos.evidencia');

    // Jefe
    Route::get('/mis-eventos', [EventoController::class, 'misEventos'])->name('eventos.mis');
});

// ── Rutas de planes de mejora ──
Route::middleware(['auth', 'role:administrador|calidad'])->group(function () {
    Route::get('/mejoras', [PlanMejoraController::class, 'index'])->name('mejoras.index');
    Route::post('/mejoras/{evento}', [PlanMejoraController::class, 'store'])->name('mejoras.store');
    Route::get('/mejoras/{evento}/revisiones', [PlanMejoraController::class, 'revisiones'])->name('mejoras.revisiones');
});

// ── Rutas de áreas (solo administrador) ──
Route::middleware(['auth', 'role:administrador'])->group(function () {
    Route::get('/areas', [AreaController::class, 'index'])->name('areas.index');
    Route::patch('/areas/{area}', [AreaController::class, 'update'])->name('areas.update');
});

require __DIR__ . '/auth.php';
