<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Services\PortalSsoService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Cache;
use RuntimeException;

/** Ingreso desde el Portal Corporativo: valida el token y abre la sesión del usuario que ya existe aquí. */
class PortalSsoController extends Controller
{
    /** Tiempo que se recuerda un token usado; debe superar su duración (60 s) más el margen de reloj. */
    private const SEGUNDOS_TOKEN_USADO = 180;

    public function __invoke(Request $request): RedirectResponse
    {
        try {
            $datos = $this->servicio()->validar((string) $request->query('token'));
        } catch (RuntimeException) {
            return $this->rechazar('El ingreso desde el portal no es válido o venció. Vuelve a abrirlo desde el portal.');
        }

        if (! $this->marcarComoUsado($datos['jti'])) {
            return $this->rechazar('Este enlace de ingreso ya fue utilizado. Vuelve a abrirlo desde el portal.');
        }

        $usuario = User::whereRaw('LOWER(email) = ?', [mb_strtolower($datos['email'])])->first();

        if (! $usuario) {
            return $this->devolverAlPortal('correo_no_registrado');
        }

        Auth::login($usuario);
        $request->session()->regenerate();

        return redirect()->route($usuario->rutaDeInicio());
    }

    private function servicio(): PortalSsoService
    {
        $ruta = config('services.portal.clave_publica');

        return new PortalSsoService(
            is_file($ruta) ? (string) file_get_contents($ruta) : '',
            (string) config('services.portal.url'),
            (string) config('services.portal.audiencia'),
        );
    }

    /** Un token solo sirve una vez. Se guarda en archivos para no escribir en la base de datos. */
    private function marcarComoUsado(string $jti): bool
    {
        return Cache::store('file')->add("sso-jti-{$jti}", true, self::SEGUNDOS_TOKEN_USADO);
    }

    /** El portal muestra el aviso (pop-up) al usuario: allí sabe qué correo tiene registrado. */
    private function devolverAlPortal(string $motivo): RedirectResponse
    {
        $consulta = http_build_query([
            'sso_error' => $motivo,
            'sso_app' => config('services.portal.audiencia'),
        ]);

        return redirect()->away(rtrim((string) config('services.portal.url'), '/') . '/?' . $consulta);
    }

    private function rechazar(string $mensaje): RedirectResponse
    {
        return redirect()->route('login')->withErrors(['email' => $mensaje]);
    }
}
