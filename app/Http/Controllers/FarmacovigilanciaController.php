<?php

namespace App\Http\Controllers;

use App\Mail\AnalisisRealizado;
use App\Models\Archivo;
use App\Models\Area;
use App\Models\Categoria;
use App\Models\EventoAdverso;
use App\Models\Farmacovigilancia;
use App\Models\Revision;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Mail;
use Illuminate\Validation\Rule;
use Inertia\Inertia;

class FarmacovigilanciaController extends Controller
{
    private const CATEGORIA = 'IAAS';

    // Catálogos del análisis (deben coincidir con ModalAnalisisFarmacovigilancia.jsx)
    private const CATEGORIZACIONES = [
        'Leve',
        'Moderado',
        'Grave',
        'Mortal',
        'Esperado',
        'No esperado',
        'Relacionado con medicamento',
        'Posiblemente relacionado',
        'No relacionado',
    ];

    private const ALERGIAS = [
        'Flebitis química',
        'Extravasaciones',
        'Alergias',
        'Rash Cutáneos',
        'Prurito',
    ];

    // ── Consulta base: solo eventos de la categoría IAAS en proceso ──
    private function consulta()
    {
        return EventoAdverso::with(['categoria', 'area', 'reportante', 'paciente', 'medicamentos', 'farmacovigilancia'])
            ->whereHas('categoria', fn($q) => $q->where('nombre', self::CATEGORIA))
            ->where('estado', 'en_proceso')
            ->orderBy('created_at', 'desc');
    }

    // ── Lista de eventos de farmacovigilancia ──
    public function index()
    {
        return Inertia::render('Farmacovigilancia/Index', [
            'eventos'    => $this->consulta()->paginate(10),
            'categorias' => Categoria::where('activo', 1)->get(),
            'jefes'      => User::role('jefe')->get(['id', 'name']),
            'areas'      => Area::where('activo', 1)->get(['id_area', 'nombre']),
        ]);
    }

    // ── Guardar análisis de farmacovigilancia ──
    // Igual que Calidad: el evento pasa a 'analizado', se asigna al jefe y se le avisa por correo.
    public function guardarAnalisis(Request $request, EventoAdverso $evento)
    {
        abort_if($evento->categoria?->nombre !== self::CATEGORIA, 403, 'Solo eventos de IAAS (farmacovigilancia).');

        $datos = $request->validate([
            'categorizacion'         => 'required|array|min:1',
            'categorizacion.*'       => ['string', Rule::in(self::CATEGORIZACIONES)],
            'alergias'               => 'required|array|min:1',
            'alergias.*'             => ['string', Rule::in(self::ALERGIAS)],
            'descripcion_analisis'   => 'required|string',
            'factores_contributivos' => 'required|string',
            'fk_jefe'                => 'required|exists:users,id',
            'archivos.*'             => 'nullable|file|mimes:pdf,jpg,jpeg,png|max:10240',
        ]);

        Farmacovigilancia::updateOrCreate(
            ['fk_evento' => $evento->id_eventoAdverso],
            [
                'categorizacion'         => $datos['categorizacion'],
                'alergias'               => $datos['alergias'],
                'factores_contributivos' => $datos['factores_contributivos'],
            ]
        );

        $evento->update([
            'descripcion_analisis' => $datos['descripcion_analisis'],
            'fk_jefe'              => $datos['fk_jefe'],
            // Al editar un análisis ya avanzado no se retrocede el estado
            'estado'               => $evento->estado === 'en_proceso' ? 'analizado' : $evento->estado,
            'fk_usuario_calidad'   => Auth::id(),
            'fecha_analisis'       => now(),
        ]);

        // Guardar evidencia
        if ($request->hasFile('archivos')) {
            foreach ($request->file('archivos') as $file) {
                Archivo::create([
                    'fk_evento'  => $evento->id_eventoAdverso,
                    'fk_usuario' => Auth::id(),
                    'tipo'       => 'calidad',
                    'nombre'     => $file->getClientOriginalName(),
                    'ruta'       => $file->store('eventos/calidad', 'public'),
                    'extension'  => $file->getClientOriginalExtension(),
                ]);
            }
        }

        Revision::create([
            'fk_evento'   => $evento->id_eventoAdverso,
            'fk_usuario'  => Auth::id(),
            'tipo'        => 'Análisis de Farmacovigilancia',
            'observacion' => 'Se realizó el análisis de farmacovigilancia del evento N° ' . $evento->id_eventoAdverso .
                ' y se asignó al jefe ID ' . $datos['fk_jefe'] .
                '. Categorización: ' . implode(', ', $datos['categorizacion']) .
                '. Fecha: ' . now()->format('Y-m-d') . ' a las ' . now()->format('H:i'),
        ]);

        // Avisar al jefe responsable (un fallo de correo no deshace el análisis)
        $evento->load(['categoria', 'area', 'jefe', 'farmacovigilancia', 'medicamentos']);
        if ($evento->jefe?->email) {
            try {
                Mail::to($evento->jefe->email)->send(new AnalisisRealizado($evento));
            } catch (\Throwable $e) {
                report($e);
            }
        }

        return redirect()->back()->with('success', 'Análisis de farmacovigilancia guardado correctamente.');
    }

    // ── Exportar a Excel (el navegador genera el .xlsx) ──
    public function exportar()
    {
        $datos = $this->consulta()->get()->map(fn($e) => [
            'N° Evento'               => $e->id_eventoAdverso,
            'Fecha Evento'            => $e->fecha_evento?->format('Y-m-d'),
            'Fecha Creación'          => $e->created_at?->format('Y-m-d H:i'),
            'Área'                    => $e->area?->nombre,
            'Estado'                  => $e->estado,
            'Doc Reportante'          => $e->reportante?->cedula,
            'Nombres Reportante'      => trim($e->reportante?->nombres . ' ' . $e->reportante?->apellidos),
            'Cargo Reportante'        => $e->reportante?->cargo,
            'Doc Paciente'            => $e->paciente?->cedula,
            'Nombres Paciente'        => trim($e->paciente?->nombres . ' ' . $e->paciente?->apellidos),
            'Medicamentos'            => $e->medicamentos->map(fn($m) => $m->nombre . ' (' . $m->descripcion . ')')->implode(' | '),
            'Descripción'             => $e->descripcion,
            'Categorización'          => implode(' | ', $e->farmacovigilancia?->categorizacion ?? []),
            'Alergias'                => implode(' | ', $e->farmacovigilancia?->alergias ?? []),
            'Factores contributivos'  => $e->farmacovigilancia?->factores_contributivos,
        ]);

        return response()->json($datos);
    }
}
