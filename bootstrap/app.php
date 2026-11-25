<?php

use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        web: __DIR__ . '/../routes/web.php',
        commands: __DIR__ . '/../routes/console.php',
        health: '/up',
    )
    ->withMiddleware(function (Middleware $middleware) {
        $middleware->web(append: [
            \App\Http\Middleware\HandleInertiaRequests::class,
            \Illuminate\Http\Middleware\AddLinkHeadersForPreloadedAssets::class,
        ]);

        $middleware->alias([
            'role'       => \Spatie\Permission\Middleware\RoleMiddleware::class,
            'permission' => \Spatie\Permission\Middleware\PermissionMiddleware::class,
        ]);
    })
    ->withExceptions(function (Exceptions $exceptions) {
        // ── 403: pantalla informativa (los usuarios lo confundían con "página caída") ──
        $exceptions->respond(function (\Symfony\Component\HttpFoundation\Response $response, \Throwable $e, \Illuminate\Http\Request $request) {
            if ($response->getStatusCode() !== 403 || $request->expectsJson()) {
                return $response;
            }

            // Solo se muestra el mensaje si lo escribimos nosotros (los de Laravel/Spatie vienen en inglés)
            $mensaje = trim($e->getMessage());
            if ($mensaje === '' || preg_match('/^(this action is unauthorized|user does not have|user is not logged in|forbidden)/i', $mensaje)) {
                $mensaje = null;
            }

            $user = $request->user();

            return \Inertia\Inertia::render('Errors/Forbidden', [
                'mensaje' => $mensaje,
                'ruta'    => '/' . ltrim($request->path(), '/'),
                'inicio'  => $user ? route($user->rutaDeInicio()) : route('login'),
            ])->toResponse($request)->setStatusCode(403);
        });
    })->create();
