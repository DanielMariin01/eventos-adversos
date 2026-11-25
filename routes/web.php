<?php

use App\Http\Controllers\ProfileController;
use App\Http\Controllers\EventoController;
use App\Http\Controllers\UserController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\PlanMejoraController;
use App\Http\Controllers\AreaController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\TecnovigilanciaController;
use App\Http\Controllers\FarmacovigilanciaController;
use App\Http\Controllers\CategoriaController;
use App\Http\Controllers\AuditoriaController;
use App\Http\Controllers\Auth\PortalSsoController;

Route::get('/', function () {
    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
    ]);
});

// Ingreso único desde el Portal Corporativo (el token se valida dentro del controlador).
Route::get('/sso', PortalSsoController::class)->middleware('throttle:20,1')->name('sso');

Route::get('/dashboard', [DashboardController::class, 'index'])
    ->middleware(['auth', 'role:administrador|calidad|jefe'])
    ->name('dashboard');

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

// ── Rutas de gestión de usuarios (administrador y gestor_usuarios) ──
Route::middleware(['auth', 'role:administrador|gestor_usuarios'])->group(function () {
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
    Route::get('/eventos/cancelados', [EventoController::class, 'cancelados'])->name('eventos.cancelados');
    Route::get('/eventos/exportar', [EventoController::class, 'exportar'])->name('eventos.exportar');
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
    Route::patch('/eventos/{evento}/area', [EventoController::class, 'cambiarArea'])->name('eventos.cambiarArea');
    Route::post('/eventos/{evento}/evidencia', [EventoController::class, 'subirEvidencia'])->name('eventos.evidencia');
    Route::patch('/eventos/{evento}/reabrir', [EventoController::class, 'reabrir'])->name('eventos.reabrir');


    // Jefe
    Route::get('/mis-eventos', [EventoController::class, 'misEventos'])->name('eventos.mis');
});

// ── Rutas de planes de mejora ──
Route::middleware(['auth', 'role:administrador|calidad|tecnovigilancia|farmacovigilancia'])->group(function () {
    Route::get('/mejoras', [PlanMejoraController::class, 'index'])->name('mejoras.index');
    Route::get('/mejoras/exportar', [PlanMejoraController::class, 'exportar'])->name('mejoras.exportar');
    Route::post('/mejoras/{evento}', [PlanMejoraController::class, 'store'])->name('mejoras.store');
    Route::get('/mejoras/{evento}/revisiones', [PlanMejoraController::class, 'revisiones'])->name('mejoras.revisiones');
    Route::post('/mejoras/{plan}/update', [PlanMejoraController::class, 'update'])->name('mejoras.update');
    Route::patch('/mejoras/{evento}/cerrar', [PlanMejoraController::class, 'cerrarCaso'])->name('mejoras.cerrar');
});

// ── Rutas de tecnovigilancia ──
Route::middleware(['auth', 'role:administrador|calidad|tecnovigilancia'])->group(function () {
    Route::get('/tecnovigilancia', [TecnovigilanciaController::class, 'index'])->name('tecnovigilancia.index');
    Route::get('/tecnovigilancia/exportar', [TecnovigilanciaController::class, 'exportar'])->name('tecnovigilancia.exportar');
    Route::post('/tecnovigilancia/{evento}/analisis', [TecnovigilanciaController::class, 'guardarAnalisis'])->name('tecnovigilancia.analisis');
});

// ── Rutas de farmacovigilancia (categoría IAAS) ──
Route::middleware(['auth', 'role:administrador|farmacovigilancia'])->group(function () {
    Route::get('/farmacovigilancia', [FarmacovigilanciaController::class, 'index'])->name('farmacovigilancia.index');
    Route::get('/farmacovigilancia/exportar', [FarmacovigilanciaController::class, 'exportar'])->name('farmacovigilancia.exportar');
    Route::post('/farmacovigilancia/{evento}/analisis', [FarmacovigilanciaController::class, 'guardarAnalisis'])->name('farmacovigilancia.analisis');
});

// ── Rutas de categorías y áreas (administrador y gestor_usuarios) ──
Route::middleware(['auth', 'role:administrador|gestor_usuarios'])->group(function () {
    Route::get('/categorias', [CategoriaController::class, 'index'])->name('categorias.index');
    Route::post('/categorias', [CategoriaController::class, 'store'])->name('categorias.store');
    Route::patch('/categorias/{categoria}', [CategoriaController::class, 'update'])->name('categorias.update');
    Route::patch('/categorias/{categoria}/activo', [CategoriaController::class, 'toggleActivo'])->name('categorias.activo');

    Route::get('/areas', [AreaController::class, 'index'])->name('areas.index');
    Route::post('/areas', [AreaController::class, 'store'])->name('areas.store');
    Route::patch('/areas/{area}', [AreaController::class, 'update'])->name('areas.update');
});

// ── Auditoría (solo administrador) ──
Route::middleware(['auth', 'role:administrador'])->group(function () {
    Route::get('/auditoria', [AuditoriaController::class, 'index'])->name('auditoria.index');
});

require __DIR__ . '/auth.php';
